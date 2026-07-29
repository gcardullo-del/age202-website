"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import type { PlayerProfile, PlayerTrophy } from "@/data/players";

type Props = {
  player: PlayerProfile;
};

const slamRoutes: Record<PlayerTrophy["tournament"], string> = {
  "Australian Open": "/results/grand-slams/australian-open",
  "Roland Garros": "/results/grand-slams/roland-garros",
  Wimbledon: "/results/grand-slams/wimbledon",
  "US Open": "/results/grand-slams/us-open",
};

const slamMetadata: Record<
  PlayerTrophy["tournament"],
  {
    code: string;
    location: string;
    surface: string;
    gradient: string;
    number: string;
  }
> = {
  "Australian Open": {
    code: "AO",
    location: "Melbourne",
    surface: "Hard Court",
    gradient: "from-sky-400/20 via-blue-500/10 to-transparent",
    number: "01",
  },
  "Roland Garros": {
    code: "RG",
    location: "Paris",
    surface: "Clay Court",
    gradient: "from-orange-400/20 via-red-500/10 to-transparent",
    number: "02",
  },
  Wimbledon: {
    code: "W",
    location: "London",
    surface: "Grass Court",
    gradient: "from-emerald-400/20 via-green-500/10 to-transparent",
    number: "03",
  },
  "US Open": {
    code: "US",
    location: "New York",
    surface: "Hard Court",
    gradient: "from-cyan-400/20 via-indigo-500/10 to-transparent",
    number: "04",
  },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 42,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function TrophyIcon({
  accent,
}: {
  accent: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 140"
      className="h-28 w-24 md:h-32 md:w-28"
      fill="none"
    >
      <defs>
        <linearGradient
          id="trophy-metal"
          x1="18"
          y1="12"
          x2="98"
          y2="128"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.96" />
          <stop offset="0.32" stopColor={accent} stopOpacity="0.88" />
          <stop offset="0.68" stopColor="white" stopOpacity="0.42" />
          <stop offset="1" stopColor={accent} stopOpacity="0.72" />
        </linearGradient>

        <filter
          id="trophy-glow"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
        >
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.45 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#trophy-glow)">
        <path
          d="M36 18H84V42C84 62.987 73.255 80 60 80C46.745 80 36 62.987 36 42V18Z"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
        />
        <path
          d="M36 28H23C18.582 28 15 31.582 15 36V40C15 54.359 26.641 66 41 66"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M84 28H97C101.418 28 105 31.582 105 36V40C105 54.359 93.359 66 79 66"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M60 80V105"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M43 105H77"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M34 120H86"
          stroke="url(#trophy-metal)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M43 105L38 120M77 105L82 120"
          stroke="url(#trophy-metal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M4 10H16M11 5L16 10L11 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlayerTrophyCabinet({
  player,
}: Props) {
  const totalGrandSlamTitles = player.trophies.reduce(
    (total, trophy) => total + trophy.titles,
    0,
  );

  const wonEveryMajor = player.trophies.every(
    (trophy) => trophy.titles > 0,
  );

  const accent = player.theme.accent;
  const glow = player.theme.glow;

  return (
    <section
      id="trophy-cabinet"
      className="relative isolate scroll-mt-28 overflow-hidden border-y border-white/10 bg-[#040914] py-24 md:py-32 lg:py-40"
      style={
        {
          "--player-accent": accent,
          "--player-glow": glow,
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-[150px]"
        style={{
          background: glow,
          opacity: 0.1,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.48,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <motion.div
            variants={cardVariants}
            className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="max-w-5xl">
              <div className="flex items-center gap-4">
                <span
                  className="h-px w-12"
                  style={{ backgroundColor: accent }}
                />

                <p
                  className="text-[11px] font-black uppercase tracking-[0.38em]"
                  style={{ color: accent }}
                >
                  Trophy Cabinet
                </p>
              </div>

              <h2 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl md:text-7xl lg:text-[86px] lg:leading-[0.94]">
                The trophies
                <span className="block text-white/28">
                  that define the legend.
                </span>
              </h2>

              <p className="mt-8 max-w-3xl text-base leading-8 text-white/48 md:text-lg md:leading-9">
                Every Grand Slam title won by {player.name},
                preserved as part of the AGE202 Hall of Fame.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 sm:min-w-[360px]">
              <div className="bg-[#07101D]/95 p-6 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
                  Major Titles
                </p>

                <p
                  className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-5xl"
                  style={{ color: accent }}
                >
                  {totalGrandSlamTitles}
                </p>
              </div>

              <div className="bg-[#07101D]/95 p-6 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
                  Collection
                </p>

                <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white md:text-base">
                  {wonEveryMajor
                    ? "Career Grand Slam"
                    : "Major Champion"}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-14 flex items-center justify-between gap-6">
            <motion.p
              variants={cardVariants}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/28"
            >
              Grand Slam Exhibition · Four Galleries
            </motion.p>

            <motion.p
              variants={cardVariants}
              className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-white/28 sm:block"
            >
              Select a trophy to enter the archive
            </motion.p>
          </div>

          <motion.div
            variants={sectionVariants}
            className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {player.trophies.map((trophy) => {
              const metadata = slamMetadata[trophy.tournament];

              return (
                <motion.div
                  key={trophy.tournament}
                  variants={cardVariants}
                  className="h-full"
                >
                  <Link
                    href={slamRoutes[trophy.tournament]}
                    aria-label={`Explore the ${trophy.tournament} archive`}
                    className="group relative flex h-full min-h-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07101D]/92 p-7 transition duration-700 hover:-translate-y-2 hover:border-[color:var(--player-accent)]/40 md:p-9"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br ${metadata.gradient} opacity-40 transition-opacity duration-700 group-hover:opacity-100`}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute -right-7 top-5 text-[120px] font-black leading-none tracking-[-0.1em] text-white/[0.025] transition duration-700 group-hover:-translate-x-2 group-hover:text-white/[0.045]"
                    >
                      {metadata.number}
                    </div>

                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-20 h-44 w-44 -translate-x-1/2 rounded-full blur-[70px] transition-opacity duration-700"
                      style={{
                        background: glow,
                        opacity: 0.06,
                      }}
                    />

                    <div className="relative flex w-full flex-col">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/30">
                            Gallery {metadata.number}
                          </p>

                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/52">
                            {metadata.code}
                          </p>
                        </div>

                        <span
                          className="rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.22em]"
                          style={{
                            borderColor: `${accent}45`,
                            color: accent,
                            backgroundColor: `${accent}0D`,
                          }}
                        >
                          {metadata.surface}
                        </span>
                      </div>

                      <div className="flex flex-1 items-center justify-center py-12">
                        <motion.div
                          whileHover={{
                            scale: 1.06,
                            rotate: 1.5,
                          }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="relative"
                        >
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full blur-3xl"
                            style={{
                              background: glow,
                              opacity: 0.13,
                            }}
                          />

                          <TrophyIcon accent={accent} />
                        </motion.div>
                      </div>

                      <div className="border-t border-white/10 pt-7">
                        <div className="flex items-end justify-between gap-5">
                          <div>
                            <p className="max-w-[220px] text-2xl font-black tracking-[-0.045em] text-white">
                              {trophy.tournament}
                            </p>

                            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/32">
                              {metadata.location}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className="text-6xl font-black leading-none tracking-[-0.08em]"
                              style={{ color: accent }}
                            >
                              {trophy.titles}
                            </p>

                            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">
                              {trophy.titles === 1
                                ? "Title"
                                : "Titles"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/35 transition-colors duration-500 group-hover:text-white">
                          <span>Enter exhibition</span>

                          <span
                            className="transition-transform duration-500 group-hover:translate-x-1"
                            style={{ color: accent }}
                          >
                            <ArrowIcon />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="relative mt-16 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.025] px-7 py-10 md:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
              }}
            />

            <div className="max-w-3xl">
              <p
                className="text-[10px] font-black uppercase tracking-[0.34em]"
                style={{ color: accent }}
              >
                Curator&apos;s Record
              </p>

              <p className="mt-5 text-xl font-semibold leading-9 tracking-[-0.025em] text-white/72 md:text-2xl">
                {player.name}&apos;s Grand Slam collection contains{" "}
                <span className="text-white">
                  {totalGrandSlamTitles} major titles
                </span>
                , distributed across the four most prestigious stages
                in tennis.
              </p>
            </div>

            <div className="mt-9 flex items-center gap-5 lg:mt-0">
              <div className="h-px w-12 bg-white/15" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
                AGE202 · Permanent Collection
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="mt-8 flex justify-end"
          >
            <a
              href="#related-legends"
              className="group flex w-full items-center justify-between rounded-full border border-white/12 bg-white/[0.035] px-5 py-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07] sm:w-auto sm:min-w-[320px]"
            >
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/28">
                  Continue the Exhibition
                </p>

                <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">
                  Related Legends
                </p>
              </div>

              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-black transition-transform duration-500 group-hover:translate-y-1"
                style={{
                  backgroundColor: accent,
                }}
              >
                ↓
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}