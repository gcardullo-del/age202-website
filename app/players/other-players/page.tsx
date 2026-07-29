import type { Metadata } from "next";

import { getOtherPlayers } from "@/lib/repositories/player.repository";

import AtpArchiveExplorer, {
  type AtpArchivePlayer,
} from "./AtpArchiveExplorer";

export const metadata: Metadata = {
  title: "ATP Archive | AGE202",
  description:
    "Explore the AGE202 ATP Archive dedicated to the world's Top 50 ATP players.",
};

function normalizePlayer(
  player: Awaited<ReturnType<typeof getOtherPlayers>>[number],
): AtpArchivePlayer {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    country: player.atpPlayer?.country ?? player.country,
    biography: player.biography,
    heroImage: player.heroImage,
    portraitImage:
      player.portraitImage ?? player.atpPlayer?.imageUrl ?? null,
    collectionType: player.collectionType,
    ranking: player.atpPlayer?.rank ?? null,
    points: player.atpPlayer?.points ?? null,
    artifactCount: player._count.artifacts,
  };
}

export default async function OtherPlayersPage() {
  const databasePlayers = await getOtherPlayers();

  const players = databasePlayers
    .map(normalizePlayer)
    .filter(
      (player) =>
        player.ranking !== null &&
        player.ranking >= 1 &&
        player.ranking <= 50,
    )
    .sort((first, second) => {
      if (first.ranking === null) return 1;
      if (second.ranking === null) return -1;

      return first.ranking - second.ranking;
    });

  return <AtpArchiveExplorer players={players} />;
}
