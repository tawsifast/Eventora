import type { Metadata } from "next";
import { CalendarDays, CalendarPlus, DollarSign, Receipt, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/states";
import { EventStatusBadge, OrderStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { getEvents, getOrganizerOrders, getOrganizerStats } from "@/lib/api";
import { getServerToken } from "@/lib/server-token";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import type { Event, Order } from "@/types";

export const metadata: Metadata = {
  title: "Organizer Dashboard — Eventora",
  description: "Track ticket sales, revenue and attendance across all of your Eventora events.",
  openGraph: {
    title: "Organizer Dashboard — Eventora",
    description: "Your events, sales and attendees at a glance.",
  },
};

const navItems = [
  { label: "Overview", to: "/organizer", icon: "layout-dashboard", exact: true },
  { label: "Create event", to: "/organizer/events/new", icon: "calendar-plus" },
];

export default async function OrganizerDashboard() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "organizer" && currentUser.role !== "admin") redirect("/unauthorized");

  const token = await getServerToken();
  let myEvents: Event[] = [];
  let recentOrders: Order[] = [];
  let stats = { totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0 };
  try {
    const [allEvents, orders]: [Event[], Order[]] = await Promise.all([
      getEvents(undefined, token),
      getOrganizerOrders(token).catch(() => [] as Order[]),
    ]);
    myEvents = allEvents.filter((e) => e.organizerId === currentUser.id);
    recentOrders = orders.slice(0, 6);
    stats = await getOrganizerStats(currentUser.id, token).catch(() => stats);
  } catch {
    stats = { totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0 };
  }

  const capacity = myEvents.reduce((s, e) => s + e.capacity, 0);
  const fillRate = capacity ? Math.round((stats.totalTicketsSold / capacity) * 100) : 0;

  return (
    <DashboardShell label="Organizer" items={navItems}>
      <div className="w-full min-w-0 space-y-8 overflow-x-hidden">
        {/* Responsive Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between min-w-0">
          <PageHeader
            eyebrow="Organizer"
            title="Sales Command Center"
            subtitle="Revenue, attendance and order flow across your events."
          />
          <Button asChild className="w-full sm:w-auto shrink-0">
            <Link href="/organizer/events/new">
              <CalendarPlus className="size-4 mr-1.5" /> New event
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
          <StatCard icon={CalendarDays} label="Live events" value={String(stats.totalEvents)} hint="published" />
          <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(stats.totalTicketsSold)} hint={`${fillRate}% fill rate`} />
          <StatCard icon={DollarSign} label="Gross revenue" value={formatCurrency(stats.totalRevenue)} hint="before fees" />
          <StatCard icon={Users} label="Capacity" value={formatNumber(capacity)} hint="across all events" />
        </div>

        {/* Your Events Section */}
        <section className="space-y-4 min-w-0">
          <h2 className="text-xl font-semibold sm:text-2xl">Your events</h2>
          {myEvents.length ? (
            <div className="grid gap-4 min-w-0">
              {myEvents.map((e) => {
                const pct = Math.min(100, Math.round((e.ticketsSold / e.capacity) * 100));
                return (
                  <article key={e.id} className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 min-w-0">
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="truncate text-lg font-semibold leading-tight sm:text-xl">
                          <Link href={`/events/${e.slug}`} className="hover:text-primary transition-colors">
                            {e.title}
                          </Link>
                        </h3>
                        <p className="truncate text-xs sm:text-sm text-muted-foreground block min-w-0">
                          {formatDate(e.date)} · {e.venue}, {e.city}
                        </p>
                      </div>
                      <div className="shrink-0 self-start">
                        <EventStatusBadge status={e.status} />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 min-w-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">
                          {formatNumber(e.ticketsSold)} / {formatNumber(e.capacity)} sold
                        </span>
                        <span className="font-medium text-primary shrink-0 ml-2">
                          {formatCurrency(e.ticketsSold * e.price)}
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5 w-full" />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No events yet"
              description="Create your first event to start selling tickets and tracking revenue."
              action={
                <Button asChild>
                  <Link href="/organizer/events/new">
                    <CalendarPlus className="size-4" /> Create event
                  </Link>
                </Button>
              }
            />
          )}
        </section>

        {/* Recent Orders Section */}
        <section className="space-y-4 min-w-0">
          <h2 className="text-xl font-semibold sm:text-2xl">Recent orders</h2>
          {recentOrders.length ? (
            <>
              {/* Mobile Card View */}
              <div className="grid gap-3 md:hidden min-w-0">
                {recentOrders.map((o) => (
                  <div key={o.id} className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-mono text-xs text-muted-foreground truncate">Order #{o.id}</span>
                      <span className="font-semibold text-primary shrink-0 ml-2">{formatCurrency(o.amount)}</span>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium text-sm truncate">{o.event?.title ?? "Event"}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground min-w-0">
                        <span className="truncate">Customer: {o.customerName}</span>
                        <span className="shrink-0 ml-2">Qty: {o.quantity}</span>
                      </div>
                    </div>
                    <div className="pt-1 shrink-0">
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
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.id}</TableCell>
                        <TableCell className="max-w-[160px] truncate">{o.customerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{o.event?.title ?? "Event"}</TableCell>
                        <TableCell className="text-center">{o.quantity}</TableCell>
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
            </>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No orders yet"
              description="Orders for your events will appear here as tickets sell."
            />
          )}
        </section>
      </div>
    </DashboardShell>
  );
}