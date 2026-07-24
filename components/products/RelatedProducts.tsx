import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
  currentProductId: string;
  player: Product["player"];
};

export default function RelatedProducts({
  products,
  currentProductId,
  player,
}: Props) {
  const relatedProducts = products
    .filter(
      (product) =>
        product.id !== currentProductId &&
        product.player === player
    )
    .slice(0, 3);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-white/10 bg-[#050B18] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#C8FF00]">
              Related Archive Pieces
            </p>

            <h2 className="mt-5 text-4xl font-black text-white md:text-6xl">
              Explore the collection.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Discover other documented pieces connected to the same player
              archive.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              player={product.player}
              brand={product.brand}
              title={product.title}
              tournament={product.tournament}
              year={product.year}
              price={product.price}
              available={product.available}
            />
          ))}
        </div>
      </div>
    </section>
  );
}