import type {
   Page,
} from "playwright";

import {
  ATP_RANKING_LIMIT,
  type AtpLiveRankingEntry,
} from "./types";


const LIVE_TENNIS_ROW_PATTERN =
  /(?:^|\n)(\d{1,4})\t[\s\S]{0,100}?\t([^\t\n]+)\t(\d{1,2})\t([A-Z]{3})\t([\d,.]+)(?=\t|\n)/g;


function parseInteger(
  value: string,
): number | null {
  const normalized =
    value
      .replace(/[^\d-]/g, "")
      .trim();

  if (!normalized) {
    return null;
  }

  const parsed =
    Number.parseInt(
      normalized,
      10,
    );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}


function normalizeName(
  value: string,
): string {
  return value
    .replace(/\s+/g, " ")
    .trim();
}


function buildProfileSlug(
  name: string,
): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/Ł/g, "L")
    .replace(/ł/g, "l")
    .replace(/Ø/g, "O")
    .replace(/ø/g, "o")
    .replace(/Æ/g, "AE")
    .replace(/æ/g, "ae")
    .replace(/Œ/g, "OE")
    .replace(/œ/g, "oe")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function deduplicateEntries(
  entries: AtpLiveRankingEntry[],
): AtpLiveRankingEntry[] {
  const byRank =
    new Map<
      number,
      AtpLiveRankingEntry
    >();

  for (const entry of entries) {
    const existing =
      byRank.get(
        entry.rank,
      );

    if (!existing) {
      byRank.set(
        entry.rank,
        entry,
      );

      continue;
    }

    if (
      existing.profileSlug ===
      entry.profileSlug
    ) {
      continue;
    }

    throw new Error(
      [
        `Conflitto nella sorgente live sul rank ${entry.rank}.`,
        `"${existing.name}" e "${entry.name}" occupano lo stesso rank.`,
      ].join(" "),
    );
  }

  return Array.from(
    byRank.values(),
  );
}


function assertReadableDataset(
  content: string,
) {
  const normalized =
    content.toLowerCase();

  if (
    normalized.includes(
      "just a moment",
    ) ||
    normalized.includes(
      "enable javascript and cookies to continue",
    ) ||
    normalized.includes(
      "cf-mitigated",
    )
  ) {
    throw new Error(
      "La sorgente live è stata bloccata da Cloudflare.",
    );
  }

  if (
    !content.includes(
      "Classifica ATP Live",
    ) ||
    !content.includes(
      "Giocatore",
    )
  ) {
    throw new Error(
      "La risposta non contiene una classifica ATP Live riconoscibile.",
    );
  }
}


export async function parseAtpLiveRanking(
  page: Page,
): Promise<AtpLiveRankingEntry[]> {
  const content =
    (
      await page
        .locator("body")
        .innerText()
    )
      .replace(/\r/g, "");

  assertReadableDataset(
    content,
  );

  const rawEntries:
    AtpLiveRankingEntry[] = [];

  LIVE_TENNIS_ROW_PATTERN.lastIndex =
    0;

  for (
    const match
    of content.matchAll(
      LIVE_TENNIS_ROW_PATTERN,
    )
  ) {
    const rank =
      parseInteger(
        match[1] ?? "",
      );

    const name =
      normalizeName(
        match[2] ?? "",
      );

    const age =
      parseInteger(
        match[3] ?? "",
      );

    const countryCode =
      (
        match[4] ??
        ""
      )
        .trim()
        .toUpperCase();

    const points =
      parseInteger(
        match[5] ?? "",
      );

    if (
      rank === null ||
      rank < 1 ||
      rank > ATP_RANKING_LIMIT ||
      !name ||
      age === null ||
      age < 14 ||
      age > 60 ||
      !/^[A-Z]{3}$/.test(
        countryCode,
      ) ||
      points === null ||
      points < 0
    ) {
      continue;
    }

    const profileSlug =
      buildProfileSlug(
        name,
      );

    if (!profileSlug) {
      continue;
    }

    rawEntries.push({
      rank,

      name,

      firstName:
        null,

      lastName:
        null,

      country:
        null,

      countryCode,

      age,

      points,

      rankMovement:
        null,

      profileHref:
        null,

      profileSlug,
    });
  }

  const entries =
    deduplicateEntries(
      rawEntries,
    )
      .sort(
        (
          first,
          second,
        ) =>
          first.rank -
          second.rank,
      );

  if (
    entries.length !==
    ATP_RANKING_LIMIT
  ) {
    const receivedRanks =
      new Set(
        entries.map(
          (entry) =>
            entry.rank,
        ),
      );

    const missingRanks:
      number[] = [];

    for (
      let rank = 1;
      rank <= ATP_RANKING_LIMIT;
      rank += 1
    ) {
      if (
        !receivedRanks.has(
          rank,
        )
      ) {
        missingRanks.push(
          rank,
        );
      }
    }

    throw new Error(
      [
        "Dataset Live Tennis incompleto.",
        `Attesi ${ATP_RANKING_LIMIT} giocatori, trovati ${entries.length}.`,
        `Rank mancanti: ${missingRanks.join(", ") || "nessuno"}.`,
      ].join(" "),
    );
  }

  return entries;
}
