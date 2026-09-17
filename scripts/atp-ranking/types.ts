export const ATP_RANKING_LIMIT = 100;

/*
 * live-tennis.eu applica Cloudflare alle richieste
 * provenienti dai server GitHub Actions.
 *
 * Il reader restituisce la stessa pagina in formato
 * testuale, permettendo al parser di estrarre la Top 100
 * senza tentare di aggirare la protezione del sito.
 */
export const ATP_LIVE_RANKING_URL =
  "https://r.jina.ai/http://live-tennis.eu/it/classifica-atp-live";

/*
 * Conserviamo il valore già utilizzato da AGE202 per
 * evitare modifiche allo schema o ai record esistenti.
 */
export const ATP_RANKING_SOURCE =
  "ATP_LIVE";


export type AtpLiveRankingEntry = {
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


export type AtpLiveRankingDataset = {
  source: typeof ATP_RANKING_SOURCE;

  sourceUrl: string;

  fetchedAt: Date;

  entries: AtpLiveRankingEntry[];
};


export type AtpRankingValidationResult = {
  valid: boolean;

  errors: string[];

  warnings: string[];
};


export type AtpRankingExistingPlayer = {
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


export type AtpRankingSyncMatch = {
  incoming: AtpLiveRankingEntry;

  existing:
    | AtpRankingExistingPlayer
    | null;

  matchStrategy:
    | "profile-slug"
    | "slug"
    | "name"
    | "unmatched";
};


export type AtpRankingSyncSummary = {
  fetched: number;

  validated: number;

  matched: number;

  updated: number;

  created: number;

  deactivated: number;

  skipped: number;

  rankingDate: Date;
};
