import type {
  Metadata,
} from "next";

import {
  CalendarDays,
  CircleDot,
  Trophy,
} from "lucide-react";

import ATP250Table from "./components/ATP250Table";

import {
  ATP_250_TOURNAMENT_COUNT,
  atp250Tournaments,
} from "@/lib/data/atp-250";

import {
  mapATP250TournamentsFromCms,
} from "@/lib/mappers/atp-250-cms.mapper";

import {
  prisma,
} from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

export const metadata: Metadata = {
  title: "ATP 250 World Archive | AGE202",
  description:
    "Explore the complete AGE202 ATP 250 tournament index with location, surface, foundation year, tournament history, record leaders and latest finals.",
  keywords: [
    "ATP 250",
    "ATP Tour",
    "tennis tournaments",
    "tennis history",
    "ATP champions",
    "AGE202",
  ],
  openGraph: {
    title:
      "ATP 250 World Archive | AGE202",
    description:
      "A complete AGE202 index of ATP 250 tournaments, record leaders and latest finals.",
    type:
      "website",
  },
  twitter: {
    card:
      "summary_large_image",
    title:
      "ATP 250 World Archive | AGE202",
    description:
      "A complete AGE202 index of ATP 250 tournaments, record leaders and latest finals.",
  },
  robots: {
    index:
      true,
    follow:
      true,
  },
  category:
    "ATP 250 tennis",
};

export default async function ATP250Page() {
  const cmsTournaments =
    await prisma.tournament.findMany({
      where: {
        category:
          "ATP_250",
        active:
          true,
      },

      select: {
        slug:
          true,

        editions: {
          orderBy: {
            year:
              "desc",
          },

          select: {
            year:
              true,
            championName:
              true,
            runnerUpName:
              true,
            championCountryCode:
              true,
            runnerUpCountryCode:
              true,
            score:
              true,
            cancelled:
              true,
          },
        },

        champions: {
          orderBy: [
            {
              titles:
                "desc",
            },
            {
              name:
                "asc",
            },
          ],

          select: {
            name:
              true,
            titles:
              true,
          },
        },
      },
    });

  const tournaments =
    mapATP250TournamentsFromCms(
      atp250Tournaments,
      cmsTournaments,
    );

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pb-20 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_12%,rgba(184,255,74,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_48%)]" />

        <div className="relative mx-auto max-w-[1700px]">
          <div className="grid gap-10 xl:grid-cols-[1.18fr_0.82fr] xl:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#B8FF4A]">
                <span>
                  AGE202 tournament archive
                </span>

                <span className="h-px w-10 bg-[#B8FF4A]/60" />

                <span>
                  ATP 250
                </span>
              </div>

              <h1 className="max-w-6xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl lg:text-[7rem]">
                ATP 250

                <span className="block text-white/25">
                  Tournament Index.
                </span>
              </h1>

              <p className="mt-7 max-w-4xl text-base leading-7 text-white/60 sm:text-lg">
                One complete table. No individual tournament pages,
                no galleries and no unnecessary layers. Just the
                essential information for every ATP 250 event:
                identity, location, surface, short history, record
                leader and latest final.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <HeroStat
                icon={
                  <Trophy
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                }
                value={String(
                  ATP_250_TOURNAMENT_COUNT,
                )}
                label="Tournaments"
              />

              <HeroStat
                icon={
                  <CircleDot
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                }
                value="3"
                label="Surfaces"
              />

              <HeroStat
                icon={
                  <CalendarDays
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                }
                value="2026"
                label="Tour set"
              />
            </div>
          </div>
        </div>
      </section>

      <ATP250Table
        tournaments={
          tournaments
        }
      />
    </main>
  );
}

type HeroStatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function HeroStat({
  icon,
  value,
  label,
}: HeroStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="text-[#B8FF4A]">
        {icon}
      </div>

      <div className="mt-5 text-3xl font-black">
        {value}
      </div>

      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </div>
    </div>
  );
}