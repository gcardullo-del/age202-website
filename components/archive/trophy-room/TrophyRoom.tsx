"use client";

import {
  useReducedMotion,
} from "framer-motion";

import type {
  Champion,
} from "@/data/champions";

import ChapterTransition from "../ui/ChapterTransition";
import FeaturedTrophy from "./FeaturedTrophy";
import TrophyGrid from "./TrophyGrid";
import TrophyMeta from "./TrophyMeta";
import type {
  TrophyItem,
} from "./types";

type TrophyRoomProps = {
  champion: Champion;
};

export default function TrophyRoom({
  champion,
}: TrophyRoomProps) {
  const shouldReduceMotion =
    useReducedMotion();

  const trophyItems: TrophyItem[] = [
    {
      label: "Grand Slam Titles",
      value:
        champion.trophies.grandSlams,
      description:
        "Major championships won across the four Grand Slam tournaments.",
    },
    {
      label: "ATP Titles",
      value:
        champion.trophies.atpTitles,
      description:
        "Official tour-level singles titles collected throughout the career.",
    },
    {
      label: "Weeks at No. 1",
      value:
        champion.trophies.weeksAtNo1,
      description:
        "Total weeks spent at the summit of the ATP world rankings.",
    },
    {
      label: "Masters 1000",
      value:
        champion.trophies.masters1000,
      description:
        "Victories achieved at the highest tier below the Grand Slams.",
    },
  ];

  if (
    champion.trophies
      .olympicGold !== undefined
  ) {
    trophyItems.push({
      label: "Olympic Gold",
      value:
        champion.trophies.olympicGold,
      description:
        "Gold medals earned on the Olympic stage during the champion's career.",
    });
  }

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
                value="Career achievements"
              />

              <TrophyMeta
                label="Recorded categories"
                value={String(
                  trophyItems.length,
                )}
              />

              <TrophyMeta
                label="Status"
                value="Verified"
                accent={
                  champion.accent
                }
              />
            </div>
          </div>
        </div>

        <FeaturedTrophy
          value={
            champion.trophies
              .grandSlams
          }
          accent={
            champion.accent
          }
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

        <TrophyGrid
          items={trophyItems.slice(1)}
          accent={
            champion.accent
          }
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

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
