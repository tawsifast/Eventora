import type { Metadata } from "next";

import { OrdersPage } from "@/components/pages/orders-page";

export const metadata: Metadata = {
  title: "Order History — Eventora",
  description: "Review every Eventora ticket order, payment status and receipt in one place.",
  openGraph: {
    title: "Order History — Eventora",
    description: "All your ticket purchases and receipts.",
  },
};

export default function Page() {
  return <OrdersPage />;
}