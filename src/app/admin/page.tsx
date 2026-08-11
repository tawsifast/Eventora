import type { Metadata } from "next";
import { CalendarDays, DollarSign, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminUsersTable } from "@/components/admin/users-table";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { EventStatusBadge, OrderStatusBadge } from "@/components/status-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminEvents, getAdminOrders, getAdminStats, getAdminUsers } from "@/lib/api";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import type { Event, Order, User } from "@/types";

export const metadata: Metadata = {
  title: "Admin Overview — EventHub",
  description: "Platform-wide view of events, organizers, ticket volume and revenue on EventHub.",
  openGraph: {
    title: "Admin Overview — EventHub",
    description: "Moderate events and monitor platform health.",
  },
};

const navItems = [{ label: "Overview", to: "/admin", icon: "layout-dashboard", exact: true }];

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "admin") redirect("/unauthorized");

  const cookie = (await cookies()).toString();
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
      getAdminStats(cookie),
      getAdminEvents(cookie),
      getAdminUsers(cookie),
      getAdminOrders(cookie),
    ]);
  } catch {
    stats = { totalUsers: 0, totalOrganizers: 0, totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0 };
  }

  return (
    <DashboardShell label="Admin" items={navItems}>
      <PageHeader
        eyebrow="Platform"
        title="Admin Overview"
        subtitle="Events, organizers and ticket volume across EventHub."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total events" value={String(stats.totalEvents)} hint="all statuses" />
        <StatCard icon={Users} label="Organizers" value={String(stats.totalOrganizers)} hint={`${stats.totalUsers} users total`} />
        <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(stats.totalTicketsSold)} hint="lifetime" />
        <StatCard icon={DollarSign} label="Collected revenue" value={formatCurrency(stats.totalRevenue)} hint="paid orders" />
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl">Event moderation</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
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
                    <TableCell className="max-w-[160px] truncate text-muted-foreground">{e.organizerName}</TableCell>
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
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Recent orders</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
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
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{o.eventTitle}</TableCell>
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
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Users</h2>
        <AdminUsersTable users={allUsers} currentUserId={currentUser.id} />
      </section>
    </DashboardShell>
  );
}
