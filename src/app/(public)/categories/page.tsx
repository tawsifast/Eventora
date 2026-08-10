import type { Metadata } from "next";

import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/section-heading";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Event Categories — EventHub",
  description:
    "Browse events by category: technology, music, business, sports, education, arts, food and workshops.",
  openGraph: {
    title: "Event Categories — EventHub",
    description: "Pick a category and find your next experience.",
  },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Categories" subtitle="Eight ways to spend an evening — or a whole weekend." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-3">
            <CategoryCard category={category} />
            <p className="px-1 text-sm text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}