import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_public/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — EventHub" },
      { name: "description", content: "Update your EventHub profile details, preferences and notification settings." },
      { property: "og:title", content: "Your Profile — EventHub" },
      { property: "og:description", content: "Manage your EventHub account." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Your Profile" subtitle="Account details and preferences." />
      <form className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full name</Label>
          <Input id="profile-name" defaultValue="Tawsif Rahman" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" defaultValue="tawsif@eventhub.io" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-city">City</Label>
          <Input id="profile-city" defaultValue="Dhaka" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
