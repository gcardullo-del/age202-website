"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { Champion } from "@/data/champions";

type NextChampionProps = {
  champion: Champion;
  nextChampion: Champion;
};

const entranceTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const,
};

const cardTransition = {
  duration: 0.9,
  delay: 0.08,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function NextChampion({
  champion,
  nextChampion,
}: NextChampionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="next-champion-title"
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#030812]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[220px]"
        style={{
          backgroundColor: nextChampion.accent,
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={shouldReduceMotion ? undefined : entranceTransition}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor: nextChampion.accent,
                  boxShadow: `0 0 14px ${nextChampion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color: nextChampion.accent,
                }}
              >
                Continue the archive
              </p>
            </div>

            <h2
              id="next-champion-title"
              className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl"
            >
              One legacy ends.

              <span className="block text-white/25">
                Another begins.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-sm lg:pb-2 lg:text-right">
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25">
              Current archive · {champion.name}
              <br />
              Next record · {nextChampion.name}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 44,
                  scale: 0.99,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
          }
          viewport={{
            once: true,
            amount: 0.14,
          }}
          transition={shouldReduceMotion ? undefined : cardTransition}
          className="mt-20 sm:mt-24"
        >
          <Link
            href={`/archives/${nextChampion.slug}`}
            aria-label={`Explore the ${nextChampion.name} archive`}
            className="group relative block min-h-[620px] overflow-hidden rounded-[36px] border border-white/10 bg-[#07101e] outline-none transition duration-300 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030812] sm:min-h-[720px] lg:min-h-[780px] lg:rounded-[44px]"
          >
            <Image
              src={nextChampion.image}
              alt={nextChampion.name}
              fill
              sizes="(max-width: 768px) 100vw, 1440px"
              className={`object-cover object-top ease-out ${
                shouldReduceMotion
                  ? ""
                  : "transition duration-[1400ms] group-hover:scale-[1.045]"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020711] via-[#020711]/45 to-[#020711]/10" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#020711]/75 via-transparent to-transparent" />

            <div
              aria-hidden="true"
              className="absolute inset-x-[8%] top-0 h-px opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${nextChampion.accent}, transparent)`,
                boxShadow: `0 0 26px ${nextChampion.accent}`,
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 top-10 select-none text-right text-[90px] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white/[0.035] sm:text-[160px] lg:text-[230px]"
            >
              {nextChampion.lastName}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14 xl:p-16">
              <div className="max-w-5xl">
                <div className="flex flex-wrap items-center gap-3">
                  <ArchiveBadge
                    label="Next champion"
                    accent={nextChampion.accent}
                  />

                  <ArchiveBadge
                    label={nextChampion.nationality}
                    accent={nextChampion.accent}
                  />

                  <ArchiveBadge
                    label={`Debut ${nextChampion.debutYear}`}
                    accent={nextChampion.accent}
                  />
                </div>

                <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.28em] text-white/35">
                  AGE202 Digital Tennis Museum
                </p>

                <h3 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.065em] text-white sm:text-7xl lg:text-9xl">
                  <span className="block text-white/45">
                    {nextChampion.firstName}
                  </span>

                  <span className="block">
                    {nextChampion.lastName}
                  </span>
                </h3>

                <div className="mt-10 flex flex-col gap-7 border-t border-white/15 pt-7 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
                    Continue through the AGE202 archive and explore the career,
                    achievements and cultural legacy of {nextChampion.name}.
                  </p>

                  <div className="flex shrink-0 items-center gap-4">
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.22em]"
                      style={{
                        color: nextChampion.accent,
                      }}
                    >
                      Explore archive
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white/[0.035] ${
                        shouldReduceMotion
                          ? ""
                          : "transition duration-500 group-hover:translate-x-1 group-hover:bg-white/[0.08]"
                      }`}
                      style={{
                        borderColor: `${nextChampion.accent}75`,
                        boxShadow: `0 0 26px ${nextChampion.accent}15`,
                      }}
                    >
                      <ArrowIcon accent={nextChampion.accent} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <span>
            Archive transition · {champion.certificateId}
          </span>

          <span>
            Next record · {nextChampion.certificateId}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ARCHIVE BADGE
========================================================= */

type ArchiveBadgeProps = {
  label: string;
  accent: string;
};

function ArchiveBadge({
  label,
  accent,
}: ArchiveBadgeProps) {
  return (
    <span
      className="rounded-full border bg-black/25 px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] backdrop-blur-md"
      style={{
        color: accent,
        borderColor: `${accent}55`,
      }}
    >
      {label}
    </span>
  );
}

/* =========================================================
   ARROW ICON
========================================================= */

type ArrowIconProps = {
  accent: string;
};

function ArrowIcon({
  accent,
}: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M5 12H19"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M13 6L19 12L13 18"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}