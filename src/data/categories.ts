import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat_tech",
    slug: "technology",
    name: "Technology",
    description: "Summits, hackathons and product launches.",
    icon: "Cpu",
    eventCount: 42,
  },
  {
    id: "cat_music",
    slug: "music",
    name: "Music",
    description: "Concerts, festivals and live sessions.",
    icon: "Music",
    eventCount: 68,
  },
  {
    id: "cat_business",
    slug: "business",
    name: "Business",
    description: "Networking, pitch nights and conferences.",
    icon: "Briefcase",
    eventCount: 31,
  },
  {
    id: "cat_sports",
    slug: "sports",
    name: "Sports",
    description: "Matches, tournaments and marathons.",
    icon: "Trophy",
    eventCount: 24,
  },
  {
    id: "cat_education",
    slug: "education",
    name: "Education",
    description: "Lectures, bootcamps and study fairs.",
    icon: "GraduationCap",
    eventCount: 19,
  },
  {
    id: "cat_arts",
    slug: "arts",
    name: "Arts",
    description: "Exhibitions, theatre and photography.",
    icon: "Palette",
    eventCount: 27,
  },
  {
    id: "cat_food",
    slug: "food",
    name: "Food",
    description: "Tastings, carnivals and supper clubs.",
    icon: "UtensilsCrossed",
    eventCount: 22,
  },
  {
    id: "cat_workshop",
    slug: "workshop",
    name: "Workshop",
    description: "Hands-on sessions with small cohorts.",
    icon: "Wrench",
    eventCount: 36,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? "General";
}
