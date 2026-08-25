"use client";

import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, createScheduleItem, createTier, getCategories } from "@/lib/api";
import type { Category } from "@/types";

const navItems = [
  { label: "Overview", to: "/organizer", icon: "layout-dashboard", exact: true },
  { label: "Create event", to: "/organizer/events/new", icon: "calendar-plus" },
];

interface TierDraft {
  name: string;
  price: string;
  perks: string;
}

interface ScheduleDraft {
  time: string;
  title: string;
  speaker: string;
}

export function CreateEventPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  const [tiers, setTiers] = useState<TierDraft[]>([{ name: "General", price: "", perks: "" }]);
  const [schedule, setSchedule] = useState<ScheduleDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    setCategoriesError(false);
    getCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategoriesError(true);
        toast.error("Could not load categories");
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") ?? "").trim(),
      shortDescription: String(form.get("shortDescription") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      date: String(form.get("date") ?? ""),
      startTime: String(form.get("startTime") ?? ""),
      endTime: String(form.get("endTime") ?? "") || null,
      venue: String(form.get("venue") ?? "").trim(),
      address: String(form.get("address") ?? "").trim() || null,
      city: String(form.get("city") ?? "").trim(),
      price: Number(form.get("price") ?? 0),
      capacity: Number(form.get("capacity") ?? 0),
      imageUrl: String(form.get("imageUrl") ?? "").trim() || null,
      categoryId: categoryId.trim() ? categoryId : null,
    };

    const validTiers = tiers
      .filter((t) => t.name.trim())
      .map((t) => ({ name: t.name.trim(), price: Number(t.price ?? 0), perks: t.perks.trim() || undefined }));
    const validSchedule = schedule
      .filter((s) => s.time.trim() && s.title.trim())
      .map((s) => ({ time: s.time.trim(), title: s.title.trim(), speaker: s.speaker.trim() || undefined }));

    if (!payload.title || !payload.date || !payload.venue || !payload.city) {
      toast.error("Title, date, venue and city are required");
      return;
    }
    if (payload.capacity <= 0) {
      toast.error("Capacity must be at least 1");
      return;
    }
    if (!validTiers.length) {
      toast.error("Add at least one ticket tier");
      return;
    }

    setSubmitting(true);
    try {
      const event = await createEvent(payload);
      for (const tier of validTiers) {
        await createTier(event.id, tier);
      }
      for (const item of validSchedule) {
        await createScheduleItem(event.id, item);
      }
      toast.success("Event published");
      router.push("/organizer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create event");
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell label="Organizer" items={navItems}>
      <div className="mx-auto max-w-2xl space-y-8">
        <PageHeader title="Create an Event" subtitle="Basics now, details later — you can edit anytime." />
        <form className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Event title</Label>
            <Input id="title" name="title" placeholder="Nightfall Rooftop Sessions" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input id="shortDescription" name="shortDescription" placeholder="One line for cards and listings" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} placeholder="What should attendees expect?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" name="startTime" type="time" defaultValue="18:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" name="endTime" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Base ticket price (USD)</Label>
              <Input id="price" name="price" type="number" min={0} step={1} placeholder="45" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" min={1} step={1} placeholder="500" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" name="venue" placeholder="Skyline Terrace" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Dhaka" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Level 12, 88 Gulshan Avenue" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            {loadingCategories ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ) : categoriesError ? (
              <p className="text-xs text-destructive">Failed to load categories</p>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger aria-label="Category">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-xs text-muted-foreground">
                      No categories available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ticket tiers</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTiers((t) => [...t, { name: "", price: "", perks: "" }])}
              >
                <Plus className="size-4" /> Add tier
              </Button>
            </div>
            {tiers.map((tier, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,1fr)_100px_auto] items-end gap-3 rounded-xl border border-border bg-background/50 p-3">
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor={`tier-name-${i}`}>Name</Label>
                  <Input
                    id={`tier-name-${i}`}
                    value={tier.name}
                    onChange={(e) => setTiers((t) => t.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                    placeholder="VIP"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor={`tier-price-${i}`}>Price</Label>
                  <Input
                    id={`tier-price-${i}`}
                    type="number"
                    min={0}
                    value={tier.price}
                    onChange={(e) => setTiers((t) => t.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))}
                    placeholder="90"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove tier"
                  disabled={tiers.length === 1}
                  onClick={() => setTiers((t) => (t.length === 1 ? t : t.filter((_, j) => j !== i)))}
                >
                  <Trash2 className="size-4" />
                </Button>
                <div className="space-y-1 sm:col-span-3">
                  <Label className="text-xs" htmlFor={`tier-perks-${i}`}>Perks</Label>
                  <Input
                    id={`tier-perks-${i}`}
                    value={tier.perks}
                    onChange={(e) => setTiers((t) => t.map((x, j) => (j === i ? { ...x, perks: e.target.value } : x)))}
                    placeholder="Front row, meet & greet"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Schedule (optional)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSchedule((s) => [...s, { time: "", title: "", speaker: "" }])}
              >
                <Plus className="size-4" /> Add item
              </Button>
            </div>
            {schedule.length ? (
              schedule.map((item, i) => (
                <div key={i} className="grid grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-3 rounded-xl border border-border bg-background/50 p-3">
                  <div className="space-y-1">
                    <Label className="text-xs" htmlFor={`sched-time-${i}`}>Time</Label>
                    <Input
                      id={`sched-time-${i}`}
                      type="time"
                      value={item.time}
                      onChange={(e) => setSchedule((s) => s.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" htmlFor={`sched-title-${i}`}>Title</Label>
                    <Input
                      id={`sched-title-${i}`}
                      value={item.title}
                      onChange={(e) => setSchedule((s) => s.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                      placeholder="Keynote"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" htmlFor={`sched-speaker-${i}`}>Speaker</Label>
                    <Input
                      id={`sched-speaker-${i}`}
                      value={item.speaker}
                      onChange={(e) => setSchedule((s) => s.map((x, j) => (j === i ? { ...x, speaker: e.target.value } : x)))}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove schedule item"
                    onClick={() => setSchedule((s) => s.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" /> No schedule items yet
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish event"}
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}