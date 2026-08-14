"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Crown,
  Landmark,
  Search,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

import IconicRivalryCard from "@/components/tennis-history/IconicRivalryCard";
import LegendOfHistoryCard from "@/components/tennis-history/LegendOfHistoryCard";

import type {
  TennisHistoryGeneration,
  TennisHistoryLegend,
  TennisHistoryRivalry,
} from "@/components/tennis-history/tennis-history.data";


type Era =
  | "Origins"
  | "Classic Era"
  | "Open Era"
  | "Modern Era";


export type TennisHistoryMilestone = {
  year: number;
  month: number | null;
  day: number | null;
  sortOrder: number;

  era: Era;

  title: string;

  description: string;

  accent: string;

  href?: string;
};


type TimelineItem =
  | {
      type: "milestone";
      year: number;
      month: number | null;
      day: number | null;
      sortOrder: number;
      data: TennisHistoryMilestone;
    }
  | {
      type: "legend";
      year: number;
      month: number | null;
      day: number | null;
      sortOrder: number;
      data: TennisHistoryLegend;
    }
  | {
      type: "rivalry";
      year: number;
      month: number | null;
      day: number | null;
      sortOrder: number;
      data: TennisHistoryRivalry;
    }
  | {
      type: "generation";
      year: number;
      month: number | null;
      day: number | null;
      sortOrder: number;
      data: TennisHistoryGeneration;
    };


const eras = [
  "All eras",
  "Origins",
  "Classic Era",
  "Open Era",
  "Modern Era",
] as const;


const slamRooms = [
  {
    name:
      "Australian Open",

    detail:
      "Open Era champions",

    href:
      "/results/grand-slams/australian-open",

    number:
      "01",
  },

  {
    name:
      "Roland Garros",

    detail:
      "Open Era champions",

    href:
      "/results/grand-slams/roland-garros",

    number:
      "02",
  },

  {
    name:
      "Wimbledon",

    detail:
      "Open Era champions",

    href:
      "/results/grand-slams/wimbledon",

    number:
      "03",
  },

  {
    name:
      "US Open",

    detail:
      "Open Era champions",

    href:
      "/results/grand-slams/us-open",

    number:
      "04",
  },
];


function getLegendEra(
  legend:
    TennisHistoryLegend,
): Era {
  switch (
    legend.era
  ) {
    case "OPEN_ERA":
      return "Open Era";

    case "GOLDEN_ERA":
      return "Classic Era";

    case "MODERN_ERA":
      return "Modern Era";
  }
}


function matchesSearch(
  values: Array<
    string |
    number
  >,

  normalizedQuery:
    string,
) {
  if (
    !normalizedQuery
  ) {
    return true;
  }

  return values
    .join(" ")
    .toLowerCase()
    .includes(
      normalizedQuery,
    );
}


