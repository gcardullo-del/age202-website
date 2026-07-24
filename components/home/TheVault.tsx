import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

const rareProducts = products.filter(
  (product) =>
    product.rarity === "legendary" ||
    product.rarity === "rare",
);

export default function TheVault() {
  if (rareProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="the-vault-heading"
      className="border-y border-white/10 bg-[#08101F] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-14 max-w-3xl lg:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C8FF00]">
            The Vault
          </p>

          <h2
            id="the-vault-heading"
            className="mt-5 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl"
          >
            Collector&apos;s pieces
            <span className="block text-white/25">
              from the Legendary Archive.
            </span>
          </h2>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
            A curated selection of the rarest and most iconic pieces preserved
            in the AGE202 Digital Archive.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {rareProducts.map((product) => (
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