import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/projects/projects-page";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — DevTrack" },
      {
        name: "description",
        content: "Manage and track all your development projects, progress and deadlines.",
      },
      { property: "og:title", content: "Projects — DevTrack" },
      {
        property: "og:description",
        content: "Manage and track all your development projects in one place.",
      },
    ],
  }),
  component: ProjectsPage,
});
