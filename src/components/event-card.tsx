import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, MapPin, Ticket } from "lucide-react";

import { CategoryBadge, EventStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { getCategoryName } from "@/data/categories";
import { formatCurrency, formatDate, formatDayMonth, formatNumber, to12h } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

export function EventCard({ event, className }: { event: Event; className?: string }) {
  const seatsLeft = event.capacity - event.ticketsSold;
  const { day, month } = formatDayMonth(event.date);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <Link
        to="/events/$eventId"
        params={{ eventId: event.slug }}
        className="relative block aspect-[16/11] overflow-hidden"
      >
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          width={1280}
          height={880}
          className="size-full object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <div className="flex flex-col items-center rounded-xl border border-border bg-background/80 px-3 py-1.5 backdrop-blur-md">
            <span className="font-display text-xl leading-none">{day}</span>
            <span className="text-[10px] font-semibold tracking-[0.16em] text-primary">{month}</span>
          </div>
          <EventStatusBadge status={event.status} className="bg-background/80 backdrop-blur-md" />
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <CategoryBadge name={getCategoryName(event.categorySlug)} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-2xl leading-tight">
            <Link
              to="/events/$eventId"
              params={{ eventId: event.slug }}
              className="transition-colors hover:text-primary"
            >
              {event.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{event.shortDescription}</p>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <dd className="truncate">
              {event.venue}, {event.city}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-primary" />
            <dd>{to12h(event.startTime)}</dd>
            <span aria-hidden>·</span>
            <Ticket className="size-3.5 shrink-0 text-primary" />
            <dd>{seatsLeft > 0 ? `${formatNumber(seatsLeft)} left` : "Sold out"}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="font-display text-2xl text-primary">
            {event.price === 0 ? "Free" : formatCurrency(event.price)}
            {event.price > 0 && (
              <span className="font-sans text-xs font-normal text-muted-foreground"> / ticket</span>
            )}
          </p>
          <Button asChild size="sm" variant="secondary" className="group/btn">
            <Link to="/events/$eventId" params={{ eventId: event.slug }}>
              View
              <ArrowUpRight className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function CompactEventCard({ event }: { event: Event }) {
  return (
    <article className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
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
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {formatDate(event.date)} · {getCategoryName(event.categorySlug)}
        </p>
        <h3 className="truncate text-xl leading-tight">
          <Link to="/events/$eventId" params={{ eventId: event.slug }} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {event.venue}, {event.city}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display text-xl text-primary">
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
