export type RankingMovement =
  | "UP"
  | "DOWN"
  | "SAME"
  | "NEW"
  | null;

export type RankingPlayer = {
  id: string;
  rank: number;
  previousRank: number | null;
  movement: RankingMovement;
  movementValue: number;
  name: string;
  slug: string | null;
  country: string | null;
  countryCode: string | null;
  age: number | null;
  points: number;
  tournamentsPlayed: number | null;
  imageUrl: string | null;
  hasProfile: boolean;
  availableArtifacts: number;
  totalArtifacts: number;
};

export type RankingSort =
  | "ranking"
  | "points-desc"
  | "points-asc"
  | "name-asc"
  | "name-desc";

export type RankingFiltersState = {
  query: string;
  country: string;
  sort: RankingSort;
};

export type RankingSummary = {
  totalPlayers: number;
  totalCountries: number;
  playersWithProfiles: number;
  playersWithAvailableArtifacts: number;
  lastUpdated: string | null;
};