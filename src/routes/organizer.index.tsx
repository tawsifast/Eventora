import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  CalendarPlus,
  DollarSign,
  LayoutDashboard,
  Ticket,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { EventStatusBadge, OrderStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEventsByOrganizer } from "@/data/events";
import { orders, revenueByMonth } from "@/data/orders";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

const navItems = [
  { label: "Overview", to: "/organizer", icon: LayoutDashboard, exact: true },
  { label: "Create event", to: "/organizer/events/new", icon: CalendarPlus },
];

export const Route = createFileRoute("/organizer/")({
  head: () => ({
    meta: [
      { title: "Organizer Dashboard — EventHub" },
      { name: "description", content: "Track ticket sales, revenue and attendance across all of your EventHub events." },
      { property: "og:title", content: "Organizer Dashboard — EventHub" },
      { property: "og:description", content: "Your events, sales and attendees at a glance." },
    ],
  }),
  component: OrganizerDashboard,
});

function OrganizerDashboard() {
  const events = getEventsByOrganizer("u_1");
  const ticketsSold = events.reduce((s, e) => s + e.ticketsSold, 0);
  const revenue = events.reduce((s, e) => s + e.ticketsSold * e.price, 0);
  const capacity = events.reduce((s, e) => s + e.capacity, 0);
  const fillRate = capacity ? Math.round((ticketsSold / capacity) * 100) : 0;
  const recentOrders = orders.slice(0, 6);
  const peak = Math.max(...revenueByMonth.map((m) => m.revenue), 1);

  return (
    <DashboardShell label="Organizer" items={navItems}>
      <PageHeader
        eyebrow="Organizer"
        title="Sales Command Center"
        subtitle="Revenue, attendance and order flow across your events."
        action={
          <Button asChild>
            <Link to="/organizer/events/new">
              <CalendarPlus className="size-4" /> New event
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Live events" value={String(events.length)} hint="published" />
        <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(ticketsSold)} hint={`${fillRate}% fill rate`} />
        <StatCard icon={DollarSign} label="Gross revenue" value={formatCurrency(revenue)} hint="before fees" />
        <StatCard icon={Users} label="Capacity" value={formatNumber(capacity)} hint="across all events" />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Revenue trend</p>
            <h2 className="mt-1 text-2xl">Last {revenueByMonth.length} months</h2>
          </div>
          <BarChart3 className="size-5 text-primary" />
        </div>
        <div className="mt-8 flex h-40 items-end gap-3">
          {revenueByMonth.map((m) => (
            <div key={m.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/25 to-primary transition-all"
                  style={{ height: `${Math.max(6, (m.revenue / peak) * 100)}%` }}
                  title={formatCurrency(m.revenue)}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Your events</h2>
        <div className="grid gap-4">
          {events.map((e) => {
            const pct = Math.min(100, Math.round((e.ticketsSold / e.capacity) * 100));
            return (
              <article key={e.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-xl leading-tight">
                      <Link to="/events/$eventId" params={{ eventId: e.slug }} className="hover:text-primary">
                        {e.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(e.date)} · {e.venue}, {e.city}
                    </p>
                  </div>
                  <EventStatusBadge status={e.status} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatNumber(e.ticketsSold)} / {formatNumber(e.capacity)} sold
                    </span>
                    <span className="text-primary">{formatCurrency(e.ticketsSold * e.price)}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </article>
            );
          })}
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
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{o.eventTitle}</TableCell>
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
        </div>
      </section>
    </DashboardShell>
  );
}
