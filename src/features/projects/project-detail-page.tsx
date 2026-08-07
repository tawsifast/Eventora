import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ListChecks,
  Pencil,
  Timer,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectStatusBadge } from "@/components/badges";
import { ProgressBar } from "@/components/progress-bar";
import { FilterDropdown, SearchInput } from "@/components/filters";
import { TaskTable } from "@/components/task-table";
import { TaskDetailDialog } from "@/components/task-detail-dialog";
import { ProjectDialog } from "@/components/project-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import {
  formatDate,
  formatRelative,
  getActivity,
  getProject,
  getTasksByProject,
  priorityLabels,
  statusLabels,
  type Task,
} from "@/lib/mock-data";

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
];
const priorityOptions = [
  { value: "all", label: "All priorities" },
  ...Object.entries(priorityLabels).map(([value, label]) => ({ value, label })),
];
const sortOptions = [
  { value: "due", label: "Sort: Due date" },
  { value: "priority", label: "Sort: Priority" },
  { value: "created", label: "Sort: Newest" },
];
const priorityWeight = { high: 0, medium: 1, low: 2 } as const;

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const project = getProject(projectId);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("due");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const projectTasks = project ? getTasksByProject(project.id) : [];

  const visibleTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projectTasks
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (priority === "all" ? true : t.priority === priority))
      .filter((t) => !term || t.title.toLowerCase().includes(term))
      .sort((a, b) => {
        if (sort === "priority") return priorityWeight[a.priority] - priorityWeight[b.priority];
        if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [projectTasks, query, status, priority, sort]);

  if (!project) {
    return (
      <AppShell title="Project not found">
        <EmptyState
          title="Project not found"
          description="This project may have been deleted or the link is incorrect."
        />
        <Button variant="outline" asChild className="w-fit">
          <Link to="/projects">
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
      </AppShell>
    );
  }

  const remaining = project.taskCount - project.completedCount;
  const entries = getActivity(project.id);

  return (
    <AppShell title={project.name}>
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit text-muted-foreground">
        <Link to="/projects">
          <ArrowLeft className="size-4" />
          Projects
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight">{project.name}</h2>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit Project
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <ProgressBar value={project.progress} label="Overall progress" />
          </CardContent>
        </Card>
        {[
          { icon: ListChecks, label: "Total tasks", value: project.taskCount },
          { icon: CheckCircle2, label: "Completed", value: project.completedCount },
          { icon: Timer, label: "Remaining", value: remaining },
        ].map((item) => (
          <Card key={item.label} className="shadow-card">
            <CardContent className="flex items-center gap-3 p-5">
              <item.icon className="size-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-display text-2xl font-semibold tabular-nums">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <ProgressBar value={project.progress} label="Completion" />
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Deadline</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                    <CalendarClock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    {formatDate(project.deadline)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm font-medium">{formatDate(project.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Open tasks</dt>
                  <dd className="mt-1 text-sm font-medium tabular-nums">{remaining}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search tasks"
              className="sm:max-w-xs sm:flex-1"
            />
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <FilterDropdown
                value={status}
                onChange={setStatus}
                options={statusOptions}
                label="Status"
                className="sm:w-40"
              />
              <FilterDropdown
                value={priority}
                onChange={setPriority}
                options={priorityOptions}
                label="Priority"
                className="sm:w-40"
              />
              <FilterDropdown
                value={sort}
                onChange={setSort}
                options={sortOptions}
                label="Sort by"
                className="col-span-2 sm:col-auto sm:w-44"
              />
            </div>
          </div>
          {visibleTasks.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No matching tasks"
              description="Try clearing the search or filters to see more tasks in this project."
            />
          ) : (
            <TaskTable tasks={visibleTasks} onOpen={setActiveTask} showProject={false} showCreated />
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
              ) : (
                <ol className="relative space-y-6 border-l border-border pl-6">
                  {entries.map((entry) => (
                    <li key={entry.id} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 -left-[1.9rem] size-2.5 rounded-full border-2 border-card bg-primary"
                      />
                      <div className="flex items-start gap-3">
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="bg-muted text-[10px] font-semibold">
                            {entry.actor.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{entry.actor}</span> {entry.action}{" "}
                            <span className="font-medium">{entry.target}</span>
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatRelative(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskDetailDialog
        task={activeTask}
        open={Boolean(activeTask)}
        onOpenChange={(open) => !open && setActiveTask(null)}
      />
      {editOpen && <ProjectDialog open onOpenChange={setEditOpen} project={project} />}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this project?"
        description={`“${project.name}” and its ${project.taskCount} tasks will be removed. This action cannot be undone.`}
        onConfirm={() => {
          toast.success("Project deleted (mock)");
          setDeleteOpen(false);
        }}
      />
    </AppShell>
  );
}