function GenerationOfHistoryCard({
  generation,
}: {
  generation: TennisHistoryGeneration;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#d7ff00]/35 bg-[#07101d] shadow-[0_30px_90px_rgba(0,0,0,.34)] transition duration-500 hover:-translate-y-1 hover:border-[#d7ff00]/55">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(215,255,0,.13),transparent_30%)]" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#d7ff00]/10" />
      <div className="pointer-events-none absolute -right-4 -top-8 h-44 w-44 rounded-full border border-white/[.04]" />

      {generation.imageUrl ? (
        <div className="relative h-[250px] overflow-hidden border-b border-white/10 sm:h-[330px] lg:h-[430px]">
          <img
            src={generation.imageUrl}
            alt={generation.title}
            className="absolute inset-0 h-full w-full object-cover grayscale-[8%] transition duration-700 group-hover:scale-[1.025]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,11,24,.95)_0%,rgba(5,11,24,.48)_34%,rgba(5,11,24,.04)_72%)]" />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-[#d7ff00]/25 bg-[#050b18]/78 px-3 py-2 backdrop-blur sm:left-7 sm:top-7">
            <Sparkles
              size={13}
              className="text-[#d7ff00]"
            />

            <span className="text-[8px] font-black uppercase tracking-[.24em] text-[#d7ff00]">
              Generation archive
            </span>
          </div>

          <div className="absolute right-5 top-5 grid h-14 w-14 place-items-center rounded-full border border-[#d7ff00]/35 bg-[#050b18]/80 font-mono text-[10px] font-black text-[#d7ff00] backdrop-blur sm:right-7 sm:top-7 sm:h-16 sm:w-16">
            {generation.year}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
            <p className="text-[8px] font-black uppercase tracking-[.24em] text-white/35">
              {generation.period}
            </p>

            <h3 className="mt-3 max-w-4xl text-[clamp(2.7rem,6vw,6.6rem)] font-black uppercase leading-[.78] tracking-[-.065em] text-white">
              {generation.title}
            </h3>
          </div>
        </div>
      ) : null}

      <div className="relative grid lg:grid-cols-[.78fr_1.22fr]">
        <div className="flex min-h-[240px] flex-col justify-between border-b border-white/10 p-6 sm:p-8 lg:min-h-[360px] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/30 bg-[#d7ff00]/5 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.24em] text-[#d7ff00]">
              <Sparkles size={12} />
              Era exhibit
            </span>

            {!generation.imageUrl ? (
              <span className="font-mono text-[10px] font-black tracking-[.18em] text-white/30">
                {generation.year}
              </span>
            ) : null}
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
              Generation archive
            </p>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/48">
              A complete competitive era preserved as one museum chapter.
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
              AGE202 · Historical era archive
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[360px] flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#d7ff00]" />

            <p className="text-[9px] font-black uppercase tracking-[.28em] text-[#d7ff00]">
              {generation.eyebrow}
            </p>
          </div>

          {!generation.imageUrl ? (
            <h3 className="mt-6 max-w-4xl text-[clamp(3rem,6.4vw,6.2rem)] font-black uppercase leading-[.8] tracking-[-.065em] text-white">
              {generation.title}
            </h3>
          ) : null}

          <p className="mt-6 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            {generation.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {generation.players.map(
              (
                player,
                index,
              ) => (
                <div
                  key={player}
                  className="group/player flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 transition hover:border-[#d7ff00]/25 hover:bg-[#d7ff00]/[.035]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d7ff00]/30 bg-[#d7ff00]/5 font-mono text-[9px] font-black text-[#d7ff00]">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="text-xs font-black uppercase tracking-[-.02em] text-white sm:text-sm">
                    {player}
                  </span>
                </div>
              ),
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <span className="text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
              {generation.period}
            </span>

            <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/20">
              {generation.players.length} protagonists · museum chapter
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}



type TennisHistoryClientProps = {
  milestones: TennisHistoryMilestone[];
  legends: TennisHistoryLegend[];
  rivalries: TennisHistoryRivalry[];
  generations: TennisHistoryGeneration[];
};


export default function TennisHistoryClient({
  milestones,
  legends,
  rivalries,
  generations,
}: TennisHistoryClientProps) {
  const [
    query,
    setQuery,
  ] =
    useState(
      "",
    );


  const [
    era,
    setEra,
  ] =
    useState<
      (typeof eras)[number]
    >(
      "All eras",
    );


  /*
   * Fase museale 2.
   *
   * La timeline ora è completamente data-driven:
   *
   * - tutte le milestone storiche
   * - tutte le Legends of History
   * - tutte le Iconic Rivalries
   *
   * - tutte le Generation of History.
   */
  const timelineItems =
    useMemo<
      TimelineItem[]
    >(
      () => {
        const milestoneItems:
          TimelineItem[] =
            milestones.map(
              (
                milestone,
              ) => ({
                type:
                  "milestone",

                year:
                  milestone.year,

                month:
                  milestone.month,

                day:
                  milestone.day,

                sortOrder:
                  milestone.sortOrder,

                data:
                  milestone,
              }),
            );


        const legendItems:
          TimelineItem[] =
            legends.map(
              (
                legend,
              ) => ({
                type:
                  "legend",

                year:
                  legend.year,

                month:
                  null,

                day:
                  null,

                sortOrder:
                  0,

                data:
                  legend,
              }),
            );


        const rivalryItems:
          TimelineItem[] =
            rivalries.map(
              (
                rivalry,
              ) => ({
                type:
                  "rivalry",

                year:
                  rivalry.year,

                month:
                  null,

                day:
                  null,

                sortOrder:
                  0,

                data:
                  rivalry,
              }),
            );


        const generationItems:
          TimelineItem[] =
            generations.map(
              (
                generation,
              ) => ({
                type:
                  "generation",

                year:
                  generation.year,

                month:
                  null,

                day:
                  null,

                sortOrder:
                  0,

                data:
                  generation,
              }),
            );


        return [
          ...milestoneItems,
          ...legendItems,
          ...rivalryItems,
          ...generationItems,
        ].sort(
          (
            first,
            second,
          ) => {
            if (
              first.year !==
              second.year
            ) {
              return (
                first.year -
                second.year
              );
            }

            const firstMonth =
              first.month ?? 0;

            const secondMonth =
              second.month ?? 0;

            if (
              firstMonth !==
              secondMonth
            ) {
              return (
                firstMonth -
                secondMonth
              );
            }

            const firstDay =
              first.day ?? 0;

            const secondDay =
              second.day ?? 0;

            if (
              firstDay !==
              secondDay
            ) {
              return (
                firstDay -
                secondDay
              );
            }

            return (
              first.sortOrder -
              second.sortOrder
            );
          },
        );
      },
      [
        generations,
        legends,
        milestones,
        rivalries,
      ],
    );


  const filteredTimeline =
    useMemo(
      () => {
        const normalizedQuery =
          query
            .trim()
            .toLowerCase();


        return timelineItems.filter(
          (
            item,
          ) => {
            if (
              item.type ===
              "milestone"
            ) {
              const matchesEra =
                era ===
                  "All eras" ||
                item.data.era ===
                  era;


              const matchesQuery =
                matchesSearch(
                  [
                    item.data.year,
                    item.data.title,
                    item.data.description,
                    item.data.accent,
                  ],
                  normalizedQuery,
                );


              return (
                matchesEra &&
                matchesQuery
              );
            }


            if (
              item.type ===
              "legend"
            ) {
              const legendEra =
                getLegendEra(
                  item.data,
                );


              const matchesEra =
                era ===
                  "All eras" ||
                legendEra ===
                  era;


              const matchesQuery =
                matchesSearch(
                  [
                    item.data.year,
                    item.data.name,
                    item.data.title,
                    item.data.description,
                    item.data.quote,
                    item.data.achievement,
                    item.data.country,
                    item.data.period,
                    item.data.eyebrow,
                  ],
                  normalizedQuery,
                );


              return (
                matchesEra &&
                matchesQuery
              );
            }


            if (
              item.type ===
              "generation"
            ) {
              const matchesEra =
                era ===
                  "All eras" ||
                era ===
                  "Modern Era";


              const matchesQuery =
                matchesSearch(
                  [
                    item.data.year,
                    item.data.title,
                    item.data.description,
                    item.data.period,
                    item.data.eyebrow,
                    ...item.data.players,
                  ],
                  normalizedQuery,
                );


              return (
                matchesEra &&
                matchesQuery
              );
            }


            const matchesEra =
              era ===
                "All eras" ||
              era ===
                "Open Era";


            const matchesQuery =
              matchesSearch(
                [
                  item.data.year,
                  item.data.title,
                  item.data.playerOne,
                  item.data.playerTwo,
                  item.data.description,
                  item.data.period,
                  item.data.eyebrow,
                ],
                normalizedQuery,
              );


            return (
              matchesEra &&
              matchesQuery
            );
          },
        );
      },
      [
        era,
        query,
        timelineItems,
      ],
    );


  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(215,255,0,.13),transparent_30%)]" />

        <div className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-[#d7ff00]/10" />

        <div className="absolute -right-10 top-6 h-80 w-80 rounded-full border border-white/[.04]" />


        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-[#d7ff00]">
            <span className="h-px w-10 bg-[#d7ff00]" />

            AGE202 heritage archive
          </div>


          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="max-w-6xl text-[clamp(3.7rem,8.7vw,8.8rem)] font-black uppercase leading-[.79] tracking-[-.07em]">
                Tennis
                <br />

                <span className="text-[#d7ff00]">
                  History.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Explore the milestones, rivalries and champions that transformed a lawn game into a global cultural institution.
              </p>
            </div>


            <div className="rounded-[1.7rem] border border-white/10 bg-white/[.035] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[.23em] text-white/45">
                  Museum collection
                </span>

                <Sparkles
                  size={17}
                  className="text-[#d7ff00]"
                />
              </div>


              <p className="mt-8 text-2xl font-black uppercase tracking-[-.04em]">
                The living archive
              </p>

              <p className="mt-3 text-sm leading-7 text-white/48">
                A curated historical path designed to connect eras, major tournaments and AGE202 player galleries.
              </p>


              <div className="mt-6 border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.18em] text-[#d7ff00]">
                1877 · Present day
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Historical span",
                "149+",
                "Years of heritage",
                CalendarDays,
              ],

              [
                "Curated eras",
                "04",
                "Origins to modern",
                Landmark,
              ],

              [
                "Grand Slams",
                "04",
                "Champion archives",
                Trophy,
              ],

              [
                "Featured stories",
                String(
                  milestones.length +
                    legends.length +
                    rivalries.length +
                    generations.length,
                ),
                "Milestones + exhibits",
                BookOpen,
              ],
            ].map(
              (
                [
                  label,
                  value,
                  detail,
                  Icon,
                ],
              ) => (
                <article
                  key={
                    String(
                      label,
                    )
                  }
                  className="rounded-[1.45rem] border border-white/10 bg-white/[.028] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[9px] font-black uppercase tracking-[.24em] text-[#d7ff00]">
                      {String(
                        label,
                      )}
                    </p>

                    <Icon
                      size={17}
                      className="text-white/30"
                    />
                  </div>


                  <p className="mt-6 text-4xl font-black uppercase tracking-[-.055em]">
                    {String(
                      value,
                    )}
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-white/38">
                    {String(
                      detail,
                    )}
                  </p>
                </article>
              ),
            )}
          </div>


          <div className="mt-16 grid gap-10 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#d7ff00]">
                Chronological exhibition
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">
                The timeline
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/48">
                Search the archive or focus on one era to follow the evolution of the game.
              </p>


              <label className="relative mt-8 block">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />

                <input
                  value={
                    query
                  }
                  onChange={(
                    event,
                  ) =>
                    setQuery(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Search history"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[.035] pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#d7ff00]/55"
                />
              </label>


              <div className="mt-5 flex flex-wrap gap-2 lg:flex-col">
                {eras.map(
                  (
                    item,
                  ) => (
                    <button
                      key={
                        item
                      }
                      onClick={() =>
                        setEra(
                          item,
                        )
                      }
                      className={`rounded-full border px-4 py-3 text-left text-[9px] font-black uppercase tracking-[.18em] transition ${
                        era ===
                        item
                          ? "border-[#d7ff00] bg-[#d7ff00] text-[#050b18]"
                          : "border-white/10 bg-white/[.025] text-white/50 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </aside>


            <div className="relative">
              <div className="absolute bottom-0 left-[43px] top-0 w-px bg-gradient-to-b from-[#d7ff00]/60 via-white/10 to-transparent sm:left-[55px]" />


              <div className="space-y-5">
                {filteredTimeline.map(
                  (
                    item,
                    index,
                  ) => {
                    if (
                      item.type ===
                      "legend"
                    ) {
                      return (
                        <div
                          key={`legend-${item.data.slug}`}
                          className="relative z-10 py-5 pl-[86px] sm:pl-[110px]"
                        >
                          <div className="absolute left-[31px] top-12 z-20 grid h-6 w-6 place-items-center rounded-full border border-[#d7ff00]/50 bg-[#050b18] sm:left-[43px]">
                            <Crown
                              size={11}
                              className="text-[#d7ff00]"
                            />
                          </div>

                          <LegendOfHistoryCard
                            legend={
                              item.data
                            }
                          />
                        </div>
                      );
                    }


                    if (
                      item.type ===
                      "generation"
                    ) {
                      return (
                        <div
                          key={`generation-${item.data.slug}`}
                          className="relative z-10 py-6 pl-[86px] sm:pl-[110px]"
                        >
                          <div className="absolute left-[31px] top-12 z-20 grid h-6 w-6 place-items-center rounded-full border border-[#d7ff00]/50 bg-[#050b18] sm:left-[43px]">
                            <Sparkles
                              size={11}
                              className="text-[#d7ff00]"
                            />
                          </div>

                          <GenerationOfHistoryCard
                            generation={
                              item.data
                            }
                          />
                        </div>
                      );
                    }


                    if (
                      item.type ===
                      "rivalry"
                    ) {
                      return (
                        <div
                          key={`rivalry-${item.data.slug}`}
                          className="relative z-10 py-5 pl-[86px] sm:pl-[110px]"
                        >
                          <div className="absolute left-[31px] top-12 z-20 grid h-6 w-6 place-items-center rounded-full border border-[#d7ff00]/50 bg-[#050b18] sm:left-[43px]">
                            <Swords
                              size={11}
                              className="text-[#d7ff00]"
                            />
                          </div>

                          <IconicRivalryCard
                            rivalry={
                              item.data
                            }
                          />
                        </div>
                      );
                    }


                    const milestone =
                      item.data;


                    const content = (
                      <article className="group relative grid grid-cols-[86px_minmax(0,1fr)] gap-4 rounded-[1.55rem] border border-white/10 bg-white/[.022] p-4 transition hover:border-[#d7ff00]/25 hover:bg-white/[.035] sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6 sm:p-6">
                        <div className="relative z-10">
                          <div className="grid h-[54px] w-[54px] place-items-center rounded-full border border-[#d7ff00]/35 bg-[#071020] text-[11px] font-black text-[#d7ff00] shadow-[0_0_30px_rgba(215,255,0,.08)] sm:h-[62px] sm:w-[62px]">
                            {milestone.day &&
                            milestone.month
                              ? `${String(
                                  milestone.day,
                                ).padStart(
                                  2,
                                  "0",
                                )}/${String(
                                  milestone.month,
                                ).padStart(
                                  2,
                                  "0",
                                )}`
                              : milestone.year}
                          </div>

                          <p className="mt-4 hidden text-[8px] font-black uppercase tracking-[.18em] text-white/28 sm:block">
                            {String(
                              index +
                                1,
                            ).padStart(
                              2,
                              "0",
                            )}{" "}
                            ·{" "}
                            {
                              milestone.era
                            }
                          </p>
                        </div>


                        <div className="min-w-0 py-1 sm:py-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                                {
                                  milestone.accent
                                }
                              </p>

                              <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-.035em] sm:text-3xl">
                                {
                                  milestone.title
                                }
                              </h3>
                            </div>


                            {milestone.href && (
                              <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/35 transition group-hover:border-[#d7ff00]/45 group-hover:text-[#d7ff00] sm:grid">
                                <ChevronRight
                                  size={
                                    17
                                  }
                                />
                              </span>
                            )}
                          </div>


                          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
                            {
                              milestone.description
                            }
                          </p>

                          <p className="mt-4 text-[8px] font-black uppercase tracking-[.18em] text-white/28 sm:hidden">
                            {
                              milestone.era
                            }
                          </p>
                        </div>
                      </article>
                    );


                    return milestone.href ? (
                      <Link
                        key={`${milestone.year}-${milestone.title}`}
                        href={
                          milestone.href
                        }
                      >
                        {
                          content
                        }
                      </Link>
                    ) : (
                      <div
                        key={`${milestone.year}-${milestone.title}`}
                      >
                        {
                          content
                        }
                      </div>
                    );
                  },
                )}


                {filteredTimeline.length ===
                  0 && (
                  <div className="rounded-[1.55rem] border border-white/10 bg-white/[.022] px-6 py-20 text-center">
                    <p className="text-sm font-black uppercase tracking-[.18em] text-white/60">
                      No historical entries found
                    </p>

                    <button
                      onClick={() => {
                        setQuery(
                          "",
                        );

                        setEra(
                          "All eras",
                        );
                      }}
                      className="mt-5 text-[10px] font-black uppercase tracking-[.2em] text-[#d7ff00]"
                    >
                      Reset archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="border-y border-white/10 bg-white/[.018] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#d7ff00]">
                Major championship archive
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">
                Grand Slam rooms
              </h2>
            </div>


            <p className="max-w-xl text-sm leading-7 text-white/45">
              Enter four dedicated museum rooms and explore the champions who defined every major stage of the Open Era.
            </p>
          </div>


          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {slamRooms.map(
              (
                slam,
              ) => (
                <Link
                  key={
                    slam.name
                  }
                  href={
                    slam.href
                  }
                  className="group"
                >
                  <article className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#071020] p-6 transition hover:border-[#d7ff00]/35 sm:p-8">
                    <div className="absolute -right-10 -top-16 text-[9rem] font-black tracking-[-.1em] text-white/[.025]">
                      {
                        slam.number
                      }
                    </div>


                    <div className="relative flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                          Room{" "}
                          {
                            slam.number
                          }
                        </p>

                        <h3 className="mt-6 text-2xl font-black uppercase tracking-[-.04em] sm:text-4xl">
                          {
                            slam.name
                          }
                        </h3>

                        <p className="mt-3 text-xs font-semibold uppercase tracking-[.16em] text-white/35">
                          {
                            slam.detail
                          }
                        </p>
                      </div>


                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 text-white/45 transition group-hover:border-[#d7ff00] group-hover:bg-[#d7ff00] group-hover:text-[#050b18]">
                        <ArrowRight
                          size={
                            18
                          }
                        />
                      </span>
                    </div>
                  </article>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>


      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] border border-[#d7ff00]/20 bg-[radial-gradient(circle_at_85%_20%,rgba(215,255,0,.12),transparent_32%),#071020] p-7 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Crown
                size={
                  22
                }
                className="text-[#d7ff00]"
              />

              <p className="mt-8 text-[10px] font-black uppercase tracking-[.26em] text-[#d7ff00]">
                Continue the exhibition
              </p>

              <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.9] tracking-[-.055em] sm:text-6xl lg:text-7xl">
                Meet the champions behind the history.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
                Discover player biographies, career narratives and collectible artifacts in the AGE202 champion galleries.
              </p>
            </div>


            <Link
              href="/players"
              className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-[#d7ff00] px-7 text-[10px] font-black uppercase tracking-[.2em] text-[#050b18] transition hover:scale-[1.02]"
            >
              Explore players

              <ArrowRight
                size={
                  16
                }
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}