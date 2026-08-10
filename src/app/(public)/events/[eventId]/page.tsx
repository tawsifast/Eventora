import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetailPage } from "@/components/pages/event-detail-page";
import { events } from "@/data/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = events.find((e) => e.slug === eventId || e.id === eventId);

  if (!event) {
    return {
      title: "Event not found — EventHub",
      robots: { index: false },
    };
  }

  return {
    title: `${event.title} — EventHub`,
    description: `${event.shortDescription} ${event.venue}, ${event.city}. Get your tickets on EventHub.`,
    openGraph: {
      title: `${event.title} — EventHub`,
      description: `${event.venue}, ${event.city}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = events.find((e) => e.slug === eventId || e.id === eventId);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}