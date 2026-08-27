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
import { toast } from "sonner";

import { EventImage } from "@/components/event-image";
import { StarRating } from "@/components/star-rating";
import { CategoryBadge, EventStatusBadge } from "@/components/status-badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getCategoryName } from "@/data/categories";
import { useAuth, initialsFromName } from "@/lib/auth-context";
import { createOrder, createReview } from "@/lib/api";
import { EventCard } from "@/components/event-card";
import type { Review, ScheduleItem, TicketTier, Event } from "@/types";
import {
  calcServiceFee,
  formatCurrency,
  formatLongDate,
  formatNumber,
  formatRelative,
  formatTimeRange,
} from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EventDetailPage({
  event,
  reviews,
  related,
}: {
  event: Event;
  reviews: Review[];
  related: Event[];
}) {
  const router = useRouter();
  const { user, isPending: authPending } = useAuth();
  const [tierId, setTierId] = useState(event.tiers[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [booking, setBooking] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const tier = event.tiers.find((t: TicketTier) => t.id === tierId) ?? event.tiers[0];
  const subtotal = (tier?.price ?? event.price) * qty;
  const fee = calcServiceFee(subtotal);

  const soldPct = Math.min(100, Math.round((event.ticketsSold / event.capacity) * 100));
  const seatsLeft = Math.max(0, event.capacity - event.ticketsSold);

  async function handleBooking() {
    if (!user) {
      toast.error("Please log in to buy tickets");
      return;
    }

    setBooking(true);
    try {
      await createOrder({
        eventId: event.id,
        quantity: qty,
        tierId: tier?.id,
        attendeeName: user.name,
      });
      toast.success(`${qty} × ${tier?.name ?? "General"} — order placed! Your ticket is in your wallet.`);
      router.push("/tickets");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place the order");
    } finally {
      setBooking(false);
    }
  }

  async function handleReview() {
    if (!user) {
      toast.error("Please log in to write a review");
      return;
    }

    setReviewSubmitting(true);
    try {
      await createReview({ eventId: event.id, rating: reviewRating, comment: reviewComment.trim() || undefined });
      toast.success("Review published — thank you!");
      setReviewComment("");
      setReviewRating(5);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to publish the review");
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <EventImage event={event} sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/45" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-36 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
            <Link href="/events">
              <ArrowLeft className="size-4" /> All events
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge name={getCategoryName(event.category?.slug ?? "general")} />
            <EventStatusBadge status={event.status} />
            {event.featured ? (
              <span className="rounded-full border border-primary/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-2xl font-bold leading-tight break-words sm:text-4xl lg:text-6xl">
            {event.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-lg">{event.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary" /> {formatLongDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" /> {formatTimeRange(event.startTime, event.endTime)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" /> {event.venue}, {event.city}
            </span>
            <span className="flex items-center gap-2">
              <User2 className="size-4 shrink-0 text-primary" /> {event.organizer?.name ?? "Organizer"}
            </span>
            <span className="flex items-center gap-2">
              <Star className="size-4 shrink-0 fill-primary text-primary" /> {event.rating.toFixed(1)} ({event.reviewCount}{" "}
              reviews)
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pb-20">
        {/* Main column */}
        <div className="min-w-0 w-full">
          <Tabs defaultValue="about" className="w-full">
            <div className="w-full overflow-x-auto no-scrollbar">
              <TabsList className="inline-flex w-full min-w-max justify-start gap-1 p-1">
                <TabsTrigger value="about" className="text-xs sm:text-sm px-3 py-1.5">About</TabsTrigger>
                <TabsTrigger value="schedule" className="text-xs sm:text-sm px-3 py-1.5">Schedule</TabsTrigger>
                <TabsTrigger value="venue" className="text-xs sm:text-sm px-3 py-1.5">Venue</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm px-3 py-1.5">Reviews</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about" className="space-y-6 pt-6 sm:space-y-8 sm:pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{event.description}</p>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {[
                  { label: "Capacity", value: formatNumber(event.capacity) },
                  { label: "Tickets sold", value: formatNumber(event.ticketsSold) },
                  { label: "Seats left", value: formatNumber(seatsLeft) },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <p className="eyebrow">{s.label}</p>
                    <p className="mt-1 font-display text-2xl sm:text-3xl">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                <p className="eyebrow">Ticket tiers</p>
                <div className="mt-4 grid gap-3">
                  {event.tiers.map((t: TicketTier) => (
                    <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">{t.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t.perks}</p>
                      </div>
                      <p className="font-display text-lg sm:text-xl text-primary">{formatCurrency(t.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="pt-6 sm:pt-8">
              <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-8">
                {event.schedule.map((item: ScheduleItem) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[1.85rem] sm:-left-[2.1rem] top-1.5 size-2.5 rounded-full bg-primary" />
                    <p className="font-mono text-xs tracking-wider text-primary">{item.time}</p>
                    <p className="mt-1 text-base sm:text-lg leading-snug">{item.title}</p>
                    {item.speaker ? (
                      <p className="text-xs sm:text-sm text-muted-foreground">with {item.speaker}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="venue" className="space-y-4 pt-6 sm:pt-8">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                <p className="eyebrow">Location</p>
                <h3 className="mt-2 text-xl sm:text-2xl">{event.venue}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {event.address}, {event.city}
                </p>
                <Separator className="my-4 sm:my-5" />
                <ul className="grid gap-2 text-xs sm:text-sm text-muted-foreground sm:grid-cols-2">
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
              <div className="flex h-40 sm:h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs sm:text-sm text-muted-foreground">
                Map preview
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 sm:space-y-5 pt-6 sm:pt-8">
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
                <p className="font-display text-3xl sm:text-5xl text-primary">{event.rating.toFixed(1)}</p>
                <div>
                  <StarRating rating={event.rating} />
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Based on {event.reviewCount} attendee reviews
                  </p>
                </div>
              </div>

              {authPending || user ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReview();
                  }}
                  className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6"
                >
                  <div>
                    <p className="text-sm font-medium">Write a review</p>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          aria-label={`${star} stars`}
                          className="rounded p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={
                              star <= reviewRating
                                ? "size-5 fill-warning text-warning"
                                : "size-5 fill-transparent text-muted-foreground/40"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others what the event was like..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={reviewSubmitting} size="sm">
                      {reviewSubmitting ? "Publishing..." : "Publish review"}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-4 sm:p-6 text-center text-xs sm:text-sm text-muted-foreground">
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                  </Link>{" "}
                  to write a review.
                </p>
              )}

              {reviews.length ? (
                <div className="grid gap-3 sm:gap-4">
                  {reviews.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 sm:size-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {initialsFromName(r.user?.name ?? "Attendee")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-medium">{r.user?.name ?? "Attendee"}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{formatRelative(r.createdAt)}</p>
                        </div>
                        <div className="ml-auto shrink-0">
                          <StarRating rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground break-words">{r.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-6 sm:p-8 text-center text-xs sm:text-sm text-muted-foreground">
                  No reviews yet — be the first to review after attending.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking rail */}
       {/* Booking rail */}
<aside className="w-full min-w-0 lg:sticky lg:top-24 lg:h-fit">
  <div className="space-y-4 sm:space-y-5 rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-glow overflow-hidden">
    <div>
      <p className="eyebrow">Starting from</p>
      <p className="mt-1 font-display text-2xl sm:text-4xl text-primary">{formatCurrency(event.price)}</p>
    </div>

    <div className="space-y-2">
      <p className="text-sm font-medium">Choose a tier</p>
      {event.tiers.map((t: TicketTier) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTierId(t.id)}
          className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 text-left transition-all duration-300 ${
            t.id === tier?.id
              ? "border-primary bg-primary/10 shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
              : "border-border hover:border-primary/40 hover:bg-accent"
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-medium leading-tight">{t.name}</p>
            <p className="truncate text-[10px] sm:text-xs text-muted-foreground mt-0.5">{t.perks}</p>
          </div>
          <span className="shrink-0 font-display text-sm sm:text-base font-semibold">{formatCurrency(t.price)}</span>
        </button>
      ))}
    </div>

    <div className="flex items-center justify-between gap-2">
      <span className="text-xs sm:text-sm font-medium shrink-0">Quantity</span>
      <div className="flex items-center gap-1 rounded-xl border border-border p-1 shrink-0">
        <Button variant="ghost" size="icon" className="size-7 sm:size-8" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
          −
        </Button>
        <span className="w-6 text-center text-xs sm:text-sm font-semibold">{qty}</span>
        <Button variant="ghost" size="icon" className="size-7 sm:size-8" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
          +
        </Button>
      </div>
    </div>

    <Separator />

    <dl className="space-y-2 text-xs sm:text-sm">
      <div className="flex justify-between items-center">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-medium">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="flex justify-between items-center">
        <dt className="text-muted-foreground">Service fee</dt>
        <dd className="font-medium">{formatCurrency(fee)}</dd>
      </div>
      <div className="flex justify-between items-center border-t border-border pt-2 text-sm sm:text-base">
        <dt className="font-medium">Total</dt>
        <dd className="font-display text-lg sm:text-2xl font-bold text-primary">{formatCurrency(subtotal + fee)}</dd>
      </div>
    </dl>

    <div className="space-y-2">
      <Button
        className="w-full"
        size="lg"
        disabled={seatsLeft === 0 || booking}
        onClick={handleBooking}
      >
        <Ticket className="size-4 mr-1" /> {booking ? "Placing order..." : seatsLeft === 0 ? "Sold out" : "Get tickets"}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast.success("Event link copied to clipboard")}
      >
        <Share2 className="size-4 mr-1" /> Share event
      </Button>
    </div>

    <div className="space-y-2 rounded-xl bg-muted/40 p-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="size-3.5" /> {formatNumber(event.ticketsSold)} going
        </span>
        <span>{soldPct}% sold</span>
      </div>
      <Progress value={soldPct} className="h-1.5" />
    </div>
  </div>
</aside>
      </div>

      {related.length ? (
        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="space-y-2">
              <p className="eyebrow">You may also like</p>
              <h2 className="text-2xl sm:text-4xl">More experiences</h2>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}