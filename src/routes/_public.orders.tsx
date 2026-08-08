import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/section-heading";
import { CompactEventCard } from "@/components/event-card";
import { getUpcomingEvents } from "@/data/events";

export const Route = createFileRoute("/_public/orders")({
  head: () => ({
    meta: [
      { title: "Order History — EventHub" },
      { name: "description", content: "Review your EventHub purchases, payment status and downloadable tickets." },
      { property: "og:title", content: "Order History — EventHub" },
      { property: "og:description", content: "Every EventHub purchase in one place." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const recent = getUpcomingEvents(4);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Order History" subtitle="Purchases, payment status and tickets." />
      <div className="grid gap-4">
        {recent.map((event) => (
          <CompactEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
