"use client";


import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CircleCheck,
  Trophy,
} from "lucide-react";


export type GrandSlamDrawMatch = {
  id: string;
  round:
    | "ROUND_OF_128"
    | "ROUND_OF_64"
    | "ROUND_OF_32"
    | "ROUND_OF_16"
    | "QUARTERFINAL"
    | "SEMIFINAL"
    | "FINAL";
  matchNumber: number;
  scoreSummary: string | null;
  court: string | null;
  playerOne: {
    name: string;
    seed: number | null;
  } | null;
  playerTwo: {
    name: string;
    seed: number | null;
  } | null;
  winnerEntryId: string | null;
  playerOneEntryId: string | null;
  playerTwoEntryId: string | null;
};


type GrandSlamProgressiveDrawProps = {
  tournamentName: string;
  year: number;
  matches: GrandSlamDrawMatch[];
};


type DrawPlayer = {
  name: string;
  seed: number | null;
  entryId: string | null;
};


type DisplayMatch = {
  id: string;
  round: GrandSlamDrawMatch["round"];
  matchNumber: number;
  scoreSummary: string | null;
  court: string | null;
  playerOne: DrawPlayer | null;
  playerTwo: DrawPlayer | null;
  winnerEntryId: string | null;
  synthetic: boolean;
};


const ROUNDS: Array<{
  key: GrandSlamDrawMatch["round"];
  label: string;
  shortLabel: string;
  expectedMatches: number;
}> = [
  {
    key: "ROUND_OF_128",
    label: "Round of 128",
    shortLabel: "R128",
    expectedMatches: 64,
  },
  {
    key: "ROUND_OF_64",
    label: "Round of 64",
    shortLabel: "R64",
    expectedMatches: 32,
  },
  {
    key: "ROUND_OF_32",
    label: "Round of 32",
    shortLabel: "R32",
    expectedMatches: 16,
  },
  {
    key: "ROUND_OF_16",
    label: "Round of 16",
    shortLabel: "R16",
    expectedMatches: 8,
  },
  {
    key: "QUARTERFINAL",
    label: "Quarterfinals",
    shortLabel: "QF",
    expectedMatches: 4,
  },
  {
    key: "SEMIFINAL",
    label: "Semifinals",
    shortLabel: "SF",
    expectedMatches: 2,
  },
  {
    key: "FINAL",
    label: "Final",
    shortLabel: "F",
    expectedMatches: 1,
  },
];


function toDisplayMatch(
  match: GrandSlamDrawMatch,
): DisplayMatch {
  return {
    id: match.id,
    round: match.round,
    matchNumber: match.matchNumber,
    scoreSummary: match.scoreSummary,
    court: match.court,
    playerOne: match.playerOne
      ? {
          name: match.playerOne.name,
          seed: match.playerOne.seed,
          entryId: match.playerOneEntryId,
        }
      : null,
    playerTwo: match.playerTwo
      ? {
          name: match.playerTwo.name,
          seed: match.playerTwo.seed,
          entryId: match.playerTwoEntryId,
        }
      : null,
    winnerEntryId: match.winnerEntryId,
    synthetic: false,
  };
}


function getWinner(
  match: DisplayMatch | undefined,
): DrawPlayer | null {
  if (!match?.winnerEntryId) {
    return null;
  }

  if (
    match.playerOne?.entryId ===
    match.winnerEntryId
  ) {
    return match.playerOne;
  }

  if (
    match.playerTwo?.entryId ===
    match.winnerEntryId
  ) {
    return match.playerTwo;
  }

  return null;
}


function buildRound({
  definition,
  existing,
  previousRound,
}: {
  definition: (typeof ROUNDS)[number];
  existing: GrandSlamDrawMatch[];
  previousRound: DisplayMatch[] | null;
}): DisplayMatch[] {
  const sortedExisting =
    [...existing].sort(
      (left, right) =>
        left.matchNumber -
        right.matchNumber,
    );

  return Array.from(
    {
      length:
        definition.expectedMatches,
    },
    (_, index) => {
      const current =
        sortedExisting[index];

      const fallbackPlayerOne =
        previousRound
          ? getWinner(
              previousRound[
                index * 2
              ],
            )
          : null;

      const fallbackPlayerTwo =
        previousRound
          ? getWinner(
              previousRound[
                index * 2 + 1
              ],
            )
          : null;

      if (current) {
        const display =
          toDisplayMatch(
            current,
          );

        return {
          ...display,
          playerOne:
            display.playerOne ??
            fallbackPlayerOne,
          playerTwo:
            display.playerTwo ??
            fallbackPlayerTwo,
        };
      }

      return {
        id:
          `synthetic-${definition.key}-${index + 1}`,
        round:
          definition.key,
        matchNumber:
          index + 1,
        scoreSummary:
          null,
        court:
          null,
        playerOne:
          fallbackPlayerOne,
        playerTwo:
          fallbackPlayerTwo,
        winnerEntryId:
          null,
        synthetic:
          true,
      };
    },
  );
}


