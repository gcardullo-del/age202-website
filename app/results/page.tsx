import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleDot,
  Crown,
  Flag,
  Gauge,
  Globe2,
  Layers3,
  Medal,
  Orbit,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import TodaysMatches from "@/components/results/TodaysMatches";


export const dynamic =
  "force-dynamic";

export const revalidate =
  0;


export const metadata: Metadata = {
  title: "Tennis Results | AGE202",
  description:
    "Follow today’s ATP matches and explore Grand Slam, ATP Masters 1000, ATP 500 and ATP 250 tournament results through the AGE202 tennis archive.",
  openGraph: {
    title: "Tennis Results | AGE202",
    description:
      "Explore the major tournaments of professional tennis through the AGE202 digital archive.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tennis Results | AGE202",
    description:
      "Grand Slam, ATP Masters 1000, ATP 500 and ATP 250 tournament results.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Tennis results",
};

type TournamentCategory = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  code: string;
  accent: string;
  icon: typeof Trophy;
  tournaments: string[];
};

const tournamentCategories: TournamentCategory[] = [
  {
    title: "Grand Slams",
    eyebrow: "The four majors",
    description:
      "Explore the defining stages of the tennis season and the champions who shaped the history of the sport.",
    href: "/results/grand-slams",
    code: "GS",
    accent: "Grand Slam archive",
    icon: Crown,
    tournaments: [
      "Australian Open",
      "Roland Garros",
      "Wimbledon",
      "US Open",
    ],
  },
  {
    title: "ATP Masters 1000",
    eyebrow: "Elite tour events",
    description:
      "Discover the most prestigious tournaments beneath the Grand Slams and follow the season across every surface.",
    href: "/results/masters-1000",
    code: "M1000",
    accent: "Masters archive",
    icon: Trophy,
    tournaments: [
      "Indian Wells",
      "Miami",
      "Monte Carlo",
      "Madrid",
      "Rome",
      "Canada",
      "Cincinnati",
      "Shanghai",
      "Paris",
    ],
  },
  {
    title: "ATP 500",
    eyebrow: "Global tour series",
    description:
      "A worldwide collection of high-level tournaments connecting historic venues, iconic cities and leading players.",
    href: "/results/atp-500",
    code: "500",
    accent: "ATP 500 archive",
    icon: Medal,
    tournaments: [
      "Hard court",
      "Clay court",
      "Grass court",
      "Indoor events",
    ],
  },
  {
    title: "ATP 250",
    eyebrow: "The foundation of the tour",
    description:
      "Follow the broadest tournament category on the ATP Tour and discover events from every part of the tennis world.",
    href: "/results/atp-250",
    code: "250",
    accent: "ATP 250 archive",
    icon: Star,
    tournaments: [
      "International events",
      "Season openers",
      "Clay swing",
      "Indoor season",
    ],
  },
];

const archiveHighlights = [
  {
    label: "Live refresh",
    value: "05 MIN",
    icon: Gauge,
  },
  {
    label: "Grand Slam events",
    value: "04",
    icon: Crown,
  },
  {
    label: "Tournament levels",
    value: "04",
    icon: Layers3,
  },
  {
    label: "Archive status",
    value: "OPEN",
    icon: Orbit,
  },
];

