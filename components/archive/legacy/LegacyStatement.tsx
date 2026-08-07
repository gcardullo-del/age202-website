"use client";

import {
  motion,
} from "framer-motion";

import type {
  Champion,
} from "@/data/champions";

import MuseumPanel from "../ui/MuseumPanel";

import LegacyDetail from "./LegacyDetail";
import LegacyMark from "./LegacyMark";

type LegacyStatementProps = {
  champion: Champion;
  shouldReduceMotion: boolean | null;
};

export default function LegacyStatement({
  champion,
  shouldReduceMotion,
}: LegacyStatementProps) {
  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 44,
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
        duration: 0.85,
        delay: 0.08,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="mt-20 sm:mt-24"
    >
      <MuseumPanel
        className="overflow-hidden rounded-[38px] bg-[#050b18]/85 backdrop-blur-2xl"
        radiusClassName="rounded-[38px]"
        decoration={
          <>
            <div className="absolute -right-10 top-0 select-none text-right text-[90px] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white/[0.018] sm:text-[150px] lg:text-[230px]">
              {champion.lastName}
            </div>

            <div
              className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-[0.1] blur-[140px] transition-opacity duration-700 group-hover:opacity-[0.16]"
              style={{
                backgroundColor:
                  champion.accent,
              }}
            />
          </>
        }
        footerDecoration={
          <div
            className="h-px w-full"
            style={{
              background:
                `linear-gradient(90deg, transparent, ${champion.accent}, transparent)`,
              boxShadow:
                `0 0 24px ${champion.accent}`,
            }}
          />
        }
      >
        <div className="relative grid lg:grid-cols-[0.34fr_1fr]">
          <div className="border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border bg-white/[0.025] sm:h-24 sm:w-24"
              style={{
                borderColor:
                  `${champion.accent}70`,
                boxShadow:
                  `0 0 42px ${champion.accent}18`,
              }}
            >
              <LegacyMark
                accent={
                  champion.accent
                }
              />
            </div>

            <p className="mt-12 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
              Cultural classification
            </p>

            <p
              className="mt-3 text-sm font-black uppercase tracking-[0.13em]"
              style={{
                color:
                  champion.accent,
              }}
            >
              Permanent legacy
            </p>

            <div className="mt-10 space-y-7">
              <LegacyDetail
                label="Subject"
                value={champion.name}
              />

              <LegacyDetail
                label="Nationality"
                value={
                  champion.nationality
                }
              />

              <LegacyDetail
                label="Archive reference"
                value={
                  champion.certificateId
                }
                accent={
                  champion.accent
                }
              />
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-16 xl:p-20">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
              Historical significance
            </p>

            <blockquote className="mt-10 max-w-5xl text-3xl font-light leading-[1.35] tracking-[-0.035em] text-white/90 sm:text-4xl sm:leading-[1.3] lg:text-5xl lg:leading-[1.28]">
              {champion.legacy}
            </blockquote>

            <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">
                  Preserved by
                </p>

                <p
                  className="mt-2 text-sm font-black uppercase tracking-[0.16em]"
                  style={{
                    color:
                      champion.accent,
                  }}
                >
                  AGE202 Digital Tennis Museum
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      champion.accent,
                    boxShadow:
                      `0 0 16px ${champion.accent}`,
                  }}
                />

                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                  Verified archive narrative
                </span>
              </div>
            </div>
          </div>
        </div>
      </MuseumPanel>
    </motion.article>
  );
}
