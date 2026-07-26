import type { Metadata } from "next";
import ShopExperience from "@/components/shop/ShopExperience";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop | AGE202",
  description:
    "Explore collectible tennis apparel and authenticated archive pieces curated by AGE202.",
};

export default function ShopPage() {
  return <ShopExperience products={products} />;
}
