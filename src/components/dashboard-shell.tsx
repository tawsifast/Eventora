import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Menu, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { EventHubLogo } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

function NavList({ items, onNavigate }: { items: DashboardNavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
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
    <div className="flex min-h-svh w-full bg-muted/30">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-5 md:flex">
        <EventHubLogo />
        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="mt-2 flex-1">
          <NavList items={items} />
        </div>
        <Button asChild variant="ghost" className="justify-start text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="size-4" /> Back to EventHub
          </Link>
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
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
                  <Link to="/" onClick={() => setOpen(false)}>
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
  );
}
