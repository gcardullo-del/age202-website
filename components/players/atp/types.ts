export type CollectionType =
  | "FEATURED"
  | "LEGEND"
  | "RISING_STAR"
  | "ARCHIVE";

export type AtpArchivePlayer = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  biography: string | null;
  heroImage: string | null;
  portraitImage: string | null;
  collectionType: CollectionType;
  ranking: number | null;
  points: number | null;
  artifactCount: number;
};

export type AtpArchiveExplorerProps = {
  players: AtpArchivePlayer[];
};

export type RankingFilter =
  | "ALL"
  | "TOP_10"
  | "TOP_20"
  | "TOP_50";

export type SortOption =
  | "RANK_ASC"
  | "RANK_DESC"
  | "POINTS_DESC"
  | "ARTIFACTS_DESC"
  | "NAME_ASC";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};