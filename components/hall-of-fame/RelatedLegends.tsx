"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  players,
  type PlayerProfile,
} from "@/data/players";

type Props = {
  player: PlayerProfile;
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
    y: 36,
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

export default function RelatedLegends({
  player,
}: Props) {
  const relatedPlayers = players
    .filter(
      (currentPlayer) =>
        currentPlayer.slug !== player.slug,
    )
    .slice(0, 4);

  return (
    <section
      id="related-legends"
      className="relative isolate scroll-mt-28 overflow-hidden border-t border-white/10 bg-[#030711] py-24 md:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[980px] -translate-x-1/2 rounded-full blur-[150px]"
        style={{
          background: player.theme.glow,
          opacity: 0.08,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-10 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={sectionVariants}
        >
          <motion.div
            variants={cardVariants}
            className="grid gap-10 border-b border-white/10 pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="max-w-5xl">
              <div className="flex items-center gap-4">
                <span
                  className="h-px w-12"
                  style={{
                    backgroundColor:
                      player.theme.accent,
                  }}
                />

                <p
                  className="text-[11px] font-black uppercase tracking-[0.38em]"
                  style={{
                    color: player.theme.accent,
                  }}
                >
                  Related Legends
                </p>
              </div>

              <h2 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl md:text-7xl lg:text-[86px] lg:leading-[0.94]">
                Continue your journey
                <span className="block text-white/28">
                  through tennis history.
                </span>
              </h2>

              <p className="mt-8 max-w-3xl text-base leading-8 text-white/48 md:text-lg md:leading-9">
                Discover the champions who shaped different
                eras, styles and identities across the AGE202
                Hall of Fame.
              </p>
            </div>

            <div className="max-w-sm rounded-[28px] border border-white/10 bg-white/[0.025] p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                Current Exhibition
              </p>

              <p className="mt-4 text-lg font-black tracking-[-0.03em] text-white">
                {player.name}
              </p>

              <p
                className="mt-2 text-xs font-bold uppercase tracking-[0.2em]"
                style={{
                  color: player.theme.accent,
                }}
              >
                {player.nickname}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {relatedPlayers.map(
              (relatedPlayer, index) => {
                const accent =
                  relatedPlayer.theme.accent;
                const glow =
                  relatedPlayer.theme.glow;

                return (
                  <motion.div
                    key={relatedPlayer.slug}
                    variants={cardVariants}
                    className="h-full"
                  >
                    <Link
                      href={`/hall-of-fame/${relatedPlayer.slug}`}
                      aria-label={`Explore ${relatedPlayer.name}'s Hall of Fame exhibition`}
                      className="group relative flex h-full min-h-[610px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07101D] transition duration-700 hover:-translate-y-2"
                    >
                      <Image
                        src={relatedPlayer.cardImage}
                        alt={`${relatedPlayer.name} museum portrait`}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${relatedPlayer.theme.gradientTo} 4%, ${relatedPlayer.theme.gradientFrom}D9 38%, transparent 76%)`,
                        }}
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute -right-3 top-8 text-[120px] font-black leading-none tracking-[-0.1em] text-white/[0.055] transition duration-700 group-hover:-translate-x-2 group-hover:text-white/[0.09]"
                      >
                        {relatedPlayer.initials}
                      </div>

                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full blur-[90px] transition duration-700"
                        style={{
                          background: glow,
                          opacity: 0.08,
                        }}
                      />

                      <div className="relative z-10 flex w-full flex-col justify-between p-7 md:p-8">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/38">
                              Exhibition{" "}
                              {String(index + 1).padStart(
                                2,
                                "0",
                              )}
                            </p>

                            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                              {
                                relatedPlayer.countryCode
                              }
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
                            {relatedPlayer.status}
                          </span>
                        </div>

                        <div className="mt-auto pt-44">
                          <p
                            className="text-[10px] font-black uppercase tracking-[0.32em]"
                            style={{ color: accent }}
                          >
                            {relatedPlayer.nickname}
                          </p>

                          <h3 className="mt-4 text-3xl font-black tracking-[-0.055em] text-white md:text-4xl">
                            {relatedPlayer.firstName}
                            <span className="block text-white/42">
                              {relatedPlayer.lastName}
                            </span>
                          </h3>

                          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                            <div className="bg-black/25 p-4 backdrop-blur-sm">
                              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">
                                Grand Slams
                              </p>

                              <p className="mt-2 text-2xl font-black text-white">
                                {
                                  relatedPlayer.grandSlamTitles
                                }
                              </p>
                            </div>

                            <div className="bg-black/25 p-4 backdrop-blur-sm">
                              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">
                                Peak Ranking
                              </p>

                              <p className="mt-2 text-2xl font-black text-white">
                                No.{" "}
                                {
                                  relatedPlayer.highestRanking
                                }
                              </p>
                            </div>
                          </div>

                          <div className="mt-7 flex items-center justify-between border-t border-white/12 pt-5">
                            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40 transition-colors duration-500 group-hover:text-white">
                              Explore exhibition
                            </span>

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
              },
            )}
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="mt-16 flex flex-col gap-8 rounded-[34px] border border-white/10 bg-white/[0.025] px-7 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="max-w-3xl">
              <p
                className="text-[10px] font-black uppercase tracking-[0.34em]"
                style={{
                  color: player.theme.accent,
                }}
              >
                Hall of Fame Directory
              </p>

              <p className="mt-5 text-xl font-semibold leading-9 tracking-[-0.025em] text-white/72 md:text-2xl">
                Step beyond this exhibition and explore the
                complete collection of champions preserved
                inside the AGE202 museum.
              </p>
            </div>

            <Link
              href="/hall-of-fame"
              className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full border border-white/12 bg-white/[0.035] px-7 text-[10px] font-black uppercase tracking-[0.24em] text-white transition duration-500 hover:border-white/30 hover:bg-white/[0.07]"
            >
              View all legends

              <span
                className="transition-transform duration-500 group-hover:translate-x-1"
                style={{
                  color: player.theme.accent,
                }}
              >
                <ArrowIcon />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}