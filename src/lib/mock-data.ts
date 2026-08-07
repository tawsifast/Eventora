/**
 * Mock data layer for DevTrack.
 *
 * Everything here is shaped like a REST payload from the future
 * Express + Prisma + PostgreSQL backend, so these arrays can be swapped for
 * fetch/react-query calls without touching the UI.
 */

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "planning" | "in_progress" | "completed" | "on_hold";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  taskCount: number;
  completedCount: number;
  deadline: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  body: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  projectId: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export const currentUser: User = {
  id: "u_1",
  name: "Tawsif Rahman",
  email: "tawsif@devtrack.io",
  initials: "TR",
};

export const projects: Project[] = [
  {
    id: "p_portfolio",
    name: "Portfolio Website",
    description: "Personal developer portfolio built with Next.js.",
    status: "in_progress",
    progress: 75,
    taskCount: 12,
    completedCount: 9,
    deadline: "2026-08-28",
    createdAt: "2026-06-02",
  },
  {
    id: "p_ecommerce",
    name: "E-commerce Platform",
    description: "Multi-vendor storefront with Stripe checkout and admin tooling.",
    status: "in_progress",
    progress: 42,
    taskCount: 24,
    completedCount: 10,
    deadline: "2026-10-15",
    createdAt: "2026-05-19",
  },
  {
    id: "p_study",
    name: "Study Planner",
    description: "Spaced-repetition planner with weekly review reports.",
    status: "planning",
    progress: 12,
    taskCount: 8,
    completedCount: 1,
    deadline: "2026-09-30",
    createdAt: "2026-07-11",
  },
  {
    id: "p_blog",
    name: "Developer Blog",
    description: "MDX-powered writing platform with syntax highlighting.",
    status: "completed",
    progress: 100,
    taskCount: 14,
    completedCount: 14,
    deadline: "2026-07-20",
    createdAt: "2026-03-08",
  },
  {
    id: "p_designsystem",
    name: "Design System",
    description: "Shared component library and token pipeline for side projects.",
    status: "on_hold",
    progress: 30,
    taskCount: 10,
    completedCount: 3,
    deadline: "2026-11-05",
    createdAt: "2026-04-27",
  },
];

export const tasks: Task[] = [
  {
    id: "t_1",
    title: "Build responsive navbar",
    description:
      "Sticky header with mobile drawer, active section highlighting and reduced-motion support.",
    projectId: "p_portfolio",
    status: "completed",
    priority: "medium",
    dueDate: "2026-08-04",
    createdAt: "2026-07-28",
  },
  {
    id: "t_2",
    title: "Create authentication UI",
    description: "Sign in, sign up and password reset screens with inline validation states.",
    projectId: "p_ecommerce",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-08-11",
    createdAt: "2026-07-30",
  },
  {
    id: "t_3",
    title: "Design project details page",
    description: "Tabbed layout covering overview metrics, task list and activity timeline.",
    projectId: "p_portfolio",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-08-09",
    createdAt: "2026-08-01",
  },
  {
    id: "t_4",
    title: "Connect task filters",
    description: "Wire status, priority and project filters to a single derived selector.",
    projectId: "p_ecommerce",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-14",
    createdAt: "2026-08-02",
  },
  {
    id: "t_5",
    title: "Improve mobile layout",
    description: "Collapse data tables into stacked cards below the md breakpoint.",
    projectId: "p_study",
    status: "todo",
    priority: "low",
    dueDate: "2026-08-19",
    createdAt: "2026-08-03",
  },
  {
    id: "t_6",
    title: "Create dashboard statistics",
    description: "Four KPI cards with week-over-week trend indicators.",
    projectId: "p_portfolio",
    status: "completed",
    priority: "medium",
    dueDate: "2026-08-06",
    createdAt: "2026-07-25",
  },
  {
    id: "t_7",
    title: "Set up MDX pipeline",
    description: "Frontmatter parsing, reading time and code block themes.",
    projectId: "p_blog",
    status: "completed",
    priority: "low",
    dueDate: "2026-07-18",
    createdAt: "2026-07-01",
  },
  {
    id: "t_8",
    title: "Audit color contrast tokens",
    description: "Verify AA contrast for every semantic token in light and dark themes.",
    projectId: "p_designsystem",
    status: "todo",
    priority: "high",
    dueDate: "2026-08-22",
    createdAt: "2026-08-04",
  },
  {
    id: "t_9",
    title: "Write spaced repetition scheduler",
    description: "Interval calculation with ease factor and lapse handling.",
    projectId: "p_study",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-08-27",
    createdAt: "2026-08-05",
  },
  {
    id: "t_10",
    title: "Add cart persistence",
    description: "Keep cart state across sessions and merge on sign-in.",
    projectId: "p_ecommerce",
    status: "todo",
    priority: "high",
    dueDate: "2026-08-30",
    createdAt: "2026-08-06",
  },
  {
    id: "t_11",
    title: "Polish case study cards",
    description: "Consistent aspect ratios, hover elevation and keyboard focus rings.",
    projectId: "p_portfolio",
    status: "todo",
    priority: "low",
    dueDate: "2026-09-02",
    createdAt: "2026-08-06",
  },
  {
    id: "t_12",
    title: "Document component variants",
    description: "Usage guidance for every button, badge and card variant.",
    projectId: "p_designsystem",
    status: "in_progress",
    priority: "low",
    dueDate: "2026-09-08",
    createdAt: "2026-08-07",
  },
];

