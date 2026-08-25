"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Landmark,
  Recycle,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react";

import AvailableToCollect, {
  type AvailableArtifact,
} from "@/components/home/AvailableToCollect";

import RecentlyAcquired, {
  type RecentlyAcquiredArtifact,
} from "@/components/home/RecentlyAcquired";

import ExploreTheMuseum from "@/components/home/ExploreTheMuseum";
import LatestArrivals from "@/components/home/LatestArrivals";
import OpeningFilm from "@/components/home/OpeningFilm";
import TodaysMuseumHighlights from "@/components/home/TodaysMuseumHighlights";

import MuseumCollections from "@/components/public/MuseumCollections";
import MuseumHero from "@/components/public/MuseumHero";
import MuseumTimeline from "@/components/public/MuseumTimeline";
import OpeningExperience from "@/components/public/OpeningExperience";

import type {
  PublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";

const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

type MuseumHomeProps = {
  settings: PublicHomepageSettings;

  availableArtifacts: AvailableArtifact[];

  recentlyAcquiredArtifacts:
    RecentlyAcquiredArtifact[];
};

export default function MuseumHome({
  settings,
  availableArtifacts,
  recentlyAcquiredArtifacts,
}: MuseumHomeProps) {
  return (
    <>
      <OpeningExperience />

      <main className="overflow-hidden bg-[#050b18] text-white">
        <MuseumHero
          settings={settings}
        />

        <MuseumCollections
          players={
            settings.featuredPlayers
          }
        />

        <LatestArrivals />

        <AvailableToCollect
          artifacts={
            availableArtifacts
          }
        />

        <RecentlyAcquired
          artifacts={
            recentlyAcquiredArtifacts
          }
        />

        <OpeningFilm />

        <ExploreTheMuseum />

        <TodaysMuseumHighlights />

        <MuseumTimeline />

        <section className="border-b border-white/10 bg-[#071021] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
              variants={reveal}
              transition={{
                duration: 0.65,
              }}
              className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20"
            >
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#d7ff00]" />

                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d7ff00]">
                    Why AGE202?
                  </p>
                </div>

                <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  Tennis history deserves a
                  second life.
                </h2>

                <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400">
                  AGE202 selects authentic
                  second-hand tennis apparel
                  and preserves the stories
                  connected to champions,
                  tournaments and
                  unforgettable eras of the
                  sport.
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
                  Every piece is presented as
                  part of tennis history,
                  while acquisitions remain
                  simple and secure through
                  an external marketplace.
                </p>

                <Link
                  href="#collections"
                  className="group mt-9 inline-flex items-center gap-4 rounded-full border border-[#d7ff00] px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#d7ff00] hover:text-[#030812]"
                >
                  Explore the collections

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid gap-4">
                <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-7 transition hover:border-[#d7ff00]/45">
                  <BadgeCheck
                    className="text-[#d7ff00]"
                    size={27}
                  />

                  <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
                    Authentic pieces
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Carefully selected tennis
                    apparel connected to
                    iconic players, brands
                    and memorable moments.
                  </p>
                </article>

                <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-7 transition hover:border-[#d7ff00]/45">
                  <Recycle
                    className="text-[#d7ff00]"
                    size={27}
                  />

                  <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
                    A second life
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Second-hand clothing
                    becomes part of a curated
                    archive instead of being
                    forgotten.
                  </p>
                </article>

                <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-7 transition hover:border-[#d7ff00]/45">
                  <ShoppingBag
                    className="text-[#d7ff00]"
                    size={27}
                  />

                  <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
                    Available to Collect
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Selected museum
                    Artifacts can enter a
                    private collection while
                    their archive identity
                    and story remain
                    preserved by AGE202.
                  </p>
                </article>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,255,0,.06),transparent_55%)]" />

          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
              variants={reveal}
              transition={{
                duration: 0.65,
              }}
              className="mb-12 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:items-end"
            >
              <div>
                <div className="mb-4 h-0.5 w-8 bg-[#d7ff00]" />

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d7ff00]">
                  Museum by the numbers
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
                  The archive at a glance
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-slate-400">
                A growing digital archive
                built to preserve the
                champions, objects and
                stories that shaped tennis
                culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 border-l border-t border-white/10 lg:grid-cols-4">
              {[
                {
                  value: "05",

                  label:
                    "Champion galleries",

                  description:
                    "Dedicated archives for five defining tennis icons.",
                },

                {
                  value: "04",

                  label:
                    "Museum pillars",

                  description:
                    "Champions, history, memorabilia and tennis culture.",
                },

                {
                  value: "01",

                  label:
                    "Digital archive",

                  description:
                    "One evolving home for every preserved tennis story.",
                },

                {
                  value: "100%",

                  label:
                    "Tennis culture",

                  description:
                    "Every gallery is created around the history of the game.",
                },
              ].map(
                (
                  statistic,
                  index,
                ) => (
                  <motion.article
                    key={
                      statistic.label
                    }
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.3,
                    }}
                    variants={
                      reveal
                    }
                    transition={{
                      duration: 0.5,

                      delay:
                        index *
                        0.08,
                    }}
                    className="group relative min-h-[250px] border-b border-r border-white/10 p-6 transition duration-500 hover:bg-white/[0.035] sm:p-8 lg:min-h-[290px]"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <div className="mt-8">
                      <p className="text-5xl font-black tracking-[-0.07em] text-[#d7ff00] sm:text-6xl lg:text-7xl">
                        {
                          statistic.value
                        }
                      </p>

                      <h3 className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white">
                        {
                          statistic.label
                        }
                      </h3>

                      <p className="mt-4 max-w-[250px] text-sm leading-7 text-slate-400">
                        {
                          statistic.description
                        }
                      </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#d7ff00] transition-transform duration-500 group-hover:scale-x-100" />
                  </motion.article>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                Landmark,
                "Museum",
                "Curated galleries dedicated to champions, brands and defining eras.",
              ],

              [
                Trophy,
                "Hall of Fame",
                "Profiles, records and artifacts connected to tennis legends.",
              ],

              [
                BookOpen,
                "History",
                "Open Era stories, rivalries and the evolution of tennis style.",
              ],

              [
                Sparkles,
                "Memorabilia",
                "Exceptional objects, signatures and collectible tennis culture.",
              ],
            ].map(
              (
                [
                  Icon,
                  title,
                  text,
                ],
                index,
              ) => {
                const IconComponent =
                  Icon as typeof Landmark;

                return (
                  <motion.article
                    key={String(
                      title,
                    )}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                    }}
                    variants={
                      reveal
                    }
                    transition={{
                      duration: 0.5,

                      delay:
                        index *
                        0.08,
                    }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-[#ccff00]/50"
                  >
                    <IconComponent
                      className="text-[#ccff00]"
                      size={25}
                    />

                    <h3 className="mt-8 text-xl font-black uppercase tracking-[-0.025em]">
                      {String(
                        title,
                      )}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {String(
                        text,
                      )}
                    </p>
                  </motion.article>
                );
              },
            )}
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/10 px-6 py-28 text-center sm:px-8 lg:py-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,.10),transparent_45%)]" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            variants={reveal}
            transition={{
              duration: 0.7,
            }}
            className="relative mx-auto max-w-4xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">
              The AGE202 manifesto
            </p>

            <h2 className="mt-7 text-balance text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Every shirt tells a story.
              Every artifact preserves a
              moment.
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
              We preserve memories,
              document achievements and
              connect generations of tennis
              enthusiasts.
            </p>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] transition hover:border-[#ccff00] hover:text-[#ccff00]"
            >
              Discover why AGE202

              <ArrowRight
                size={16}
              />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}