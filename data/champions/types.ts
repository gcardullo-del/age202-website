export type CareerEvent = {
  year: number;
  title: string;
  description: string;
};

export type TrophyStats = {
  grandSlams: number;
  atpTitles: number;
  weeksAtNo1: number;
  masters1000: number;
  olympicGold?: number;
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

  accent: string;

  trophies: TrophyStats;

  careerTimeline: CareerEvent[];

  legacy: string;

  certificateId: string;
};