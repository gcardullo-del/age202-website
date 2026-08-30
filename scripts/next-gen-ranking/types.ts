export const NEXT_GEN_RANKING_SOURCE =
  "ATP_PLAYER_PROFILE";


export type NextGenRankingPlayer = {
  /*
   * Identificatore stabile interno AGE202.
   *
   * Esempio:
   * moise-kouame
   */
  id: string;

  /*
   * Nome visualizzato nel museo.
   */
  name: string;

  /*
   * URL/profilo ATP.
   *
   * Verrà verificato prima di essere
   * inserito nel registry definitivo.
   */
  atpProfileUrl: string;

  /*
   * Permette di sospendere un giocatore
   * senza eliminarlo dall'archivio.
   */
  active: boolean;
};


export type NextGenRankingResult = {
  playerId: string;

  name: string;

  ranking: number | null;

  source:
    typeof NEXT_GEN_RANKING_SOURCE;

  sourceUrl: string;

  fetchedAt: Date;

  success: boolean;

  error: string | null;
};


export type NextGenRankingDataset = {
  source:
    typeof NEXT_GEN_RANKING_SOURCE;

  fetchedAt: Date;

  players:
    NextGenRankingResult[];
};


export type NextGenRankingSyncSummary = {
  requested: number;

  successful: number;

  failed: number;

  ranked: number;

  unranked: number;

  fetchedAt: Date;
};