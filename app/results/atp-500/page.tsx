import type {
  CSSProperties,
} from "react";
import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleDot,
  MapPin,
  Trophy,
} from "lucide-react";

import {
  atp500Tournaments,
  getAtp500Href,
} from "@/lib/data/atp-500";

export const metadata: Metadata = {
  title: "ATP 500 Archive | AGE202",
  description:
    "Explore the AGE202 ATP 500 archive: sixteen tournaments across hard, clay and grass, each with its own identity, history, legends and recent champions.",
  keywords: [
    "ATP 500",
    "Rotterdam Open",
    "Dallas Open",
    "Qatar Open",
    "Rio Open",
    "Dubai Tennis Championships",
    "Acapulco",
    "Barcelona Open",
    "BMW Open Munich",
    "Hamburg Open",
    "Halle Open",
    "Queen's Club Championships",
    "Washington Open",
    "China Open",
    "Japan Open",
    "Swiss Indoors Basel",
    "Vienna Open",
    "tennis history",
    "AGE202",
  ],
  openGraph: {
    title: "ATP 500 Archive | AGE202",
    description:
      "Sixteen tournaments. Three surfaces. One global ATP 500 archive.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATP 500 Archive | AGE202",
    description:
      "Sixteen tournaments. Three surfaces. One global ATP 500 archive.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "ATP 500 tennis",
};

type TournamentStyle =
  CSSProperties & {
    "--tournament-accent": string;
    "--tournament-accent-soft": string;
  };

export default function Atp500Page() {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pb-20 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_45%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/results"
            className="mb-10 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Results archive
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#B8FF4A]">
                <span>
                  AGE202 tournament archive
                </span>

                <span className="h-px w-10 bg-[#B8FF4A]/60" />

                <span>
                  Level 03
                </span>
              </div>

              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl lg:text-[7.5rem]">
                ATP 500

                <span className="block text-white/25">
                  World Archive.
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-7 text-white/60 sm:text-lg">
                Sixteen tournaments across hard,
                clay and grass. A faster AGE202
                archive focused on identity,
                history, iconic moments, legends
                and the latest championship
                editions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <Trophy className="mb-5 h-5 w-5 text-[#B8FF4A]" />

                <div className="text-3xl font-black">
                  {atp500Tournaments.length}
                </div>

                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Tournaments
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <CircleDot className="mb-5 h-5 w-5 text-[#B8FF4A]" />

                <div className="text-3xl font-black">
                  3
                </div>

                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Surfaces
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <CalendarDays className="mb-5 h-5 w-5 text-[#B8FF4A]" />

                <div className="text-3xl font-black">
                  2026
                </div>

                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Tour set
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.26em] text-[#B8FF4A]">
                Tournament index
              </div>

              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl">
                The ATP 500 collection
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-white/45">
              Every tournament keeps its own
              visual colour and opens into a
              compact museum page with hero,
              history, iconic moments, legends
              and the five most recent finals.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#08101F]">
            <div className="hidden grid-cols-[1.7fr_0.9fr_1fr_0.7fr_0.8fr_0.55fr_52px] border-b border-white/10 bg-white/[0.025] px-5 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-white/35 lg:grid">
              <div>
                Tournament
              </div>

              <div>
                Country
              </div>

              <div>
                City
              </div>

              <div>
                Founded
              </div>

              <div>
                Surface
              </div>

              <div>
                Draw
              </div>

              <div />
            </div>

            <div>
              {atp500Tournaments.map(
                (tournament) => {
                  const style: TournamentStyle = {
                    "--tournament-accent":
                      tournament.colors.primary,

                    "--tournament-accent-soft":
                      `${tournament.colors.primary}24`,
                  };

                  return (
                    <Link
                      key={tournament.slug}
                      href={getAtp500Href(
                        tournament.slug,
                      )}
                      style={style}
                      className="group relative grid gap-4 border-b border-white/[0.07] px-5 py-5 transition last:border-b-0 hover:bg-[var(--tournament-accent-soft)] lg:grid-cols-[1.7fr_0.9fr_1fr_0.7fr_0.8fr_0.55fr_52px] lg:items-center lg:gap-0"
                    >
                      <div className="absolute bottom-0 left-0 top-0 w-[3px] origin-y scale-y-0 bg-[var(--tournament-accent)] transition-transform duration-300 group-hover:scale-y-100" />

                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[11px] font-black tracking-[0.08em]"
                          style={{
                            borderColor:
                              "color-mix(in srgb, var(--tournament-accent) 45%, transparent)",
                            color:
                              "var(--tournament-accent)",
                            backgroundColor:
                              "var(--tournament-accent-soft)",
                          }}
                        >
                          {tournament.countryCode}
                        </div>

                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--tournament-accent)]">
                            ATP 500 ·{" "}
                            {tournament.shortName}
                          </div>

                          <div className="mt-1 text-lg font-black uppercase tracking-[-0.03em] text-white transition-colors group-hover:text-[var(--tournament-accent)]">
                            {tournament.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span className="lg:hidden text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                          Country
                        </span>

                        {tournament.country}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="h-3.5 w-3.5 text-[var(--tournament-accent)] lg:hidden" />

                        {tournament.city}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="lg:hidden text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                          Founded
                        </span>

                        <span className="text-sm font-bold text-white/70">
                          {tournament.founded}
                        </span>
                      </div>

                      <div>
                        <span
                          className="inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
                          style={{
                            borderColor:
                              "color-mix(in srgb, var(--tournament-accent) 38%, transparent)",
                            color:
                              "var(--tournament-accent)",
                            backgroundColor:
                              "var(--tournament-accent-soft)",
                          }}
                        >
                          {tournament.surface}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="lg:hidden text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                          Draw
                        </span>

                        <span className="text-sm font-black text-white/70">
                          {tournament.drawSize}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/50 transition-all group-hover:border-[var(--tournament-accent)] group-hover:bg-[var(--tournament-accent)] group-hover:text-[#050B18]">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7 text-[10px] font-black uppercase tracking-[0.17em] text-white/30">
            <span>
              AGE202 · ATP 500 Museum Archive
            </span>

            <span>
              Hard · Clay · Grass
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}