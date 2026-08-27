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
  const spent = orders.reduce((s, o) => (String(o.paymentStatus).toLowerCase() === "paid" ? s + o.amount : s), 0);

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
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-14 lg:px-8 overflow-x-hidden">
      <PageHeader eyebrow="Account" title="Your Profile" subtitle="Details, preferences and account controls." />

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-8">
        <div className="spotlight absolute inset-0 opacity-70" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 min-w-0">
            <Avatar className="size-20 shrink-0 border border-primary/30">
              {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.name} /> : null}
              <AvatarFallback className="bg-primary/10 font-display text-2xl text-primary">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 w-full">
              <h2 className="truncate text-xl font-bold leading-tight sm:text-3xl">{profile.name}</h2>
              <p className="mt-1 flex items-center justify-center sm:justify-start min-w-0 gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <RoleBadge role={profile.role} />
                <UserStatusBadge status={profile.status} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {profile.city ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:w-auto">
            {[
              { label: "Tickets", value: statsLoading ? "…" : String(tickets.length) },
              { label: "Orders", value: statsLoading ? "…" : String(orders.length) },
              { label: "Spent", value: statsLoading ? "…" : formatCurrency(spent) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background/50 p-2.5 sm:p-4 text-center min-w-0">
                <dt className="eyebrow text-[10px] sm:text-xs truncate">{s.label}</dt>
                <dd className="mt-1 font-display text-lg sm:text-2xl truncate font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form
          className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6"
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
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <p className="eyebrow">Notifications</p>
            {[
              { id: "n-events", label: "New events near me", icon: MapPin, on: true },
              { id: "n-reminders", label: "Event reminders", icon: Bell, on: true },
              { id: "n-offers", label: "Ticket offers & drops", icon: Ticket, on: false },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4">
                <Label htmlFor={row.id} className="flex items-center gap-2 text-sm font-normal">
                  <row.icon className="size-4 text-primary shrink-0" /> {row.label}
                </Label>
                <Switch id={row.id} defaultChecked={row.on} />
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <p className="eyebrow">Account</p>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/orders">
                <Shield className="size-4 mr-2 shrink-0" /> Order history & receipts
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
              <LogOut className="size-4 mr-2 shrink-0" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}