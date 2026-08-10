import type { Metadata } from "next";

import { CreateEventPage } from "@/components/pages/create-event-page";

export const metadata: Metadata = {
  title: "Create an Event — EventHub",
  description: "Publish a new event on EventHub with tickets, capacity and pricing in minutes.",
  openGraph: {
    title: "Create an Event — EventHub",
    description: "Publish your event and start selling tickets.",
  },
};

export default function Page() {
  return <CreateEventPage />;
}