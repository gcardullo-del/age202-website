"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { Champion } from "@/data/champions";

type LegacySectionProps = {
  champion: Champion;
};

export default function LegacySection({
  champion,
}: LegacySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#07101e] py-24 sm:py-28 lg:py-40">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-[210px]"
        style={{
          backgroundColor: champion.accent,
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

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor: champion.accent,
                  boxShadow: `0 0 14px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color: champion.accent,
                }}
              >
                Legacy
              </p>
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              Beyond victories.
              <span className="block text-white/25">
                Beyond generations.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-sm lg:pb-2 lg:text-right">
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25">
              AGE202 cultural archive
              <br />
              Permanent historical record
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            LEGACY STATEMENT
        ====================================================== */}

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group relative mt-20 overflow-hidden rounded-[38px] border border-white/10 bg-[#050b18]/85 backdrop-blur-2xl sm:mt-24"
        >
          {/* Decorative name */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-0 select-none text-right text-[90px] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white/[0.018] sm:text-[150px] lg:text-[230px]"
          >
            {champion.lastName}
          </div>

          {/* Accent glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-[0.1] blur-[140px] transition-opacity duration-700 group-hover:opacity-[0.16]"
            style={{
              backgroundColor: champion.accent,
            }}
          />

          <div className="relative grid lg:grid-cols-[0.34fr_1fr]">
            {/* Archive marker */}

            <div className="border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border bg-white/[0.025] sm:h-24 sm:w-24"
                style={{
                  borderColor: `${champion.accent}70`,
                  boxShadow: `0 0 42px ${champion.accent}18`,
                }}
              >
                <LegacyMark accent={champion.accent} />
              </div>

              <p className="mt-12 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                Cultural classification
              </p>

              <p
                className="mt-3 text-sm font-black uppercase tracking-[0.13em]"
                style={{
                  color: champion.accent,
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
                  value={champion.nationality}
                />

                <LegacyDetail
                  label="Archive reference"
                  value={champion.certificateId}
                  accent={champion.accent}
                />
              </div>
            </div>

            {/* Main statement */}

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
                      color: champion.accent,
                    }}
                  >
                    AGE202 Digital Tennis Museum
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: champion.accent,
                      boxShadow: `0 0 16px ${champion.accent}`,
                    }}
                  />

                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                    Verified archive narrative
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${champion.accent}, transparent)`,
              boxShadow: `0 0 24px ${champion.accent}`,
            }}
          />
        </motion.article>

        {/* =====================================================
            LEGACY PRINCIPLES
        ====================================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <LegacyCard
            index="01"
            title="Influence"
            description={`The impact of ${champion.name} reaches beyond results, shaping how future generations understand excellence in tennis.`}
            accent={champion.accent}
            delay={0}
            shouldReduceMotion={shouldReduceMotion}
          />

          <LegacyCard
            index="02"
            title="Identity"
            description="Technique, personality and visual culture combine to create an unmistakable place in the history of the sport."
            accent={champion.accent}
            delay={0.08}
            shouldReduceMotion={shouldReduceMotion}
          />

          <LegacyCard
            index="03"
            title="Continuity"
            description="Every preserved story, image and archive piece ensures that this sporting legacy remains accessible over time."
            accent={champion.accent}
            delay={0.16}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* =====================================================
            FOOTER REFERENCE
        ====================================================== */}

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:mt-28">
          <span>
            AGE202 Legacy Registry · {champion.name}
          </span>

          <span>
            Cultural record · {champion.certificateId}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEGACY CARD
========================================================= */

type LegacyCardProps = {
  index: string;
  title: string;
  description: string;
  accent: string;
  delay: number;
  shouldReduceMotion: boolean | null;
};

function LegacyCard({
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
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.16]"
        style={{
          backgroundColor: accent,
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
            Principle {index}
          </span>

          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 12px ${accent}`,
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
              backgroundColor: accent,
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   LEGACY DETAIL
========================================================= */

type LegacyDetailProps = {
  label: string;
  value: string;
  accent?: string;
};

function LegacyDetail({
  label,
  value,
  accent,
}: LegacyDetailProps) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p
        className="mt-2 text-[10px] font-black uppercase leading-5 tracking-[0.12em] text-white/65"
        style={
          accent
            ? {
                color: accent,
              }
            : undefined
        }
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   LEGACY MARK
========================================================= */

type LegacyMarkProps = {
  accent: string;
};

function LegacyMark({
  accent,
}: LegacyMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-10 w-10 sm:h-12 sm:w-12"
      fill="none"
    >
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke={accent}
        strokeWidth="2.4"
      />

      <circle
        cx="32"
        cy="32"
        r="12"
        stroke={accent}
        strokeWidth="2.4"
        opacity="0.5"
      />

      <path
        d="M32 8V18"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M32 46V56"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M8 32H18"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M46 32H56"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <circle
        cx="32"
        cy="32"
        r="3.5"
        fill={accent}
      />
    </svg>
  );
}