import type { Product } from "@/data/products";

export type MuseumStats = {
  totalPieces: number;
  availablePieces: number;
  archivedPieces: number;
  availabilityPercentage: number;
  players: number;
  brands: number;
  collections: number;
  tournaments: number;
  grandSlamPieces: number;
  oldestYear: number | null;
  newestYear: number | null;
};

const GRAND_SLAM_KEYWORDS = [
  "australian open",
  "roland garros",
  "french open",
  "wimbledon",
  "us open",
  "u.s. open",
];

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function countUniqueValues(values: Array<string | null | undefined>) {
  return new Set(
    values
      .map((value) => normalizeValue(value))
      .filter(Boolean)
  ).size;
}

function isGrandSlamProduct(product: Product) {
  const tournament = normalizeValue(product.tournament);
  const collection = normalizeValue(product.collection);
  const title = normalizeValue(product.title);

  const searchableText = [
    tournament,
    collection,
    title,
  ].join(" ");

  return GRAND_SLAM_KEYWORDS.some((keyword) =>
    searchableText.includes(keyword)
  );
}

export function getMuseumStats(
  products: Product[]
): MuseumStats {
  const totalPieces = products.length;

  const availablePieces = products.filter(
    (product) => product.available
  ).length;

  const archivedPieces =
    totalPieces - availablePieces;

  const availabilityPercentage =
    totalPieces === 0
      ? 0
      : Math.round(
          (availablePieces / totalPieces) * 100
        );

  const validYears = products
    .map((product) => product.year)
    .filter(
      (year): year is number =>
        typeof year === "number" &&
        Number.isFinite(year)
    )
    .sort((a, b) => a - b);

  return {
    totalPieces,
    availablePieces,
    archivedPieces,
    availabilityPercentage,

    players: countUniqueValues(
      products.map((product) => product.player)
    ),

    brands: countUniqueValues(
      products.map((product) => product.brand)
    ),

    collections: countUniqueValues(
      products.map((product) => product.collection)
    ),

    tournaments: countUniqueValues(
      products.map((product) => product.tournament)
    ),

    grandSlamPieces: products.filter(
      isGrandSlamProduct
    ).length,

    oldestYear:
      validYears.length > 0
        ? validYears[0]
        : null,

    newestYear:
      validYears.length > 0
        ? validYears[validYears.length - 1]
        : null,
  };
}