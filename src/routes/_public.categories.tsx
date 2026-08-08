import { createFileRoute } from "@tanstack/react-router";

import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/section-heading";
import { categories } from "@/data/categories";

export const Route = createFileRoute("/_public/categories")({
  head: () => ({
    meta: [
      { title: "Event Categories — EventHub" },
      {
        name: "description",
        content: "Browse events by category: technology, music, business, sports, education, arts, food and workshops.",
      },
      { property: "og:title", content: "Event Categories — EventHub" },
      { property: "og:description", content: "Pick a category and find your next experience." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
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
