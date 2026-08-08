import type { Metadata } from "next";

import MuseumHome from "@/components/public/MuseumHome";

import {
  getPublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";

export const metadata: Metadata = {
  title: "AGE202 | Digital Tennis Museum",

  description:
    "Explore AGE202, the digital tennis museum preserving iconic apparel, champions and stories from tennis history.",

  alternates: {
    canonical: "/",
  },
};

export const dynamic =
  "force-dynamic";

export default async function HomePage() {
  const settings =
    await getPublicHomepageSettings();

  return (
    <MuseumHome
      settings={settings}
    />
  );
}