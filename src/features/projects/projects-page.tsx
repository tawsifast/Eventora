import { useMemo, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FilterDropdown, SearchInput } from "@/components/filters";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";
import { ProjectDialog } from "@/components/project-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { projects, projectStatusLabels, type Project } from "@/lib/mock-data";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(projectStatusLabels).map(([value, label]) => ({ value, label })),
];

const sortOptions = [
  { value: "deadline", label: "Sort: Deadline" },
  { value: "progress", label: "Sort: Progress" },
  { value: "name", label: "Sort: Name" },
  { value: "created", label: "Sort: Newest" },
];

export function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter(
        (p) =>
          !term ||
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
      .sort((a, b) => {
        if (sort === "progress") return b.progress - a.progress;
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
        return a.deadline.localeCompare(b.deadline);
      });
  }, [query, status, sort]);

  return (
    <AppShell title="Projects">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all your development projects.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects"
          className="sm:max-w-xs sm:flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <FilterDropdown
            value={status}
            onChange={setStatus}
            options={statusOptions}
            label="Status"
            className="sm:w-40"
          />
          <FilterDropdown
            value={sort}
            onChange={setSort}
            options={sortOptions}
            label="Sort by"
            className="sm:w-44"
          />
        </div>
        <ToggleGroup
          type="single"
          value={layout}
          onValueChange={(v) => v && setLayout(v as "grid" | "list")}
          className="hidden sm:flex"
          aria-label="Layout"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start tracking your work."
          actionLabel="Create Project"
          onAction={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        />
      ) : (
        <div
          className={
            layout === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"
          }
        >
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              layout={layout}
              showCreated
              onEdit={(p) => {
                setEditing(p);
                setDialogOpen(true);
              }}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      {dialogOpen && (
        <ProjectDialog open onOpenChange={setDialogOpen} project={editing ?? undefined} />
      )}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this project?"
        description={`“${pendingDelete?.name ?? ""}” and its tasks will be removed. This action cannot be undone.`}
        onConfirm={() => {
          toast.success("Project deleted (mock)");
          setPendingDelete(null);
        }}
      />
    </AppShell>
  );
}
