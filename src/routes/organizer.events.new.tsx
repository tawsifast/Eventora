import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data/categories";

export const Route = createFileRoute("/organizer/events/new")({
  head: () => ({
    meta: [
      { title: "Create an Event — EventHub" },
      { name: "description", content: "Publish a new event on EventHub with tickets, capacity and pricing in minutes." },
      { property: "og:title", content: "Create an Event — EventHub" },
      { property: "og:description", content: "Publish your event and start selling tickets." },
    ],
  }),
  component: CreateEventPage,
});

function CreateEventPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <PageHeader title="Create an Event" subtitle="Basics now, details later — you can edit anytime." />
        <form
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Event saved as draft");
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Event title</Label>
            <Input id="title" placeholder="Nightfall Rooftop Sessions" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="What should attendees expect?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Ticket price (USD)</Label>
              <Input id="price" type="number" min={0} step={1} placeholder="45" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Skyline Terrace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Dhaka" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger aria-label="Category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Publish event</Button>
        </form>
      </div>
    </DashboardShell>
  );
}
