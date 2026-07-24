import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";

type FeaturedArchiveProps = {
  product: Product;
};

const playerNames: Record<Product["player"], string> = {
  federer: "Roger Federer",
  nadal: "Rafael Nadal",
  djokovic: "Novak Djokovic",
  sinner: "Jannik Sinner",
  alcaraz: "Carlos Alcaraz",
};

export default function FeaturedArchive({
  product,
}: FeaturedArchiveProps) {
  const playerName = playerNames[product.player];

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8FF00]/5 blur-[180px]" />

      <div className="relative mx-auto grid max-w-[1700px] gap-14 px-6 py-20 md:px-10 md:py-28 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
        {/* COPY */}

        <div className="relative z-10">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white"
          >
            ← Back to AGE202
          </Link>

          <p className="mt-14 text-sm font-black uppercase tracking-[0.4em] text-[#C8FF00]">
            Digital Museum Database
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl md:text-7xl xl:text-8xl">
            Explore tennis
            <br />
            history.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl">
            Search the AGE202 archive by player, tournament, brand,
            collection and year.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ArchiveLabel label="Curated pieces" />
            <ArchiveLabel label="Verified records" />
            <ArchiveLabel label="Tennis heritage" />
          </div>
        </div>

        {/* FEATURED CARD */}

        <Link
          href={`/product/${product.id}`}
          className="group relative min-h-[560px] overflow-hidden rounded-[44px] border border-white/10 bg-[#111B2E] shadow-2xl md:min-h-[680px]"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 58vw"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/30 via-transparent to-transparent" />

          <div className="absolute left-6 top-6 z-10 md:left-9 md:top-9">
            <span className="inline-flex items-center gap-3 rounded-full border border-[#C8FF00]/30 bg-[#050B18]/70 px-5 py-3 backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C8FF00] shadow-[0_0_16px_rgba(200,255,0,.8)]" />

              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C8FF00]">
                Featured Archive
              </span>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-7 md:p-10 xl:p-12">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              {playerName}
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              {product.title}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold uppercase tracking-[0.18em] text-gray-300">
              <span>{product.tournament}</span>
              <span className="h-1 w-1 rounded-full bg-[#C8FF00]" />
              <span>{product.year}</span>
              <span className="h-1 w-1 rounded-full bg-[#C8FF00]" />
              <span>{product.brand}</span>
            </div>

            <div className="mt-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors group-hover:text-[#C8FF00]">
              View the archive
              <span className="transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#C8FF00]/0 blur-[100px] transition-all duration-700 group-hover:bg-[#C8FF00]/10" />
        </Link>
      </div>
    </section>
  );
}

function ArchiveLabel({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
      {label}
    </span>
  );
}