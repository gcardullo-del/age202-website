import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ChampionArchive from "@/components/archive/ChampionArchive";

import {
  champions,
  getChampionBySlug,
} from "@/data/champions";

type ArchivePageProps = {
  params: Promise<{
    player: string;
  }>;
};

/* =========================================================
   STATIC ROUTES
========================================================= */

export function generateStaticParams() {
  return champions.map((champion) => ({
    player: champion.slug,
  }));
}

/* =========================================================
   PAGE METADATA
========================================================= */

export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const { player } = await params;

  const champion = getChampionBySlug(player);

  if (!champion) {
    return {
      title: "Archive Not Found | AGE202",
      description:
        "The requested AGE202 champion archive could not be found.",
    };
  }

  return {
    title: `${champion.name} Archive | AGE202`,
    description: champion.description,
  };
}

/* =========================================================
   ARCHIVE PAGE
========================================================= */

export default async function ArchivePage({
  params,
}: ArchivePageProps) {
  const { player } = await params;

  const champion = getChampionBySlug(player);

  if (!champion) {
    notFound();
  }

  /* =======================================================
     NEXT CHAMPION
  ======================================================= */

  const currentChampionIndex = champions.findIndex(
    (item) => item.slug === champion.slug
  );

  const nextChampion =
    champions[(currentChampionIndex + 1) % champions.length];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <ChampionArchive
        champion={champion}
        nextChampion={nextChampion}
      />
    </main>
  );
}