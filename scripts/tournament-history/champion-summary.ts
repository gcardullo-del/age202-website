import { prisma } from "../../lib/prisma";

import type {
  TournamentChampionSummary,
} from "./types";

type HistoricalChampionIdentity = {
  playerId: string | null;
  name: string;
  countryCode: string | null;
};

type ExistingChampion = {
  id: string;
  playerId: string | null;
  name: string | null;
  country: string | null;
  countryCode: string | null;
  titles: number;
  firstTitleYear: number | null;
  lastTitleYear: number | null;
  titleYears: number[];
  finals: number | null;
  wins: number | null;
  legend: boolean;
  featured: boolean;
  sortOrder: number;
  recordLabel: string | null;
  quote: string | null;
  imageUrl: string | null;
};

function normalizeChampionName(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

function createIdentityKey(
  identity: HistoricalChampionIdentity,
): string {
  if (identity.playerId) {
    return `player:${identity.playerId}`;
  }

  return `name:${normalizeChampionName(identity.name)}`;
}

function getEditorialScore(
  champion: ExistingChampion,
): number {
  return (
    Number(champion.legend) * 100 +
    Number(champion.featured) * 50 +
    Number(Boolean(champion.imageUrl)) * 20 +
    Number(Boolean(champion.quote)) * 10 +
    Number(Boolean(champion.recordLabel)) * 5 +
    Number(Boolean(champion.country)) * 2 +
    Number(Boolean(champion.countryCode))
  );
}

function chooseKeeper(
  champions: ExistingChampion[],
): ExistingChampion {
  return [...champions].sort(
    (a, b) =>
      getEditorialScore(b) -
        getEditorialScore(a) ||
      a.sortOrder -
        b.sortOrder ||
      a.id.localeCompare(b.id),
  )[0];
}

function findMatchingExistingChampions(
  summary: TournamentChampionSummary,
  existingChampions: ExistingChampion[],
): ExistingChampion[] {
  const normalizedSummaryName =
    normalizeChampionName(
      summary.name,
    );

  return existingChampions.filter(
    (champion) => {
      if (
        summary.playerId &&
        champion.playerId ===
          summary.playerId
      ) {
        return true;
      }

      if (!champion.name) {
        return false;
      }

      return (
        normalizeChampionName(
          champion.name,
        ) ===
        normalizedSummaryName
      );
    },
  );
}

function mergeEditorialFields(
  champions: ExistingChampion[],
) {
  const byEditorialPriority =
    [...champions].sort(
      (a, b) =>
        getEditorialScore(b) -
          getEditorialScore(a) ||
        a.sortOrder -
          b.sortOrder,
    );

  const firstValue = <T>(
    selector: (
      champion: ExistingChampion,
    ) => T | null,
  ): T | null => {
    for (
      const champion
      of byEditorialPriority
    ) {
      const value =
        selector(champion);

      if (value != null) {
        return value;
      }
    }

    return null;
  };

  return {
    country:
      firstValue(
        (champion) =>
          champion.country,
      ),
    countryCode:
      firstValue(
        (champion) =>
          champion.countryCode,
      ),
    finals:
      firstValue(
        (champion) =>
          champion.finals,
      ),
    wins:
      firstValue(
        (champion) =>
          champion.wins,
      ),
    legend:
      champions.some(
        (champion) =>
          champion.legend,
      ),
    featured:
      champions.some(
        (champion) =>
          champion.featured,
      ),
    recordLabel:
      firstValue(
        (champion) =>
          champion.recordLabel,
      ),
    quote:
      firstValue(
        (champion) =>
          champion.quote,
      ),
    imageUrl:
      firstValue(
        (champion) =>
          champion.imageUrl,
      ),
  };
}

export async function buildTournamentChampionSummaries(
  tournamentId: string,
): Promise<TournamentChampionSummary[]> {
  const editions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId,
        cancelled: false,
        championName: {
          not: null,
        },
      },

      select: {
        year: true,
        championName: true,
        championCountryCode: true,
        championPlayerId: true,
      },

      orderBy: {
        year: "asc",
      },
    });

  const summaries =
    new Map<
      string,
      TournamentChampionSummary
    >();

  for (const edition of editions) {
    if (!edition.championName) {
      continue;
    }

    const displayName =
      edition.championName
        .trim()
        .replace(/\s+/g, " ");

    if (!displayName) {
      continue;
    }

    const identity: HistoricalChampionIdentity = {
      playerId:
        edition.championPlayerId,
      name:
        displayName,
      countryCode:
        edition.championCountryCode,
    };

    const identityKey =
      createIdentityKey(identity);

    const current =
      summaries.get(identityKey);

    if (!current) {
      summaries.set(identityKey, {
        identityKey,
        playerId:
          identity.playerId,
        name:
          identity.name,
        countryCode:
          identity.countryCode,
        titles: 1,
        firstTitleYear:
          edition.year,
        lastTitleYear:
          edition.year,
        titleYears: [
          edition.year,
        ],
      });

      continue;
    }

    current.titles += 1;
    current.firstTitleYear =
      Math.min(
        current.firstTitleYear,
        edition.year,
      );
    current.lastTitleYear =
      Math.max(
        current.lastTitleYear,
        edition.year,
      );

    if (
      !current.titleYears.includes(
        edition.year,
      )
    ) {
      current.titleYears.push(
        edition.year,
      );
    }

    if (
      !current.countryCode &&
      identity.countryCode
    ) {
      current.countryCode =
        identity.countryCode;
    }
  }

  return Array.from(
    summaries.values(),
  ).sort((a, b) => {
    if (b.titles !== a.titles) {
      return b.titles - a.titles;
    }

    if (
      a.firstTitleYear !==
      b.firstTitleYear
    ) {
      return (
        a.firstTitleYear -
        b.firstTitleYear
      );
    }

    return a.name.localeCompare(
      b.name,
    );
  });
}

