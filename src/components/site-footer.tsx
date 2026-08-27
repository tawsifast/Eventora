import Link from "next/link";

import { EventHubLogo } from "@/components/site-header";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types";

export async function SiteFooter() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    // backend offline — footer falls back to no category links
  }
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 md:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <EventHubLogo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Discover. Experience. Remember. EventHub brings the country&apos;s best events and your tickets into one
            place.
          </p>
        </div>

        <nav className="space-y-3">
          <p className="text-sm font-semibold">Discover</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/events" className="hover:text-foreground">
                Explore Events
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                About EventHub
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="space-y-3">
          <p className="text-sm font-semibold">Popular categories</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link href={`/events?category=${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="space-y-3">
          <p className="text-sm font-semibold">For organizers</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/organizer" className="hover:text-foreground">
                Organizer Dashboard
              </Link>
            </li>
            <li>
              <Link href="/organizer/events/new" className="hover:text-foreground">
                Create an Event
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-foreground">
                Administration
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <p>Discover. Experience. Remember.</p>
        </div>
      </div>
    </footer>
  );
}
