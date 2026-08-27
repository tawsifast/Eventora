"use client";

import { CalendarDays, Download, MapPin, QrCode, Ticket as TicketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/section-heading";
import { EmptyState } from "@/components/states";
import { TicketStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEvents, getMyTickets } from "@/lib/api";
import { formatDate, formatLongDate, to12h } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import type { Event, Ticket } from "@/types";
import Link from "next/link";

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

function TicketRow({ ticket, event }: { ticket: Ticket; event?: Event }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/20" />
      <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {ticket.tierName} · {ticket.quantity} {ticket.quantity > 1 ? "seats" : "seat"}
            </span>
          </div>
          <h3 className="text-2xl leading-tight">
            {event ? (
              <Link href={`/events/${event.slug}`} className="hover:text-primary">
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
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                {/* min-w-0 needed here: truncate on a flex item next to an
                   icon sibling is ignored without it, so long venue names
                   would overflow the card instead of being clipped. */}
                <dd className="min-w-0 truncate">
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

        <div className="flex flex-wrap items-center gap-4 sm:flex-col sm:items-end">
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

export function TicketsPage() {
  const { user } = useAuth();
  const [all, setAll] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Record<string, Event>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    if (!user) return;
    Promise.all([getMyTickets(), getEvents()])
      .then(([myTickets, myEvents]: [Ticket[], Event[]]) => {
        setAll(myTickets);
        setEvents(Object.fromEntries(myEvents.map((e) => [e.id, e])));
      })
      .catch((error) => toast.error(error.message ?? "Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [user]);

  const groups = {
    active: all.filter((t) => String(t.status).toLowerCase() === "active"),
    used: all.filter((t) => String(t.status).toLowerCase() === "used"),
    cancelled: all.filter((t) => String(t.status).toLowerCase() === "cancelled"),
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Ticket wallet"
        title="My Tickets"
        subtitle="Your digital passes, ready to scan at the gate."
        action={
          <Button asChild variant="outline">
            <Link href="/events">Find more events</Link>
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full max-w-72" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          {/* overflow-x-auto is a safety net: if the three tab triggers
             ever don't fit a very narrow screen, they scroll horizontally
             within this strip instead of breaking the page width. */}
          <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="active">Upcoming ({groups.active.length})</TabsTrigger>
              <TabsTrigger value="used">Attended ({groups.used.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({groups.cancelled.length})</TabsTrigger>
            </TabsList>
          </div>

          {(["active", "used", "cancelled"] as const).map((key) => (
            <TabsContent key={key} value={key} className="pt-8">
              {groups[key].length ? (
                <div className="grid gap-5">
                  {groups[key].map((t) => (
                    <TicketRow key={t.id} ticket={t} event={t.event ?? events[t.eventId]} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={TicketIcon}
                  title="Nothing here yet"
                  description="Tickets you buy will appear in this wallet instantly."
                  action={
                    <Button asChild>
                      <Link href="/events">Explore events</Link>
                    </Button>
                  }
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}