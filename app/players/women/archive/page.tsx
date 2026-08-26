import type { Metadata } from "next";

import WomenArchiveExperience, {
  type WomenArchiveEntry,
} from "@/components/players/WomenArchiveExperience";

import {
  getWomenArchiveRanking,
} from "@/lib/repositories/player.repository";


export const dynamic =
  "force-dynamic";


export const metadata: Metadata = {
  title: "WTA Archive | AGE202",
  description:
    "Explore the AGE202 women's tennis archive across the current WTA Top 100.",
  alternates: {
    canonical: "/players/women/archive",
  },
  openGraph: {
    title: "WTA Archive | AGE202",
    description:
      "A living AGE202 directory of the current WTA Top 100.",
    url: "/players/women/archive",
    images: [
      {
        url: "/players/other-players/hero.png",
        width: 1200,
        height: 630,
        alt: "AGE202 WTA Archive",
      },
    ],
  },
};


function normalizeArchiveEntry(
  player: Awaited<ReturnType<typeof getWomenArchiveRanking>>[number],
): WomenArchiveEntry {
  const hasProfile =
    Boolean(
      player.player?.active &&
      player.player?.slug,
    );

  return {
    id:
      player.id,

    rank:
      player.rank,

    previousRank:
      player.previousRank,

    name:
      player.name,

    slug:
      player.slug,

    country:
      player.country,

    countryCode:
      player.countryCode,

    points:
      player.points,

    age:
      player.age,

    imageUrl:
      player.imageUrl,

    hasProfile,

    href:
      hasProfile &&
      player.player?.slug
        ? `/players/women/${player.player.slug}`
        : null,
  };
}


export default async function WomenArchivePage() {
  const ranking =
    await getWomenArchiveRanking();


  const players =
    ranking.map(
      normalizeArchiveEntry,
    );


  return (
    <WomenArchiveExperience
      players={
        players
      }
    />
  );
}
