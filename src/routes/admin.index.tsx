import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, DollarSign, LayoutDashboard, Ticket, Users } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { EventStatusBadge, RoleBadge, UserStatusBadge } from "@/components/status-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { events } from "@/data/events";
import { users } from "@/data/users";
import { orders } from "@/data/orders";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

const navItems = [{ label: "Overview", to: "/admin", icon: LayoutDashboard, exact: true }];

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — EventHub" },
      { name: "description", content: "Platform-wide view of events, organizers, ticket volume and revenue on EventHub." },
      { property: "og:title", content: "Admin Overview — EventHub" },
      { property: "og:description", content: "Moderate events and monitor platform health." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const ticketsSold = events.reduce((s, e) => s + e.ticketsSold, 0);
  const revenue = orders.reduce((s, o) => (o.paymentStatus === "paid" ? s + o.amount : s), 0);
  const organizers = users.filter((u) => u.role === "organizer");

  return (
    <DashboardShell label="Admin" items={navItems}>
      <PageHeader
        eyebrow="Platform"
        title="Admin Overview"
        subtitle="Events, organizers and ticket volume across EventHub."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total events" value={String(events.length)} hint="all statuses" />
        <StatCard icon={Users} label="Organizers" value={String(organizers.length)} hint={`${users.length} users total`} />
        <StatCard icon={Ticket} label="Tickets sold" value={formatNumber(ticketsSold)} hint="lifetime" />
        <StatCard icon={DollarSign} label="Collected revenue" value={formatCurrency(revenue)} hint="paid orders" />
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
                {events.slice(0, 8).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      <Link to="/events/$eventId" params={{ eventId: e.slug }} className="hover:text-primary">
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
        <h2 className="text-2xl">Users</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                      {formatDate(u.joinedAt)}
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
