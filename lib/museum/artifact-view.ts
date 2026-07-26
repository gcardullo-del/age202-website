import type { Product } from "@/data/product.types";

export type MuseumArtifactView = {
  identity: {
    archiveNumber: string;
    authenticityCode: string;
    title: string;
    player: string;
  };
  classification: {
    year: number;
    tournament: string;
    brand: string;
    category: string;
    collection: string;
    rarity: Product["rarity"];
  };
  preservation: {
    condition: string;
    authentic: boolean;
    vintage: boolean;
    status: Product["status"];
  };
};

export function createMuseumArtifactView(
  product: Product,
): MuseumArtifactView {
  return {
    identity: {
      archiveNumber: product.archiveNumber,
      authenticityCode: product.authenticityCode,
      title: product.title,
      player: product.player,
    },
    classification: {
      year: product.year,
      tournament: product.tournament,
      brand: product.brand,
      category: product.category,
      collection: product.collection,
      rarity: product.rarity,
    },
    preservation: {
      condition: product.condition,
      authentic: product.authentic,
      vintage: product.vintage,
      status: product.status,
    },
  };
}
