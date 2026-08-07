import { useState } from "react";
import { CalendarClock, CalendarPlus, FolderKanban, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import {
  currentUser,
  formatDate,
  formatRelative,
  getComments,
  getProjectName,
  type Task,
} from "@/lib/mock-data";

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [draft, setDraft] = useState("");

  if (!task) return null;
  const taskComments = getComments(task.id);

  function sendComment(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    toast.success("Comment posted", { description: "Mock action — nothing was saved." });
    setDraft("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-6 text-left">{task.title}</DialogTitle>
          <DialogDescription className="text-left">{task.description}</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Project</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
              <FolderKanban className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {getProjectName(task.projectId)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={task.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Priority</dt>
            <dd className="mt-1">
              <PriorityBadge priority={task.priority} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Due date</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium tabular-nums">
              <CalendarClock className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formatDate(task.dueDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Created</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium tabular-nums">
              <CalendarPlus className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formatDate(task.createdAt)}
            </dd>
          </div>
        </dl>

        <Separator />

        <section aria-label="Comments" className="space-y-4">
          <h3 className="text-sm font-semibold">Comments ({taskComments.length})</h3>

          <form onSubmit={sendComment} className="flex items-center gap-2">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment…"
              aria-label="Write a comment"
            />
            <Button type="submit" size="icon" aria-label="Send comment" disabled={!draft.trim()}>
              <SendHorizonal className="size-4" />
            </Button>
          </form>

          {taskComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the discussion above.
            </p>
          ) : (
            <ul className="space-y-4">
              {taskComments.map((comment) => (
                <li key={comment.id} className="flex gap-3">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                      {comment.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {comment.authorName}
                      <span className="text-xs font-normal text-muted-foreground">
                        {formatRelative(comment.createdAt)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{comment.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
