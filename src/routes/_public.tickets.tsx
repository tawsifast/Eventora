import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Download, MapPin, QrCode, Ticket as TicketIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/section-heading";
import { EmptyState } from "@/components/states";
import { TicketStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEvent } from "@/data/events";
import { getTicketsByUser } from "@/data/tickets";
import { currentUser } from "@/data/users";
import { formatDate, formatLongDate, to12h } from "@/lib/format";
import type { Ticket } from "@/types";

export const Route = createFileRoute("/_public/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — EventHub" },
      { name: "description", content: "View and manage the digital tickets for events you are attending." },
      { property: "og:title", content: "My Tickets — EventHub" },
      { property: "og:description", content: "Your digital tickets, all in one wallet." },
    ],
  }),
  component: TicketsPage,
});

function QrMock({ id }: { id: string }) {
  return (
    <div
      aria-label={`QR code for ticket ${id}`}
      className="grid size-24 shrink-0 grid-cols-7 gap-0.5 rounded-xl border border-border bg-background p-2"
    >
      {Array.from({ length: 49 }).map((_, i) => {
        const on = (id.charCodeAt(i % id.length) + i * 7) % 3 !== 0;
        return <span key={i} className={on ? "rounded-[1px] bg-foreground" : "bg-transparent"} />;
      })}
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const event = getEvent(ticket.eventId);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/20" />
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {ticket.tierName} · {ticket.quantity} {ticket.quantity > 1 ? "seats" : "seat"}
            </span>
          </div>
          <h3 className="text-2xl leading-tight">
            {event ? (
              <Link to="/events/$eventId" params={{ eventId: event.slug }} className="hover:text-primary">
                {event.title}
              </Link>
            ) : (
              "Event unavailable"
            )}
          </h3>
          {event ? (
            <dl className="grid gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5 text-primary" />
                <dd>
                  {formatLongDate(event.date)} · {to12h(event.startTime)}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <dd className="truncate">
                  {event.venue}, {event.city}
                </dd>
              </div>
            </dl>
          ) : null}
          <Separator className="max-w-xs" />
          <p className="font-mono text-xs text-muted-foreground">
            {ticket.id.toUpperCase()} · purchased {formatDate(ticket.purchasedAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <QrMock id={ticket.id} />
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="secondary" onClick={() => toast.success("Ticket PDF downloaded")}>
              <Download className="size-4" /> Download
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast.success("Showing entry QR code")}>
              <QrCode className="size-4" /> Show QR
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TicketsPage() {
  const all = getTicketsByUser(currentUser.id);
  const [tab, setTab] = useState("valid");

  const groups = {
    valid: all.filter((t) => t.status === "valid"),
    used: all.filter((t) => t.status === "used"),
    refunded: all.filter((t) => t.status === "refunded"),
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ticket wallet"
        title="My Tickets"
        subtitle="Your digital passes, ready to scan at the gate."
        action={
          <Button asChild variant="outline">
            <Link to="/events">Find more events</Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="valid">Upcoming ({groups.valid.length})</TabsTrigger>
          <TabsTrigger value="used">Attended ({groups.used.length})</TabsTrigger>
          <TabsTrigger value="refunded">Refunded ({groups.refunded.length})</TabsTrigger>
        </TabsList>

        {(["valid", "used", "refunded"] as const).map((key) => (
          <TabsContent key={key} value={key} className="pt-8">
            {groups[key].length ? (
              <div className="grid gap-5">
                {groups[key].map((t) => (
                  <TicketRow key={t.id} ticket={t} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={TicketIcon}
                title="Nothing here yet"
                description="Tickets you buy will appear in this wallet instantly."
                action={
                  <Button asChild>
                    <Link to="/events">Explore events</Link>
                  </Button>
                }
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