function roundIsComplete(
  roundMatches: DisplayMatch[],
) {
  return (
    roundMatches.length >
      0 &&
    roundMatches.every(
      (match) =>
        Boolean(
          match.winnerEntryId,
        ),
    )
  );
}


function roundHasPlayers(
  roundMatches: DisplayMatch[],
) {
  return roundMatches.some(
    (match) =>
      Boolean(
        match.playerOne ||
        match.playerTwo,
      ),
  );
}


function PlayerRow({
  player,
  winnerEntryId,
  champion = false,
}: {
  player: DrawPlayer | null;
  winnerEntryId: string | null;
  champion?: boolean;
}) {
  const winner =
    Boolean(
      player?.entryId &&
      player.entryId ===
        winnerEntryId,
    );

  return (
    <div
      className={[
        "flex min-h-12 items-center gap-3 px-4 py-3",
        winner
          ? "bg-[var(--tournament-primary)]/[0.10]"
          : "",
      ].join(" ")}
    >
      <span className="w-7 shrink-0 text-center font-mono text-[8px] font-black text-white/25">
        {player?.seed ?? "—"}
      </span>

      <span
        className={[
          "min-w-0 flex-1 truncate text-sm font-bold",
          player
            ? winner
              ? "text-white"
              : "text-white/62"
            : "text-white/22",
        ].join(" ")}
      >
        {player?.name ?? "TBD"}
      </span>

      {winner ? (
        champion ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--tournament-primary)] px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.12em] text-[#050B18]">
            <Trophy
              size={10}
              aria-hidden="true"
            />
            Champion
          </span>
        ) : (
          <CircleCheck
            size={15}
            aria-label="Winner"
            className="shrink-0 text-[var(--tournament-primary)]"
          />
        )
      ) : null}
    </div>
  );
}


function MatchCard({
  match,
}: {
  match: DisplayMatch;
}) {
  const completed =
    Boolean(
      match.winnerEntryId,
    );

  return (
    <article
      className={[
        "overflow-hidden rounded-[1.4rem] border bg-[#091321]",
        completed
          ? "border-white/10"
          : "border-white/[0.07]",
      ].join(" ")}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
          {match.matchNumber >=
          1001
            ? "Match"
            : `Match ${match.matchNumber}`}
        </span>

        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[6px] font-black uppercase tracking-[0.15em]",
            completed
              ? "border-[var(--tournament-primary)]/20 bg-[var(--tournament-primary)]/[0.08] text-[var(--tournament-primary)]"
              : "border-white/10 bg-white/[0.035] text-white/35",
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              completed
                ? "bg-[var(--tournament-primary)]"
                : "border border-white/35",
            ].join(" ")}
          />
          {completed
            ? "Final"
            : "Upcoming"}
        </span>
      </div>

      <div className="divide-y divide-white/[0.07]">
        <PlayerRow
          player={match.playerOne}
          winnerEntryId={
            match.winnerEntryId
          }
          champion={
            match.round ===
              "FINAL" &&
            match.winnerEntryId ===
              match.playerOne?.entryId
          }
        />

        <PlayerRow
          player={match.playerTwo}
          winnerEntryId={
            match.winnerEntryId
          }
          champion={
            match.round ===
              "FINAL" &&
            match.winnerEntryId ===
              match.playerTwo?.entryId
          }
        />
      </div>

      <div className="flex min-h-11 items-center border-t border-white/[0.07] px-4 py-2.5">
        <p
          className={[
            "font-mono font-black",
            match.scoreSummary
              ? "text-[12px] tracking-[0.06em] text-white/85"
              : "text-[8px] uppercase tracking-[0.08em] text-white/24",
          ].join(" ")}
        >
          {match.scoreSummary ??
            (match.synthetic
              ? "Awaiting players"
              : "Result unavailable")}
        </p>
      </div>
    </article>
  );
}


