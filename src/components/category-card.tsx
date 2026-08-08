import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Cpu,
  GraduationCap,
  Music,
  Palette,
  Trophy,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Category } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Music,
  Briefcase,
  Trophy,
  GraduationCap,
  Palette,
  UtensilsCrossed,
  Wrench,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? Cpu;

  return (
    <Link
      to="/events"
      search={{ category: category.slug }}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <span className="space-y-1">
        <span className="block font-semibold">{category.name}</span>
        <span className="block text-sm text-muted-foreground">{formatNumber(category.eventCount)} events</span>
      </span>
    </Link>
  );
}
