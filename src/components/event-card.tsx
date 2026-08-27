import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Ticket } from "lucide-react";

import { EventImage } from "@/components/event-image";
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
        href={`/events/${event.slug}`}
        className="relative block aspect-[16/11] overflow-hidden"
      >
        <EventImage
          event={event}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-[1.06]"
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
          <CategoryBadge name={getCategoryName(event.category?.slug ?? "general")} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-2xl leading-tight">
            <Link
              href={`/events/${event.slug}`}
              className="transition-colors hover:text-primary"
            >
              {event.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{event.shortDescription}</p>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            {/* min-w-0 is required on the truncating element itself when its
               sibling is a flex item (the icon) — without it, text-overflow:
               ellipsis is ignored and long venue names push past the card
               edge instead of being clipped. */}
            <dd className="min-w-0 truncate">
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
            <Link href={`/events/${event.slug}`}>
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
    // overflow-hidden added as a safety net: even if some inner content
    // miscalculates its width, it gets clipped here instead of breaking
    // the grid/page width on mobile.
    <article className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
      <Link
        href={`/events/${event.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-28"
      >
        <EventImage
          event={event}
          sizes="128px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {formatDate(event.date)} · {getCategoryName(event.category?.slug ?? "general")}
        </p>
        <h3 className="truncate text-xl leading-tight">
          <Link href={`/events/${event.slug}`} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        {/* Same fix as EventCard: truncate goes on a dedicated min-w-0 span,
           not directly on the flex row that also contains the icon. */}
        <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate">
            {event.venue}, {event.city}
          </span>
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-display text-lg text-primary sm:text-xl">
            {event.price === 0 ? "Free" : formatCurrency(event.price)}
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/events/${event.slug}`}>
              Get Tickets
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}