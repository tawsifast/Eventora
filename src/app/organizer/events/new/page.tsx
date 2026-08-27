import type { Metadata } from "next";

import { CreateEventPage } from "@/components/pages/create-event-page";

export const metadata: Metadata = {
  title: "Create an Event — Eventora",
  description: "Publish a new event on Eventora with tickets, capacity and pricing in minutes.",
  openGraph: {
    title: "Create an Event — Eventora",
    description: "Publish your event and start selling tickets.",
  },
};

export default function Page() {
  return <CreateEventPage />;
}