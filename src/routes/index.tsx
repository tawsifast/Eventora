import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/dashboard-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevTrack — Developer Project & Task Dashboard" },
      {
        name: "description",
        content:
          "Track software projects, tasks, deadlines and productivity stats in one clean developer dashboard.",
      },
      { property: "og:title", content: "DevTrack — Developer Project & Task Dashboard" },
      {
        property: "og:description",
        content: "Projects, tasks, deadlines and productivity stats for developers.",
      },
    ],
  }),
  component: DashboardPage,
});
