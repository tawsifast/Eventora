import type { Metadata } from "next";

import { ProfilePage } from "@/components/pages/profile-page";

export const metadata: Metadata = {
  title: "Your Profile — EventHub",
  description: "Update your EventHub profile details, preferences and notification settings.",
  openGraph: {
    title: "Your Profile — EventHub",
    description: "Manage your EventHub account.",
  },
};

export default function Page() {
  return <ProfilePage />;
}