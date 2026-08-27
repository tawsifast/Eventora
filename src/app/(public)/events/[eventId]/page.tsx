import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetailPage } from "@/components/pages/event-detail-page";
import { getEvent, getEventReviews, getEvents } from "@/lib/api";
import type { Event, Review } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;

  let event: Event;
  try {
    event = await getEvent(eventId);
  } catch {
    return {
      title: "Event not found â€” Eventora",
      robots: { index: false },
    };
  }

  return {
    title: `${event.title} â€” Eventora`,
    description: `${event.shortDescription} ${event.venue}, ${event.city}. Get your tickets on Eventora.`,
    openGraph: {
      title: `${event.title} â€” Eventora`,
      description: `${event.venue}, ${event.city}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  let event: Event;
  try {
    event = await getEvent(eventId);
  } catch {
    notFound();
  }

  // reviews + "you may also like" suggestions in parallel
  let reviews: Review[] = [];
  let related: Event[] = [];
  try {
    const [allReviews, allEvents]: [Review[], Event[]] = await Promise.all([getEventReviews(event.id), getEvents()]);
    reviews = allReviews;
    related = allEvents
      .filter(
        (e) =>
          e.id !== event.id &&
          e.category?.slug === event.category?.slug &&
          String(e.status).toLowerCase() === "upcoming"
      )
      .slice(0, 3);
    if (related.length === 0) {
      related = allEvents
        .filter((e) => e.id !== event.id && String(e.status).toLowerCase() === "upcoming")
        .slice(0, 3);
    }
  } catch {
    // backend offline â€” detail still renders, sections stay empty
  }

  return <EventDetailPage event={event} reviews={reviews} related={related} />;
}
