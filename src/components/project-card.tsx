import { Link } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, ListChecks, MoreHorizontal } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/badges";
import { ProgressBar } from "@/components/progress-bar";
import { formatDate, type Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  layout?: "grid" | "list";
  showCreated?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  layout = "grid",
  showCreated = false,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const remaining = project.taskCount - project.completedCount;

  return (
    <Card
      className={cn(
        "group gap-0 overflow-hidden py-0 shadow-card transition-shadow hover:shadow-elevated",
        layout === "list" && "sm:flex sm:items-center",
      )}
    >
      <CardHeader className={cn("gap-2 p-5 pb-3", layout === "list" && "sm:flex-1 sm:pb-5")}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="font-display text-base font-semibold tracking-tight underline-offset-4 hover:underline"
            >
              {project.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <ProjectStatusBadge status={project.status} className="hidden sm:inline-flex" />
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Actions for ${project.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link to="/projects/$projectId" params={{ projectId: project.id }}>
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onEdit?.(project)}>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => onDelete?.(project)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <ProjectStatusBadge status={project.status} className="w-fit sm:hidden" />
      </CardHeader>

      <CardContent className={cn("space-y-4 p-5 pt-0", layout === "list" && "sm:w-80 sm:pt-5")}>
        <ProgressBar value={project.progress} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-3.5" aria-hidden="true" />
            {project.taskCount} tasks
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {project.completedCount} done
            <span className="text-muted-foreground/70">· {remaining} left</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {formatDate(project.deadline)}
          </span>
          {showCreated && <span>Created {formatDate(project.createdAt)}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="gap-0 py-0 shadow-card">
      <CardHeader className="gap-2 p-5 pb-3">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <div className="h-1.5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-52 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
