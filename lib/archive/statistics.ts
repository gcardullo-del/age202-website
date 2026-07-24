import type { Product } from "@/data/product.types";
import type { ArchiveStatistics } from "@/lib/archive/types";

export function getArchiveStatistics(
  products: Product[]
): ArchiveStatistics {
  return {
    total: products.length,

    available: products.filter(
      (product) => product.status === "available"
    ).length,

    sold: products.filter(
      (product) => product.status === "sold"
    ).length,

    comingSoon: products.filter(
      (product) => product.status === "coming-soon"
    ).length,

    featured: products.filter(
      (product) => product.featured
    ).length,

    authentic: products.filter(
      (product) => product.authentic
    ).length,
  };
}