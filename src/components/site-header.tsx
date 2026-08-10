"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, Menu, Search, ShieldCheck, Ticket, TicketCheck, User2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Explore Events", to: "/events" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
] as const;

export function EventHubLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">EventHub</span>
    </Link>
  );
}

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : "/events");
    setSearchOpen(false);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <EventHubLogo />

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground",
                pathname === link.to ? "text-foreground bg-accent" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="hidden md:block">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Search events, locations, or categories..."
                className="w-72"
                aria-label="Search events"
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
          )}

          {isAuthenticated && user ? (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/tickets">
                  <Ticket className="size-4" />
                  My Tickets
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Account menu"
                  >
                    <Avatar className="size-9 border border-border">
                      {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User2 className="size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tickets">
                      <Ticket className="size-4" /> My Tickets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <TicketCheck className="size-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "organizer" || user.role === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/organizer">
                        <LayoutDashboard className="size-4" /> Organizer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  {user.role === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <ShieldCheck className="size-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle asChild>
                  <EventHubLogo />
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6 p-4">
                <form onSubmit={submitSearch}>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search events, locations, or categories..."
                    aria-label="Search events"
                  />
                </form>
                <nav className="grid gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      href={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        pathname === link.to && "bg-accent text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="grid gap-1 border-t border-border pt-4">
                  {isAuthenticated ? (
                    <>
                      {[
                        { to: "/tickets", label: "My Tickets" },
                        { to: "/orders", label: "My Orders" },
                        { to: "/profile", label: "Profile" },
                        ...(user?.role === "organizer" || user?.role === "admin"
                          ? [{ to: "/organizer", label: "Organizer Dashboard" }]
                          : []),
                        ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
                      ].map((item) => (
                        <Link
                          key={item.to}
                          href={item.to}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="size-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup" onClick={() => setMobileOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
