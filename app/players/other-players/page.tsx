import type { Metadata } from "next";

import {
  getArchiveDirectory,
  getPremiumPlayers,
} from "@/lib/repositories/player.repository";

import AtpArchiveExplorer, {
  type AtpArchivePlayer,
} from "./AtpArchiveExplorer";

import type {
  AtpArchiveDirectoryPlayer,
} from "@/components/players/atp/ArchiveDirectory";

export const metadata: Metadata = {
  title: "ATP Archive | AGE202",
  description:
    "Explore the AGE202 ATP Archive: Premium cards for the ATP Top 50 and a compact directory for positions 51–100.",
};

type PremiumDatabasePlayer = Awaited<
  ReturnType<typeof getPremiumPlayers>
>[number];

type DirectoryDatabasePlayer = Awaited<
  ReturnType<typeof getArchiveDirectory>
>[number];

function normalizePremiumPlayer(
  player: PremiumDatabasePlayer,
): AtpArchivePlayer {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    country:
      player.atpPlayer?.country ??
      player.country,
    biography: player.biography,
    heroImage: player.heroImage,
    portraitImage:
      player.portraitImage ??
      player.atpPlayer?.imageUrl ??
      null,
    collectionType:
      player.collectionType,
    ranking:
      player.atpPlayer?.rank ?? null,
    points:
      player.atpPlayer?.points ?? null,
    artifactCount:
      player._count.artifacts,
  };
}

function normalizeDirectoryPlayer(
  record: DirectoryDatabasePlayer,
): AtpArchiveDirectoryPlayer {
  const linkedPlayer =
    record.player;

  return {
    id: record.id,
    name:
      linkedPlayer?.name ??
      record.name,
    slug:
      linkedPlayer?.slug ??
      record.slug,
    country:
      record.country ??
      linkedPlayer?.country ??
      null,
    ranking: record.rank,
    points: record.points,
    hasPage: Boolean(
      linkedPlayer?.active,
    ),
    profileComplete: Boolean(
      linkedPlayer?.active &&
      linkedPlayer.playerProfile &&
      (
        linkedPlayer.heroImage ||
        linkedPlayer.portraitImage ||
        linkedPlayer.biography ||
        linkedPlayer._count.artifacts > 0
      ),
    ),
  };
}

function sortByRanking<
  T extends {
    ranking: number | null;
  },
>(
  first: T,
  second: T,
): number {
  return (
    (first.ranking ??
      Number.MAX_SAFE_INTEGER) -
    (second.ranking ??
      Number.MAX_SAFE_INTEGER)
  );
}

export default async function OtherPlayersPage() {
  const [
    premiumRecords,
    directoryRecords,
  ] = await Promise.all([
    getPremiumPlayers(),
    getArchiveDirectory(),
  ]);

  const premiumPlayers =
    premiumRecords
      .map(normalizePremiumPlayer)
      .filter(
        (player) =>
          player.ranking !== null &&
          player.ranking >= 1 &&
          player.ranking <= 50,
      )
      .sort(sortByRanking);

  const archiveDirectory =
    directoryRecords
      .map(
        normalizeDirectoryPlayer,
      )
      .sort(sortByRanking);

  return (
    <AtpArchiveExplorer
      premiumPlayers={premiumPlayers}
      archiveDirectory={
        archiveDirectory
      }
    />
  );
}
