import type { Product } from "@/data/product.types";
import type { ArchiveSort } from "@/lib/archive/types";

export function sortProducts(
  products: Product[],
  sort: ArchiveSort
): Product[] {
  const sortedProducts = [...products];

  switch (sort) {
    case "oldest":
      return sortedProducts.sort(
        (a, b) => a.year - b.year
      );

    case "player-az":
      return sortedProducts.sort((a, b) =>
        a.player.localeCompare(b.player)
      );

    case "player-za":
      return sortedProducts.sort((a, b) =>
        b.player.localeCompare(a.player)
      );

    case "title-az":
      return sortedProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    case "newest":
    default:
      return sortedProducts.sort(
        (a, b) => b.year - a.year
      );
  }
}