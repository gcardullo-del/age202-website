import { prisma } from "../../lib/prisma";

import {
  resolveTournamentHistoryPlayerIds,
} from "./player-resolver";

import type {
  ResolvedTournamentHistoryEdition,
  TournamentHistoryDataset,
  TournamentHistoryEditionInput,
} from "./types";

function parseOptionalDate(
  value: string | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Data torneo non valida: "${value}"`,
    );
  }

  return date;
}

function normalizeEditionKey(
  value: string | null | undefined,
): string {
  if (!value) {
    return "main";
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "main";
}

async function resolveEdition(
  edition: TournamentHistoryEditionInput,
): Promise<ResolvedTournamentHistoryEdition> {
  const {
    championPlayerId,
    runnerUpPlayerId,
  } = await resolveTournamentHistoryPlayerIds(
    edition.championPlayer,
    edition.runnerUpPlayer,
    edition.championName,
    edition.runnerUpName,
  );

  return {
    year: edition.year,

    editionKey:
      normalizeEditionKey(
        edition.editionKey,
      ),

    editionLabel:
      edition.editionLabel?.trim() ||
      null,

    startDate:
      parseOptionalDate(
        edition.startDate,
      ),

    endDate:
      parseOptionalDate(
        edition.endDate,
      ),

    drawSize:
      edition.drawSize ?? null,

    championName:
      edition.championName ?? null,

    runnerUpName:
      edition.runnerUpName ?? null,

    championCountryCode:
      edition.championCountryCode ??
      null,

    runnerUpCountryCode:
      edition.runnerUpCountryCode ??
      null,

    championPlayerId,
    runnerUpPlayerId,

    score:
      edition.score ?? null,

    cancelled:
      edition.cancelled ?? false,
  };
}

export async function importTournamentEditions(
  dataset: TournamentHistoryDataset,
): Promise<{
  tournamentId: string;
  tournamentName: string;
  importedEditions: number;
}> {
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
      `Torneo non trovato: "${dataset.tournamentSlug}"`,
    );
  }

  const seenEditionKeys =
    new Set<string>();

  for (const edition of dataset.editions) {
    const resolvedEdition =
      await resolveEdition(
        edition,
      );

    const {
      year,
      editionKey,
      ...editionData
    } = resolvedEdition;

    const datasetIdentity =
      `${year}:${editionKey}`;

    if (
      seenEditionKeys.has(
        datasetIdentity,
      )
    ) {
      throw new Error(
        `Edizione duplicata nel dataset: ${dataset.tournamentSlug} ${year} [${editionKey}]`,
      );
    }

    seenEditionKeys.add(
      datasetIdentity,
    );

    await prisma.tournamentEdition.upsert({
      where: {
        tournamentId_year_editionKey: {
          tournamentId:
            tournament.id,
          year,
          editionKey,
        },
      },

      create: {
        tournamentId:
          tournament.id,

        year,
        editionKey,

        ...editionData,
      },

      update: editionData,
    });

    const editionLabel =
      resolvedEdition.editionLabel
        ? ` · ${resolvedEdition.editionLabel}`
        : resolvedEdition.editionKey !==
            "main"
          ? ` · ${resolvedEdition.editionKey}`
          : "";

    const resultLabel =
      resolvedEdition.cancelled
        ? "cancelled"
        : [
            resolvedEdition.championName,
            resolvedEdition.runnerUpName
              ? `d. ${resolvedEdition.runnerUpName}`
              : null,
          ]
            .filter(Boolean)
            .join(" ");

    console.log(
      `   ✅ ${year}${editionLabel}: ${resultLabel || "edition imported"}`,
    );
  }

  return {
    tournamentId:
      tournament.id,

    tournamentName:
      tournament.name,

    importedEditions:
      dataset.editions.length,
  };
}