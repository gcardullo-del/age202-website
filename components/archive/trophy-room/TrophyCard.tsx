"use client";

import {
  motion,
} from "framer-motion";

import type {
  TrophyCardProps,
} from "./types";

export default function TrophyCard({
  item,
  index,
  accent,
  shouldReduceMotion,
}: TrophyCardProps) {
  return (
    <motion.article
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
        amount: 0.25,
      }}
      transition={{
        duration: 0.7,
        delay: Math.min(
          index * 0.08,
          0.3,
        ),
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="h-full min-w-0"
    >
      <div className="group relative h-full min-h-[300px] w-full min-w-0 rounded-[30px] border border-white/10 bg-white/[0.025] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]"
        >
          <div
            className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-[65px] transition-opacity duration-500 group-hover:opacity-[0.18]"
            style={{
              backgroundColor:
                accent,
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-w-0 flex-col px-7 pb-8 pt-9 sm:px-8">
          <div className="flex min-h-8 min-w-0 items-center justify-between gap-4">
            <span className="min-w-0 break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.16em] text-white/25">
              Record{" "}
              {String(
                index + 2,
              ).padStart(
                2,
                "0",
              )}
            </span>

            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  accent,
                boxShadow:
                  `0 0 12px ${accent}`,
              }}
            />
          </div>

          <p
            className="mt-6 max-w-full break-words text-6xl font-black leading-[1.04] tracking-[-0.025em] sm:text-7xl"
            style={{
              color: accent,
            }}
          >
            {item.value}
          </p>

          <h3 className="mt-5 max-w-full break-words text-xl font-black leading-[1.25] tracking-[-0.02em] text-white sm:text-2xl">
            {item.label}
          </h3>

          <p className="mt-3 max-w-full break-words text-sm leading-7 text-white/40">
            {item.description}
          </p>

          <div className="mt-auto pt-8">
            <span
              className="block h-px w-12 transition-all duration-500 group-hover:w-20"
              style={{
                backgroundColor:
                  accent,
              }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
