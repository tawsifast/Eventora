import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CalendarPlus, DollarSign, LayoutDashboard, Ticket, Users } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { CompactEventCard } from "@/components/event-card";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { getUpcomingEvents } from "@/data/events";

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
  const events = getUpcomingEvents(4);

  return (
    <DashboardShell label="Organizer" items={navItems}>
      <div className="space-y-8">
        <PageHeader title="Organizer Dashboard" subtitle="Sales and attendance across your events." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Active events" value="6" hint="+2 this month" />
          <StatCard icon={Ticket} label="Tickets sold" value="4,218" hint="+312 this week" />
          <StatCard icon={DollarSign} label="Revenue" value="$128,940" hint="+9.4%" />
          <StatCard icon={Users} label="Attendees" value="3,905" hint="92% check-in rate" />
        </div>
        <div className="grid gap-4">
          {events.map((event) => (
            <CompactEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
