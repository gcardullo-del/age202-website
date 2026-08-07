"use client";

import {
  motion,
} from "framer-motion";

import TrophyIcon from "./TrophyIcon";
import type {
  FeaturedTrophyProps,
} from "./types";

export default function FeaturedTrophy({
  value,
  accent,
  shouldReduceMotion,
}: FeaturedTrophyProps) {
  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 42,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="mt-20 w-full min-w-0 sm:mt-24"
    >
      <div className="group relative w-full min-w-0 rounded-[36px] border border-white/10 bg-[#08101f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]"
        >
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-[0.14] blur-[100px] transition-opacity duration-700 group-hover:opacity-[0.22]"
            style={{
              backgroundColor:
                accent,
            }}
          />

          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none text-[220px] font-black leading-none text-white/[0.025] sm:text-[320px] lg:text-[420px]">
            {value}
          </div>
        </div>

        <div className="relative z-10 grid w-full min-w-0 gap-10 px-8 pb-12 pt-14 sm:px-12 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-16 lg:pb-20 lg:pt-20">
          <div className="min-w-0">
            <p className="break-words py-1 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.2em] text-white/30">
              Primary achievement
            </p>

            <p
              className="mt-6 max-w-full break-words text-[82px] font-black leading-[0.95] tracking-[-0.035em] sm:text-[124px] lg:text-[168px]"
              style={{
                color: accent,
                textShadow:
                  `0 0 42px ${accent}20`,
              }}
            >
              {value}
            </p>

            <h3 className="mt-6 max-w-full break-words text-3xl font-black leading-[1.15] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Grand Slam titles
            </h3>

            <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
              The defining measure of
              championship excellence across
              Melbourne, Paris, London and New
              York.
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-4 lg:flex-col lg:items-end">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-white/[0.025] sm:h-24 sm:w-24"
              style={{
                borderColor:
                  `${accent}70`,
                boxShadow:
                  `0 0 40px ${accent}18`,
              }}
            >
              <TrophyIcon
                accent={accent}
              />
            </div>

            <div className="min-w-0 lg:text-right">
              <p className="break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-white/25">
                AGE202 verified record
              </p>

              <p
                className="mt-1 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.12em]"
                style={{
                  color: accent,
                }}
              >
                Elite classification
              </p>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            boxShadow:
              `0 0 24px ${accent}`,
          }}
        />
      </div>
    </motion.div>
  );
}
