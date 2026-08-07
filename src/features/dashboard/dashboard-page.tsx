import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FolderKanban, ListChecks, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { ProjectCard } from "@/components/project-card";
import { TaskTable } from "@/components/task-table";
import { TaskDialog } from "@/components/task-dialog";
import { TaskDetailDialog } from "@/components/task-detail-dialog";
import { ProjectDialog } from "@/components/project-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AppShell } from "@/components/app-shell";
import { dashboardStats, projects, tasks, type Task } from "@/lib/mock-data";
import { toast } from "sonner";

export function DashboardPage() {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const recentTasks = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Good morning, Tawsif 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button onClick={() => setProjectDialogOpen(true)} className="shrink-0">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={dashboardStats.totalProjects.value}
          change={dashboardStats.totalProjects.change}
        />
        <StatCard
          icon={ListChecks}
          label="Total Tasks"
          value={dashboardStats.totalTasks.value}
          change={dashboardStats.totalTasks.change}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={dashboardStats.completed.value}
          change={dashboardStats.completed.change}
        />
        <StatCard
          icon={Loader2}
          label="In Progress"
          value={dashboardStats.inProgress.value}
          change={dashboardStats.inProgress.change}
        />
      </section>

      <section aria-labelledby="project-overview" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 id="project-overview" className="font-display text-lg font-semibold">
            Project Overview
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/projects">
              All projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-tasks" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 id="recent-tasks" className="font-display text-lg font-semibold">
            Recent Tasks
          </h3>
          <Button variant="outline" size="sm" onClick={() => setTaskDialogOpen(true)}>
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
        <TaskTable
          tasks={recentTasks}
          onOpen={setActiveTask}
          onDelete={setPendingDelete}
        />
      </section>

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
      {taskDialogOpen && <TaskDialog open onOpenChange={setTaskDialogOpen} />}
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
