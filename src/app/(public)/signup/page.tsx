"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const url = avatarUrl.trim();
    if (url) {
      try {
        new URL(url);
      } catch {
        setError("Profile image must be a valid URL (e.g. https://...)");
        return;
      }
    }

    setSubmitting(true);
    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      image: url || undefined,
      role,
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create an account with those details.");
      return;
    }

    toast.success("Account created. Welcome to EventHub!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Discover. Experience. Remember.</p>
      </div>
      <form className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={submit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Join as</Label>
          <RadioGroup value={role} onValueChange={(v: "user" | "organizer") => setRole(v)} className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value="user" className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">Attendee</span>
                <span className="block text-xs text-muted-foreground">Buy tickets & manage orders</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value="organizer" className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">Organizer</span>
                <span className="block text-xs text-muted-foreground">Create & manage events</span>
              </span>
            </label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-avatar">Profile image URL</Label>
          <Input
            id="signup-avatar"
            type="url"
            placeholder="https://example.com/avatar.jpg (optional)"
            value={avatarUrl}
            onChange={(e) => {
              setAvatarUrl(e.target.value);
              setError(null);
            }}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}