export default function GrandSlamProgressiveDraw({
  tournamentName,
  year,
  matches,
}: GrandSlamProgressiveDrawProps) {
  const builtRounds =
    useMemo(() => {
      const result =
        new Map<
          GrandSlamDrawMatch["round"],
          DisplayMatch[]
        >();

      let previousRound:
        | DisplayMatch[]
        | null = null;

      for (const definition of ROUNDS) {
        const round =
          buildRound({
            definition,
            existing:
              matches.filter(
                (match) =>
                  match.round ===
                  definition.key,
              ),
            previousRound,
          });

        result.set(
          definition.key,
          round,
        );

        previousRound =
          round;
      }

      return result;
    }, [matches]);

  if (matches.length === 0) {
    return null;
  }

  const automaticRound =
    (() => {
      for (
        let index = 0;
        index <
        ROUNDS.length;
        index += 1
      ) {
        const definition =
          ROUNDS[index];

        const round =
          builtRounds.get(
            definition.key,
          ) ?? [];

        const previous =
          index === 0
            ? null
            : builtRounds.get(
                ROUNDS[index - 1]
                  .key,
              ) ?? [];

        const previousComplete =
          !previous ||
          roundIsComplete(
            previous,
          );

        if (
          previousComplete &&
          roundHasPlayers(
            round,
          ) &&
          !roundIsComplete(
            round,
          )
        ) {
          return definition.key;
        }
      }

      return (
        ROUNDS.at(-1)?.key ??
        "FINAL"
      );
    })();

  const [selectedRound, setSelectedRound] =
    useState<GrandSlamDrawMatch["round"]>(
      automaticRound,
    );

  const selectedDefinition =
    ROUNDS.find(
      (round) =>
        round.key ===
        selectedRound,
    ) ?? ROUNDS[0];

  const selectedMatches =
    builtRounds.get(
      selectedRound,
    ) ?? [];

  const final =
    builtRounds.get(
      "FINAL",
    )?.[0];

  const champion =
    getWinner(
      final,
    );

  return (
    <section
      id="current-draw"
      className="relative overflow-hidden border-b border-white/10 bg-[#06101D] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 78% 8%, color-mix(in srgb, var(--tournament-primary) 13%, transparent), transparent 32%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <Trophy
                  size={15}
                  aria-hidden="true"
                  className="text-[var(--tournament-primary)]"
                />

                <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)] sm:text-[9px]">
                  {year} Competition Draw
                </p>
              </div>

              <span className="hidden h-3 w-px bg-white/15 sm:block" />

              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/20 bg-[var(--tournament-primary)]/[0.06] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--tournament-primary)] opacity-30" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--tournament-primary)]" />
                </span>
                Live archive
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Road to
              <br />
              the title
            </h2>
          </div>

          <div className="lg:text-right">
            <p className="text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
              The current{" "}
              <span className="font-semibold text-white/75">
                {tournamentName}
              </span>{" "}
              stage is shown by default. Use the round navigation to browse the complete tournament history.
            </p>

            {champion ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/[0.08] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)]">
                <Trophy
                  size={12}
                  aria-hidden="true"
                />
                Champion ·{" "}
                {champion.name}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:none]">
          <div className="flex min-w-max items-center gap-2">
            {ROUNDS.map(
              (
                round,
                index,
              ) => {
                const active =
                  round.key ===
                  selectedRound;

                const roundMatches =
                  builtRounds.get(
                    round.key,
                  ) ?? [];

                const completedCount =
                  roundMatches.filter(
                    (match) =>
                      Boolean(
                        match.winnerEntryId,
                      ),
                  ).length;

                return (
                  <div
                    key={
                      round.key
                    }
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRound(
                          round.key,
                        )
                      }
                      aria-pressed={
                        active
                      }
                      className={[
                        "min-h-12 rounded-full border px-5 py-3 text-left transition",
                        active
                          ? "border-[var(--tournament-primary)] bg-[var(--tournament-primary)] text-[#050B18]"
                          : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/25 hover:text-white",
                      ].join(
                        " ",
                      )}
                    >
                      <span className="flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.16em]">
                        {round.shortLabel} ·{" "}
                        {
                          round.expectedMatches
                        }

                        {completedCount ===
                          round.expectedMatches &&
                        round.expectedMatches >
                          0 ? (
                          <CircleCheck
                            size={
                              11
                            }
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>
                    </button>

                    {index <
                    ROUNDS.length -
                      1 ? (
                      <ArrowRight
                        size={13}
                        aria-hidden="true"
                        className="text-white/15"
                      />
                    ) : null}
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              {
                selectedDefinition.shortLabel
              }{" "}
              ·{" "}
              {
                selectedMatches.length
              }{" "}
              matches
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-4xl">
              {
                selectedDefinition.label
              }
            </h3>
          </div>

          {selectedRound ===
          automaticRound ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--tournament-primary)]/20 bg-[var(--tournament-primary)]/[0.06] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-[var(--tournament-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tournament-primary)]" />
              Current stage
            </span>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {selectedMatches.map(
            (match) => (
              <MatchCard
                key={
                  match.id
                }
                match={
                  match
                }
              />
            ),
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-6">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tournament-primary)]" />
            <span className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/35">
              Final
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full border border-white/40" />
            <span className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/35">
              Upcoming
            </span>
          </div>

          <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/25 sm:ml-auto">
            Winners progress automatically as synchronized results become available.
          </p>
        </div>
      </div>
    </section>
  );
}
