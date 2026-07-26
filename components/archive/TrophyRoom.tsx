"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { Champion } from "@/data/champions";

type TrophyRoomProps = {
  champion: Champion;
};

type TrophyItem = {
  label: string;
  value: number;
  description: string;
};

export default function TrophyRoom({
  champion,
}: TrophyRoomProps) {
  const shouldReduceMotion = useReducedMotion();

  const trophyItems: TrophyItem[] = [
    {
      label: "Grand Slam Titles",
      value: champion.trophies.grandSlams,
      description:
        "Major championships won across the four Grand Slam tournaments.",
    },
    {
      label: "ATP Titles",
      value: champion.trophies.atpTitles,
      description:
        "Official tour-level singles titles collected throughout the career.",
    },
    {
      label: "Weeks at No. 1",
      value: champion.trophies.weeksAtNo1,
      description:
        "Total weeks spent at the summit of the ATP world rankings.",
    },
    {
      label: "Masters 1000",
      value: champion.trophies.masters1000,
      description:
        "Victories achieved at the highest tier below the Grand Slams.",
    },
  ];

  if (champion.trophies.olympicGold !== undefined) {
    trophyItems.push({
      label: "Olympic Gold",
      value: champion.trophies.olympicGold,
      description:
        "Gold medals earned on the Olympic stage during the champion's career.",
    });
  }

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#050b18] py-24 sm:py-28 lg:py-36">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[190px]"
        style={{
          backgroundColor: champion.accent,
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

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-end lg:gap-20">
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
              A statistical record of the achievements that define the
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
                value={String(trophyItems.length)}
              />

              <TrophyMeta
                label="Status"
                value="Verified"
                accent={champion.accent}
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            FEATURED GRAND SLAM CARD
        ====================================================== */}

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group relative mt-20 overflow-hidden rounded-[36px] border border-white/10 bg-[#08101f] sm:mt-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-[0.14] blur-[100px] transition-opacity duration-700 group-hover:opacity-[0.22]"
            style={{
              backgroundColor: champion.accent,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[220px] font-black leading-none text-white/[0.025] sm:text-[320px] lg:text-[420px]"
          >
            {champion.trophies.grandSlams}
          </div>

          <div className="relative grid gap-12 px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-16 lg:py-20">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                Primary achievement
              </p>

              <p
                className="mt-8 text-[96px] font-black leading-[0.75] tracking-[-0.09em] sm:text-[140px] lg:text-[190px]"
                style={{
                  color: champion.accent,
                  textShadow: `0 0 42px ${champion.accent}20`,
                }}
              >
                {champion.trophies.grandSlams}
              </p>

              <h3 className="mt-10 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                Grand Slam titles
              </h3>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                The defining measure of championship excellence across
                Melbourne, Paris, London and New York.
              </p>
            </div>

            <div className="flex items-center gap-4 lg:flex-col lg:items-end">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border bg-white/[0.025] sm:h-24 sm:w-24"
                style={{
                  borderColor: `${champion.accent}70`,
                  boxShadow: `0 0 40px ${champion.accent}18`,
                }}
              >
                <TrophyIcon accent={champion.accent} />
              </div>

              <div className="lg:text-right">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                  AGE202 verified record
                </p>

                <p
                  className="mt-2 text-[10px] font-black uppercase tracking-[0.16em]"
                  style={{
                    color: champion.accent,
                  }}
                >
                  Elite classification
                </p>
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
        </motion.div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trophyItems.slice(1).map((item, index) => (
            <motion.article
              key={item.label}
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
                delay: Math.min(index * 0.08, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative min-h-[310px] overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.025] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-[65px] transition-opacity duration-500 group-hover:opacity-[0.18]"
                style={{
                  backgroundColor: champion.accent,
                }}
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
                    Record {String(index + 2).padStart(2, "0")}
                  </span>

                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: champion.accent,
                      boxShadow: `0 0 12px ${champion.accent}`,
                    }}
                  />
                </div>

                <p
                  className="mt-12 text-7xl font-black leading-none tracking-[-0.07em] sm:text-8xl"
                  style={{
                    color: champion.accent,
                  }}
                >
                  {item.value}
                </p>

                <h3 className="mt-8 text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">
                  {item.label}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/40">
                  {item.description}
                </p>

                <div className="mt-auto pt-10">
                  <span
                    className="block h-px w-12 transition-all duration-500 group-hover:w-20"
                    style={{
                      backgroundColor: champion.accent,
                    }}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* =====================================================
            FOOTER REFERENCE
        ====================================================== */}

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:mt-28">
          <span>
            AGE202 Statistical Archive · {champion.name}
          </span>

          <span>
            Record reference · {champion.certificateId}
          </span>
        </div>
      </div>
    </section>
  );
}

type TrophyMetaProps = {
  label: string;
  value: string;
  accent?: string;
};

function TrophyMeta({
  label,
  value,
  accent,
}: TrophyMetaProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 backdrop-blur-xl">
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p
        className="mt-1 text-[10px] font-black uppercase tracking-[0.13em] text-white/60"
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

type TrophyIconProps = {
  accent: string;
};

function TrophyIcon({
  accent,
}: TrophyIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-9 w-9 sm:h-11 sm:w-11"
      fill="none"
    >
      <path
        d="M21 12H43V24C43 31.18 38.07 37.21 31.41 38.83C25.49 37.42 21 32.08 21 25.66V12Z"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <path
        d="M21 17H14V21C14 27.08 18.48 32.12 24.32 33"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M43 17H50V21C50 27.08 45.52 32.12 39.68 33"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M32 39V48"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M24 53H40"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M27 48H37"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}