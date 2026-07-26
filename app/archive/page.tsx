import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import ArchiveExplorer from "@/components/archive/ArchiveExplorer";
import ArchiveOverview from "@/components/archive/ArchiveOverview";
import ArchiveTimeline from "@/components/archive/ArchiveTimeline";

import { champions } from "@/data/champions";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Digital Archive | AGE202",
  description:
    "Explore the AGE202 digital archive of collectible tennis apparel connected to the greatest champions.",
};

export default function ArchivePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <ArchiveLandingHero />

      <ArchiveOverview products={products} />

      <ArchiveTimeline />

      <Suspense fallback={<ArchiveExplorerFallback />}>
        <ArchiveExplorer products={products} />
      </Suspense>
    </main>
  );
}

/* =========================================================
   ARCHIVE LANDING HERO
========================================================= */

function ArchiveLandingHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.07] bg-[#030812]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-15%] top-[-30%] h-[620px] w-[620px] rounded-full bg-cyan-400/[0.07] blur-[180px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-45%] right-[-10%] h-[680px] w-[680px] rounded-full bg-blue-500/[0.08] blur-[200px]"
      />

      <div className="relative mx-auto flex min-h-[780px] max-w-[1440px] flex-col justify-end px-6 pb-20 pt-40 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28 lg:pt-52">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="h-px w-10 bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.8)] sm:w-14"
          />

          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
            AGE202 Digital Tennis Museum
          </p>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
              Archive record · AGE202-ALL-CHAMPIONS
            </p>

            <h1 className="mt-5 max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] text-white sm:text-7xl md:text-8xl lg:text-[132px]">
              Digital
              <span className="block text-white/20">
                Archive
              </span>
            </h1>
          </div>

          <div className="border-l border-white/10 pl-6 lg:mb-3">
            <p className="text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
              A curated museum of collectible tennis apparel, iconic champions
              and the stories that transformed the sport.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ArchiveMetric
                value={String(champions.length).padStart(2, "0")}
                label="Champions"
              />

              <ArchiveMetric
                value={String(products.length).padStart(2, "0")}
                label="Archive pieces"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {champions.map((champion) => (
              <Link
                key={champion.id}
                href={`/archives/${champion.slug}`}
                className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/45 transition duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {champion.lastName}
              </Link>
            ))}
          </div>

          <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25 sm:text-right">
            Authentic garments
            <br />
            Preserved sporting history
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ARCHIVE METRIC
========================================================= */

type ArchiveMetricProps = {
  value: string;
  label: string;
};

function ArchiveMetric({
  value,
  label,
}: ArchiveMetricProps) {
  return (
    <div className="min-w-[130px] rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
      <span className="block text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </span>

      <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   EXPLORER FALLBACK
========================================================= */

function ArchiveExplorerFallback() {
  return (
    <section
      aria-label="Loading archive explorer"
      className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="h-[520px] animate-pulse rounded-[32px] border border-white/[0.07] bg-white/[0.025]" />
    </section>
  );
}