export default function ResultsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tennis Results | AGE202",
    description:
      "AGE202 archive hub for Grand Slam, ATP Masters 1000, ATP 500 and ATP 250 tournament results.",
    mainEntity: tournamentCategories.map((category) => ({
      "@type": "ItemList",
      name: category.title,
      description: category.description,
      url: category.href,
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate min-h-[780px] overflow-hidden border-b border-white/10 bg-[#020611]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(215,255,0,0.16),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_72%,rgba(56,189,248,0.07),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#020611_0%,#06101d_52%,#020611_100%)]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="pointer-events-none absolute -right-24 top-10 hidden select-none text-[22rem] font-black leading-none tracking-[-0.12em] text-white/[0.022] xl:block">
          202
        </div>

        <div className="relative mx-auto flex min-h-[780px] max-w-[1480px] flex-col px-6 pb-14 pt-14 sm:px-10 lg:px-14 lg:pb-20 lg:pt-20">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[#D7FF00]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
                AGE202 results hub
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.055] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D7FF00] opacity-30" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D7FF00]" />
              </span>
              Live archive
            </span>
          </div>

          <div className="my-auto grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-end">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
                Today&apos;s matches · Tournament draws · Historical results
              </p>

              <h1 className="mt-7 max-w-5xl text-[clamp(5.2rem,12vw,11rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">
                <span className="block text-white">Results.</span>
                <span className="block text-[#D7FF00]">Live archive.</span>
              </h1>

              <p className="mt-10 max-w-3xl text-base leading-8 text-white/52 sm:text-lg">
                Follow today&apos;s ATP matches as results are synchronized into AGE202,
                then continue through tournament draws, champions and historical editions.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#todays-matches"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D7FF00] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
                >
                  Today&apos;s matches
                  <ArrowDown size={14} aria-hidden="true" />
                </a>

                <a
                  href="#tournament-levels"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[#D7FF00]/35 hover:text-[#D7FF00]"
                >
                  Explore archive
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[2rem] border border-[#D7FF00]/18 bg-[#07101D]/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D7FF00]/[0.10] blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#D7FF00]">
                      Results system
                    </p>

                    <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                      From today&apos;s court to the archive
                    </h2>
                  </div>

                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#D7FF00]/22 bg-[#D7FF00]/[0.08] text-[#D7FF00]">
                    <Gauge size={20} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-9 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/15">
                  <div className="flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#D7FF00]" />
                      <span className="text-sm font-black uppercase tracking-[-0.02em] text-white/75">
                        Match schedule
                      </span>
                    </div>

                    <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
                      Today
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CircleDot size={12} className="text-[#D7FF00]" aria-hidden="true" />
                      <span className="text-sm font-black uppercase tracking-[-0.02em] text-white/75">
                        Tournament draws
                      </span>
                    </div>

                    <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                      Progressive
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-5 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Layers3 size={12} className="text-[#D7FF00]" aria-hidden="true" />
                      <span className="text-sm font-black uppercase tracking-[-0.02em] text-white/75">
                        Historical archive
                      </span>
                    </div>

                    <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                      Open
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
                      Sync cadence
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-white">
                      5 min
                    </p>
                  </div>

                  <p className="max-w-[220px] text-right text-xs leading-5 text-white/35">
                    Periodic result synchronization. No point-by-point live scoring.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {archiveHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.label}
                  className="flex min-h-[112px] items-center justify-between bg-[#071021]/92 px-6 py-5"
                >
                  <div>
                    <span className="block text-3xl font-black tracking-[-0.055em]">
                      {highlight.value}
                    </span>
                    <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
                      {highlight.label}
                    </span>
                  </div>

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] text-[#D7FF00]">
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <nav
        aria-label="Results page sections"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/92 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00] sm:inline-flex">
            <Layers3 size={13} aria-hidden="true" />
            Results index
          </span>

          <SectionLink href="#tournament-levels" label="Categories" />
          <SectionLink href="#todays-matches" label="Today's matches" />
          <SectionLink href="#grand-slam-overview" label="Grand Slams" />
          <SectionLink href="#archive-method" label="Archive" />
        </div>
      </nav>

      <TodaysMatches />

      <section
        id="tournament-levels"
        className="scroll-mt-16 relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-36 top-20 h-[30rem] w-[30rem] rounded-full bg-[#D7FF00]/[0.035] blur-3xl" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
                Tournament levels
              </p>

              <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Choose your competition
              </h2>
            </div>

            <p className="text-sm leading-7 text-white/44 lg:text-right">
              Enter one of the four main tournament categories and continue
              through the AGE202 results archive.
            </p>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-2">
            {tournamentCategories.map((category, index) => (
              <TournamentCategoryCard
                key={category.title}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="grand-slam-overview"
        className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-28">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Grand Slam overview
            </p>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl">
              Four tournaments. One legacy.
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/43">
              The four majors represent the highest level of the sport and form
              the historical centre of the AGE202 Results section.
            </p>

            <Link
              href="/results/grand-slams"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D7FF00]/30 bg-[#D7FF00]/[0.06] px-5 py-3 text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00] transition hover:bg-[#D7FF00] hover:text-[#050B18]"
            >
              Grand Slam archive
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            <GrandSlamCard
              code="AO"
              title="Australian Open"
              location="Melbourne"
              surface="Hard"
              season="January"
            />
            <GrandSlamCard
              code="RG"
              title="Roland Garros"
              location="Paris"
              surface="Clay"
              season="May · June"
            />
            <GrandSlamCard
              code="W"
              title="Wimbledon"
              location="London"
              surface="Grass"
              season="June · July"
            />
            <GrandSlamCard
              code="US"
              title="US Open"
              location="New York"
              surface="Hard"
              season="August · September"
            />
          </div>
        </div>
      </section>

      <section
        id="archive-method"
        className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-[#D7FF00]/18 bg-[#07101D] px-7 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#D7FF00]/[0.075] blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] text-[#D7FF00]">
                    <Sparkles size={18} strokeWidth={1.4} aria-hidden="true" />
                  </span>

                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#D7FF00]">
                    AGE202 results archive
                  </p>
                </div>

                <h2 className="mt-7 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                  Results become history
                </h2>

                <p className="mt-7 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
                  Tournament pages combine current draws, completed results,
                  champions and historical context within one coherent visual
                  archive.
                </p>
              </div>

              <div className="space-y-3">
                <ArchiveStep
                  number="01"
                  title="Select a level"
                  description="Grand Slam, Masters 1000, ATP 500 or ATP 250."
                />
                <ArchiveStep
                  number="02"
                  title="Choose a tournament"
                  description="Enter the dedicated archive of the selected event."
                />
                <ArchiveStep
                  number="03"
                  title="Explore every edition"
                  description="Discover champions, finals and historical records."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#D7FF00]">
              Next archive
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
              Start with the Grand Slams
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/42">
              Enter the major tournament archive and explore the four events
              that define the tennis calendar.
            </p>
          </div>

          <Link
            href="/results/grand-slams"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#D7FF00] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
          >
            Explore Grand Slams
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 transition hover:border-[#D7FF00]/35 hover:text-[#D7FF00]"
        >
          Back to top
          <ArrowDown
            size={13}
            className="rotate-180"
            aria-hidden="true"
          />
        </a>
      </div>
    </main>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
};

function SectionLink({
  href,
  label,
}: SectionLinkProps) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 transition hover:border-[#D7FF00]/35 hover:bg-[#D7FF00]/[0.06] hover:text-[#D7FF00] sm:text-[8px]"
    >
      {label}
    </a>
  );
}

type TournamentCategoryCardProps = {
  category: TournamentCategory;
  index: number;
};

function TournamentCategoryCard({
  category,
  index,
}: TournamentCategoryCardProps) {
  const Icon =
    category.icon;

  return (
    <Link
      href={category.href}
      className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition duration-500 hover:-translate-y-1.5 hover:border-[#D7FF00]/35 hover:shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-9"
    >
      <div className="pointer-events-none absolute -right-10 -top-12 text-[10rem] font-black leading-none tracking-[-0.09em] text-white/[0.025]">
        {category.code}
      </div>

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#D7FF00]/[0.045] blur-3xl transition duration-700 group-hover:bg-[#D7FF00]/[0.09]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/26">
              {String(index + 1).padStart(2, "0")} · {category.code}
            </span>

            <p className="mt-4 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
              {category.eyebrow}
            </p>
          </div>

          <span className="grid h-13 w-13 place-items-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] text-[#D7FF00]">
            <Icon size={20} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-10 max-w-xl text-4xl font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-5xl">
          {category.title}
        </h3>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/43">
          {category.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {category.tournaments.slice(0, 4).map((tournament) => (
            <span
              key={tournament}
              className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.15em] text-white/36"
            >
              {tournament}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-7">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/32">
            {category.accent}
          </span>

          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/55 transition group-hover:text-[#D7FF00]">
            Open archive
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type GrandSlamCardProps = {
  code: string;
  title: string;
  location: string;
  surface: string;
  season: string;
};

function GrandSlamCard({
  code,
  title,
  location,
  surface,
  season,
}: GrandSlamCardProps) {
  return (
    <div className="group min-h-[320px] bg-[#07101D] p-7 transition hover:bg-[#091421] sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <span className="text-5xl font-black tracking-[-0.07em] text-white/[0.12]">
          {code}
        </span>

        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#D7FF00]/18 bg-[#D7FF00]/[0.05] text-[#D7FF00] transition group-hover:border-[#D7FF00]/35">
          <Trophy size={17} strokeWidth={1.4} aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-12 text-3xl font-black uppercase leading-[0.9] tracking-[-0.045em]">
        {title}
      </h3>

      <dl className="mt-8 space-y-4 border-t border-white/10 pt-6">
        <GrandSlamDetail
          icon={Flag}
          label="Location"
          value={location}
        />
        <GrandSlamDetail
          icon={CircleDot}
          label="Surface"
          value={surface}
        />
        <GrandSlamDetail
          icon={CalendarDays}
          label="Season"
          value={season}
        />
      </dl>
    </div>
  );
}

type GrandSlamDetailProps = {
  icon: typeof Flag;
  label: string;
  value: string;
};

function GrandSlamDetail({
  icon: Icon,
  label,
  value,
}: GrandSlamDetailProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="inline-flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.17em] text-white/28">
        <Icon
          size={11}
          className="text-[#D7FF00]"
          aria-hidden="true"
        />
        {label}
      </dt>

      <dd className="text-xs font-black uppercase tracking-[0.07em] text-white/62">
        {value}
      </dd>
    </div>
  );
}

type ArchiveStepProps = {
  number: string;
  title: string;
  description: string;
};

function ArchiveStep({
  number,
  title,
  description,
}: ArchiveStepProps) {
  return (
    <div className="group flex items-start gap-5 rounded-[1.4rem] border border-white/10 bg-black/15 p-5 transition hover:border-[#D7FF00]/25 hover:bg-[#D7FF00]/[0.025]">
      <span className="font-mono text-[9px] font-black text-[#D7FF00]">
        {number}
      </span>

      <div className="flex-1">
        <h3 className="text-sm font-black uppercase tracking-[0.04em]">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-6 text-white/36">
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="mt-1 text-white/18 transition group-hover:text-[#D7FF00]"
        aria-hidden="true"
      />
    </div>
  );
}