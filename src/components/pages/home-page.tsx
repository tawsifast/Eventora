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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <Image
          src={heroImage}
          alt="Crowd celebrating at a live outdoor concert"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Slightly darker gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95 sm:bg-gradient-to-br sm:from-background/95 sm:via-background/80 sm:to-background/40" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="size-3.5 text-primary" /> Discover. Experience. Remember.
            </span>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Discover Events <br className="hidden sm:inline" />
                Worth Remembering
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Find concerts, conferences, workshops, sports, festivals, and experiences happening around you.
              </p>
            </div>

            {/* Search Bar Refactored for Clean UI */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : "/events");
              }}
              className="relative flex max-w-xl items-center rounded-xl border border-border bg-card/80 p-1.5 shadow-lg backdrop-blur-md"
            >
              <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, locations..."
                className="h-11 border-0 bg-transparent pl-10 pr-2 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
                aria-label="Search events"
              />
              <Button type="submit" size="default" className="h-10 px-5 shrink-0 rounded-lg">
                Search
              </Button>
            </form>

            {/* Action Buttons (Distinct Styles & Responsive Stack) */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="w-full sm:w-auto h-11 px-6 font-medium">
                <Link href="/events">
                  Explore Events <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 border-border/80 bg-card/40 backdrop-blur-md hover:bg-card/80"
              >
                <Link href="/organizer/events/new">
                  <CalendarPlus className="size-4 mr-1.5 text-muted-foreground" /> Create an Event
                </Link>
              </Button>
            </div>

            {/* Quick Stats Grid */}
            <dl className="grid grid-cols-3 gap-3 pt-4 sm:flex sm:flex-wrap sm:gap-x-10">
              {[
                { icon: Ticket, value: "268", label: "Live events" },
                { icon: Users, value: "94k", label: "Tickets sold" },
                { icon: Sparkles, value: "4.8", label: "Avg rating" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon className="size-4 text-primary shrink-0" />
                  <div>
                    <dt className="text-base font-semibold leading-none sm:text-lg">{s.value}</dt>
                    <dd className="text-xs text-muted-foreground mt-0.5">{s.label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            title="Browse by category"
            subtitle="From rooftop gigs to hands-on workshops — pick a lane and go."
          />
          <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="Upcoming Events" subtitle="Sorted by what's happening soonest." />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {upcoming.map((event) => (
            <CompactEventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Host Banner */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-primary/5 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Hosting something?</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Publish your event, track ticket sales in real time and manage attendees from one organizer dashboard.
            </p>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto shrink-0">
            <Link href="/organizer/events/new">
              <CalendarPlus className="size-4 mr-1.5" /> Create an Event
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}