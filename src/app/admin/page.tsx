import type { Metadata } from "next";
import { CalendarDays, DollarSign, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminUsersTable } from "@/components/admin/users-table";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { EventStatusBadge, OrderStatusBadge } from "@/components/status-badges";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { getAdminEvents, getAdminOrders, getAdminStats, getAdminUsers } from "@/lib/api";
import { getServerToken } from "@/lib/server-token";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import type { Event, Order, User } from "@/types";

export const metadata: Metadata = {
  title: "Admin Overview — Eventora",
  description: "Platform-wide view of events, organizers, ticket volume and revenue on Eventora.",
  openGraph: {
    title: "Admin Overview — Eventora",
    description: "Moderate events and monitor platform health.",
  },
};

const navItems = [{ label: "Overview", to: "/admin", icon: "layout-dashboard", exact: true }];

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "admin") redirect("/unauthorized");

  const token = await getServerToken();
  let stats = {
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  };
  let allEvents: Event[] = [];
  let allUsers: User[] = [];
  let allOrders: Order[] = [];
  try {
    [stats, allEvents, allUsers, allOrders] = await Promise.all([
      getAdminStats(token),
      getAdminEvents(token),
      getAdminUsers(token),
      getAdminOrders(token),
    ]);
  } catch {
    stats = { totalUsers: 0, totalOrganizers: 0, totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0 };
  }

  return (
    <DashboardShell label="Admin" items={navItems}>
      <div className="space-y-8 overflow-x-hidden">
        <PageHeader
          eyebrow="Platform"
          title="Admin Overview"
          subtitle="Events, organizers and ticket volume across Eventora."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total events" value={String(stats.totalEvents)} hint="all statuses" />
          <StatCard icon={Users} label="Organizers" value={String(stats.totalOrganizers)} hint={`${stats.totalUsers} users total`} />
          <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(stats.totalTicketsSold)} hint="lifetime" />
          <StatCard icon={DollarSign} label="Collected revenue" value={formatCurrency(stats.totalRevenue)} hint="paid orders" />
        </div>

        {/* Event Moderation Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Event moderation</h2>

          {/* Mobile Card View */}
          <div className="grid gap-3 md:hidden">
            {allEvents.slice(0, 8).map((e) => (
              <div key={e.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/events/${e.slug}`} className="font-medium text-base hover:text-primary line-clamp-1">
                    {e.title}
                  </Link>
                  <EventStatusBadge status={e.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                  <span>{e.organizer?.name ?? "Organizer"}</span>
                  <span>{formatDate(e.date)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono pt-1">
                  <span className="text-muted-foreground">Tickets Sold:</span>
                  <span className="font-semibold">{formatNumber(e.ticketsSold)} / {formatNumber(e.capacity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Event</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allEvents.slice(0, 8).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      <Link href={`/events/${e.slug}`} className="hover:text-primary">
                        {e.title}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-muted-foreground">{e.organizer?.name ?? "Organizer"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(e.date)}</TableCell>
                    <TableCell>
                      <EventStatusBadge status={e.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(e.ticketsSold)} / {formatNumber(e.capacity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Recent Orders Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Recent orders</h2>

          {/* Mobile Card View */}
          <div className="grid gap-3 md:hidden">
            {allOrders.slice(0, 8).map((o) => (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-mono text-xs text-muted-foreground">Order #{o.id}</span>
                  <span className="font-semibold text-primary">{formatCurrency(o.amount)}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm truncate">{o.event?.title ?? "Event"}</p>
                  <p className="text-xs text-muted-foreground">Customer: {o.customerName}</p>
                </div>
                <div className="pt-1">
                  <OrderStatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOrders.slice(0, 8).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate">{o.customerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{o.event?.title ?? "Event"}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-primary">
                      {formatCurrency(o.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Users Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Users</h2>
          <div className="overflow-x-auto">
            <AdminUsersTable users={allUsers} currentUserId={currentUser.id} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}