import type { Product } from "@/data/product.types";
import ArchiveCard from "./ArchiveCard";
import EmptyState from "./EmptyState";

type ArchiveGridProps = {
  products: Product[];
};

export default function ArchiveGrid({
  products,
}: ArchiveGridProps) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ArchiveCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}