import type { Product } from "@/data/product.types";
import type {
  ArchiveFilterOptions,
  ArchiveFilters,
} from "@/lib/archive/types";

export const initialArchiveFilters: ArchiveFilters = {
  player: "",
  tournament: "",
  year: "",
  brand: "",
  category: "",
  status: "",
};

export function filterProducts(
  products: Product[],
  filters: ArchiveFilters
): Product[] {
  return products.filter((product) => {
    const matchesPlayer =
      !filters.player ||
      product.player === filters.player;

    const matchesTournament =
      !filters.tournament ||
      product.tournament === filters.tournament;

    const matchesYear =
      !filters.year ||
      product.year === Number(filters.year);

    const matchesBrand =
      !filters.brand ||
      product.brand === filters.brand;

    const matchesCategory =
      !filters.category ||
      product.category === filters.category;

    const matchesStatus =
      !filters.status ||
      product.status === filters.status;

    return (
      matchesPlayer &&
      matchesTournament &&
      matchesYear &&
      matchesBrand &&
      matchesCategory &&
      matchesStatus
    );
  });
}

export function getArchiveFilterOptions(
  products: Product[]
): ArchiveFilterOptions {
  return {
    players: getUniqueTextValues(
      products.map((product) => product.player)
    ),

    tournaments: getUniqueTextValues(
      products.map((product) => product.tournament)
    ),

    years: Array.from(
      new Set(products.map((product) => product.year))
    ).sort((a, b) => b - a),

    brands: getUniqueTextValues(
      products.map((product) => product.brand)
    ),

    categories: Array.from(
      new Set(products.map((product) => product.category))
    ).sort(),

    statuses: Array.from(
      new Set(products.map((product) => product.status))
    ).sort(),
  };
}

export function hasActiveFilters(
  filters: ArchiveFilters
): boolean {
  return Object.values(filters).some(Boolean);
}

function getUniqueTextValues(values: string[]): string[] {
  return Array.from(new Set(values))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}