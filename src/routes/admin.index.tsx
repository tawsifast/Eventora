import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, DollarSign, LayoutDashboard, Ticket, Users } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";

const navItems = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, exact: true },
];

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
  return (
    <DashboardShell label="Admin" items={navItems}>
      <div className="space-y-8">
        <PageHeader title="Admin Overview" subtitle="Platform health at a glance." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total events" value="268" hint="+14 this month" />
          <StatCard icon={Users} label="Organizers" value="72" hint="+5 pending review" />
          <StatCard icon={Ticket} label="Tickets sold" value="94,120" hint="+3.2k this week" />
          <StatCard icon={DollarSign} label="Gross revenue" value="$2.4M" hint="+11%" />
        </div>
      </div>
    </DashboardShell>
  );
}
