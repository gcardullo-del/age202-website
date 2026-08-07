export type PlayerDashboardProfile = {
  careerHigh: number | null;
  atpTitles: number;
  grandSlams: number;
  masters1000: number;
};

export type PlayerDashboardRanking = {
  rank: number;
  previousRank: number | null;
  points: number | null;
  country: string;
  countryCode: string;
  imageUrl: string | null;
};

export type PlayerDashboardCareerEvent = {
  id: string;
  year: number;
  month: number | null;
  day: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string;
  imageUrl: string | null;
  location: string | null;
  tournament: string | null;
  featured: boolean;
  sortOrder: number;
};

export type PlayerDashboardStats = {
  artifacts: number;
  collections: number;
  careerEvents: number;
};

export type PlayerDashboardData = {
  id: string;
  name: string;
  slug: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  country: string | null;
  quote: string | null;
  biography: string | null;
  heroImage: string | null;
  portraitImage: string | null;
  accent: string;
  active: boolean;
  collectionType:
    | "FEATURED"
    | "LEGEND"
    | "RISING_STAR"
    | "ARCHIVE";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile: PlayerDashboardProfile | null;
  ranking: PlayerDashboardRanking | null;
  careerEvents: PlayerDashboardCareerEvent[];
  stats: PlayerDashboardStats;
};