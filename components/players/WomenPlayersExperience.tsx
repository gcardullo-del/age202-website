

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  Crown,
  Globe2,
  LibraryBig,
  MapPin,
  Shirt,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";


export type WomenFeaturedPlayerCard = {
  id: string;
  name: string;
  slug: string;

  country: string | null;
  countryCode: string | null;

  rank: number | null;
  previousRank: number | null;

  points: number | null;
  age: number | null;

  portraitImage: string | null;

  artifactCount: number;

  href: string;
};


export type NationSummary = {
  country: string;
  count: number;
};


type WomenPlayersExperienceProps = {
  featuredPlayers:
    WomenFeaturedPlayerCard[];

  wtaPlayerCount:
    number;

  totalArtifactCount:
    number;

  nations:
    NationSummary[];
};


const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};


const easePremium =
  [
    0.22,
    1,
    0.36,
    1,
  ] as const;


function rankingMovement(
  player: WomenFeaturedPlayerCard,
): string {
  if (
    player.rank === null ||
    player.previousRank === null
  ) {
    return "Current WTA ranking";
  }


  const movement =
    player.previousRank -
    player.rank;


  if (
    movement > 0
  ) {
    return `▲ ${movement} from previous AGE202 snapshot`;
  }


  if (
    movement < 0
  ) {
    return `▼ ${Math.abs(
      movement,
    )} from previous AGE202 snapshot`;
  }


  return "No ranking movement";
}


function artifactLabel(
  count: number,
): string {
  return count === 1
    ? "1 archived piece"
    : `${count} archived pieces`;
}


function statValue(
  value: number | null,
): string {
  if (
    value === null
  ) {
    return "—";
  }


  return value.toLocaleString(
    "en-US",
  );
}


