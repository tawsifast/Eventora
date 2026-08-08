import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, DollarSign, Ticket, Users } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { CompactEventCard } from "@/components/event-card";
import { PageHeader } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { getUpcomingEvents } from "@/data/events";

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
    <DashboardShell>
      <div className="space-y-8">
        <PageHeader title="Organizer Dashboard" subtitle="Sales and attendance across your events." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Active events" value="6" change="+2 this month" />
          <StatCard icon={Ticket} label="Tickets sold" value="4,218" change="+312 this week" />
          <StatCard icon={DollarSign} label="Revenue" value="$128,940" change="+9.4%" />
          <StatCard icon={Users} label="Attendees" value="3,905" change="92% check-in rate" />
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
