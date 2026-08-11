import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { getCategories, getEvents } from "@/lib/api";

export const metadata: Metadata = {
  title: "EventHub — Discover Events Worth Remembering",
  description:
    "Find concerts, conferences, workshops, sports, festivals and experiences happening around you. Buy tickets in seconds on EventHub.",
  openGraph: {
    title: "EventHub — Discover Events Worth Remembering",
    description: "Concerts, conferences, workshops, festivals and experiences near you.",
  },
};

export default async function Page() {
  // the backend may be offline — show an empty home page instead of crashing
  let featured: Awaited<ReturnType<typeof getEvents>> = [];
  let upcoming: Awaited<ReturnType<typeof getEvents>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const [events, allCategories] = await Promise.all([getEvents(), getCategories()]);
    featured = events.filter((e) => e.featured).slice(0, 3);
    upcoming = events
      .filter((e) => e.status === "upcoming")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
    categories = allCategories;
  } catch {
    // backend not reachable — sections below simply render empty states
  }

  return <HomePage featured={featured} upcoming={upcoming} categories={categories} />;
}