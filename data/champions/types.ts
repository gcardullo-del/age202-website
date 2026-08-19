export type CareerEvent = {
  year: number;
  title: string;
  description: string;
};

export type TrophyStats = {
  /*
   * Core career records
   */
  grandSlams: number;
  atpTitles: number;
  weeksAtNo1: number;
  masters1000: number;

  /*
   * Grand Slam breakdown
   */
  australianOpen?: number;
  rolandGarros?: number;
  wimbledon?: number;
  usOpen?: number;

  /*
   * ATP Tour breakdown
   */
  atp500?: number;
  atp250?: number;
  atpFinals?: number;

  /*
   * Olympic record
   *
   * olympicGold is retained for backwards compatibility
   * with existing Champion data.
   */
  olympicGold?: number;
  olympicSinglesGold?: number;
  olympicDoublesGold?: number;
};

export type Champion = {
  id: string;

  slug: string;

  name: string;

  firstName: string;

  lastName: string;

  nickname: string;

  nationality: string;

  debutYear: number;

  mainBrand: string;

  archivePieces: number;

  description: string;

  quote: string;

  image: string;

  signatureImage?: string;

  accent: string;

  trophies: TrophyStats;

  careerTimeline: CareerEvent[];

  legacy: string;

  certificateId: string;
};