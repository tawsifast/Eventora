import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_public/login")({
  head: () => ({
    meta: [
      { title: "Log in — EventHub" },
      { name: "description", content: "Log in to manage your EventHub tickets, orders and events." },
      { property: "og:title", content: "Log in — EventHub" },
      { property: "og:description", content: "Access your tickets and orders." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Log in to see your tickets and orders.</p>
      </div>
      <form className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full" type="submit">
          Log in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
