"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Share2,
  Star,
  Ticket,
  User2,
  Users,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { StarRating } from "@/components/star-rating";
import { CategoryBadge, EventStatusBadge } from "@/components/status-badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryName } from "@/data/categories";
import { getUpcomingEvents } from "@/data/events";
import { getReviewsByEvent } from "@/data/reviews";
import { EventCard } from "@/components/event-card";
import type { ScheduleItem, TicketTier, Event } from "@/types";
import {
  calcServiceFee,
  formatCurrency,
  formatLongDate,
  formatNumber,
  formatRelative,
  formatTimeRange,
} from "@/lib/format";
import Link from "next/link";

export function EventDetailPage({ event }: { event: Event }) {
  const reviews = getReviewsByEvent(event.id);
  const related = getUpcomingEvents(8)
    .filter((e) => e.id !== event.id && e.categorySlug === event.categorySlug)
    .slice(0, 3);
  const fallbackRelated = getUpcomingEvents(4).filter((e) => e.id !== event.id).slice(0, 3);
  const suggestions = related.length ? related : fallbackRelated;

  const [tierId, setTierId] = useState(event.tiers[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const tier = event.tiers.find((t: TicketTier) => t.id === tierId) ?? event.tiers[0];
  const subtotal = (tier?.price ?? event.price) * qty;
  const fee = calcServiceFee(subtotal);

  const soldPct = Math.min(100, Math.round((event.ticketsSold / event.capacity) * 100));
  const seatsLeft = Math.max(0, event.capacity - event.ticketsSold);

  return (
    <div>
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/45" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
            <Link href="/events">
              <ArrowLeft className="size-4" /> All events
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge name={getCategoryName(event.categorySlug)} />
            <EventStatusBadge status={event.status} />
            {event.featured ? (
              <span className="rounded-full border border-primary/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.03] sm:text-6xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{event.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" /> {formatLongDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-primary" /> {formatTimeRange(event.startTime, event.endTime)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> {event.venue}, {event.city}
            </span>
            <span className="flex items-center gap-2">
              <User2 className="size-4 text-primary" /> {event.organizerName}
            </span>
            <span className="flex items-center gap-2">
              <Star className="size-4 fill-primary text-primary" /> {event.rating.toFixed(1)} ({event.reviewCount}{" "}
              reviews)
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:px-8">
        {/* Main column */}
        <div className="min-w-0">
          <Tabs defaultValue="about">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="venue">Venue</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8 pt-8">
              <p className="text-base leading-relaxed text-muted-foreground">{event.description}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Capacity", value: formatNumber(event.capacity) },
                  { label: "Tickets sold", value: formatNumber(event.ticketsSold) },
                  { label: "Seats left", value: formatNumber(seatsLeft) },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                    <p className="eyebrow">{s.label}</p>
                    <p className="mt-2 font-display text-3xl">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="eyebrow">Ticket tiers</p>
                <div className="mt-4 grid gap-3">
                  {event.tiers.map((t: TicketTier) => (
                    <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.perks}</p>
                      </div>
                      <p className="font-display text-xl text-primary">{formatCurrency(t.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="pt-8">
              <ol className="relative space-y-6 border-l border-border pl-6">
                {event.schedule.map((item: ScheduleItem) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 size-2.5 rounded-full bg-primary" />
                    <p className="font-mono text-xs tracking-wider text-primary">{item.time}</p>
                    <p className="mt-1 text-lg leading-snug">{item.title}</p>
                    {item.speaker ? (
                      <p className="text-sm text-muted-foreground">with {item.speaker}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="venue" className="space-y-4 pt-8">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="eyebrow">Location</p>
                <h3 className="mt-2 text-2xl">{event.venue}</h3>
                <p className="mt-1 text-muted-foreground">
                  {event.address}, {event.city}
                </p>
                <Separator className="my-5" />
                <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {[
                    "Doors open one hour before start",
                    "Digital tickets scanned at the gate",
                    "Step-free access at the main entrance",
                    "Paid parking available on site",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                Map preview
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-5 pt-8">
              <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6">
                <p className="font-display text-5xl text-primary">{event.rating.toFixed(1)}</p>
                <div>
                  <StarRating rating={event.rating} />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Based on {event.reviewCount} attendee reviews
                  </p>
                </div>
              </div>
              {reviews.length ? (
                <div className="grid gap-4">
                  {reviews.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {r.userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{r.userName}</p>
                          <p className="text-xs text-muted-foreground">{formatRelative(r.createdAt)}</p>
                        </div>
                        <div className="ml-auto shrink-0">
                          <StarRating rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No reviews yet — be the first to review after attending.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking rail */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-glow)]">
            <div>
              <p className="eyebrow">Starting from</p>
              <p className="mt-1 font-display text-4xl text-primary">{formatCurrency(event.price)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Choose a tier</p>
              {event.tiers.map((t: TicketTier) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTierId(t.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    t.id === tier?.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{t.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{t.perks}</span>
                  </span>
                  <span className="shrink-0 font-display text-lg">{formatCurrency(t.price)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-1 rounded-xl border border-border p-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </Button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
                  +
                </Button>
              </div>
            </div>

            <Separator />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Service fee</dt>
                <dd>{formatCurrency(fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-medium">Total</dt>
                <dd className="font-display text-2xl text-primary">{formatCurrency(subtotal + fee)}</dd>
              </div>
            </dl>

            <Button
              className="w-full"
              size="lg"
              disabled={seatsLeft === 0}
              onClick={() => toast.success(`${qty} × ${tier?.name} reserved for ${event.title}`)}
            >
              <Ticket className="size-4" /> {seatsLeft === 0 ? "Sold out" : "Get tickets"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Event link copied to clipboard")}
            >
              <Share2 className="size-4" /> Share event
            </Button>

            <div className="space-y-2 rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" /> {formatNumber(event.ticketsSold)} going
                </span>
                <span>{soldPct}% sold</span>
              </div>
              <Progress value={soldPct} className="h-1.5" />
            </div>
          </div>
        </aside>
      </div>

      {suggestions.length ? (
        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-2">
              <p className="eyebrow">You may also like</p>
              <h2 className="text-3xl sm:text-4xl">More experiences</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}