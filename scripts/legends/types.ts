export type LegendImportMilestone = {
  year: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
};

export type LegendImportImage = {
  url: string;
  alt?: string | null;
  caption?: string | null;
  sortOrder?: number;
};

export type LegendImportProfile = {
  name: string;
  slug: string;
  gender: "MALE" | "FEMALE";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  firstName?: string | null;
  lastName?: string | null;
  nickname?: string | null;
  nationality?: string | null;
  countryCode?: string | null;
  birthDate?: Date | null;
  birthPlace?: string | null;
  deathDate?: Date | null;
  era?: string | null;
  turnedPro?: number | null;
  retiredYear?: number | null;
  plays?: string | null;
  backhand?: string | null;

  heroImage?: string | null;
  portraitImage?: string | null;
  quote?: string | null;
  biographyShort?: string | null;
  biographyLong?: string | null;
  legacy?: string | null;

  careerHigh?: number | null;
  careerTitles?: number;
  grandSlams?: number;
  australianOpen?: number;
  rolandGarros?: number;
  wimbledon?: number;
  usOpen?: number;
  weeksAtNo1?: number;
  yearEndNo1?: number;
  olympicGold?: number;

  displayOrder?: number;
  featured?: boolean;
  publishedAt?: Date | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  openGraphImage?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;

  milestones?: LegendImportMilestone[];
  images?: LegendImportImage[];
};
