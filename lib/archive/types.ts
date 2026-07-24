import type {
  Product,
  ProductCategory,
  ProductStatus,
} from "@/data/product.types";

export type ArchiveSort =
  | "newest"
  | "oldest"
  | "player-az"
  | "player-za"
  | "title-az";

export type ArchiveFilters = {
  player: string;
  tournament: string;
  year: string;
  brand: string;
  category: ProductCategory | "";
  status: ProductStatus | "";
};

export type ArchiveFilterOptions = {
  players: string[];
  tournaments: string[];
  years: number[];
  brands: string[];
  categories: ProductCategory[];
  statuses: ProductStatus[];
};

export type ArchiveStatistics = {
  total: number;
  available: number;
  sold: number;
  comingSoon: number;
  featured: number;
  authentic: number;
};

export type ArchiveResult = {
  products: Product[];
  total: number;
};