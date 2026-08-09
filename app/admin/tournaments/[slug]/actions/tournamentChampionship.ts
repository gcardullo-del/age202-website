"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function requiredText(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function optionalText(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function optionalInteger(formData: FormData, key: string): number | null {
  const value = optionalText(formData, key);

  if (value === null) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${key} must be an integer.`);
  }

  return parsed;
}

function requiredInteger(formData: FormData, key: string): number {
  const value = optionalInteger(formData, key);

  if (value === null) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function optionalDate(formData: FormData, key: string): Date | null {
  const value = optionalText(formData, key);

  if (value === null) {
    return null;
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${key} must be a valid date.`);
  }

  return parsed;
}

function validateYear(year: number) {
  if (year < 1800 || year > 2200) {
    throw new Error("Tournament year is outside the allowed range.");
  }
}

function validateOptionalYear(year: number | null, label: string) {
  if (year !== null && (year < 1800 || year > 2200)) {
    throw new Error(`${label} is outside the allowed range.`);
  }
}

function normalizeCountryCode(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  return value.trim().toUpperCase().slice(0, 3);
}

function integerList(
  formData: FormData,
  key: string,
): number[] {
  const value = optionalText(
    formData,
    key,
  );

  if (!value) {
    return [];
  }

  const years = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number.parseInt(item, 10));

  if (
    years.some(
      (year) =>
        !Number.isInteger(year) ||
        year < 1800 ||
        year > 2200,
    )
  ) {
    throw new Error(
      `${key} must contain valid years separated by commas.`,
    );
  }

  return Array.from(
    new Set(years),
  ).sort((a, b) => a - b);
}

function validateDateRange(startDate: Date | null, endDate: Date | null) {
  if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
    throw new Error("Start date cannot be after end date.");
  }
}

function validateTitleYears(
  firstTitleYear: number | null,
  lastTitleYear: number | null,
) {
  validateOptionalYear(firstTitleYear, "First title year");
  validateOptionalYear(lastTitleYear, "Last title year");

  if (
    firstTitleYear !== null &&
    lastTitleYear !== null &&
    firstTitleYear > lastTitleYear
  ) {
    throw new Error("First title year cannot be after last title year.");
  }
}

async function getTournamentContext(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: {
      slug: true,
      category: true,
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  return tournament;
}

function revalidateTournamentPaths(slug: string, category: string) {
  revalidatePath("/admin/tournaments");
  revalidatePath(`/admin/tournaments/${slug}`);

  if (category === "MASTERS_1000") {
    revalidatePath(`/results/masters-1000/${slug}`);
  }
}

async function validateOptionalPlayer(playerId: string | null) {
  if (playerId === null) {
    return;
  }

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      id: true,
    },
  });

  if (!player) {
    throw new Error("Selected player was not found.");
  }
}

