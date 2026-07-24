import type { Metadata } from "next";

import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import ArchiveExplorer from "@/components/archive/ArchiveExplorer";
import {
  getGrandSlamBySlug,
  grandSlams,
  productMatchesGrandSlam,
} from "@/data/grandSlams";
import { products } from "@/data/products";

type GrandSlamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const slamHistory: Record<
  string,
  {
    founded: string;
    venue: string;
    signature: string;
  }
> = {
  "australian-open": {
    founded: "1905",
    venue: "Melbourne Park",
    signature: "The opening major beneath the Australian summer.",
  },
  "roland-garros": {
    founded: "1891",
    venue: "Stade Roland-Garros",
    signature: "The ultimate test of endurance on Parisian clay.",
  },
  wimbledon: {
    founded: "1877",
    venue: "All England Club",
    signature: "Tradition, grass courts and Centre Court history.",
  },
  "us-open": {
    founded: "1881",
    venue: "USTA Billie Jean King National Tennis Center",
    signature: "Electric night sessions beneath the lights of New York.",
  },
};

export function generateStaticParams() {
  return grandSlams.map((grandSlam) => ({
    slug: grandSlam.slug,
  }));
}

export async function generateMetadata({
  params,
}: GrandSlamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const grandSlam = getGrandSlamBySlug(slug);

  if (!grandSlam) {
    return {
      title: "Grand Slam Room | AGE202",
    };
  }

  return {
    title: `${grandSlam.name} | AGE202 Museum`,
    description: grandSlam.archiveDescription,
  };
}

export default async function GrandSlamPage({
  params,
}: GrandSlamPageProps) {
  const { slug } = await params;
  const grandSlam = getGrandSlamBySlug(slug);

  if (!grandSlam) {
    notFound();
  }

  const grandSlamProducts = products.filter((product) =>
    productMatchesGrandSlam(product, grandSlam)
  );

  const information = slamHistory[grandSlam.slug];

  const availablePieces = grandSlamProducts.filter(
    (product) => product.available
  ).length;

  const representedPlayers = new Set(
    grandSlamProducts.map((product) => product.player)
  ).size;

  const years = grandSlamProducts
    .map((product) => product.year)
    .filter((year): year is number => Number.isFinite(year))
    .sort((a, b) => a - b);

  const archivePeriod =
    years.length === 0
      ? "Not documented"
      : years[0] === years[years.length - 1]
        ? years[0].toString()
        : `${years[0]} — ${years[years.length - 1]}`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* NAVBAR SPACER */}

      <div className="h-24" />

      {/* HERO */}

      <section className="relative min-h-[760px] overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,255,0,0.08),transparent_35%)]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-blue-500/[0.05] blur-[180px]" />

        <p className="pointer-events-none absolute -bottom-16 right-0 text-[220px] font-black leading-none tracking-[-0.1em] text-white/[0.025] md:text-[360px]">
          {grandSlam.shortName}
        </p>

        <div className="relative mx-auto flex min-h-[760px] max-w-[1700px] flex-col justify-between px-6 py-20 md:px-10 md:py-24">
          <div>
            <Link
              href="/slams"
              className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-[#C8FF00]"
            >
              <span aria-hidden="true">←</span>
              Grand Slam Rooms
            </Link>
          </div>

          <div className="max-w-5xl py-20">
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[#C8FF00]">
              {grandSlam.city} · {grandSlam.country}
            </p>

            <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-[-0.06em] text-white md:text-8xl xl:text-9xl">
              {grandSlam.name}
            </h1>

            <p className="mt-9 max-w-3xl text-base leading-8 text-gray-400 md:text-xl md:leading-10">
              {grandSlam.description}
            </p>

            <p className="mt-5 max-w-3xl text-sm font-bold uppercase tracking-[0.16em] text-gray-600">
              {information.signature}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[30px] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            <HeroDetail
              label="Surface"
              value={grandSlam.surface}
            />

            <HeroDetail
              label="Season"
              value={grandSlam.season}
            />

            <HeroDetail
              label="Founded"
              value={information.founded}
            />

            <HeroDetail
              label="Venue"
              value={information.venue}
            />
          </div>
        </div>
      </section>

      {/* MUSEUM STATISTICS */}

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1700px] px-6 md:px-10">
          <div className="mb-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              index="01"
              label="Archive Pieces"
              value={grandSlamProducts.length.toString()}
            />

            <StatisticCard
              index="02"
              label="Available"
              value={availablePieces.toString()}
            />

            <StatisticCard
              index="03"
              label="Players"
              value={representedPlayers.toString()}
            />

            <StatisticCard
              index="04"
              label="Archive Period"
              value={archivePeriod}
            />
          </div>

          {/* ARCHIVE INTRODUCTION */}

          <div className="mb-14 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-[#C8FF00]">
              Curated Tournament Archive
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
              Documented pieces from{" "}
              <span className="text-gray-500">
                {grandSlam.name}.
              </span>
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-8 text-gray-400">
              {grandSlam.archiveDescription}
            </p>
          </div>

          {grandSlamProducts.length > 0 ? (
            <Suspense fallback={null}>
              <ArchiveExplorer products={grandSlamProducts} />
            </Suspense>
          ) : (
            <EmptyRoom grandSlamName={grandSlam.name} />
          )}
        </div>
      </section>
    </main>
  );
}

function HeroDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[150px] bg-[#07101F]/90 p-7 backdrop-blur-xl md:p-8">
      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-600">
        {label}
      </p>

      <p className="mt-5 max-w-sm text-lg font-black leading-7 text-white">
        {value}
      </p>
    </div>
  );
}

function StatisticCard({
  index,
  label,
  value,
}: {
  index: string;
  label: string;
  value: string;
}) {
  return (
    <article className="group relative min-h-[230px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0A1425] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#C8FF00]/30">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-black tracking-[0.3em] text-gray-700 transition-colors group-hover:text-[#C8FF00]">
          {index}
        </span>

        <span className="h-px w-10 bg-white/10 transition-all duration-500 group-hover:w-16 group-hover:bg-[#C8FF00]" />
      </div>

      <p className="mt-12 break-words text-4xl font-black tracking-[-0.05em] text-white">
        {value}
      </p>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
        {label}
      </p>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8FF00] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

function EmptyRoom({
  grandSlamName,
}: {
  grandSlamName: string;
}) {
  return (
    <div className="rounded-[38px] border border-dashed border-white/15 bg-[#0A1425] px-6 py-24 text-center">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
        Archive in progress
      </p>

      <h3 className="mt-5 text-3xl font-black text-white md:text-4xl">
        No {grandSlamName} pieces documented yet.
      </h3>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-500">
        New archive records connected to this tournament will appear here
        automatically when they are added to the AGE202 database.
      </p>

      <Link
        href="/archive"
        className="mt-9 inline-flex rounded-full bg-[#C8FF00] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(200,255,0,0.2)]"
      >
        Explore full archive
      </Link>
    </div>
  );
}