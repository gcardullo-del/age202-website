"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Globe2,
  Trophy,
  Users,
} from "lucide-react";

type RankingHeroProps = {
  totalPlayers?: number;
  totalCountries?: number;
  lastUpdated?: string | null;
};

function formatUpdateDate(value?: string | null) {
  if (!value) {
    return "Updated weekly";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Updated weekly";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function RankingHero({
  totalPlayers = 150,
  totalCountries = 0,
  lastUpdated = null,
}: RankingHeroProps) {
  const formattedUpdate = formatUpdateDate(lastUpdated);

  const scrollToRanking = () => {
    document
      .getElementById("atp-ranking-table")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#020711]">
      <div className="absolute inset-0 -z-30 bg-[#020711]" />

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_22%,rgba(215,255,0,0.15),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(43,95,255,0.10),transparent_34%)]" />

      <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="absolute -right-32 top-12 -z-10 h-[420px] w-[420px] rounded-full border border-[#D7FF00]/10" />

      <div className="absolute -right-16 top-28 -z-10 h-[300px] w-[300px] rounded-full border border-[#D7FF00]/10" />

      <div className="absolute right-20 top-48 -z-10 h-[150px] w-[150px] rounded-full border border-[#D7FF00]/15" />

      <div className="mx-auto flex min-h-[720px] w-full max-w-[1600px] flex-col justify-between px-5 pb-8 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-10 lg:pt-40 xl:px-16">
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div>
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center gap-3 rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] px-4 py-2 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D7FF00] opacity-50" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D7FF00]" />
              </span>

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                Official ATP data experience
              </span>
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.32em] text-white/38"
            >
              AGE202 Tennis Intelligence
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 28,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.14,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-5 max-w-5xl text-[clamp(4.2rem,11vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[-0.085em] text-white"
            >
              ATP
              <span className="block text-[#D7FF00]">
                Rankings
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.22,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 max-w-2xl text-base leading-8 text-white/56 sm:text-lg"
            >
              Explore the world&apos;s Top 150 players and
              access their statistics, biographies and
              AGE202 collections from one definitive ranking
              experience.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={scrollToRanking}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#D7FF00] px-7 text-[10px] font-black uppercase tracking-[0.2em] text-[#020711] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_38px_rgba(215,255,0,0.24)]"
              >
                Explore rankings

                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </button>

              <div className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-6 backdrop-blur-xl">
                <CalendarDays
                  size={16}
                  className="text-[#D7FF00]"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                    Last update
                  </p>

                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/75">
                    {formattedUpdate}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.28,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div className="absolute -inset-10 -z-10 rounded-full bg-[#D7FF00]/[0.07] blur-3xl" />

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#050B18]/90 p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#D7FF00]/10 blur-3xl" />

                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.25em] text-[#D7FF00]">
                      Ranking overview
                    </p>

                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-white/80">
                      ATP Top 150
                    </p>
                  </div>

                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07]">
                    <Trophy
                      size={20}
                      className="text-[#D7FF00]"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.05]">
                        <Users
                          size={16}
                          className="text-[#D7FF00]"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">
                        Players
                      </span>
                    </div>

                    <p className="mt-7 text-4xl font-black tracking-[-0.06em] text-white">
                      {totalPlayers}
                    </p>

                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                      Ranked athletes
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.05]">
                        <Globe2
                          size={16}
                          className="text-[#D7FF00]"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">
                        Countries
                      </span>
                    </div>

                    <p className="mt-7 text-4xl font-black tracking-[-0.06em] text-white">
                      {totalCountries > 0
                        ? totalCountries
                        : "70+"}
                    </p>

                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                      Global representation
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-[#D7FF00]/15 bg-[#D7FF00]/[0.045] p-5">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
                        AGE202 connection
                      </p>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/48">
                        Select an eligible player to discover
                        statistics, stories and available
                        tennis apparel.
                      </p>
                    </div>

                    <div className="hidden h-12 w-px bg-white/10 sm:block" />

                    <span className="hidden rounded-full border border-white/10 bg-black/20 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/50 sm:inline-flex">
                      Player profiles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.65,
            duration: 0.7,
          }}
          className="mt-14 flex items-center justify-between gap-6 border-t border-white/10 pt-6"
        >
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.22em] text-white/25">
            Ranking · Statistics · Collections
          </p>

          <button
            type="button"
            onClick={scrollToRanking}
            aria-label="Scroll to ATP rankings"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/40 transition hover:border-[#D7FF00]/30 hover:bg-[#D7FF00]/[0.06] hover:text-[#D7FF00]"
          >
            <ChevronDown
              size={16}
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}