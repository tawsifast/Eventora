import { CalendarClock, MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { formatDate, getProjectName, type Task } from "@/lib/mock-data";

interface TaskListProps {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onDelete?: ((task: Task) => void) | undefined;
  showCreated?: boolean | undefined;
  showProject?: boolean | undefined;
}

function RowActions({ task, onOpen, onDelete }: Omit<TaskListProps, "tasks"> & { task: Task }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${task.title}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onOpen(task)}>View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onOpen(task)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => onDelete?.(task)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TaskCard({ task, onOpen, onDelete, showProject = true }: TaskListProps & { task: Task }) {
  return (
    <Card className="gap-0 py-0 shadow-card">
      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <button
            type="button"
            onClick={() => onOpen(task)}
            className="min-w-0 text-left text-sm font-medium underline-offset-4 hover:underline"
          >
            {task.title}
          </button>
          <RowActions task={task} onOpen={onOpen} onDelete={onDelete} />
        </div>
        {showProject && (
          <p className="text-xs text-muted-foreground">{getProjectName(task.projectId)}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" aria-hidden="true" />
          Due {formatDate(task.dueDate)}
        </p>
      </CardContent>
    </Card>
  );
}

export function TaskTable({
  tasks,
  onOpen,
  onDelete,
  showCreated = false,
  showProject = true,
}: TaskListProps) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            tasks={tasks}
            onOpen={onOpen}
            onDelete={onDelete}
            showProject={showProject}
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-56">Task</TableHead>
              {showProject && <TableHead>Project</TableHead>}
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due date</TableHead>
              {showCreated && <TableHead>Created</TableHead>}
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="group">
                <TableCell className="max-w-80">
                  <button
                    type="button"
                    onClick={() => onOpen(task)}
                    className="truncate text-left font-medium underline-offset-4 hover:underline"
                  >
                    {task.title}
                  </button>
                </TableCell>
                {showProject && (
                  <TableCell className="text-muted-foreground">
                    {getProjectName(task.projectId)}
                  </TableCell>
                )}
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(task.dueDate)}
                </TableCell>
                {showCreated && (
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatDate(task.createdAt)}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <RowActions task={task} onOpen={onOpen} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function TaskTableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-card">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
