import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck, Sparkles, Ticket } from "lucide-react";

import { PageHeader } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About EventHub — Discover. Experience. Remember.",
  description:
    "EventHub is an event discovery and ticketing platform connecting audiences with organizers across the country.",
  openGraph: {
    title: "About EventHub",
    description: "Why we built an event marketplace worth remembering.",
  },
};

const pillars = [
  { icon: Sparkles, title: "Curated discovery", body: "Editors highlight events worth your evening, not just the ones paying for placement." },
  { icon: Ticket, title: "Tickets in seconds", body: "One checkout, instant digital tickets and a wallet that keeps every order in one place." },
  { icon: ShieldCheck, title: "Organizer trust", body: "Verified organizers, transparent capacity numbers and clear refund states on every event." },
  { icon: HeartHandshake, title: "Built for community", body: "Small meetups matter as much as stadium nights. Both get the same tooling." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="About EventHub" subtitle="Discover. Experience. Remember." />
      <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          EventHub began as a spreadsheet passed between three friends who kept missing gigs they would have loved.
          Today it is a marketplace where audiences find concerts, conferences, workshops, festivals and matches —
          and where organizers get the tooling to sell out.
        </p>
        <p>
          We care about two things: making discovery feel effortless, and making ticketing feel trustworthy. Every
          event page shows real capacity, real pricing and real reviews from people who attended.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.title} className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="size-5" />
            </span>
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}