export const comments: Comment[] = [
  {
    id: "c_1",
    taskId: "t_3",
    authorId: "u_1",
    authorName: "Tawsif Rahman",
    authorInitials: "TR",
    body: "Split the overview tab into metrics + progress so the tasks tab stays scannable.",
    createdAt: "2026-08-05T09:24:00Z",
  },
  {
    id: "c_2",
    taskId: "t_3",
    authorId: "u_2",
    authorName: "Nadia Karim",
    authorInitials: "NK",
    body: "Timeline entries read better with relative timestamps. Added a helper for that.",
    createdAt: "2026-08-06T14:02:00Z",
  },
  {
    id: "c_3",
    taskId: "t_2",
    authorId: "u_3",
    authorName: "Imran Hossain",
    authorInitials: "IH",
    body: "Validation copy should stay under 80 characters so it never wraps twice on mobile.",
    createdAt: "2026-08-06T18:41:00Z",
  },
];

export const activity: ActivityEntry[] = [
  {
    id: "a_1",
    projectId: "p_portfolio",
    actor: "Tawsif",
    action: "completed",
    target: "Build responsive navbar",
    createdAt: "2026-08-06T16:10:00Z",
  },
  {
    id: "a_2",
    projectId: "p_portfolio",
    actor: "Tawsif",
    action: "created a new task",
    target: "Polish case study cards",
    createdAt: "2026-08-06T11:35:00Z",
  },
  {
    id: "a_3",
    projectId: "p_portfolio",
    actor: "Tawsif",
    action: "updated project status",
    target: "In Progress",
    createdAt: "2026-08-04T08:12:00Z",
  },
  {
    id: "a_4",
    projectId: "p_ecommerce",
    actor: "Tawsif",
    action: "created a new task",
    target: "Add cart persistence",
    createdAt: "2026-08-06T07:55:00Z",
  },
  {
    id: "a_5",
    projectId: "p_ecommerce",
    actor: "Nadia",
    action: "commented on",
    target: "Create authentication UI",
    createdAt: "2026-08-05T19:20:00Z",
  },
];

export const dashboardStats = {
  totalProjects: { value: 5, change: "+1 this month" },
  totalTasks: { value: 32, change: "+6 this week" },
  completed: { value: 18, change: "+4 this week" },
  inProgress: { value: 9, change: "3 due soon" },
};

/* ---------- selectors (mirror future API queries) ---------- */

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectName(id: string): string {
  return getProject(id)?.name ?? "Unassigned";
}

export function getTasksByProject(projectId: string): Task[] {
  return tasks.filter((t) => t.projectId === projectId);
}

export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function getComments(taskId: string): Comment[] {
  return comments.filter((c) => c.taskId === taskId);
}

export function getActivity(projectId: string): ActivityEntry[] {
  return activity.filter((a) => a.projectId === projectId);
}

export const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  completed: "Completed",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  completed: "Completed",
  on_hold: "On Hold",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
