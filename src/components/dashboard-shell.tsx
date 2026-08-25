"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, LayoutDashboard, Menu, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { EventHubLogo, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navIcons: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "calendar-plus": CalendarPlus,
};

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: string;
  exact?: boolean;
}

function NavList({ items, onNavigate }: { items: DashboardNavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const Icon = (key: string) => navIcons[key] ?? Menu;

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const ItemIcon = Icon(item.icon);
        return (
          <Link
            key={item.to}
            href={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <ItemIcon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  items,
  label,
  children,
}: {
  items: DashboardNavItem[];
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full flex-col bg-muted/30">
      {/* ১. লেআউটের একদম উপরে মূল SiteHeader (যাতে নেভবার এবং ইউজার প্রফাইল মেনু ড্যাশবোর্ডেও থাকে) */}
      <SiteHeader />

      <div className="flex flex-1 w-full">
        {/* ২. সাইডবার (Desktop) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-5 md:flex">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <div className="mt-2 flex-1">
            <NavList items={items} />
          </div>
          <Button asChild variant="ghost" className="justify-start text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to EventHub
            </Link>
          </Button>
        </aside>

        {/* ৩. মূল কন্টেন্ট এরিয়া */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* মোবাইল নেভিগেশন বার */}
          <header className="sticky top-16 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open dashboard menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b border-border p-4">
                  <SheetTitle asChild>
                    <EventHubLogo />
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <NavList items={items} onNavigate={() => setOpen(false)} />
                  <Button asChild variant="ghost" className="mt-4 w-full justify-start text-muted-foreground">
                    <Link href="/" onClick={() => setOpen(false)}>
                      <ArrowLeft className="size-4" /> Back to EventHub
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold">{label}</span>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}