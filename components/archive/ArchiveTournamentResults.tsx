import {
  CalendarDays,
  CircleDot,
  MapPin,
  Medal,
  Trophy,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import type {
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

type TournamentEditions = Awaited<
  ReturnType<
    typeof getPlayerTournamentEditions
  >
>;

type ArchiveTournamentResultsProps = {
  playerId: string;
  playerName: string;
  accent: string;
  editions: TournamentEditions;
};

function formatCategory(
  category: string,
): string {
  switch (category) {
    case "MASTERS_1000":
      return "Masters 1000";

    case "ATP_500":
      return "ATP 500";

    case "ATP_250":
      return "ATP 250";

    case "GRAND_SLAM":
      return "Grand Slam";

    default:
      return category.replaceAll(
        "_",
        " ",
      );
  }
}

function formatSurface(
  surface: string | null,
): string | null {
  if (!surface) {
    return null;
  }

  return surface
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatDate(
  value: Date | null,
): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(value);
}

export default function ArchiveTournamentResults({
  playerId,
  playerName,
  accent,
  editions,
}: ArchiveTournamentResultsProps) {
  const completedEditions =
    editions.filter(
      (edition) =>
        Boolean(
          edition.championPlayerId,
        ) &&
        Boolean(
          edition.runnerUpPlayerId,
        ),
    );

  if (
    completedEditions.length ===
    0
  ) {
    return null;
  }

  const titles =
    completedEditions.filter(
      (edition) =>
        edition.championPlayerId ===
        playerId,
    ).length;

  const runnerUps =
    completedEditions.filter(
      (edition) =>
        edition.runnerUpPlayerId ===
        playerId,
    ).length;

  const finals =
    titles +
    runnerUps;

  const years =
    Array.from(
      new Set(
        completedEditions.map(
          (edition) =>
            edition.year,
        ),
      ),
    ).sort(
      (
        first,
        second,
      ) =>
        second -
        first,
    );

  return (
    <section
      id="tournament-results"
      aria-labelledby="archive-tournament-results-title"
      className="relative overflow-hidden border-y border-white/10 bg-[#07101d] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${accent}14`,
        }}
      />

      <div className="relative w-full">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)] xl:items-end xl:gap-16">
          <div>
            <span
              className="font-mono text-[8px] font-black uppercase tracking-[0.24em]"
              style={{
                color: accent,
              }}
            >
              Live tournament archive
            </span>

            <h2
              id="archive-tournament-results-title"
              className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl"
            >
              Finals written by the tour.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/48 sm:text-[15px]">
              Official tournament editions linked to {playerName} by the AGE202 results engine.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 xl:max-w-[520px] xl:justify-self-end">
            <StatCard
              label="Titles"
              value={titles}
              accent={accent}
              icon={
                <Trophy
                  size={16}
                  aria-hidden="true"
                />
              }
            />

            <StatCard
              label="Runner-up"
              value={runnerUps}
              accent={accent}
              icon={
                <Medal
                  size={16}
                  aria-hidden="true"
                />
              }
            />

            <StatCard
              label="Finals"
              value={finals}
              accent={accent}
              icon={
                <CircleDot
                  size={16}
                  aria-hidden="true"
                />
              }
            />
          </div>
        </div>

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-20">
          {years.map(
            (year) => {
              const yearEditions =
                completedEditions.filter(
                  (edition) =>
                    edition.year ===
                    year,
                );

              const yearTitles =
                yearEditions.filter(
                  (edition) =>
                    edition.championPlayerId ===
                    playerId,
                ).length;

              return (
                <section
                  key={year}
                  aria-labelledby={`tournament-year-${year}`}
                >
                  <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-end gap-4">
                      <h3
                        id={`tournament-year-${year}`}
                        className="text-4xl font-black tracking-[-0.055em] sm:text-5xl"
                        style={{
                          color: accent,
                        }}
                      >
                        {year}
                      </h3>

                      <div className="pb-1">
                        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                          Season chapter
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white/62">
                          {yearTitles} title
                          {yearTitles === 1
                            ? ""
                            : "s"} · {yearEditions.length} final
                          {yearEditions.length ===
                          1
                            ? ""
                            : "s"}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
                      AGE202 verified tournament record
                    </span>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {yearEditions.map(
                      (edition) => {
                        const isChampion =
                          edition.championPlayerId ===
                          playerId;

                        const opponent =
                          isChampion
                            ? edition.runnerUpPlayer
                            : edition.championPlayer;

                        const surface =
                          formatSurface(
                            edition.tournament.surface,
                          );

                        const finalDate =
                          formatDate(
                            edition.endDate,
                          );

                        const location =
                          [
                            edition.tournament.city,
                            edition.tournament.country,
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(
                              ", ",
                            );

                        return (
                          <article
                            key={
                              edition.id
                            }
                            className="group relative min-h-[220px] overflow-hidden rounded-[32px] border border-white/10 bg-[#050b18]/88 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:p-7 lg:min-h-[240px]"
                          >
                            <div
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0 w-[3px] opacity-80"
                              style={{
                                backgroundColor:
                                  isChampion
                                    ? accent
                                    : "rgba(255,255,255,0.12)",
                              }}
                            />

                            <div className="flex h-full flex-col justify-between">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em]"
                                    style={{
                                      borderColor:
                                        isChampion
                                          ? `${accent}66`
                                          : "rgba(255,255,255,0.10)",
                                      backgroundColor:
                                        isChampion
                                          ? `${accent}16`
                                          : "rgba(255,255,255,0.035)",
                                      color:
                                        isChampion
                                          ? accent
                                          : "rgba(255,255,255,0.55)",
                                    }}
                                  >
                                    {isChampion ? (
                                      <Trophy
                                        size={11}
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <Medal
                                        size={11}
                                        aria-hidden="true"
                                      />
                                    )}

                                    {isChampion
                                      ? "Champion"
                                      : "Runner-up"}
                                  </span>

                                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
                                    {formatCategory(
                                      edition.tournament.category,
                                    )}
                                  </span>
                                </div>

                                <span className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/20">
                                  Final
                                </span>
                              </div>

                              <div className="mt-6">
                                <h4 className="max-w-[18ch] text-2xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-3xl">
                                  {
                                    edition.tournament.name
                                  }
                                </h4>

                                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/52">
                                  {isChampion
                                    ? `${playerName} d. ${opponent?.name ?? edition.runnerUpName ?? "Opponent"}`
                                    : `${edition.championPlayer?.name ?? edition.championName ?? "Champion"} d. ${playerName}`}
                                </p>

                                {edition.score ? (
                                  <p
                                    className="mt-4 font-mono text-sm font-black tracking-[0.08em]"
                                    style={{
                                      color:
                                        isChampion
                                          ? accent
                                          : "rgba(255,255,255,0.78)",
                                    }}
                                  >
                                    {
                                      edition.score
                                    }
                                  </p>
                                ) : null}
                              </div>

                              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5">
                                {surface ? (
                                  <MetaItem
                                    icon={
                                      <CircleDot
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    }
                                    text={
                                      surface
                                    }
                                  />
                                ) : null}

                                {location ? (
                                  <MetaItem
                                    icon={
                                      <MapPin
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    }
                                    text={
                                      location
                                    }
                                  />
                                ) : null}

                                {finalDate ? (
                                  <MetaItem
                                    icon={
                                      <CalendarDays
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    }
                                    text={
                                      finalDate
                                    }
                                  />
                                ) : null}
                              </div>
                            </div>
                          </article>
                        );
                      },
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div
        className="flex items-center gap-2"
        style={{
          color: accent,
        }}
      >
        {icon}

        <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>
      </div>

      <div className="mt-4 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">
        {value}
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/32">
      {icon}
      {text}
    </span>
  );
}