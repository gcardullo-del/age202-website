"use client";
<section
  id="latest-arrivals"
  className="bg-[#08101F] py-28"
></section>
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function LatestArrivals() {
  return (
    <section className="bg-[#08101F] py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
          NEW ARRIVALS
        </span>

        <h2 className="mt-4 text-5xl font-black text-white">
          Latest Arrivals
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          The newest additions to the AGE202 archive. Authentic tennis apparel
          selected for collectors and enthusiasts.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
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