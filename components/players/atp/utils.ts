import {
  RankingFilter,
  SortOption,
  SelectOption,
} from "./types";

export const sortOptions: SelectOption<SortOption>[] = [
  {
    value: "RANK_ASC",
    label: "Ranking: highest",
  },
  {
    value: "RANK_DESC",
    label: "Ranking: lowest",
  },
  {
    value: "POINTS_DESC",
    label: "Most ATP points",
  },
  {
    value: "ARTIFACTS_DESC",
    label: "Most artifacts",
  },
  {
    value: "NAME_ASC",
    label: "Name A–Z",
  },
];

export const rankingFilters: SelectOption<RankingFilter>[] = [
  {
    value: "ALL",
    label: "All players",
  },
  {
    value: "TOP_10",
    label: "Top 10",
  },
  {
    value: "TOP_20",
    label: "Top 20",
  },
  {
    value: "TOP_50",
    label: "Top 50",
  },
];

export function matchesRanking(
  ranking: number | null,
  filter: RankingFilter,
): boolean {
  if (ranking === null) return false;

  switch (filter) {
    case "TOP_10":
      return ranking <= 10;

    case "TOP_20":
      return ranking <= 20;

    case "TOP_50":
      return ranking <= 50;

    default:
      return true;
  }
}

export function formatPoints(
  points: number | null,
): string {
  if (points === null) {
    return "Points unavailable";
  }

  return `${new Intl.NumberFormat("it-IT").format(
    points,
  )} points`;
}

export function getCollectionLabel(
  collectionType: string,
): string {
  return collectionType === "FEATURED"
    ? "Champion Collection"
    : collectionType.replaceAll("_", " ");
}