import type { Metadata } from "next";

import MastersWorldTourMap from "@/components/results/MastersWorldTourMap";

import BackToResults from "./components/BackToResults";
import MastersArchivePreview from "./components/MastersArchivePreview";
import MastersGrid from "./components/MastersGrid";
import MastersHero from "./components/MastersHero";
import MastersOverview from "./components/MastersOverview";
import SeasonRoute from "./components/SeasonRoute";

export const metadata: Metadata = {
  title: "ATP Masters 1000 World Tour | AGE202",
  description:
    "Explore the complete AGE202 ATP Masters 1000 archive, from Indian Wells to Paris through the nine elite tournaments of the ATP season.",
  keywords: [
    "ATP Masters 1000",
    "Indian Wells",
    "Miami Open",
    "Monte-Carlo Masters",
    "Madrid Open",
    "Italian Open",
    "Canadian Open",
    "Cincinnati Open",
    "Shanghai Masters",
    "Paris Masters",
    "tennis history",
    "AGE202",
  ],
  openGraph: {
    title: "ATP Masters 1000 World Tour | AGE202",
    description:
      "Travel through the nine ATP Masters 1000 tournaments and explore their history, identity, champions and defining moments.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATP Masters 1000 World Tour | AGE202",
    description:
      "Travel through the nine ATP Masters 1000 tournaments and explore their history, identity, champions and defining moments.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "ATP Masters 1000 tennis",
};

export default function Masters1000Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <MastersHero />
      <MastersOverview />
      <MastersWorldTourMap />
      <SeasonRoute />
      <MastersGrid />
      <MastersArchivePreview />
      <BackToResults />
    </main>
  );
}
