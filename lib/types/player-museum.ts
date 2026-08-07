export type PlayerMuseumProfile = {
  birthDate: Date | null;
  birthPlace: string | null;
  residence: string | null;

  height: number | null;
  weight: number | null;

  plays: string | null;
  backhand: string | null;
  coach: string | null;

  turnedPro: number | null;
  careerHigh: number | null;

  atpTitles: number;
  australianOpen: number;
  rolandGarros: number;
  wimbledon: number;
  usOpen: number;
  grandSlams: number;
  masters1000: number;
  atpFinals: number;
  olympicGold: number;
  davisCup: number;

  prizeMoney: string | null;

  playingStyle: string | null;
  favouriteSurface: string | null;

  biographyShort: string | null;
  biographyLong: string | null;
};

export type PlayerMuseumRanking = {
  rank: number;
  previousRank: number | null;
  points: number | null;
  country: string;
  countryCode: string;
  imageUrl: string | null;
};

export type PlayerMuseumCareerEvent = {
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

export type PlayerMuseumEquipmentCategory =
  | "RACQUET"
  | "STRINGS"
  | "SHOES"
  | "APPAREL"
  | "BAG"
  | "ACCESSORY"
  | "OTHER";

export type PlayerMuseumEquipment = {
  id: string;
  category: PlayerMuseumEquipmentCategory;
  name: string;
  brand: string | null;
  period: string | null;
  description: string | null;
  curiosity: string | null;
  imageUrl: string | null;
  featured: boolean;
  sortOrder: number;
};

export type PlayerMuseumArtifactImage = {
  id: string;
  url: string;
  alt: string | null;
  isCover: boolean;
  sortOrder: number;
};

export type PlayerMuseumArtifact = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  availability: string;
  vintedUrl: string | null;
  price: string | null;
  currency: string;
  brand: {
    name: string;
  };
  images: PlayerMuseumArtifactImage[];
};

export type PlayerMuseumData = {
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

  collectionType:
    | "FEATURED"
    | "LEGEND"
    | "RISING_STAR"
    | "ARCHIVE";

  profile: PlayerMuseumProfile | null;
  ranking: PlayerMuseumRanking | null;
  careerEvents: PlayerMuseumCareerEvent[];
  equipment: PlayerMuseumEquipment[];
  artifacts: PlayerMuseumArtifact[];
};