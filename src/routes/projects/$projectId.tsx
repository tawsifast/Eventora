import { createFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/features/projects/project-detail-page";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project details — DevTrack" },
      {
        name: "description",
        content: "Project overview, task list and activity timeline for a DevTrack project.",
      },
      { property: "og:title", content: "Project details — DevTrack" },
      {
        property: "og:description",
        content: "Overview, tasks and activity for this development project.",
      },
    ],
  }),
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { projectId } = Route.useParams();
  return <ProjectDetailPage projectId={projectId} />;
}
