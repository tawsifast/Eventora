import type { Metadata } from "next";
import { Instrument_Serif, Work_Sans } from "next/font/google";

import { Providers } from "@/app/providers";

import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-eventora-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-eventora-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventora — Discover. Experience. Remember.",
  description:
    "Discover concerts, conferences, workshops and festivals near you, buy tickets and manage your orders on Eventora.",
  openGraph: {
    title: "Eventora — Discover. Experience. Remember.",
    description:
      "Discover concerts, conferences, workshops and festivals near you, buy tickets and manage your orders on Eventora.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${instrumentSerif.variable} dark`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}