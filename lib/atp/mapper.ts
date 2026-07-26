import type {
  AtpRankingMovement,
  AtpRankingPlayer,
} from "@/lib/atp/types";

export type RawAtpRankingPlayer = {
  rank: number | string;
  previousRank?: number | string | null;

  name: string;
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;

  country?: string | null;
  countryCode?: string | null;

  points: number | string;
  age?: number | string | null;

  imageUrl?: string | null;
};

type Age202Collection = {
  href: string;
  slug: string;
};

const AGE202_COLLECTIONS: Record<string, Age202Collection> = {
  "jannik sinner": {
    slug: "sinner",
    href: "/archives/sinner",
  },
  "carlos alcaraz": {
    slug: "alcaraz",
    href: "/archives/alcaraz",
  },
  "novak djokovic": {
    slug: "djokovic",
    href: "/archives/djokovic",
  },
  "roger federer": {
    slug: "federer",
    href: "/archives/federer",
  },
  "rafael nadal": {
    slug: "nadal",
    href: "/archives/nadal",
  },
};

function normalizeText(value?: string | null): string {
  return value?.trim() ?? "";
}

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function parseNumber(
  value: number | string | null | undefined,
  fallback = 0,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function parseNullableNumber(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = parseNumber(value, Number.NaN);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getMovement(
  rank: number,
  previousRank: number | null,
): {
  movement: AtpRankingMovement;
  movementPositions: number;
} {
  if (previousRank === null) {
    return {
      movement: "new",
      movementPositions: 0,
    };
  }

  const difference = previousRank - rank;

  if (difference > 0) {
    return {
      movement: "up",
      movementPositions: difference,
    };
  }

  if (difference < 0) {
    return {
      movement: "down",
      movementPositions: Math.abs(difference),
    };
  }

  return {
    movement: "same",
    movementPositions: 0,
  };
}

export function mapAtpRankingPlayer(
  rawPlayer: RawAtpRankingPlayer,
): AtpRankingPlayer {
  const rank = parseNumber(rawPlayer.rank);
  const previousRank = parseNullableNumber(rawPlayer.previousRank);
  const name = normalizeText(rawPlayer.name);

  const collection = AGE202_COLLECTIONS[normalizeName(name)];
  const movementData = getMovement(rank, previousRank);

  return {
    rank,
    previousRank,

    name,
    firstName: normalizeText(rawPlayer.firstName) || undefined,
    lastName: normalizeText(rawPlayer.lastName) || undefined,
   slug:
  collection?.slug ??
  (normalizeText(rawPlayer.slug) || undefined),

    country: normalizeText(rawPlayer.country) || "Unknown",
    countryCode:
      normalizeText(rawPlayer.countryCode).toUpperCase() || "N/A",

    points: parseNumber(rawPlayer.points),
    age: parseNullableNumber(rawPlayer.age),

    movement: movementData.movement,
    movementPositions: movementData.movementPositions,

    imageUrl: normalizeText(rawPlayer.imageUrl) || null,

    age202Href: collection?.href ?? null,
    hasAge202Collection: Boolean(collection),
  };
}

export function mapAtpRanking(
  rawPlayers: RawAtpRankingPlayer[],
  limit = 150,
): AtpRankingPlayer[] {
  return rawPlayers
    .map(mapAtpRankingPlayer)
    .filter((player) => player.rank > 0 && player.name.length > 0)
    .sort((firstPlayer, secondPlayer) => firstPlayer.rank - secondPlayer.rank)
    .slice(0, limit);
}