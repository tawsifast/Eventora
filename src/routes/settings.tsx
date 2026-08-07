import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/features/settings/settings-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DevTrack" },
      {
        name: "description",
        content: "Update your DevTrack profile, theme, notification preferences and account.",
      },
      { property: "og:title", content: "Settings — DevTrack" },
      { property: "og:description", content: "Profile, preferences and account settings." },
    ],
  }),
  component: SettingsPage,
});
