import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  priorityLabels,
  projectStatusLabels,
  statusLabels,
  type ProjectStatus,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/mock-data";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        info: "border-info/25 bg-info/10 text-info",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/12 text-warning",
        danger: "border-destructive/25 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type Tone = NonNullable<VariantProps<typeof pillVariants>["tone"]>;

function Dot({ tone }: { tone: Tone }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 rounded-full",
        tone === "success" && "bg-success",
        tone === "info" && "bg-info",
        tone === "warning" && "bg-warning",
        tone === "danger" && "bg-destructive",
        tone === "neutral" && "bg-muted-foreground",
      )}
    />
  );
}

const taskStatusTone: Record<TaskStatus, Tone> = {
  todo: "neutral",
  in_progress: "info",
  completed: "success",
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const tone = taskStatusTone[status];
  return (
    <span className={cn(pillVariants({ tone }), className)}>
      <Dot tone={tone} />
      {statusLabels[status]}
    </span>
  );
}

const projectStatusTone: Record<ProjectStatus, Tone> = {
  planning: "neutral",
  in_progress: "info",
  completed: "success",
  on_hold: "warning",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const tone = projectStatusTone[status];
  return (
    <span className={cn(pillVariants({ tone }), className)}>
      <Dot tone={tone} />
      {projectStatusLabels[status]}
    </span>
  );
}

const priorityTone: Record<TaskPriority, Tone> = {
  low: "neutral",
  medium: "warning",
  high: "danger",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  const tone = priorityTone[priority];
  return (
    <span className={cn(pillVariants({ tone }), className)}>
      <Dot tone={tone} />
      {priorityLabels[priority]}
    </span>
  );
}
