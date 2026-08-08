import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";

import { EventStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from "@/data/events";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_public/events/$eventId")({
  loader: ({ params }) => {
    const event = events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found — EventHub" }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    return {
      meta: [
        { title: `${event.title} — EventHub` },
        { name: "description", content: `${event.title} at ${event.venue}, ${event.city}. Get your tickets on EventHub.` },
        { property: "og:title", content: `${event.title} — EventHub` },
        { property: "og:description", content: `${event.venue}, ${event.city}` },
      ],
    };
  },
  component: EventDetailPage,
});

function EventDetailPage() {
  const { event } = Route.useLoaderData();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <EventStatusBadge status={event.status} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4" /> {event.date}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" /> {event.venue}, {event.city}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4" /> Hosted by {event.organizerName}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="venue">Venue</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="pt-6 text-muted-foreground">
            <p>{event.description}</p>
          </TabsContent>
          <TabsContent value="venue" className="pt-6 text-muted-foreground">
            <p>
              {event.venue} — {event.city}. Doors open one hour before the scheduled start time.
            </p>
          </TabsContent>
        </Tabs>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted-foreground">Starting from</p>
          <p className="text-3xl font-semibold">{formatCurrency(event.price)}</p>
          <Button className="w-full" size="lg">
            <Ticket className="size-4" /> Get tickets
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/events">Back to explore</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
