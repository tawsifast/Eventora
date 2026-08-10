import type { Metadata } from "next";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Access Denied — EventHub",
  description: "You don't have permission to view this page.",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </div>
      <p className="eyebrow mt-8">403 · Unauthorized</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Access denied</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Your account doesn&apos;t have permission to view this page. Sign in with a different account or
        head back to the EventHub home page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" /> Back to EventHub
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/events">
            <ArrowLeft className="size-4" /> Explore events
          </Link>
        </Button>
      </div>
    </div>
  );
}