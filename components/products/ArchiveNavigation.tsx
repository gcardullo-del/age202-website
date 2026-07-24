import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
  currentProductId: string;
};

export default function ArchiveNavigation({
  products,
  currentProductId,
}: Props) {
  const currentIndex = products.findIndex(
    (product) => product.id === currentProductId
  );

  if (currentIndex === -1 || products.length < 2) {
    return null;
  }

  const previousProduct =
    currentIndex > 0
      ? products[currentIndex - 1]
      : products[products.length - 1];

  const nextProduct =
    currentIndex < products.length - 1
      ? products[currentIndex + 1]
      : products[0];

  return (
    <section className="border-t border-white/10 bg-[#08101F]">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <Link
          href={`/product/${previousProduct.id}`}
          className="group relative overflow-hidden border-b border-white/10 px-6 py-12 transition-colors hover:bg-white/[0.03] md:border-b-0 md:border-r md:px-10 md:py-16"
        >
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 transition-colors group-hover:text-[#C8FF00]">
              ← Previous Archive
            </p>

            <h3 className="mt-5 max-w-lg text-2xl font-black leading-tight text-white md:text-3xl">
              {previousProduct.title}
            </h3>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              {previousProduct.brand} · {previousProduct.year}
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#C8FF00]/0 blur-[90px] transition-all duration-500 group-hover:bg-[#C8FF00]/10" />
        </Link>

        <Link
          href={`/product/${nextProduct.id}`}
          className="group relative overflow-hidden px-6 py-12 text-left transition-colors hover:bg-white/[0.03] md:px-10 md:py-16 md:text-right"
        >
          <div className="relative z-10 md:ml-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 transition-colors group-hover:text-[#C8FF00]">
              Next Archive →
            </p>

            <h3 className="mt-5 max-w-lg text-2xl font-black leading-tight text-white md:text-3xl">
              {nextProduct.title}
            </h3>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              {nextProduct.brand} · {nextProduct.year}
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#C8FF00]/0 blur-[90px] transition-all duration-500 group-hover:bg-[#C8FF00]/10" />
        </Link>
      </div>
    </section>
  );
}