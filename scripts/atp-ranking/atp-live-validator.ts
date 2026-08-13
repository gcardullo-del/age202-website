import {
  ATP_RANKING_LIMIT,
  type AtpLiveRankingEntry,
  type AtpRankingValidationResult,
} from "./types";


export function validateAtpLiveRanking(
  entries: AtpLiveRankingEntry[],
): AtpRankingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (
    entries.length !==
    ATP_RANKING_LIMIT
  ) {
    errors.push(
      `Attesi ${ATP_RANKING_LIMIT} giocatori, trovati ${entries.length}.`,
    );
  }

  const ranks =
    entries.map(
      (entry) =>
        entry.rank,
    );

  const uniqueRanks =
    new Set(
      ranks,
    );

  if (
    uniqueRanks.size !==
    entries.length
  ) {
    errors.push(
      "Sono presenti rank duplicati.",
    );
  }

  for (
    let rank = 1;
    rank <= ATP_RANKING_LIMIT;
    rank += 1
  ) {
    if (
      !uniqueRanks.has(
        rank,
      )
    ) {
      errors.push(
        `Rank ${rank} mancante.`,
      );
    }
  }

  const profileSlugs =
    entries
      .map(
        (entry) =>
          entry.profileSlug,
      )
      .filter(
        (
          value,
        ): value is string =>
          Boolean(
            value,
          ),
      );

  if (
    new Set(
      profileSlugs,
    ).size !==
    profileSlugs.length
  ) {
    errors.push(
      "Sono presenti profileSlug ATP duplicati.",
    );
  }

  for (const entry of entries) {
    if (
      !entry.profileSlug
    ) {
      errors.push(
        `Rank ${entry.rank}: profileSlug mancante.`,
      );
    }

    if (
      !entry.name.trim()
    ) {
      errors.push(
        `Rank ${entry.rank}: nome mancante.`,
      );
    }

    if (
      !Number.isInteger(
        entry.points,
      ) ||
      entry.points < 0
    ) {
      errors.push(
        `Rank ${entry.rank}: punti non validi.`,
      );
    }

    if (
      entry.points === 0
    ) {
      warnings.push(
        `Rank ${entry.rank}: punti pari a 0.`,
      );
    }
  }

  return {
    valid:
      errors.length === 0,
    errors,
    warnings,
  };
}