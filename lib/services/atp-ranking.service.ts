import {
  getAtpPlayerByRank,
  getAtpPlayerBySlug,
  getAtpRanking,
  getLinkedAtpPlayers,
} from "@/lib/repositories/atp-player.repository";

type AtpRankingRecord = Awaited<
  ReturnType<typeof getAtpRanking>
>[number];

function formatAtpPlayer(
  record: AtpRankingRecord,
) {
  const { player, ...atpPlayer } = record;

  const availableArtifacts =
    player?._count?.artifacts ?? 0;

  const hasAvailableArtifacts =
    Boolean(player?.active) &&
    availableArtifacts > 0;

  const isFeaturedCollection =
    player?.collectionType === "FEATURED";

  const collectionUrl =
    player && isFeaturedCollection
      ? `/archives/${player.slug}`
      : null;

  const archiveUrl =
    atpPlayer.rank <= 50
      ? `/players/${atpPlayer.slug}`
      : null;

  return {
    ...atpPlayer,

    player: player
      ? {
          id: player.id,
          name: player.name,
          slug: player.slug,
          active: player.active,
          portraitImage:
            player.portraitImage,
          collectionType:
            player.collectionType,
        }
      : null,

    availableArtifacts,
    hasAvailableArtifacts,
    collectionUrl,
    archiveUrl,
  };
}

export async function getRanking(
  limit = 150,
) {
  const players = await getAtpRanking(limit);

  return players.map(formatAtpPlayer);
}

export async function getTop10() {
  return getRanking(10);
}

export async function getTop20() {
  return getRanking(20);
}

export async function getPlayer(
  slug: string,
) {
  const player = await getAtpPlayerBySlug(slug);

  if (!player) {
    return null;
  }

  return formatAtpPlayer(player);
}

export async function getPlayerByRank(
  rank: number,
) {
  const player = await getAtpPlayerByRank(rank);

  if (!player) {
    return null;
  }

  return formatAtpPlayer(player);
}

export async function getAge202Players() {
  const players =
    await getLinkedAtpPlayers();

  return players.map(formatAtpPlayer);
}