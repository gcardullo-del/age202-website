"use client";

import {
  motion,
} from "framer-motion";

import MuseumCard from "../ui/MuseumCard";

import type {
  LegacyCardProps,
} from "./types";

export default function LegacyCard({
  index,
  title,
  description,
  accent,
  delay,
  shouldReduceMotion,
}: LegacyCardProps) {
  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 32,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="min-w-0"
    >
      <MuseumCard
        accent={accent}
        className="h-full min-h-[280px] overflow-hidden rounded-[28px]"
        contentClassName="flex h-full flex-col p-8"
        radiusClassName="rounded-[28px]"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
            Principle {index}
          </span>

          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                accent,
              boxShadow:
                `0 0 12px ${accent}`,
            }}
          />
        </div>

        <h3 className="mt-12 text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
          {title}
        </h3>

        <p className="mt-5 text-sm leading-7 text-white/42 sm:text-base sm:leading-8">
          {description}
        </p>

        <div className="mt-auto pt-10">
          <span
            className="block h-px w-12 transition-all duration-500 group-hover:w-20"
            style={{
              backgroundColor:
                accent,
            }}
          />
        </div>
      </MuseumCard>
    </motion.article>
  );
}
