import type { Metadata } from "next";

import ShopExperience from "@/components/shop/ShopExperience";

import {
  mapArtifactsToProducts,
} from "@/lib/mappers/artifact.mapper";

import {
  getPublishedArtifacts,
} from "@/lib/repositories/artifact.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | AGE202",
  description:
    "Explore collectible tennis apparel and authenticated archive pieces curated by AGE202.",
};

export default async function ShopPage() {
  const artifacts =
    await getPublishedArtifacts();

  const products =
    mapArtifactsToProducts(
      artifacts,
    );

  return (
    <ShopExperience
      products={products}
    />
  );
}
