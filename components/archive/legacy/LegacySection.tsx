"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  Champion,
} from "@/data/champions";

import ChapterTransition from "../ui/ChapterTransition";
import MuseumHeading from "../ui/MuseumHeading";
import MuseumSection from "../ui/MuseumSection";

import LegacyCard from "./LegacyCard";
import LegacyStatement from "./LegacyStatement";

type LegacySectionProps = {
  champion: Champion;
};

export default function LegacySection({
  champion,
}: LegacySectionProps) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <MuseumSection
      id="legacy-section"
      accent={champion.accent}
      className="bg-[#07101e] py-24 sm:py-28 lg:py-40"
      withGrid
      withGlow={false}
      containerClassName="px-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-[210px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-64 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/[0.035]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-72 bottom-[-180px] h-[620px] w-[620px] rounded-full border border-white/[0.035]"
      />

      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 34,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.75,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <MuseumHeading
          eyebrow="Legacy"
          accent={champion.accent}
          title={
            <>
              Beyond victories.

              <span className="block text-white/25">
                Beyond generations.
              </span>
            </>
          }
          aside={
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25 lg:text-right">
              AGE202 cultural archive
              <br />
              Permanent historical record
            </p>
          }
        />
      </motion.div>

      <LegacyStatement
        champion={champion}
        shouldReduceMotion={
          shouldReduceMotion
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <LegacyCard
          index="01"
          title="Influence"
          description={`The impact of ${champion.name} reaches beyond results, shaping how future generations understand excellence in tennis.`}
          accent={champion.accent}
          delay={0}
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

        <LegacyCard
          index="02"
          title="Identity"
          description="Technique, personality and visual culture combine to create an unmistakable place in the history of the sport."
          accent={champion.accent}
          delay={0.08}
          shouldReduceMotion={
            shouldReduceMotion
          }
        />

        <LegacyCard
          index="03"
          title="Continuity"
          description="Every preserved story, image and archive piece ensures that this sporting legacy remains accessible over time."
          accent={champion.accent}
          delay={0.16}
          shouldReduceMotion={
            shouldReduceMotion
          }
        />
      </div>

      <ChapterTransition
        chapterLabel="End of Chapter VI"
        title="Legacy becomes collection."
        description={`Continue into the curated AGE202 collection and explore authentic museum artifacts connected to ${champion.firstName ?? champion.name}.`}
        href="#player-artifacts"
        buttonLabel="Visit the Collection"
        accent={champion.accent}
      />
    </MuseumSection>
  );
}
