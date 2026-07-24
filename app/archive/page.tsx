import type { Metadata } from "next";
import { Suspense } from "react";

import ArchiveExplorer from "@/components/archive/ArchiveExplorer";
import ArchiveHero from "@/components/archive/ArchiveHero";
import ArchiveOverview from "@/components/archive/ArchiveOverview";
import ArchiveTimeline from "@/components/archive/ArchiveTimeline";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Digital Archive",
  description:
    "Explore the AGE202 digital archive of collectible tennis apparel connected to the greatest champions.",
};

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <ArchiveHero />

      <ArchiveOverview products={products} />

      <ArchiveTimeline />

      <Suspense fallback={null}>
        <ArchiveExplorer products={products} />
      </Suspense>
    </main>
  );
}
