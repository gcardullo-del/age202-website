import type { Product } from "@/data/product.types";
import { filterProducts } from "@/lib/archive/filters";
import { searchProducts } from "@/lib/archive/searching";
import { sortProducts } from "@/lib/archive/sorting";
import type {
  ArchiveFilters,
  ArchiveResult,
  ArchiveSort,
} from "@/lib/archive/types";

type RunArchiveEngineOptions = {
  products: Product[];
  query: string;
  filters: ArchiveFilters;
  sort: ArchiveSort;
};

export function runArchiveEngine({
  products,
  query,
  filters,
  sort,
}: RunArchiveEngineOptions): ArchiveResult {
  const searchedProducts = searchProducts(
    products,
    query
  );

  const filteredProducts = filterProducts(
    searchedProducts,
    filters
  );

  const sortedProducts = sortProducts(
    filteredProducts,
    sort
  );

  return {
    products: sortedProducts,
    total: sortedProducts.length,
  };
}