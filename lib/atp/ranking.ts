import type {
  AtpRankingResponse,
  AtpRankingPlayer,
} from "@/lib/atp/types";

import {
  mapAtpRanking,
  type RawAtpRankingPlayer,
} from "@/lib/atp/mapper";

const ATP_RANKINGS_URL =
  "https://www.atptour.com/en/rankings/singles?rankRange=1-150";

const CACHE_DURATION_SECONDS = 60 * 60 * 12;

const FALLBACK_RANKING: RawAtpRankingPlayer[] = [
  {
    rank: 1,
    previousRank: 1,
    name: "Jannik Sinner",
    country: "Italy",
    countryCode: "ITA",
    points: 13450,
    age: 24,
  },
  {
    rank: 2,
    previousRank: 2,
    name: "Alexander Zverev",
    country: "Germany",
    countryCode: "GER",
    points: 8480,
    age: 29,
  },
  {
    rank: 3,
    previousRank: 3,
    name: "Carlos Alcaraz",
    country: "Spain",
    countryCode: "ESP",
    points: 8160,
    age: 23,
  },
  {
    rank: 4,
    previousRank: 4,
    name: "Felix Auger-Aliassime",
    country: "Canada",
    countryCode: "CAN",
    points: 4740,
    age: 25,
  },
  {
    rank: 5,
    previousRank: 5,
    name: "Alex de Minaur",
    country: "Australia",
    countryCode: "AUS",
    points: 4110,
    age: 27,
  },
];

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

function stripHtml(value: string): string {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  );
}

function parsePoints(value: string): number {
  const normalizedValue = value
    .replace(/[^\d]/g, "")
    .trim();

  return Number(normalizedValue) || 0;
}

function extractRankingRows(html: string): RawAtpRankingPlayer[] {
  const players: RawAtpRankingPlayer[] = [];

  /*
   * Il markup ATP può cambiare nel tempo.
   * Per questo manteniamo tutta la logica di parsing
   * confinata in questo singolo file.
   */
  const rowRegex =
    /<tr[^>]*>[\s\S]*?<td[^>]*class="[^"]*rank[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="[^"]*player[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="[^"]*age[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="[^"]*points[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;

  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(html)) !== null) {
    const rank = Number(stripHtml(match[1]));
    const playerCell = match[2];
    const name = stripHtml(playerCell);
    const age = Number(stripHtml(match[3])) || null;
    const points = parsePoints(stripHtml(match[4]));

    const countryCodeMatch =
      playerCell.match(/(?:country|flag)[-_ ]?([A-Z]{3})/i) ??
      playerCell.match(/data-country-code=["']([A-Z]{3})["']/i);

    if (!rank || !name || !points) {
      continue;
    }

    players.push({
      rank,
      previousRank: null,
      name,
      country: "Unknown",
      countryCode: countryCodeMatch?.[1]?.toUpperCase() ?? "N/A",
      points,
      age,
    });
  }

  return players;
}

async function fetchOfficialAtpRanking(): Promise<RawAtpRankingPlayer[]> {
  const response = await fetch(ATP_RANKINGS_URL, {
    headers: {
      Accept: "text/html",
      "User-Agent":
        "Mozilla/5.0 (compatible; AGE202/1.0; +https://www.age202.com)",
    },
    next: {
      revalidate: CACHE_DURATION_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(
      `ATP ranking request failed with status ${response.status}`,
    );
  }

  const html = await response.text();
  const players = extractRankingRows(html);

  if (players.length < 10) {
    throw new Error(
      `ATP ranking parser returned only ${players.length} players`,
    );
  }

  return players;
}

function buildResponse(
  players: AtpRankingPlayer[],
  isLive: boolean,
): AtpRankingResponse {
  return {
    players,
    metadata: {
      source: "ATP Tour",
      rankingType: "singles",
      totalPlayers: players.length,
      updatedAt: new Date().toISOString(),
      isLive,
    },
  };
}

export async function getAtpRanking(
  limit = 150,
): Promise<AtpRankingResponse> {
  const safeLimit = Math.min(Math.max(limit, 1), 150);

  try {
    const rawPlayers = await fetchOfficialAtpRanking();
    const players = mapAtpRanking(rawPlayers, safeLimit);

    return buildResponse(players, true);
  } catch (error) {
    console.error("[ATP Ranking]", error);

    const fallbackPlayers = mapAtpRanking(
      FALLBACK_RANKING,
      safeLimit,
    );

    return buildResponse(fallbackPlayers, false);
  }
}