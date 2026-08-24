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
  title: "Organizer Dashboard — EventHub",
  description: "Track ticket sales, revenue and attendance across all of your EventHub events.",
  openGraph: {
    title: "Organizer Dashboard — EventHub",
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
      <PageHeader
        eyebrow="Organizer"
        title="Sales Command Center"
        subtitle="Revenue, attendance and order flow across your events."
        action={
          <Button asChild>
            <Link href="/organizer/events/new">
              <CalendarPlus className="size-4" /> New event
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Live events" value={String(stats.totalEvents)} hint="published" />
        <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(stats.totalTicketsSold)} hint={`${fillRate}% fill rate`} />
        <StatCard icon={DollarSign} label="Gross revenue" value={formatCurrency(stats.totalRevenue)} hint="before fees" />
        <StatCard icon={Users} label="Capacity" value={formatNumber(capacity)} hint="across all events" />
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl">Your events</h2>
        {myEvents.length ? (
          <div className="grid gap-4">
            {myEvents.map((e) => {
              const pct = Math.min(100, Math.round((e.ticketsSold / e.capacity) * 100));
              return (
                <article key={e.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-xl leading-tight">
                        <Link href={`/events/${e.slug}`} className="hover:text-primary">
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

      <section className="space-y-4">
        <h2 className="text-2xl">Recent orders</h2>
        {recentOrders.length ? (
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
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No orders yet"
            description="Orders for your events will appear here as tickets sell."
          />
        )}
      </section>
    </DashboardShell>
  );
}
