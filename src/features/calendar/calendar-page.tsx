import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaskDetailDialog } from "@/components/task-detail-dialog";
import { PriorityBadge } from "@/components/badges";
import { tasks, type Task } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // Monday-first

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const upcoming = [...tasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <AppShell title="Calendar">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Calendar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks placed on their due dates. Click a task to open its details.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden py-0 shadow-card">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-display text-base font-semibold">{monthLabel}</h3>
            <span className="text-xs text-muted-foreground">Monday – Sunday</span>
          </div>

          <div className="grid grid-cols-7 border-b border-border bg-muted/40">
            {weekdays.map((day) => (
              <div
                key={day}
                className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((date, index) => {
              const key = date ? toKey(date) : `blank-${index}`;
              const dayTasks = date ? (tasksByDay.get(toKey(date)) ?? []) : [];
              const isToday = date ? toKey(date) === toKey(today) : false;
              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-20 border-r border-b border-border p-1.5 sm:min-h-28 sm:p-2",
                    !date && "bg-muted/25",
                  )}
                >
                  {date && (
                    <>
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                          isToday
                            ? "bg-primary font-semibold text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <ul className="mt-1 space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <li key={task.id}>
                            <button
                              type="button"
                              onClick={() => setActiveTask(task)}
                              className={cn(
                                "w-full truncate rounded-md border px-1.5 py-1 text-left text-[11px] leading-tight transition-colors",
                                task.priority === "high"
                                  ? "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15"
                                  : task.priority === "medium"
                                    ? "border-warning/30 bg-warning/12 text-warning hover:bg-warning/20"
                                    : "border-border bg-muted text-muted-foreground hover:bg-accent",
                              )}
                            >
                              {task.title}
                            </button>
                          </li>
                        ))}
                        {dayTasks.length > 2 && (
                          <li className="px-1.5 text-[11px] text-muted-foreground">
                            +{dayTasks.length - 2} more
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="upcoming" className="space-y-3">
        <h3 id="upcoming" className="font-display text-lg font-semibold">
          Upcoming deadlines
        </h3>
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {upcoming.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setActiveTask(task)}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{task.title}</span>
                  <span className="block text-xs text-muted-foreground tabular-nums">
                    Due {task.dueDate}
                  </span>
                </span>
                <PriorityBadge priority={task.priority} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <TaskDetailDialog
        task={activeTask}
        open={Boolean(activeTask)}
        onOpenChange={(open) => !open && setActiveTask(null)}
      />
    </AppShell>
  );
}
