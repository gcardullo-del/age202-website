import {
  Medal,
  Trophy,
} from "lucide-react";

import type {
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

type TournamentEditions = Awaited<
  ReturnType<
    typeof getPlayerTournamentEditions
  >
>;

type TournamentEdition =
  TournamentEditions[number];

type PlayerTournamentResultsProps = {
  playerId: string;
  playerName: string;
  editions: TournamentEditions;
};

type PlayerResult = {
  id: string;
  year: number;
  tournamentName: string;
  tournamentSlug: string;
  category: string;
  score: string | null;
  opponentName: string;
  result: "WINNER" | "RUNNER_UP";
};

const CATEGORY_LABELS: Record<
  string,
  string
> = {
  GRAND_SLAM: "Grand Slam",
  MASTERS_1000: "Masters 1000",
  ATP_500: "ATP 500",
  ATP_250: "ATP 250",
  ATP_FINALS: "ATP Finals",
  OLYMPICS: "Olympics",
  DAVIS_CUP: "Davis Cup",
  OTHER: "Other",
};

const CATEGORY_ORDER: Record<
  string,
  number
> = {
  GRAND_SLAM: 1,
  ATP_FINALS: 2,
  MASTERS_1000: 3,
  OLYMPICS: 4,
  ATP_500: 5,
  ATP_250: 6,
  DAVIS_CUP: 7,
  OTHER: 8,
};

function getCategoryLabel(
  category: string,
): string {
  return (
    CATEGORY_LABELS[category] ??
    category.replaceAll("_", " ")
  );
}

function getCategoryOrder(
  category: string,
): number {
  return (
    CATEGORY_ORDER[category] ??
    99
  );
}

function toPlayerResult(
  edition: TournamentEdition,
  playerId: string,
): PlayerResult | null {
  const isChampion =
    edition.championPlayerId ===
    playerId;

  const isRunnerUp =
    edition.runnerUpPlayerId ===
    playerId;

  if (!isChampion && !isRunnerUp) {
    return null;
  }

  const opponentName =
    isChampion
      ? edition.runnerUpName ??
        "Unknown opponent"
      : edition.championName ??
        "Unknown opponent";

  return {
    id: edition.id,
    year: edition.year,
    tournamentName:
      edition.tournament.name,
    tournamentSlug:
      edition.tournament.slug,
    category: String(
      edition.tournament.category,
    ),
    score: edition.score,
    opponentName,
    result: isChampion
      ? "WINNER"
      : "RUNNER_UP",
  };
}

function compareResults(
  a: PlayerResult,
  b: PlayerResult,
): number {
  if (a.year !== b.year) {
    return b.year - a.year;
  }

  const categoryDifference =
    getCategoryOrder(
      a.category,
    ) -
    getCategoryOrder(
      b.category,
    );

  if (
    categoryDifference !==
    0
  ) {
    return categoryDifference;
  }

  return a.tournamentName.localeCompare(
    b.tournamentName,
  );
}

export default function PlayerTournamentResults({
  playerId,
  playerName,
  editions,
}: PlayerTournamentResultsProps) {
  const results =
    editions
      .filter(
        (edition) =>
          !edition.cancelled,
      )
      .map(
        (edition) =>
          toPlayerResult(
            edition,
            playerId,
          ),
      )
      .filter(
        (
          result,
        ): result is PlayerResult =>
          result !== null,
      )
      .sort(compareResults);

  if (results.length === 0) {
    return null;
  }

  const wins =
    results.filter(
      (result) =>
        result.result ===
        "WINNER",
    ).length;

  const runnerUps =
    results.filter(
      (result) =>
        result.result ===
        "RUNNER_UP",
    ).length;

  const years =
    Array.from(
      new Set(
        results.map(
          (result) =>
            result.year,
        ),
      ),
    ).sort(
      (a, b) =>
        b - a,
    );

  return (
    <section
      id="tournament-results"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Tournament record
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Finals written by the tour.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/45 lg:text-right">
            Verified tournament editions linked to{" "}
            <span className="font-semibold text-white/70">
              {playerName}
            </span>{" "}
            through the AGE202 Tournament Engine.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10">
          <SummaryStat
            label="Finals"
            value={
              results.length
            }
          />

          <SummaryStat
            label="Titles"
            value={wins}
          />

          <SummaryStat
            label="Runner-up"
            value={
              runnerUps
            }
          />
        </div>

        <div className="mt-12 space-y-14">
          {years.map(
            (year) => {
              const yearResults =
                results.filter(
                  (result) =>
                    result.year ===
                    year,
                );

              const yearWins =
                yearResults.filter(
                  (result) =>
                    result.result ===
                    "WINNER",
                ).length;

              const yearRunnerUps =
                yearResults.length -
                yearWins;

              return (
                <section
                  key={year}
                  aria-labelledby={`tournament-year-${year}`}
                >
                  <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]/70">
                        Season
                      </p>

                      <h3
                        id={`tournament-year-${year}`}
                        className="mt-1 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl"
                      >
                        {year}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                      <span>
                        {yearWins}{" "}
                        {yearWins === 1
                          ? "title"
                          : "titles"}
                      </span>

                      <span className="text-white/15">
                        •
                      </span>

                      <span>
                        {yearRunnerUps} runner-up
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {yearResults.map(
                      (result) => (
                        <ResultCard
                          key={
                            result.id
                          }
                          result={
                            result
                          }
                        />
                      ),
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

function ResultCard({
  result,
}: {
  result: PlayerResult;
}) {
  const isWinner =
    result.result ===
    "WINNER";

  return (
    <article className="group relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#07101D] p-5 transition hover:border-[#D7FF00]/25 hover:bg-[#091421] sm:p-6">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 -translate-y-1/3 translate-x-1/3 rounded-full border border-white/[0.035]" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/40">
              {getCategoryLabel(
                result.category,
              )}
            </span>

            <span
              className={[
                "rounded-full border px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em]",
                isWinner
                  ? "border-[#D7FF00]/30 bg-[#D7FF00]/[0.07] text-[#D7FF00]"
                  : "border-white/10 bg-white/[0.025] text-white/38",
              ].join(" ")}
            >
              {isWinner
                ? "Winner"
                : "Runner-up"}
            </span>
          </div>

          <span
            className={[
              "grid h-10 w-10 place-items-center rounded-xl border",
              isWinner
                ? "border-[#D7FF00]/25 bg-[#D7FF00]/[0.07] text-[#D7FF00]"
                : "border-white/10 bg-white/[0.025] text-white/28",
            ].join(" ")}
          >
            {isWinner ? (
              <Trophy
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ) : (
              <Medal
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </span>
        </div>

        <h4 className="mt-6 text-2xl font-black tracking-[-0.045em] text-white">
          {result.tournamentName}
        </h4>

        <p className="mt-3 text-sm leading-6 text-white/42">
          {isWinner
            ? "Defeated"
            : "Lost to"}{" "}
          <span className="font-semibold text-white/68">
            {result.opponentName}
          </span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-4">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/28">
            {result.year}
          </span>

          <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[#D7FF00]/70">
            {result.score ??
              "Score not recorded"}
          </span>
        </div>
      </div>
    </article>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#07101D]/95 px-4 py-5 text-center sm:px-6">
      <span className="block text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">
        {value}
      </span>

      <span className="mt-2 block font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>
    </div>
  );
}
