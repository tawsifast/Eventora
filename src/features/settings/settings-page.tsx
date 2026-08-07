import { useState } from "react";
import { Bell, Moon, ShieldAlert, Sun, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { currentUser } from "@/lib/mock-data";

export function SettingsPage() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [theme, setTheme] = useState("system");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <AppShell title="Settings">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences and account. All actions here are mocked.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>How you appear across DevTrack.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-accent text-lg font-semibold text-accent-foreground">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="outline" size="sm" onClick={() => toast("Upload is mocked")}>
                <Upload className="size-4" />
                Change photo
              </Button>
              <p className="text-xs text-muted-foreground">PNG or JPG, up to 2 MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast.success("Profile saved (mock)")}>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Appearance and notification behaviour.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Choose a light, dark or system theme.</p>
            </div>
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(v) => v && setTheme(v)}
              aria-label="Theme"
            >
              <ToggleGroupItem value="light" aria-label="Light theme">
                <Sun className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark theme">
                <Moon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="System theme">
                Auto
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator />

          {[
            {
              id: "notif-email",
              label: "Email notifications",
              hint: "Task assignments and mentions.",
              value: emailNotifications,
              set: setEmailNotifications,
            },
            {
              id: "notif-deadline",
              label: "Deadline reminders",
              hint: "A nudge 24 hours before a task is due.",
              value: deadlineReminders,
              set: setDeadlineReminders,
            },
            {
              id: "notif-digest",
              label: "Weekly digest",
              hint: "Monday summary of progress and blockers.",
              value: weeklyDigest,
              set: setWeeklyDigest,
            },
          ].map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
            >
              <div className="min-w-0">
                <Label htmlFor={row.id} className="text-sm font-medium">
                  {row.label}
                </Label>
                <p className="text-xs text-muted-foreground">{row.hint}</p>
              </div>
              <Switch
                id={row.id}
                checked={row.value}
                onCheckedChange={(checked) => {
                  row.set(checked);
                  toast(`${row.label} ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          ))}

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <Bell className="size-4 shrink-0" aria-hidden="true" />
            Notification delivery will be wired up when the backend is connected.
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Security and irreversible actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" autoComplete="new-password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => toast.success("Password updated (mock)")}>
              Update password
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
                <ShieldAlert className="size-4" aria-hidden="true" />
                Delete account
              </p>
              <p className="text-xs text-muted-foreground">
                Permanently removes your workspace, projects and tasks.
              </p>
            </div>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account?"
        description="Every project, task and comment will be permanently deleted. This cannot be undone."
        confirmLabel="Delete account"
        onConfirm={() => {
          toast.success("Account deleted (mock)");
          setDeleteOpen(false);
        }}
      />
    </AppShell>
  );
}
