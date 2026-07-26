export type AtpRankingMovement = "up" | "down" | "same" | "new";

export type AtpRankingPlayer = {
  rank: number;
  previousRank: number | null;

  name: string;
  firstName?: string;
  lastName?: string;
  slug?: string;

  country: string;
  countryCode: string;

  points: number;
  age: number | null;

  movement: AtpRankingMovement;
  movementPositions: number;

  imageUrl?: string | null;

  age202Href?: string | null;
  hasAge202Collection: boolean;
};

export type AtpRankingMetadata = {
  source: string;
  rankingType: "singles";
  totalPlayers: number;
  updatedAt: string;
  isLive: boolean;
};

export type AtpRankingResponse = {
  players: AtpRankingPlayer[];
  metadata: AtpRankingMetadata;
};