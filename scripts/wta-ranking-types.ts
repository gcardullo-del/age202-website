export const WTA_RANKING_LIMIT = 100;

export const WTA_LIVE_RANKING_URL =
  "https://www.wtatennis.com/rankings/singles";

export const WTA_RANKING_SOURCE =
  "WTA_LIVE";


export type WtaLiveRankingEntry = {
  rank: number;

  name: string;

  firstName: string | null;

  lastName: string | null;

  country: string | null;

  countryCode: string | null;

  age: number | null;

  points: number;

  rankMovement: number | null;

  profileHref: string | null;

  profileSlug: string | null;
};


export type WtaLiveRankingDataset = {
  source: typeof WTA_RANKING_SOURCE;

  sourceUrl: string;

  fetchedAt: Date;

  entries: WtaLiveRankingEntry[];
};


export type WtaRankingValidationResult = {
  valid: boolean;

  errors: string[];

  warnings: string[];
};


export type WtaRankingExistingPlayer = {
  id: string;

  rank: number;

  previousRank: number | null;

  name: string;

  firstName: string | null;

  lastName: string | null;

  slug: string;

  country: string;

  countryCode: string;

  points: number | null;

  age: number | null;

  imageUrl: string | null;

  playerId: string | null;

  active: boolean;
};


export type WtaRankingSyncMatch = {
  incoming: WtaLiveRankingEntry;

  existing:
    | WtaRankingExistingPlayer
    | null;

  matchStrategy:
    | "profile-slug"
    | "slug"
    | "name"
    | "unmatched";
};


export type WtaRankingSyncSummary = {
  fetched: number;

  validated: number;

  matched: number;

  updated: number;

  created: number;

  deactivated: number;

  skipped: number;

  rankingDate: Date;
};