export async function createTournamentEdition(
  tournamentId: string,
  formData: FormData,
) {
  const tournament = await getTournamentContext(tournamentId);

  const year = requiredInteger(formData, "year");
  validateYear(year);

  const startDate = optionalDate(formData, "startDate");
  const endDate = optionalDate(formData, "endDate");
  validateDateRange(startDate, endDate);

  const championPlayerId = optionalText(formData, "championPlayerId");
  const runnerUpPlayerId = optionalText(formData, "runnerUpPlayerId");

  await Promise.all([
    validateOptionalPlayer(championPlayerId),
    validateOptionalPlayer(runnerUpPlayerId),
  ]);

  const existingEdition = await prisma.tournamentEdition.findUnique({
    where: {
      tournamentId_year: {
        tournamentId,
        year,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingEdition) {
    throw new Error(`An edition for ${year} already exists.`);
  }

  await prisma.tournamentEdition.create({
    data: {
      tournamentId,
      year,
      startDate,
      endDate,
      drawSize: optionalInteger(formData, "drawSize"),
      championName: optionalText(formData, "championName"),
      runnerUpName: optionalText(formData, "runnerUpName"),
      championPlayerId,
      runnerUpPlayerId,
      championCountryCode: normalizeCountryCode(
        optionalText(formData, "championCountryCode"),
      ),
      runnerUpCountryCode: normalizeCountryCode(
        optionalText(formData, "runnerUpCountryCode"),
      ),
      score: optionalText(formData, "score"),
      cancelled: formData.get("cancelled") === "on",
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=edition`);
}

export async function updateTournamentEdition(
  tournamentId: string,
  editionId: string,
  formData: FormData,
) {
  const tournament = await getTournamentContext(tournamentId);

  const edition = await prisma.tournamentEdition.findFirst({
    where: {
      id: editionId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!edition) {
    throw new Error("Tournament edition not found.");
  }

  const year = requiredInteger(formData, "year");
  validateYear(year);

  const startDate = optionalDate(formData, "startDate");
  const endDate = optionalDate(formData, "endDate");
  validateDateRange(startDate, endDate);

  const championPlayerId = optionalText(formData, "championPlayerId");
  const runnerUpPlayerId = optionalText(formData, "runnerUpPlayerId");

  await Promise.all([
    validateOptionalPlayer(championPlayerId),
    validateOptionalPlayer(runnerUpPlayerId),
  ]);

  const duplicateEdition = await prisma.tournamentEdition.findFirst({
    where: {
      tournamentId,
      year,
      id: {
        not: edition.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateEdition) {
    throw new Error(`Another edition for ${year} already exists.`);
  }

  await prisma.tournamentEdition.update({
    where: {
      id: edition.id,
    },
    data: {
      year,
      startDate,
      endDate,
      drawSize: optionalInteger(formData, "drawSize"),
      championName: optionalText(formData, "championName"),
      runnerUpName: optionalText(formData, "runnerUpName"),
      championPlayerId,
      runnerUpPlayerId,
      championCountryCode: normalizeCountryCode(
        optionalText(formData, "championCountryCode"),
      ),
      runnerUpCountryCode: normalizeCountryCode(
        optionalText(formData, "runnerUpCountryCode"),
      ),
      score: optionalText(formData, "score"),
      cancelled: formData.get("cancelled") === "on",
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=edition`);
}

export async function deleteTournamentEdition(
  tournamentId: string,
  editionId: string,
) {
  const tournament = await getTournamentContext(tournamentId);

  const edition = await prisma.tournamentEdition.findFirst({
    where: {
      id: editionId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!edition) {
    throw new Error("Tournament edition not found.");
  }

  await prisma.tournamentEdition.delete({
    where: {
      id: edition.id,
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=edition`);
}

export async function createTournamentChampion(
  tournamentId: string,
  formData: FormData,
) {
  const tournament = await getTournamentContext(tournamentId);

  const playerId = optionalText(formData, "playerId");
  await validateOptionalPlayer(playerId);

  const name = optionalText(formData, "name");
  const country = optionalText(formData, "country");
  const countryCode = normalizeCountryCode(
    optionalText(formData, "countryCode"),
  );

  if (!playerId && !name) {
    throw new Error(
      "Select an AGE202 player or enter a historical legend name.",
    );
  }

  const titles = requiredInteger(formData, "titles");

  if (titles < 1) {
    throw new Error("Titles must be at least 1.");
  }

  const firstTitleYear = optionalInteger(formData, "firstTitleYear");
  const lastTitleYear = optionalInteger(formData, "lastTitleYear");

  validateTitleYears(firstTitleYear, lastTitleYear);

  const existingChampion =
    playerId
      ? await prisma.tournamentChampion.findFirst({
          where: {
            tournamentId,
            playerId,
          },
          select: {
            id: true,
          },
        })
      : await prisma.tournamentChampion.findFirst({
          where: {
            tournamentId,
            playerId: null,
            name: {
              equals: name!,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
          },
        });

  if (existingChampion) {
    throw new Error(
      playerId
        ? "This player is already registered as a tournament champion."
        : "This historical legend is already registered for this tournament.",
    );
  }

  await prisma.tournamentChampion.create({
    data: {
      tournamentId,
      playerId,
      name,
      country,
      countryCode,
      titles,
      firstTitleYear,
      lastTitleYear,

      titleYears:
        integerList(
          formData,
          "titleYears",
        ),

      finals:
        optionalInteger(
          formData,
          "finals",
        ),

      wins:
        optionalInteger(
          formData,
          "wins",
        ),

      legend:
        formData.get(
          "legend",
        ) === "on",

      featured:
        formData.get(
          "featured",
        ) === "on",

      sortOrder:
        optionalInteger(
          formData,
          "sortOrder",
        ) ?? 0,

      recordLabel:
        optionalText(
          formData,
          "recordLabel",
        ),

      quote:
        optionalText(
          formData,
          "quote",
        ),

      imageUrl:
        optionalText(
          formData,
          "imageUrl",
        ),
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=champion`);
}

export async function updateTournamentChampion(
  tournamentId: string,
  championId: string,
  formData: FormData,
) {
  const tournament = await getTournamentContext(tournamentId);

  const champion = await prisma.tournamentChampion.findFirst({
    where: {
      id: championId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!champion) {
    throw new Error("Tournament champion not found.");
  }

  const playerId = optionalText(formData, "playerId");
  await validateOptionalPlayer(playerId);

  const name = optionalText(formData, "name");
  const country = optionalText(formData, "country");
  const countryCode = normalizeCountryCode(
    optionalText(formData, "countryCode"),
  );

  if (!playerId && !name) {
    throw new Error(
      "Select an AGE202 player or enter a historical legend name.",
    );
  }

  const titles = requiredInteger(formData, "titles");

  if (titles < 1) {
    throw new Error("Titles must be at least 1.");
  }

  const firstTitleYear = optionalInteger(formData, "firstTitleYear");
  const lastTitleYear = optionalInteger(formData, "lastTitleYear");

  validateTitleYears(firstTitleYear, lastTitleYear);

  const duplicateChampion =
    playerId
      ? await prisma.tournamentChampion.findFirst({
          where: {
            tournamentId,
            playerId,
            id: {
              not: champion.id,
            },
          },
          select: {
            id: true,
          },
        })
      : await prisma.tournamentChampion.findFirst({
          where: {
            tournamentId,
            playerId: null,
            name: {
              equals: name!,
              mode: "insensitive",
            },
            id: {
              not: champion.id,
            },
          },
          select: {
            id: true,
          },
        });

  if (duplicateChampion) {
    throw new Error(
      playerId
        ? "This player is already registered as a tournament champion."
        : "This historical legend is already registered for this tournament.",
    );
  }

  await prisma.tournamentChampion.update({
    where: {
      id: champion.id,
    },
    data: {
      playerId,
      name,
      country,
      countryCode,
      titles,
      firstTitleYear,
      lastTitleYear,

      titleYears:
        integerList(
          formData,
          "titleYears",
        ),

      finals:
        optionalInteger(
          formData,
          "finals",
        ),

      wins:
        optionalInteger(
          formData,
          "wins",
        ),

      legend:
        formData.get(
          "legend",
        ) === "on",

      featured:
        formData.get(
          "featured",
        ) === "on",

      sortOrder:
        optionalInteger(
          formData,
          "sortOrder",
        ) ?? 0,

      recordLabel:
        optionalText(
          formData,
          "recordLabel",
        ),

      quote:
        optionalText(
          formData,
          "quote",
        ),

      imageUrl:
        optionalText(
          formData,
          "imageUrl",
        ),
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=champion`);
}

export async function deleteTournamentChampion(
  tournamentId: string,
  championId: string,
) {
  const tournament = await getTournamentContext(tournamentId);

  const champion = await prisma.tournamentChampion.findFirst({
    where: {
      id: championId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!champion) {
    throw new Error("Tournament champion not found.");
  }

  await prisma.tournamentChampion.delete({
    where: {
      id: champion.id,
    },
  });

  revalidateTournamentPaths(tournament.slug, tournament.category);

  redirect(`/admin/tournaments/${tournament.slug}?saved=champion`);
}