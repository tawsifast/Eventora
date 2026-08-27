import type { Metadata } from "next";

import { ProfilePage } from "@/components/pages/profile-page";

export const metadata: Metadata = {
  title: "Your Profile — Eventora",
  description: "Update your Eventora profile details, preferences and notification settings.",
  openGraph: {
    title: "Your Profile — Eventora",
    description: "Manage your Eventora account.",
  },
};

export default function Page() {
  return <ProfilePage />;
}