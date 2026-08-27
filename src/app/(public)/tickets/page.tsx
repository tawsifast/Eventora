import type { Metadata } from "next";

import { TicketsPage } from "@/components/pages/tickets-page";

export const metadata: Metadata = {
  title: "My Tickets — Eventora",
  description: "View and manage the digital tickets for events you are attending.",
  openGraph: {
    title: "My Tickets — Eventora",
    description: "Your digital tickets, all in one wallet.",
  },
};

export default function Page() {
  return <TicketsPage />;
}