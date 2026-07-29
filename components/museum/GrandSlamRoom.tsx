import Link from "next/link";

import type { Product } from "@/data/products";
import {
  grandSlams,
  productMatchesGrandSlam,
  type GrandSlam,
} from "@/data/grandSlams";

type GrandSlamRoomProps = {
  products: Product[];
  className?: string;
};

export default function GrandSlamRoom({
  products,
  className = "",
}: GrandSlamRoomProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[42px] border border-white/10 bg-[#07101F] ${className}`}
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C8FF00]/[0.05] blur-[150px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-blue-500/[0.05] blur-[160px]" />

      {/* HEADER */}

      <div className="relative border-b border-white/10 px-6 py-10 md:px-10 md:py-14 xl:px-14">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8FF00] md:text-xs">
              AGE202 Grand Slam Wing
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-6xl">
              Four tournaments.
              <span className="block text-gray-500">
                One archive of history.
              </span>
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-8 text-gray-400">
              Enter the four most prestigious rooms of the AGE202 Digital
              Museum and explore garments connected to the defining stages of
              tennis history.
            </p>
          </div>

          <Link
            href="/results/grand-slams"
            className="inline-flex items-center justify-center gap-3 self-start rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#C8FF00]/50 hover:text-[#C8FF00] xl:self-auto"
          >
            View all rooms
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* GRAND SLAM GRID */}

      <div className="relative grid lg:grid-cols-2">
        {grandSlams.map((grandSlam, index) => {
          const matchingProducts = products.filter((product) =>
            productMatchesGrandSlam(product, grandSlam),
          );

          return (
            <GrandSlamCard
              key={grandSlam.slug}
              grandSlam={grandSlam}
              pieces={matchingProducts.length}
              index={index + 1}
            />
          );
        })}
      </div>
    </section>
  );
}

type GrandSlamCardProps = {
  grandSlam: GrandSlam;
  pieces: number;
  index: number;
};

function GrandSlamCard({
  grandSlam,
  pieces,
  index,
}: GrandSlamCardProps) {
  return (
    <Link
      href={`/results/grand-slams/${grandSlam.slug}`}
      className="group relative min-h-[480px] overflow-hidden border-b border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.025] md:p-10 lg:border-r lg:[&:nth-child(even)]:border-r-0 lg:[&:nth-child(n+3)]:border-b-0"
    >
      {/* GLOW */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C8FF00]/0 blur-[110px] transition-all duration-700 group-hover:bg-[#C8FF00]/[0.08]" />

      {/* LARGE LETTERS */}

      <p className="pointer-events-none absolute bottom-[-25px] right-2 text-[150px] font-black leading-none tracking-[-0.1em] text-white/[0.025] transition-all duration-700 group-hover:-translate-y-3 group-hover:text-white/[0.05] md:text-[210px]">
        {grandSlam.shortName}
      </p>

      <div className="relative flex h-full min-h-[410px] flex-col justify-between">
        {/* TOP */}

        <div className="flex items-start justify-between gap-6">
          <p className="text-[10px] font-black tracking-[0.3em] text-gray-700 transition-colors duration-300 group-hover:text-[#C8FF00]">
            {String(index).padStart(2, "0")}
          </p>

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#050B18]/60 text-xl text-white backdrop-blur-xl transition-all duration-500 group-hover:rotate-[-10deg] group-hover:border-[#C8FF00] group-hover:bg-[#C8FF00] group-hover:text-black">
            →
          </div>
        </div>

        {/* CONTENT */}

        <div className="relative mt-16">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#C8FF00]">
            {grandSlam.city} · {grandSlam.country}
          </p>

          <h3 className="mt-5 max-w-xl text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            {grandSlam.name}
          </h3>

          <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500 md:text-base md:leading-8">
            {grandSlam.archiveDescription}
          </p>

          {/* DETAILS */}

          <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
            <GrandSlamDetail
              label="Surface"
              value={grandSlam.surface}
            />

            <GrandSlamDetail
              label="Season"
              value={grandSlam.season}
            />

            <GrandSlamDetail
              label="Archive"
              value={`${pieces} ${pieces === 1 ? "piece" : "pieces"}`}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8FF00] transition-all duration-700 group-hover:w-full" />
    </Link>
  );
}

function GrandSlamDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold leading-5 text-gray-300 md:text-sm">
        {value}
      </p>
    </div>
  );
}