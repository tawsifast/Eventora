import { useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FilterDropdown, SearchInput } from "@/components/filters";
import { TaskTable } from "@/components/task-table";
import { TaskDialog } from "@/components/task-dialog";
import { TaskDetailDialog } from "@/components/task-detail-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { priorityLabels, projects, statusLabels, tasks, type Task } from "@/lib/mock-data";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
];
const priorityOptions = [
  { value: "all", label: "All priorities" },
  ...Object.entries(priorityLabels).map(([value, label]) => ({ value, label })),
];
const projectOptions = [
  { value: "all", label: "All projects" },
  ...projects.map((p) => ({ value: p.id, label: p.name })),
];
const sortOptions = [
  { value: "due-asc", label: "Deadline: Soonest" },
  { value: "due-desc", label: "Deadline: Latest" },
  { value: "created", label: "Newest first" },
];

export function TasksPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [sort, setSort] = useState("due-asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tasks
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (priority === "all" ? true : t.priority === priority))
      .filter((t) => (projectId === "all" ? true : t.projectId === projectId))
      .filter(
        (t) =>
          !term ||
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term),
      )
      .sort((a, b) => {
        if (sort === "due-desc") return b.dueDate.localeCompare(a.dueDate);
        if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [query, status, priority, projectId, sort]);

  return (
    <AppShell title="Tasks">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Tasks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage everything you need to get done.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search tasks by title or description"
          className="max-w-full sm:max-w-md"
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <FilterDropdown
            value={status}
            onChange={setStatus}
            options={statusOptions}
            label="Status"
          />
          <FilterDropdown
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
            label="Priority"
          />
          <FilterDropdown
            value={projectId}
            onChange={setProjectId}
            options={projectOptions}
            label="Project"
          />
          <FilterDropdown value={sort} onChange={setSort} options={sortOptions} label="Sort by" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {visible.length} of {tasks.length} tasks
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description="Nothing matches these filters. Adjust them or create a new task."
          actionLabel="New Task"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <TaskTable
          tasks={visible}
          onOpen={setActiveTask}
          onDelete={setPendingDelete}
          showCreated
        />
      )}

      {dialogOpen && <TaskDialog open onOpenChange={setDialogOpen} />}
      <TaskDetailDialog
        task={activeTask}
        open={Boolean(activeTask)}
        onOpenChange={(open) => !open && setActiveTask(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this task?"
        description={`“${pendingDelete?.title ?? ""}” will be removed. This action cannot be undone.`}
        onConfirm={() => {
          toast.success("Task deleted (mock)");
          setPendingDelete(null);
        }}
      />
    </AppShell>
  );
}
