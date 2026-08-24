import type { Metadata } from "next";

import { ExploreEventsPage } from "@/components/pages/explore-events-page";
import { getCategories, getEvents } from "@/lib/api";
import type { Category, Event } from "@/types";

export const metadata: Metadata = {
  title: "Explore Events — EventHub",
  description:
    "Search and filter concerts, conferences, workshops and festivals by category, date, price and status.",
  openGraph: {
    title: "Explore Events — EventHub",
    description: "Find your next experience on EventHub.",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;

  let events: Event[] = [];
  let categories: Category[] = [];
  try {
    [events, categories] = await Promise.all([getEvents(), getCategories()]);
  } catch {
    // backend offline — the page renders with empty data
  }

  console.log(events, "event")


  return (
    <ExploreEventsPage initialQuery={q ?? ""} initialCategory={category ?? "all"} events={events} categories={categories} />
  );
}