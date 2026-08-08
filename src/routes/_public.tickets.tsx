import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/section-heading";
import { CompactEventCard } from "@/components/event-card";
import { getUpcomingEvents } from "@/data/events";

export const Route = createFileRoute("/_public/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — EventHub" },
      { name: "description", content: "View and manage the digital tickets for events you are attending." },
      { property: "og:title", content: "My Tickets — EventHub" },
      { property: "og:description", content: "Your digital tickets, all in one wallet." },
    ],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const upcoming = getUpcomingEvents(3);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="My Tickets" subtitle="Everything you are attending, newest first." />
      <div className="grid gap-4">
        {upcoming.map((event) => (
          <CompactEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
