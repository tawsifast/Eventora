import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";

export const metadata: Metadata = {
  title: "EventHub — Discover Events Worth Remembering",
  description:
    "Find concerts, conferences, workshops, sports, festivals and experiences happening around you. Buy tickets in seconds on EventHub.",
  openGraph: {
    title: "EventHub — Discover Events Worth Remembering",
    description: "Concerts, conferences, workshops, festivals and experiences near you.",
  },
};

export default function Page() {
  return <HomePage />;
}