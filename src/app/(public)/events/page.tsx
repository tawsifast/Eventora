import type { Metadata } from "next";

import { ExploreEventsPage } from "@/components/pages/explore-events-page";

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

  return <ExploreEventsPage initialQuery={q ?? ""} initialCategory={category ?? "all"} />;
}