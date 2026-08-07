import { createFileRoute } from "@tanstack/react-router";

import { TasksPage } from "@/features/tasks/tasks-page";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — DevTrack" },
      {
        name: "description",
        content: "Search, filter and sort every development task by status, priority and deadline.",
      },
      { property: "og:title", content: "Tasks — DevTrack" },
      {
        property: "og:description",
        content: "Manage everything you need to get done across your projects.",
      },
    ],
  }),
  component: TasksPage,
});
