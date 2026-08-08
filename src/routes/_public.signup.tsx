import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_public/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — EventHub" },
      { name: "description", content: "Sign up for EventHub to buy tickets, save events and host your own." },
      { property: "og:title", content: "Create your account — EventHub" },
      { property: "og:description", content: "Join EventHub in under a minute." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Discover. Experience. Remember.</p>
      </div>
      <form className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Ada Lovelace" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full" type="submit">
          Sign up
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
