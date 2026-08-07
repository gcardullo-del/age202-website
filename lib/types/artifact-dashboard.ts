export type ArtifactDashboardPlayer = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  heroImage: string | null;
  portraitImage: string | null;
};

export type ArtifactDashboardBrand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export type ArtifactDashboardImage = {
  id: string;
  url: string;
  alt: string | null;
  isCover: boolean;
  sortOrder: number;
};

export type ArtifactDashboardCertificate = {
  id: string;
  code: string;
  verified: boolean;
  issuedAt: Date;
};

export type ArtifactDashboardData = {
  id: string;
  archiveNumber: string;
  title: string;
  subtitle: string | null;
  slug: string;

  description: string | null;
  museumStory: string | null;
  historicalContext: string | null;
  curatorNote: string | null;

  year: number | null;
  season: string | null;
  tournament: string | null;
  collection: string | null;
  edition: string | null;

  category:
    | "SHIRT"
    | "POLO"
    | "JACKET"
    | "SHORTS"
    | "SHOES"
    | "CAP"
    | "ACCESSORY"
    | null;

  rarity:
    | "COMMON"
    | "RARE"
    | "VERY_RARE"
    | "LEGENDARY";

  condition:
    | "MINT"
    | "EXCELLENT"
    | "VERY_GOOD"
    | "GOOD"
    | "FAIR";

  availability:
    | "AVAILABLE"
    | "SOLD"
    | "COMING_SOON"
    | "NOT_FOR_SALE";

  status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";

  size: string | null;
  colour: string | null;
  material: string | null;

  authentic: boolean;
  authenticityCode: string | null;
  vintage: boolean;
  featured: boolean;
  tags: string[];

  price: string | null;
  currency: string;
  vintedUrl: string | null;

  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  player: ArtifactDashboardPlayer;
  brand: ArtifactDashboardBrand;
  images: ArtifactDashboardImage[];
  certificate: ArtifactDashboardCertificate | null;

  stats: {
    imageCount: number;
    hasCertificate: boolean;
    storyBlocks: number;
  };
};