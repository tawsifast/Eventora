"use client";

import { CalendarX2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { EventCard } from "@/components/event-card";
import { PageHeader } from "@/components/section-heading";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Category, Event, EventStatus } from "@/types";

const PER_PAGE = 6;

export function ExploreEventsPage({
  initialQuery = "",
  initialCategory = "all",
  events,
  categories,
}: {
  initialQuery?: string;
  initialCategory?: string;
  events: Event[];
  categories: Category[];
}) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [dateRange, setDateRange] = useState("all");
  const [maxPrice, setMaxPrice] = useState(80);
  const [sort, setSort] = useState("soonest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();

    const list = events.filter((event) => {
      const matchesQuery =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.city.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.organizerName.toLowerCase().includes(q);
      const matchesCategory = category === "all" || event.categorySlug === category;
      const matchesStatus = status === "all" || event.status === status;
      const matchesPrice = event.price <= maxPrice;

      let matchesDate = true;
      if (dateRange !== "all") {
        const days = dateRange === "week" ? 7 : dateRange === "month" ? 30 : 90;
        const diff = (new Date(event.date).getTime() - now.getTime()) / 86_400_000;
        matchesDate = diff >= -1 && diff <= days;
      }

      return matchesQuery && matchesCategory && matchesStatus && matchesPrice && matchesDate;
    });

    return list.sort((a, b) => {
      switch (sort) {
        case "latest":
          return b.date.localeCompare(a.date);
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "popular":
          return b.popularity - a.popularity;
        default:
          return a.date.localeCompare(b.date);
      }
    });
  }, [query, category, status, dateRange, maxPrice, sort, events]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function reset() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setDateRange("all");
    setMaxPrice(80);
    setSort("soonest");
    setPage(1);
    router.replace("/events");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Explore Events" subtitle="Find your next experience." />

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by event title, location or organizer..."
            className="pl-9"
            aria-label="Search events"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger aria-label="Date">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any date</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
              <SelectItem value="month">Next 30 days</SelectItem>
              <SelectItem value="quarter">Next 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v as EventStatus | "all")}>
            <SelectTrigger aria-label="Event status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-label="Sort by">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soonest">Soonest</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_low">Lowest price</SelectItem>
              <SelectItem value="price_high">Highest price</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Max price: ${maxPrice}</p>
            <Slider
              value={[maxPrice]}
              min={0}
              max={80}
              step={5}
              onValueChange={([v]) => setMaxPrice(v ?? 80)}
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "event" : "events"} found
        </p>
        <Button variant="ghost" size="sm" onClick={reset}>
          Clear filters
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="No upcoming events"
          description="Nothing matches these filters yet. Try widening your search."
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.max(1, current - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={current === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.min(totalPages, current + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}