export async function syncTournamentChampionSummaries(
  tournamentId: string,
): Promise<{
  champions: number;
  duplicatesRemoved: number;
}> {
  const summaries =
    await buildTournamentChampionSummaries(
      tournamentId,
    );

  const existingChampions =
    await prisma.tournamentChampion.findMany({
      where: {
        tournamentId,
      },
      select: {
        id: true,
        playerId: true,
        name: true,
        country: true,
        countryCode: true,
        titles: true,
        firstTitleYear: true,
        lastTitleYear: true,
        titleYears: true,
        finals: true,
        wins: true,
        legend: true,
        featured: true,
        sortOrder: true,
        recordLabel: true,
        quote: true,
        imageUrl: true,
      },
    });

  let duplicatesRemoved = 0;

  for (
    const [
      index,
      summary,
    ] of summaries.entries()
  ) {
    const matches =
      findMatchingExistingChampions(
        summary,
        existingChampions,
      );

    const summaryData = {
      playerId:
        summary.playerId,
      name:
        summary.name,
      countryCode:
        summary.countryCode,
      titles:
        summary.titles,
      firstTitleYear:
        summary.firstTitleYear,
      lastTitleYear:
        summary.lastTitleYear,
      titleYears:
        summary.titleYears,
      sortOrder:
        index,
    };

    if (matches.length === 0) {
      const created =
        await prisma.tournamentChampion.create({
          data: {
            tournamentId,
            ...summaryData,
          },
          select: {
            id: true,
            playerId: true,
            name: true,
            country: true,
            countryCode: true,
            titles: true,
            firstTitleYear: true,
            lastTitleYear: true,
            titleYears: true,
            finals: true,
            wins: true,
            legend: true,
            featured: true,
            sortOrder: true,
            recordLabel: true,
            quote: true,
            imageUrl: true,
          },
        });

      existingChampions.push(
        created,
      );

      continue;
    }

    const keeper =
      chooseKeeper(matches);

    const editorial =
      mergeEditorialFields(
        matches,
      );

    await prisma.tournamentChampion.update({
      where: {
        id:
          keeper.id,
      },
      data: {
        ...summaryData,
        country:
          editorial.country,
        countryCode:
          summary.countryCode ??
          editorial.countryCode,
        finals:
          editorial.finals,
        wins:
          editorial.wins,
        legend:
          editorial.legend,
        featured:
          editorial.featured,
        recordLabel:
          editorial.recordLabel,
        quote:
          editorial.quote,
        imageUrl:
          editorial.imageUrl,
      },
    });

    const duplicateIds =
      matches
        .filter(
          (match) =>
            match.id !==
            keeper.id,
        )
        .map(
          (match) =>
            match.id,
        );

    if (
      duplicateIds.length > 0
    ) {
      await prisma.tournamentChampion.deleteMany({
        where: {
          id: {
            in:
              duplicateIds,
          },
        },
      });

      duplicatesRemoved +=
        duplicateIds.length;

      for (
        const duplicateId
        of duplicateIds
      ) {
        const duplicateIndex =
          existingChampions.findIndex(
            (champion) =>
              champion.id ===
              duplicateId,
          );

        if (
          duplicateIndex !== -1
        ) {
          existingChampions.splice(
            duplicateIndex,
            1,
          );
        }
      }
    }
  }

  console.log(
    `👑 Hall of Champions sincronizzata: ${summaries.length} campioni, ${duplicatesRemoved} duplicati rimossi.`,
  );

  return {
    champions:
      summaries.length,
    duplicatesRemoved,
  };
}