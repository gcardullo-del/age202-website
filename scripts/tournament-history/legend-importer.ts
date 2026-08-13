import {
  prisma,
} from "../../lib/prisma";

import type {
  TournamentHistoryPlayerRef,
  TournamentHistoryDataset,
  TournamentLegendInput,
} from "./types";

type LegendImportResult = {
  tournamentId: string;
  tournamentName: string;

  legends: number;
  linkedPlayers: number;
};

async function resolvePlayerId(
  playerRef: TournamentHistoryPlayerRef | null | undefined,
): Promise<string | null> {
  if (!playerRef) {
    return null;
  }

  const slugCandidates =
    playerRef.slugCandidates
      .map((slug) => slug.trim())
      .filter(Boolean);

  for (const slug of slugCandidates) {
    const player =
      await prisma.player.findUnique({
        where: {
          slug,
        },

        select: {
          id: true,
        },
      });

    if (player) {
      return player.id;
    }
  }

  return null;
}

async function findChampionRecord(
  tournamentId: string,
  legend: TournamentLegendInput,
  playerId: string | null,
) {
  if (playerId) {
    const byPlayer =
      await prisma.tournamentChampion.findFirst({
        where: {
          tournamentId,
          playerId,
        },

        select: {
          id: true,
          playerId: true,
        },
      });

    if (byPlayer) {
      return byPlayer;
    }
  }

  const byName =
    await prisma.tournamentChampion.findFirst({
      where: {
        tournamentId,
        name: legend.name,
      },

      select: {
        id: true,
        playerId: true,
      },
    });

  return byName;
}

async function syncLegend(
  tournamentId: string,
  legend: TournamentLegendInput,
  index: number,
): Promise<{
  linkedPlayer: boolean;
}> {
  const name =
    legend.name.trim();

  if (!name) {
    throw new Error(
      "Il nome di una legend non può essere vuoto.",
    );
  }

  const playerId =
    await resolvePlayerId(
      legend.player,
    );

  const champion =
    await findChampionRecord(
      tournamentId,
      legend,
      playerId,
    );

  if (!champion) {
    throw new Error(
      [
        `Champion record non trovato per "${name}".`,
        "Importa prima le Tournament Editions e sincronizza la Hall of Champions.",
      ].join(" "),
    );
  }

  /*
   * Non aggiorniamo:
   * - titles
   * - firstTitleYear
   * - lastTitleYear
   * - titleYears
   * - finals
   * - wins
   *
   * Questi dati devono continuare a essere derivati
   * dalla Tournament Editions / Champion Summary.
   *
   * Non aggiorniamo neppure imageUrl:
   * resta sotto il controllo manuale del CMS.
   */
  await prisma.tournamentChampion.update({
    where: {
      id: champion.id,
    },

    data: {
      ...(playerId !== null
        ? {
            playerId,
          }
        : {}),

      name,

      ...(legend.country !== undefined
        ? {
            country: legend.country,
          }
        : {}),

      ...(legend.countryCode !== undefined
        ? {
            countryCode: legend.countryCode,
          }
        : {}),

      ...(legend.recordLabel !== undefined
        ? {
            recordLabel:
              legend.recordLabel,
          }
        : {}),

      ...(legend.quote !== undefined
        ? {
            quote: legend.quote,
          }
        : {}),

      legend:
        legend.legend ?? true,

      featured:
        legend.featured ?? false,

      sortOrder:
        legend.sortOrder ??
        index,
    },
  });

  return {
    linkedPlayer:
      playerId !== null &&
      champion.playerId !== playerId,
  };
}

export async function importTournamentLegends(
  dataset: TournamentHistoryDataset,
): Promise<LegendImportResult> {
  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug: dataset.tournamentSlug,
      },

      select: {
        id: true,
        name: true,
      },
    });

  if (!tournament) {
    throw new Error(
      `Torneo non trovato per slug "${dataset.tournamentSlug}".`,
    );
  }

  const legends =
    dataset.legends ?? [];

  let linkedPlayers = 0;

  for (
    const [index, legend] of
    legends.entries()
  ) {
    const result =
      await syncLegend(
        tournament.id,
        legend,
        index,
      );

    if (result.linkedPlayer) {
      linkedPlayers += 1;
    }
  }

  return {
    tournamentId:
      tournament.id,
    tournamentName:
      tournament.name,

    legends:
      legends.length,

    linkedPlayers,
  };
}