"use client";

import {
  useReducedMotion,
} from "framer-motion";

import type {
  Champion,
} from "@/data/champions";

import type {
  PlayerTrophyStats,
} from "@/lib/services/players/player-trophy-stats.service";

import ChapterTransition from "../ui/ChapterTransition";
import FeaturedTrophy from "./FeaturedTrophy";
import TrophyGrid from "./TrophyGrid";
import TrophyMeta from "./TrophyMeta";
import type {
  TrophyItem,
} from "./types";

type TrophyRoomProps = {
  champion: Champion;
  liveStats?:
    | PlayerTrophyStats
    | null;
};

export default function TrophyRoom({
  champion,
  liveStats = null,
}: TrophyRoomProps) {
  const shouldReduceMotion =
    useReducedMotion();

  /*
   * SOURCE STRATEGY
   * -------------------------------------------------------
   * Active / synchronized players:
   *   Tournament Engine -> liveStats
   *
   * Historical retired champions:
   *   champion.trophies -> verified static archive
   *
   * The visual Trophy Room remains identical regardless
   * of the underlying source.
   */

  const grandSlamTitles =
    liveStats?.recordedGrandSlams ??
    champion.trophies.grandSlams;

  const australianOpen =
    liveStats?.recordedAustralianOpen ??
    champion.trophies.australianOpen ??
    0;

  const rolandGarros =
    liveStats?.recordedRolandGarros ??
    champion.trophies.rolandGarros ??
    0;

  const wimbledon =
    liveStats?.recordedWimbledon ??
    champion.trophies.wimbledon ??
    0;

  const usOpen =
    liveStats?.recordedUsOpen ??
    champion.trophies.usOpen ??
    0;

  const atpTitles =
    liveStats?.recordedTitles ??
    champion.trophies.atpTitles;

  const masters1000 =
    liveStats?.recordedMasters1000 ??
    champion.trophies.masters1000;

  const atp500 =
    liveStats?.recordedAtp500 ??
    champion.trophies.atp500 ??
    0;

  const atp250 =
    liveStats?.recordedAtp250 ??
    champion.trophies.atp250 ??
    0;

  const atpFinals =
    liveStats?.recordedAtpFinals ??
    champion.trophies.atpFinals ??
    0;

  const olympicSinglesGold =
    liveStats?.recordedOlympicGold ??
    champion.trophies
      .olympicSinglesGold ??
    champion.trophies
      .olympicGold ??
    0;

  const olympicDoublesGold =
    liveStats
      ? 0
      : champion.trophies
          .olympicDoublesGold ??
        0;

  const davisCupTitles =
    liveStats?.davisCupTitles ??
    0;

  const hasHistoricalDetailedStats =
    !liveStats &&
    (
      champion.trophies
        .australianOpen !== undefined ||
      champion.trophies
        .rolandGarros !== undefined ||
      champion.trophies
        .wimbledon !== undefined ||
      champion.trophies
        .usOpen !== undefined ||
      champion.trophies
        .atp500 !== undefined ||
      champion.trophies
        .atp250 !== undefined ||
      champion.trophies
        .atpFinals !== undefined ||
      champion.trophies
        .olympicSinglesGold !== undefined ||
      champion.trophies
        .olympicDoublesGold !== undefined
    );

  const showDetailedSlamBreakdown =
    Boolean(
      liveStats ||
      hasHistoricalDetailedStats,
    );

  const trophyItems: TrophyItem[] = [
    {
      label:
        "Grand Slam Titles",
      value:
        grandSlamTitles,
      description:
        "Major championships won across the four Grand Slam tournaments.",
    },

    ...(showDetailedSlamBreakdown
      ? [
          {
            label:
              "Australian Open",
            value:
              australianOpen,
            description:
              "Titles won at the Australian Open in Melbourne.",
          },
          {
            label:
              "Roland Garros",
            value:
              rolandGarros,
            description:
              "Titles won on the clay of Roland Garros in Paris.",
          },
          {
            label:
              "Wimbledon",
            value:
              wimbledon,
            description:
              "Titles won on the grass courts of Wimbledon.",
          },
          {
            label:
              "US Open",
            value:
              usOpen,
            description:
              "Titles won at the US Open in New York.",
          },
        ]
      : []),

    {
      label:
        "ATP Titles",
      value:
        atpTitles,
      description:
        "Official tour-level singles titles collected throughout the career.",
    },

    {
      label:
        "Weeks at No. 1",
      value:
        champion.trophies
          .weeksAtNo1,
      description:
        "Total weeks spent at the summit of the ATP world rankings.",
    },

    {
      label:
        "Masters 1000",
      value:
        masters1000,
      description:
        "Victories achieved at the highest tier below the Grand Slams.",
    },

    ...(atp500 > 0
      ? [
          {
            label:
              "ATP 500",
            value:
              atp500,
            description:
              "Titles won at ATP 500 events across the tour calendar.",
          },
        ]
      : []),

    ...(atp250 > 0
      ? [
          {
            label:
              "ATP 250",
            value:
              atp250,
            description:
              "Titles won at ATP 250 events across the tour calendar.",
          },
        ]
      : []),

    ...(atpFinals > 0
      ? [
          {
            label:
              "ATP Finals",
            value:
              atpFinals,
            description:
              "Season-ending championship titles won against the elite ATP field.",
          },
        ]
      : []),

    ...(olympicSinglesGold > 0
      ? [
          {
            label:
              "Olympic Singles Gold",
            value:
              olympicSinglesGold,
            description:
              "Singles gold medals won on the Olympic stage.",
          },
        ]
      : []),

    ...(olympicDoublesGold > 0
      ? [
          {
            label:
              "Olympic Doubles Gold",
            value:
              olympicDoublesGold,
            description:
              "Doubles gold medals won on the Olympic stage.",
          },
        ]
      : []),

    ...(liveStats &&
    davisCupTitles > 0
      ? [
          {
            label:
              "Davis Cup",
            value:
              davisCupTitles,
            description:
              "Team titles won representing the national side in Davis Cup competition.",
          },
        ]
      : []),
  ];

  const recordedPeriod =
    liveStats &&
    liveStats.firstRecordedYear &&
    liveStats.lastRecordedYear
      ? liveStats.firstRecordedYear ===
        liveStats.lastRecordedYear
        ? String(
            liveStats.firstRecordedYear,
          )
        : `${liveStats.firstRecordedYear}–${liveStats.lastRecordedYear}`
      : null;

  const sourceLabel =
    liveStats
      ? "Live tournament record"
      : hasHistoricalDetailedStats
        ? "Historical career record"
        : "Career achievements";

  const statusLabel =
    liveStats
      ? "AGE202 Verified"
      : hasHistoricalDetailedStats
        ? "Historical Verified"
        : "Verified";

  return (
    <section
      id="trophy-room"
      className="relative w-full max-w-full overflow-x-clip overflow-y-hidden border-y border-white/[0.07] bg-[#050b18] py-24 sm:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize:
            "88px 88px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[190px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full border border-white/[0.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 bottom-8 h-80 w-80 rounded-full border border-white/[0.04]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] min-w-0 px-6 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor:
                    champion.accent,
                  boxShadow:
                    `0 0 14px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color:
                    champion.accent,
                }}
              >
                Trophy Room
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              The numbers behind
              <span className="block text-white/30">
                a historic legacy.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-2xl text-base leading-8 text-white/45 sm:text-lg sm:leading-9">
              A statistical record of the
              achievements that define the
              competitive history of{" "}
              <span className="font-semibold text-white/75">
                {champion.name}
              </span>
              .
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrophyMeta
                label="Archive classification"
                value={
                  sourceLabel
                }
              />

              <TrophyMeta
                label="Recorded categories"
                value={String(
                  trophyItems.length,
                )}
              />

              <TrophyMeta
                label="Status"
                value={
                  statusLabel
                }
                accent={
                  champion.accent
                }
              />
            </div>
          </div>
        </div>

        <FeaturedTrophy
          value={
            grandSlamTitles
          }
          accent={
            champion.accent
          }
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

        <TrophyGrid
          items={
            trophyItems.slice(1)
          }
          accent={
            champion.accent
          }
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

        {liveStats &&
        liveStats.recordedFinals >
          0 ? (
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.26em]"
                  style={{
                    color:
                      champion.accent,
                  }}
                >
                  AGE202 synced career record
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
                  Verified tournament results linked to the AGE202 Tournament Engine, with team achievements supplied by the career archive.
                </p>
              </div>

              {recordedPeriod ? (
                <TrophyMeta
                  label="Recorded period"
                  value={
                    recordedPeriod
                  }
                  accent={
                    champion.accent
                  }
                />
              ) : null}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <SyncedStat
                label="ATP Titles"
                value={
                  liveStats.recordedTitles
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Runner-up"
                value={
                  liveStats.recordedRunnerUps
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Finals"
                value={
                  liveStats.recordedFinals
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Grand Slams"
                value={
                  liveStats.recordedGrandSlams
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Australian Open"
                value={
                  liveStats.recordedAustralianOpen
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Roland Garros"
                value={
                  liveStats.recordedRolandGarros
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Wimbledon"
                value={
                  liveStats.recordedWimbledon
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="US Open"
                value={
                  liveStats.recordedUsOpen
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Masters 1000"
                value={
                  liveStats.recordedMasters1000
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="ATP 500"
                value={
                  liveStats.recordedAtp500
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="ATP 250"
                value={
                  liveStats.recordedAtp250
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="ATP Finals"
                value={
                  liveStats.recordedAtpFinals
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Olympic Gold"
                value={
                  liveStats.recordedOlympicGold
                }
                accent={
                  champion.accent
                }
              />

              <SyncedStat
                label="Davis Cup"
                value={
                  liveStats.davisCupTitles
                }
                accent={
                  champion.accent
                }
              />
            </div>
          </div>
        ) : null}

        <ChapterTransition
          chapterLabel="End of Chapter V"
          title="Achievement becomes legacy."
          description={`Discover the influence, values and lasting impact that defined ${champion.firstName ?? champion.name} beyond trophies and records.`}
          href="#legacy-section"
          buttonLabel="Continue to the Legacy"
          accent={champion.accent}
        />
      </div>
    </section>
  );
}

function SyncedStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050b18]/70 p-4">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p
        className="mt-2 text-2xl font-black tracking-[-0.045em]"
        style={{
          color:
            accent,
        }}
      >
        {value}
      </p>
    </div>
  );
}