import { createFileRoute } from "@tanstack/react-router";

import { CalendarPage } from "@/features/calendar/calendar-page";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — DevTrack" },
      {
        name: "description",
        content: "See tasks laid out on their due dates with a clean monthly developer calendar.",
      },
      { property: "og:title", content: "Calendar — DevTrack" },
      { property: "og:description", content: "Monthly view of task deadlines across projects." },
    ],
  }),
  component: CalendarPage,
});
