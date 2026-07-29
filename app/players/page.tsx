import type { Metadata } from "next";

import PlayersExperience, {
  type FeaturedPlayerCard,
  type NationSummary,
} from "@/components/players/PlayersExperience";
import {
  getFeaturedPlayers,
  getOtherPlayers,
} from "@/lib/repositories/player.repository";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Explore the official AGE202 champion collections and the dynamic ATP Top 50 tennis archive.",
  alternates: {
    canonical: "/players",
  },
  openGraph: {
    title: "Players | AGE202",
    description:
      "Five iconic champion collections and a living ATP archive inside the AGE202 digital tennis museum.",
    url: "/players",
    images: [
      {
        url: "/players/federernew.jpg",
        width: 1200,
        height: 630,
        alt: "AGE202 Players archive",
      },
    ],
  },
};

const LEGACY_ARCHIVE_SLUGS: Record<string, string> = {
  "roger-federer": "federer",
  federer: "federer",
  "rafael-nadal": "nadal",
  nadal: "nadal",
  "novak-djokovic": "djokovic",
  djokovic: "djokovic",
  "jannik-sinner": "sinner",
  sinner: "sinner",
  "carlos-alcaraz": "alcaraz",
  alcaraz: "alcaraz",
};

function getLegacyArchiveHref(slug: string): string {
  const archiveSlug =
    LEGACY_ARCHIVE_SLUGS[slug] ?? slug.split("-").at(-1) ?? slug;

  return `/archives/${archiveSlug}`;
}

function normalizeFeaturedPlayer(
  player: Awaited<ReturnType<typeof getFeaturedPlayers>>[number],
): FeaturedPlayerCard {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    country: player.country,
    biography: player.biography,
    heroImage: player.heroImage,
    portraitImage: player.portraitImage,
    debutYear: player.debutYear,
    accent: player.accent,
    artifactCount: player._count.artifacts,
    href: getLegacyArchiveHref(player.slug),
  };
}

function buildNationSummary(
  players: Awaited<ReturnType<typeof getOtherPlayers>>,
): NationSummary[] {
  const counts = new Map<string, number>();

  for (const player of players) {
    const country = player.atpPlayer?.country?.trim() || player.country?.trim();

    if (!country) continue;

    counts.set(country, (counts.get(country) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((first, second) => {
      if (first.count !== second.count) return second.count - first.count;
      return first.country.localeCompare(second.country);
    })
    .slice(0, 6);
}

export default async function PlayersPage() {
  const [featuredPlayersData, atpPlayers] = await Promise.all([
    getFeaturedPlayers(),
    getOtherPlayers(),
  ]);

  const featuredPlayers = featuredPlayersData.map(normalizeFeaturedPlayer);
  const totalArtifactCount = featuredPlayers.reduce(
    (total, player) => total + player.artifactCount,
    0,
  );

  return (
    <PlayersExperience
      featuredPlayers={featuredPlayers}
      atpPlayerCount={atpPlayers.length}
      totalArtifactCount={totalArtifactCount}
      nations={buildNationSummary(atpPlayers)}
    />
  );
}
