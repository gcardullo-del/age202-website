export type ProductStatus =
  | "available"
  | "sold"
  | "coming-soon";

export type ProductCategory =
  | "shirt"
  | "polo"
  | "jacket"
  | "shorts"
  | "shoes"
  | "cap"
  | "accessory";

export type ProductRarity =
  | "common"
  | "rare"
  | "very-rare"
  | "legendary";

export interface Product {
  id: string;
  slug: string;
  title: string;

  player: string;
  tournament: string;
  year: number;
  brand: string;

  category: ProductCategory;
  collection: string;

  description: string;
  museumStory: string;

  // Legacy museum fields used by existing AGE202 components
  story: string;
  historicalContext: string;
  curatorNote: string;

  size: string;
  color: string;
  condition: string;

  status: ProductStatus;
  available: boolean;
  authentic: boolean;
  featured: boolean;
  vintage: boolean;

  rarity: ProductRarity;
  archiveNumber: string;
  authenticityCode: string;

  price: number | null;
  vintedUrl: string | null;

  image: string;
  images: string[];
  gallery: string[];

  tags: string[];
}