export default function WomenPlayersExperience({
  featuredPlayers,
  wtaPlayerCount,
  totalArtifactCount,
  nations,
}: WomenPlayersExperienceProps) {
  const shouldReduceMotion =
    useReducedMotion();


  const stats = [
    {
      value:
        featuredPlayers.length,

      label:
        "Top players featured",

      icon:
        Trophy,
    },

    {
      value:
        wtaPlayerCount,

      label:
        "WTA players indexed",

      icon:
        Users,
    },

    {
      value:
        totalArtifactCount,

      label:
        "Published artifacts",

      icon:
        Shirt,
    },
  ];


  return (
    <div className="overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate min-h-[720px] overflow-hidden border-b border-white/10 bg-[#020611] md:min-h-[780px] lg:min-h-[840px]">
        <div className="absolute inset-0">
          <motion.div
            initial={{
              opacity:
                0,

              scale:
                shouldReduceMotion
                  ? 1
                  : 1.04,
            }}
            animate={{
              opacity:
                1,

              scale:
                1,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0
                  : 1.2,

              ease:
                easePremium,
            }}
            className="absolute inset-0"
          >
            <Image
              src="/players/players-trophies-hero.png"
              alt="AGE202 women's professional tennis archive"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_54%]"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,0.98)_24%,rgba(2,6,17,0.82)_46%,rgba(2,6,17,0.38)_70%,rgba(2,6,17,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.12)_0%,rgba(2,6,17,0.02)_45%,#020611_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(200,255,0,0.13),transparent_24%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>


        <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1480px] items-start gap-10 px-6 pb-24 pt-10 sm:px-10 sm:pt-12 md:min-h-[780px] md:pb-28 lg:min-h-[840px] lg:grid-cols-[1.18fr_0.52fr] lg:px-14 lg:pb-32 lg:pt-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden:
                {},

              visible: {
                transition: {
                  staggerChildren:
                    shouldReduceMotion
                      ? 0
                      : 0.11,

                  delayChildren:
                    shouldReduceMotion
                      ? 0
                      : 0.15,
                },
              },
            }}
            className="max-w-4xl"
          >
            <motion.div
              variants={
                fadeUp
              }
              transition={{
                duration:
                  0.72,

                ease:
                  easePremium,
              }}
              className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C8FF00]"
            >
              <span className="h-px w-10 bg-[#C8FF00]" />

              <Crown className="h-3.5 w-3.5" />

              Women · Current tour
            </motion.div>


            <motion.h1
              variants={
                fadeUp
              }
              transition={{
                duration:
                  0.85,

                ease:
                  easePremium,
              }}
              className="max-w-4xl text-[clamp(4.2rem,9vw,8.4rem)] font-black uppercase leading-[0.8] tracking-[-0.075em]"
            >
              Women
            </motion.h1>


            <motion.p
              variants={
                fadeUp
              }
              transition={{
                duration:
                  0.72,

                ease:
                  easePremium,
              }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
            >
              Explore the women shaping professional tennis today through a
              living AGE202 archive connected to the current WTA ranking.
            </motion.p>


            <motion.div
              variants={
                fadeUp
              }
              transition={{
                duration:
                  0.72,

                ease:
                  easePremium,
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="#featured-women"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#C8FF00] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#050B18] shadow-[0_14px_40px_rgba(200,255,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_46px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
              >
                Explore players

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>


              <Link
                href="/players/women/archive"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/25 bg-white/[0.07] px-7 text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/60 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
              >
                Open WTA Archive

                <LibraryBig className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>


          <motion.div
            initial={{
              opacity:
                0,

              x:
                shouldReduceMotion
                  ? 0
                  : 34,

              y:
                shouldReduceMotion
                  ? 0
                  : 18,
            }}
            animate={{
              opacity:
                1,

              x:
                0,

              y:
                0,
            }}
            transition={{
              delay:
                shouldReduceMotion
                  ? 0
                  : 0.32,

              duration:
                shouldReduceMotion
                  ? 0
                  : 0.8,

              ease:
                easePremium,
            }}
            className="mt-8 w-full max-w-[290px] rounded-[22px] border border-[#C8FF00]/20 bg-[#07101D]/84 p-4 shadow-[0_22px_62px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-4 lg:absolute lg:bottom-8 lg:left-14 lg:mt-0"
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8FF00]">
                  AGE202 index
                </div>

                <div className="mt-1 text-[11px] text-white/44">
                  Live women archive
                </div>
              </div>

              <Globe2 className="h-5 w-5 text-[#C8FF00]" />
            </div>


            <div>
              {stats.map(
                (
                  stat,
                ) => {
                  const Icon =
                    stat.icon;

                  return (
                    <div
                      key={
                        stat.label
                      }
                      className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#C8FF00]/18 bg-[#C8FF00]/10 text-[#C8FF00]">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="text-[9px] uppercase tracking-[0.14em] text-white/52 sm:text-[10px]">
                          {
                            stat.label
                          }
                        </span>
                      </div>

                      <span className="text-2xl font-black tracking-[-0.05em] text-white">
                        {
                          stat.value
                        }
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </motion.div>
        </div>


        <Link
          href="#featured-women"
          aria-label="Scroll to featured women"
          className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/55 transition-colors hover:text-[#C8FF00] lg:flex"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.32em]">
            Discover players
          </span>

          <ArrowDown className="h-4 w-4 animate-bounce" />
        </Link>
      </section>


      <section
        id="featured-women"
        className="relative mx-auto w-full max-w-[1480px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      >
        <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF00]">
              <Sparkles className="h-4 w-4" />

              01 · Current leaders
            </div>

            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              WTA Top Five
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-base">
            The leading players in the current AGE202 WTA snapshot, presented
            through the same museum language used across the men&apos;s archive.
          </p>
        </div>


        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
          {featuredPlayers.map(
            (
              player,
              index,
            ) => {
              const isLarge =
                index === 0 ||
                index === 3;


              return (
                <motion.article
                  key={
                    player.id
                  }
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once:
                      true,

                    amount:
                      0.18,
                  }}
                  variants={
                    fadeUp
                  }
                  transition={{
                    duration:
                      0.65,

                    delay:
                      Math.min(
                        index *
                          0.06,
                        0.24,
                      ),

                    ease:
                      easePremium,
                  }}
                  className={`group relative min-h-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07101D] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(0,0,0,0.38)] ${
                    isLarge
                      ? "xl:col-span-7"
                      : "xl:col-span-5"
                  }`}
                >
                  {player.portraitImage ? (
                    <Image
                      src={
                        player.portraitImage
                      }
                      alt={
                        player.name
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 58vw"
                      className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(200,255,0,0.14),transparent_30%),linear-gradient(145deg,#0A1527,#040813)]" />

                      <div className="absolute right-[-3rem] top-[-3rem] text-[16rem] font-black leading-none tracking-[-0.09em] text-white/[0.025]">
                        {String(
                          player.rank ??
                            index +
                              1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>
                    </div>
                  )}


                  <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-[#030711]/38 to-transparent" />


                  <div className="absolute inset-x-0 top-0 h-1 bg-[#C8FF00] opacity-90" />


                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#C8FF00]/25 bg-[#C8FF00]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8FF00] backdrop-blur-md">
                        WTA #
                        {
                          player.rank ??
                          "—"
                        }
                      </span>

                      {player.country ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/62 backdrop-blur-md">
                          <MapPin className="h-3 w-3" />

                          {
                            player.country
                          }
                        </span>
                      ) : null}
                    </div>


                    <h3 className="max-w-3xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                      {
                        player.name
                      }
                    </h3>


                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62">
                      {
                        rankingMovement(
                          player,
                        )
                      }
                    </p>


                    <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/12 pt-6">
                      <div>
                        <div className="text-xl font-black text-white">
                          {
                            statValue(
                              player.points,
                            )
                          }
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
                          WTA points
                        </div>
                      </div>


                      <div>
                        <div className="text-xl font-black text-white">
                          {
                            player.age ??
                            "—"
                          }
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
                          Age
                        </div>
                      </div>


                      <div>
                        <div className="text-xl font-black text-white">
                          {
                            player.artifactCount
                          }
                        </div>

                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/42">
                          {
                            artifactLabel(
                              player.artifactCount,
                            )
                          }
                        </div>
                      </div>
                    </div>


                    <div className="mt-7">
                      <Link
                        href={
                          player.href
                        }
                        className="group/button relative z-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#050B18] shadow-[0_10px_26px_rgba(200,255,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(255,255,255,0.15)]"
                        aria-label={`Explore ${player.name} profile`}
                      >
                        Explore player

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            },
          )}
        </div>
      </section>


      <section className="border-y border-white/10 bg-[#030711]">
        <div className="mx-auto grid w-full max-w-[1480px] gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once:
                true,

              amount:
                0.25,
            }}
            variants={
              fadeUp
            }
            transition={{
              duration:
                0.65,

              ease:
                easePremium,
            }}
            className="group relative min-h-[500px] overflow-hidden rounded-[34px] border border-white/10"
          >
            <Image
              src="/players/other-players/hero.png"
              alt="AGE202 WTA Archive"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-[#030711]/40 to-[#030711]/10" />

            <div className="absolute left-7 top-7 rounded-full border border-[#C8FF00]/35 bg-[#C8FF00]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C8FF00] backdrop-blur-md">
              Live Top 50 index
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
                02 · The women&apos;s tour
              </div>

              <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-7xl">
                WTA Archive
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Discover the current generation through a dynamic AGE202 archive
                connected to the WTA Top 50.
              </p>

              <Link
                href="/players/women/archive"
                className="group/button relative z-10 mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#C8FF00] px-7 text-sm font-black uppercase tracking-[0.1em] text-[#050B18] shadow-[0_14px_36px_rgba(200,255,0,0.15)] transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                Enter WTA Archive

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Link>
            </div>
          </motion.div>


          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once:
                true,

              amount:
                0.25,
            }}
            variants={
              fadeUp
            }
            transition={{
              duration:
                0.65,

              delay:
                0.08,

              ease:
                easePremium,
            }}
            className="flex flex-col justify-between rounded-[34px] border border-white/10 bg-[#07101D] p-8 sm:p-10"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8FF00]/10 text-[#C8FF00]">
                <Globe2 className="h-6 w-6" />
              </div>

              <div className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                Browse the archive
              </div>

              <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl">
                Players by nation
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/58">
                A snapshot of the countries represented in the current AGE202 WTA
                archive.
              </p>
            </div>


            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {nations.length > 0 ? (
                nations.map(
                  (
                    nation,
                    index,
                  ) => (
                    <div
                      key={
                        nation.country
                      }
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-white/28">
                          {String(
                            index +
                              1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="font-semibold text-white/82">
                          {
                            nation.country
                          }
                        </span>
                      </div>

                      <span className="rounded-full bg-white/6 px-3 py-1 text-xs font-bold text-white/52">
                        {
                          nation.count
                        }
                      </span>
                    </div>
                  ),
                )
              ) : (
                <div className="py-8 text-sm text-white/45">
                  Nation data will appear after the next WTA ranking sync.
                </div>
              )}
            </div>


            <div className="mt-8 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-white/38">
              <span>
                {
                  wtaPlayerCount
                } players indexed
              </span>

              <span className="inline-flex items-center gap-1.5 text-[#C8FF00]">
                <LibraryBig className="h-3.5 w-3.5" />

                Dynamic archive
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      <section className="mx-auto w-full max-w-[1480px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(200,255,0,0.12),transparent_34%),linear-gradient(135deg,#07101D,#030711)] px-7 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div className="absolute right-[-5rem] top-[-6rem] h-64 w-64 rounded-full border border-[#C8FF00]/15" />
          <div className="absolute right-[-1rem] top-[-2rem] h-40 w-40 rounded-full border border-[#C8FF00]/20" />

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">
                The archive keeps growing
              </div>

              <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">
                The women writing tennis history now.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                AGE202 follows the current women&apos;s game through a living WTA
                archive while the Legends section preserves the historic champions
                of previous generations.
              </p>
            </div>

            <Link
              href="/contribute"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full border border-white/22 bg-white/[0.05] px-7 text-sm font-black uppercase tracking-[0.1em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/60 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]"
            >
              Contribute to AGE202

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
