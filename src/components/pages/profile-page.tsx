"use client";

import { Bell, LogOut, Mail, MapPin, Shield, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/section-heading";
import { RoleBadge, UserStatusBadge } from "@/components/status-badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getMyOrders, getMyTickets, updateUser } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import type { Order, Ticket as TicketType } from "@/types";
import Link from "next/link";

export function ProfilePage() {
  const { user, isPending, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([getMyOrders(), getMyTickets()])
      .then(([myOrders, myTickets]) => {
        setOrders(myOrders);
        setTickets(myTickets);
      })
      .catch((error) => toast.error(error.message ?? "Failed to load your activity"))
      .finally(() => setStatsLoading(false));
  }, [user]);

  if (isPending || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  const profile = user;
  const spent = orders.reduce((s, o) => (o.paymentStatus === "paid" ? s + o.amount : s), 0);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("profile-name") ?? "").trim();

    if (!name) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await updateUser(profile.id, {
        name,
        bio: String(form.get("profile-bio") ?? "").trim() || null,
        city: String(form.get("profile-city") ?? "").trim() || null,
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Account" title="Your Profile" subtitle="Details, preferences and account controls." />

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="spotlight absolute inset-0 opacity-70" />
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 sm:flex sm:flex-wrap sm:justify-between">
          <div className="col-span-2 flex min-w-0 items-center gap-4">
            <Avatar className="size-16 shrink-0 border border-primary/30">
              {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.name} /> : null}
              <AvatarFallback className="bg-primary/10 font-display text-xl text-primary">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate text-3xl leading-tight">{profile.name}</h2>
              <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                <Mail className="size-3.5" /> {profile.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={profile.role} />
                <UserStatusBadge status={profile.status} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {profile.city ?? "—"}
                </span>
              </div>
            </div>
          </div>
          <dl className="col-span-2 grid w-full grid-cols-3 gap-3 sm:w-auto">
            {[
              { label: "Tickets", value: statsLoading ? "…" : String(tickets.length) },
              { label: "Orders", value: statsLoading ? "…" : String(orders.length) },
              { label: "Spent", value: statsLoading ? "…" : formatCurrency(spent) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background/50 p-4 text-center">
                <dt className="eyebrow">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form
          className="space-y-5 rounded-2xl border border-border bg-card p-6"
          onSubmit={handleSave}
        >
          <p className="eyebrow">Personal details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input id="profile-name" name="profile-name" defaultValue={profile.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" name="profile-email" type="email" defaultValue={profile.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-city">City</Label>
              <Input id="profile-city" name="profile-city" defaultValue={profile.city ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-joined">Member since</Label>
              <Input id="profile-joined" defaultValue={formatDate(profile.joinedAt)} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea id="profile-bio" name="profile-bio" rows={3} defaultValue={profile.bio ?? ""} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <p className="eyebrow">Notifications</p>
            {[
              { id: "n-events", label: "New events near me", icon: MapPin, on: true },
              { id: "n-reminders", label: "Event reminders", icon: Bell, on: true },
              { id: "n-offers", label: "Ticket offers & drops", icon: Ticket, on: false },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4">
                <Label htmlFor={row.id} className="flex items-center gap-2 text-sm font-normal">
                  <row.icon className="size-4 text-primary" /> {row.label}
                </Label>
                <Switch id={row.id} defaultChecked={row.on} />
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <p className="eyebrow">Account</p>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/orders">
                <Shield className="size-4" /> Order history & receipts
              </Link>
            </Button>
            <Separator />
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                logout();
                toast.success("Signed out");
              }}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}