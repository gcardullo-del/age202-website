import { prisma } from "@/lib/prisma";

import {
  buildAtpCountryMap,
  resolveAtpCountry,
} from "./atp-country-resolver";

import type {
  AtpLiveRankingEntry,
} from "./types";


export type AtpRankingPreviewStatus =
  | "up"
  | "down"
  | "unchanged"
  | "new";


export type AtpRankingPreviewRow = {
  incoming: AtpLiveRankingEntry;

  existing: {
    id: string;
    rank: number;
    previousRank: number | null;
    points: number | null;
    slug: string;
    playerId: string | null;
    country: string;
    countryCode: string;
    imageUrl: string | null;
    active: boolean;
  } | null;

  status: AtpRankingPreviewStatus;

  rankDelta: number | null;
  pointsDelta: number | null;
};


export type AtpRankingPreviewResult = {
  rows: AtpRankingPreviewRow[];

  matched: number;
  newPlayers: number;

  movedUp: number;
  movedDown: number;
  unchanged: number;

  pointsChanged: number;

  leavingTop100: {
    id: string;
    rank: number;
    name: string;
    slug: string;
    playerId: string | null;
  }[];
};


export async function buildAtpRankingPreview(
  entries: AtpLiveRankingEntry[],
): Promise<AtpRankingPreviewResult> {
  const storedPlayers =
    await prisma.atpPlayer.findMany({
      select: {
        id: true,
        rank: true,
        previousRank: true,
        name: true,
        slug: true,
        points: true,
        playerId: true,
        country: true,
        countryCode: true,
        imageUrl: true,
        active: true,
      },
    });


  /*
   * AGE202 possiede già un dizionario verificato
   * countryCode → country attraverso i giocatori
   * ATP presenti nel database.
   *
   * Esempi:
   *
   * USA → United States
   * ITA → Italy
   * ESP → Spain
   *
   * Non inventiamo il nome della nazione:
   * lo risolviamo dai dati AGE202 già esistenti.
   */
  const countryMap =
    buildAtpCountryMap(
      storedPlayers.map(
        (player) => ({
          country:
            player.country,

          countryCode:
            player.countryCode,
        }),
      ),
    );


  /*
   * Arricchiamo il dataset ATP con il nome esteso
   * della nazione.
   *
   * Il countryCode arriva direttamente dal DOM ATP.
   * Il country viene risolto dal dizionario AGE202.
   *
   * Se il codice non è conosciuto, country resta null.
   */
  const resolvedEntries:
    AtpLiveRankingEntry[] =
      entries.map(
        (entry) => {
          const resolution =
            resolveAtpCountry(
              entry.countryCode,
              countryMap,
            );


          if (!resolution) {
            return {
              ...entry,

              country:
                entry.country ??
                null,
            };
          }


          return {
            ...entry,

            countryCode:
              resolution.countryCode,

            country:
              entry.country ??
              resolution.country,
          };
        },
      );


  const storedBySlug =
    new Map(
      storedPlayers.map(
        (player) => [
          player.slug
            .trim()
            .toLowerCase(),

          player,
        ],
      ),
    );


  const incomingSlugs =
    new Set(
      resolvedEntries
        .map(
          (entry) =>
            entry.profileSlug
              ?.trim()
              .toLowerCase(),
        )
        .filter(
          (
            slug,
          ): slug is string =>
            Boolean(slug),
        ),
    );


  const rows:
    AtpRankingPreviewRow[] =
      resolvedEntries.map(
        (incoming) => {
          const slug =
            incoming.profileSlug
              ?.trim()
              .toLowerCase() ??
            "";


          const existing =
            slug
              ? storedBySlug.get(
                  slug,
                ) ??
                null
              : null;


          if (!existing) {
            return {
              incoming,

              existing:
                null,

              status:
                "new",

              rankDelta:
                null,

              pointsDelta:
                null,
            };
          }


          const rankDelta =
            existing.rank -
            incoming.rank;


          const status:
            AtpRankingPreviewStatus =
              rankDelta > 0
                ? "up"
                : rankDelta < 0
                  ? "down"
                  : "unchanged";


          const pointsDelta =
            existing.points ===
            null
              ? null
              : incoming.points -
                existing.points;


          return {
            incoming,

            existing: {
              id:
                existing.id,

              rank:
                existing.rank,

              previousRank:
                existing.previousRank,

              points:
                existing.points,

              slug:
                existing.slug,

              playerId:
                existing.playerId,

              country:
                existing.country,

              countryCode:
                existing.countryCode,

              imageUrl:
                existing.imageUrl,

              active:
                existing.active,
            },

            status,

            rankDelta,

            pointsDelta,
          };
        },
      );


  /*
   * Consideriamo "in uscita dalla Top 100"
   * soltanto i giocatori che:
   *
   * 1. sono attualmente ACTIVE;
   * 2. hanno ancora rank <= 100 nel database;
   * 3. non compaiono nella nuova Top 100 ATP.
   *
   * Questo allinea la preview alla logica
   * utilizzata dal vero sync live.
   */
  const leavingTop100 =
    storedPlayers
      .filter(
        (player) =>
          player.active &&
          player.rank <= 100 &&
          !incomingSlugs.has(
            player.slug
              .trim()
              .toLowerCase(),
          ),
      )
      .sort(
        (
          first,
          second,
        ) =>
          first.rank -
          second.rank,
      )
      .map(
        (player) => ({
          id:
            player.id,

          rank:
            player.rank,

          name:
            player.name,

          slug:
            player.slug,

          playerId:
            player.playerId,
        }),
      );


  return {
    rows,

    matched:
      rows.filter(
        (row) =>
          row.existing !==
          null,
      ).length,

    newPlayers:
      rows.filter(
        (row) =>
          row.status ===
          "new",
      ).length,

    movedUp:
      rows.filter(
        (row) =>
          row.status ===
          "up",
      ).length,

    movedDown:
      rows.filter(
        (row) =>
          row.status ===
          "down",
      ).length,

    unchanged:
      rows.filter(
        (row) =>
          row.status ===
          "unchanged",
      ).length,

    pointsChanged:
      rows.filter(
        (row) =>
          row.pointsDelta !==
            null &&
          row.pointsDelta !==
            0,
      ).length,

    leavingTop100,
  };
}