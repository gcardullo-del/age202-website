import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  Globe2,
  Shirt,
  Users,
} from "lucide-react";

import StatCard from "./StatCard";

type ArchiveHeroProps = {
  playerCount: number;
  countryCount: number;
  artifactCount: number;
};

export default function ArchiveHero({
  playerCount,
  countryCount,
  artifactCount,
}: ArchiveHeroProps) {
  return (
    <section className="relative isolate min-h-[820px] overflow-hidden border-b border-white/10 bg-[#020611] md:min-h-[880px] lg:min-h-[920px]">
      <Image
        src="/players/other-players/hero.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[#020611]/30" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,0.98)_25%,rgba(2,6,17,0.78)_49%,rgba(2,6,17,0.28)_72%,rgba(2,6,17,0.08)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.30)_0%,rgba(2,6,17,0.02)_44%,#020611_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(215,255,0,0.14),transparent_24%)]" />

      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute right-[9%] top-[19%] hidden h-[430px] w-[430px] rounded-full border border-[#D7FF00]/10 lg:block" />

      <div className="pointer-events-none absolute right-[13%] top-[25%] hidden h-[300px] w-[300px] rounded-full border border-white/[0.06] lg:block" />

      <div className="relative mx-auto min-h-[820px] w-full max-w-[1480px] px-6 pb-32 pt-10 sm:px-10 sm:pt-12 md:min-h-[880px] lg:min-h-[920px] lg:px-14 lg:pb-36 lg:pt-14">
        <Link
          href="/players"
          className="group inline-flex w-fit items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/45 transition-colors duration-300 hover:text-[#D7FF00]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/20 transition-all duration-300 group-hover:border-[#D7FF00]/35 group-hover:bg-[#D7FF00]/[0.08]">
            <ArrowLeft
              size={14}
              aria-hidden="true"
            />
          </span>

          Players
        </Link>

        <div className="mt-12 max-w-4xl sm:mt-14 lg:mt-16">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#D7FF00]">
            <span className="h-px w-9 bg-[#D7FF00]" />
            World Top 50
          </div>

          <h1 className="mt-6 text-[clamp(4.4rem,9vw,8.4rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
            ATP

            <span className="block text-white/35">
              Archive
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Explore every player ranked from ATP No. 1 to No. 50,
            including AGE202 Champion Collection players.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#archive-toolbar"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#D7FF00] px-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#050B18] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(215,255,0,0.18)]"
            >
              Explore archive
            </a>

            <span className="rounded-full border border-white/10 bg-black/20 px-5 py-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white/38 backdrop-blur-md">
              AGE202 Player Index
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:left-10 sm:right-auto sm:w-[620px] sm:grid-cols-3 lg:bottom-12 lg:left-14">
          <StatCard
            icon={Users}
            value={playerCount}
            label="ATP players"
          />

          <StatCard
            icon={Globe2}
            value={countryCount}
            label="Countries"
          />

          <StatCard
            icon={Shirt}
            value={artifactCount}
            label="Archive artifacts"
          />
        </div>
      </div>

      <a
        href="#archive-toolbar"
        aria-label="Scroll to ATP Archive players"
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/55 transition-colors hover:text-[#D7FF00] lg:flex"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.32em]">
          Discover players
        </span>

        <ArrowDown
          className="h-4 w-4 animate-bounce"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}