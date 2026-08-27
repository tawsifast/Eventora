"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, CalendarPlus, Search, Sparkles, Ticket, Users } from "lucide-react";
import { useState } from "react";

import { CategoryCard } from "@/components/category-card";
import { CompactEventCard, EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-events.jpg";
import Link from "next/link";
import type { Category, Event } from "@/types";

interface HomePageProps {
  featured: Event[];
  upcoming: Event[];
  categories: Category[];
}

export function HomePage({ featured, upcoming, categories }: HomePageProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div>
      <section className="relative overflow-hidden">
        <Image
          src={heroImage}
          alt="Crowd celebrating at a live outdoor concert"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/40" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium uppercase tracking-widest backdrop-blur">
              <Sparkles className="size-3.5 text-primary" /> Discover. Experience. Remember.
            </span>
            <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Discover Events Worth Remembering
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Find concerts, conferences, workshops, sports, festivals, and experiences happening around you.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : "/events");
              }}
              className="flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-[var(--shadow-elevated)] backdrop-blur sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, locations, or categories..."
                  className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                  aria-label="Search events"
                />
              </div>
              {/* Full width on mobile so the tap target matches the input above it */}
              <Button type="submit" size="lg" className="h-11 w-full sm:w-auto">
                Search
              </Button>
            </form>

            {/* Stack full-width on mobile, side-by-side from sm up, to avoid two
               multi-word buttons squeezing into a narrow row on small phones. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/events">
                  Explore Events <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full bg-card/70 backdrop-blur sm:w-auto">
                <Link href="/organizer/events/new">
                  <CalendarPlus className="size-4" /> Create an Event
                </Link>
              </Button>
            </div>

            <dl className="flex flex-wrap gap-x-6 gap-y-4 pt-4 sm:gap-x-10">
              {[
                { icon: Ticket, value: "268", label: "Live events" },
                { icon: Users, value: "94k", label: "Tickets sold" },
                { icon: Sparkles, value: "4.8", label: "Average rating" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <s.icon className="size-5 text-primary" />
                  <div>
                    <dt className="text-xl font-semibold leading-none">{s.value}</dt>
                    <dd className="text-sm text-muted-foreground">{s.label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Events"
          subtitle="Handpicked experiences you won't want to miss."
          action={
            <Button asChild variant="ghost">
              <Link href="/events">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            title="Browse by category"
            subtitle="From rooftop gigs to hands-on workshops — pick a lane and go."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title="Upcoming Events" subtitle="Sorted by what's happening soonest." />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {upcoming.map((event) => (
            <CompactEventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-primary/5 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hosting something?</h2>
            <p className="text-muted-foreground">
              Publish your event, track ticket sales in real time and manage attendees from one organizer
              dashboard.
            </p>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/organizer/events/new">
              <CalendarPlus className="size-4" /> Create an Event
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}