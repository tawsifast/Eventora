import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Ticket, User2 } from "lucide-react";

import { CategoryBadge, EventStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { getCategoryName } from "@/data/categories";
import { formatCurrency, formatDate, formatNumber, to12h } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

export function EventCard({ event, className }: { event: Event; className?: string }) {
  const seatsLeft = event.capacity - event.ticketsSold;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <Link
        to="/events/$eventId"
        params={{ eventId: event.slug }}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          width={1280}
          height={832}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <CategoryBadge name={getCategoryName(event.categorySlug)} />
          <EventStatusBadge status={event.status} className="bg-background/90 backdrop-blur" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-snug tracking-tight">
            <Link
              to="/events/$eventId"
              params={{ eventId: event.slug }}
              className="transition-colors hover:text-primary"
            >
              {event.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.shortDescription}</p>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <dd>{formatDate(event.date)}</dd>
            <span aria-hidden className="text-border">
              |
            </span>
            <Clock className="size-4 shrink-0 text-primary" />
            <dd>{to12h(event.startTime)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <dd className="truncate">
              {event.venue}, {event.city}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <User2 className="size-4 shrink-0 text-primary" />
            <dd className="truncate">{event.organizerName}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="size-4 shrink-0 text-primary" />
            <dd>{seatsLeft > 0 ? `${formatNumber(seatsLeft)} seats available` : "Sold out"}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="font-semibold">
            {event.price === 0 ? "Free" : formatCurrency(event.price)}
            {event.price > 0 && <span className="text-sm font-normal text-muted-foreground"> / ticket</span>}
          </p>
          <Button asChild size="sm">
            <Link to="/events/$eventId" params={{ eventId: event.slug }}>
              View Event
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function CompactEventCard({ event }: { event: Event }) {
  return (
    <article className="group flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <Link
        to="/events/$eventId"
        params={{ eventId: event.slug }}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28"
      >
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          width={1280}
          height={832}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {formatDate(event.date)} · {getCategoryName(event.categorySlug)}
        </p>
        <h3 className="truncate font-semibold">
          <Link to="/events/$eventId" params={{ eventId: event.slug }} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {event.venue}, {event.city}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">
            {event.price === 0 ? "Free" : formatCurrency(event.price)}
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link to="/events/$eventId" params={{ eventId: event.slug }}>
              Get Tickets
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
