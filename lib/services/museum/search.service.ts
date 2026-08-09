import "server-only";

import {
  searchBrands,
  searchPublishedArtifacts,
} from "@/lib/repositories/museum-search.repository";

import {
  searchPlayers,
} from "@/lib/repositories/player.repository";

export type MuseumSearchResultType =
  | "PLAYER"
  | "ARTIFACT"
  | "BRAND";

export type MuseumSearchResult = {
  id: string;
  type: MuseumSearchResultType;
  title: string;
  subtitle: string | null;
  href: string;
  imageUrl: string | null;
  keywords: string[];
};

export type MuseumSearchResponse = {
  query: string;
  results: MuseumSearchResult[];
  total: number;
};

type MuseumSearchOptions = {
  limitPerType?: number;
  totalLimit?: number;
};

const DEFAULT_LIMIT_PER_TYPE = 6;
const DEFAULT_TOTAL_LIMIT = 15;

function normalizeQuery(
  query: string,
): string {
  return query.trim();
}

function normalizeLimit(
  value: number | undefined,
  fallback: number,
  maximum: number,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.max(
    1,
    Math.min(
      Math.trunc(value),
      maximum,
    ),
  );
}

function getSearchableText(
  result: MuseumSearchResult,
): string {
  return [
    result.title,
    result.subtitle,
    ...result.keywords,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getSearchScore(
  result: MuseumSearchResult,
  query: string,
): number {
  const normalizedQuery =
    query.toLowerCase();

  const normalizedTitle =
    result.title.toLowerCase();

  const normalizedSubtitle =
    result.subtitle?.toLowerCase() ??
    "";

  const searchableText =
    getSearchableText(
      result,
    );

  let score = 0;

  if (
    normalizedTitle ===
    normalizedQuery
  ) {
    score += 1000;
  } else if (
    normalizedTitle.startsWith(
      normalizedQuery,
    )
  ) {
    score += 700;
  } else if (
    normalizedTitle.includes(
      normalizedQuery,
    )
  ) {
    score += 500;
  }

  if (
    normalizedSubtitle.startsWith(
      normalizedQuery,
    )
  ) {
    score += 250;
  } else if (
    normalizedSubtitle.includes(
      normalizedQuery,
    )
  ) {
    score += 150;
  }

  if (
    searchableText.includes(
      normalizedQuery,
    )
  ) {
    score += 100;
  }

  if (result.type === "PLAYER") {
    score += 30;
  }

  if (result.type === "ARTIFACT") {
    score += 20;
  }

  if (result.type === "BRAND") {
    score += 10;
  }

  return score;
}

function sortSearchResults(
  results: MuseumSearchResult[],
  query: string,
): MuseumSearchResult[] {
  return [...results].sort(
    (first, second) => {
      const scoreDifference =
        getSearchScore(
          second,
          query,
        ) -
        getSearchScore(
          first,
          query,
        );

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return first.title.localeCompare(
        second.title,
      );
    },
  );
}

export async function searchMuseum(
  rawQuery: string,
  options: MuseumSearchOptions = {},
): Promise<MuseumSearchResponse> {
  const query =
    normalizeQuery(
      rawQuery,
    );

  if (query.length < 2) {
    return {
      query,
      results: [],
      total: 0,
    };
  }

  const limitPerType =
    normalizeLimit(
      options.limitPerType,
      DEFAULT_LIMIT_PER_TYPE,
      12,
    );

  const totalLimit =
    normalizeLimit(
      options.totalLimit,
      DEFAULT_TOTAL_LIMIT,
      30,
    );

  const [
    players,
    artifacts,
    brands,
  ] = await Promise.all([
    searchPlayers(
      query,
      limitPerType,
    ),

    searchPublishedArtifacts(
      query,
      limitPerType,
    ),

    searchBrands(
      query,
      limitPerType,
    ),
  ]);

  const playerResults:
    MuseumSearchResult[] =
    players.map(
      (player) => ({
        id: player.id,
        type: "PLAYER",
        title: player.name,
        subtitle:
          player.country
            ? `Player · ${player.country}`
            : "Player",
        href:
          `/players/${player.slug}`,
        imageUrl:
          player.portraitImage ??
          player.heroImage ??
          null,
        keywords: [
          player.slug,
          player.country ?? "",
          player.firstName ?? "",
          player.lastName ?? "",
          player.nickname ?? "",
          player.atpPlayer?.name ?? "",
        ].filter(Boolean),
      }),
    );

  const artifactResults:
    MuseumSearchResult[] =
    artifacts.map(
      (artifact) => {
        const context = [
          artifact.player.name,
          artifact.brand.name,
          artifact.year?.toString(),
          artifact.tournament,
        ]
          .filter(Boolean)
          .join(" · ");

        return {
          id: artifact.id,
          type: "ARTIFACT",
          title: artifact.title,
          subtitle:
            artifact.subtitle?.trim() ||
            context ||
            "Museum artifact",
          href:
            `/artifacts/${artifact.slug}`,
          imageUrl:
            artifact.images[0]?.url ??
            null,
          keywords: [
            artifact.slug,
            artifact.archiveNumber,
            artifact.player.name,
            artifact.brand.name,
            artifact.tournament ?? "",
            artifact.collection ?? "",
            artifact.year?.toString() ??
              "",
          ].filter(Boolean),
        };
      },
    );

  const brandResults:
    MuseumSearchResult[] =
    brands.map(
      (brand) => ({
        id: brand.id,
        type: "BRAND",
        title: brand.name,
        subtitle:
          "Tennis brand",
        href: "/brands",
        imageUrl:
          brand.logo ?? null,
        keywords: [
          brand.slug,
        ],
      }),
    );

  const results =
    sortSearchResults(
      [
        ...playerResults,
        ...artifactResults,
        ...brandResults,
      ],
      query,
    ).slice(
      0,
      totalLimit,
    );

  return {
    query,
    results,
    total: results.length,
  };
}