"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Trophy,
} from "lucide-react";


export type Masters1000DrawMatch = {
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


type Masters1000TournamentDrawProps = {
  tournamentName: string;
  year: number;
  matches: Masters1000DrawMatch[];
};


const ROUNDS: Array<{
  key: Masters1000DrawMatch["round"];
  label: string;
  shortLabel: string;
}> = [
  {
    key: "ROUND_OF_128",
    label: "Round of 128",
    shortLabel: "R128",
  },
  {
    key: "ROUND_OF_64",
    label: "Round of 64",
    shortLabel: "R64",
  },
  {
    key: "ROUND_OF_32",
    label: "Round of 32",
    shortLabel: "R32",
  },
  {
    key: "ROUND_OF_16",
    label: "Round of 16",
    shortLabel: "R16",
  },
  {
    key: "QUARTERFINAL",
    label: "Quarterfinals",
    shortLabel: "QF",
  },
  {
    key: "SEMIFINAL",
    label: "Semifinals",
    shortLabel: "SF",
  },
  {
    key: "FINAL",
    label: "Final",
    shortLabel: "F",
  },
];


function PlayerRow({
  player,
  entryId,
  winnerEntryId,
  champion = false,
}: {
  player:
    | Masters1000DrawMatch["playerOne"]
    | Masters1000DrawMatch["playerTwo"];
  entryId: string | null;
  winnerEntryId: string | null;
  champion?: boolean;
}) {
  const winner =
    Boolean(
      entryId &&
      winnerEntryId === entryId,
    );

  return (
    <div
      className={[
        "flex min-h-12 items-center gap-3 px-4 py-3",
        winner
          ? "bg-[var(--tournament-primary)]/[0.09]"
          : "bg-transparent",
      ].join(" ")}
    >
      <span className="w-6 shrink-0 text-center font-mono text-[8px] font-black text-white/25">
        {player?.seed ?? "—"}
      </span>

      <span
        className={[
          "min-w-0 flex-1 truncate text-sm font-bold",
          winner
            ? "text-white"
            : "text-white/50",
        ].join(" ")}
      >
        {player?.name ?? "Bye"}
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
  match: Masters1000DrawMatch;
}) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#091321] shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <div className="flex min-h-9 items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
          {match.matchNumber >= 1001
            ? "Match"
            : `Match ${match.matchNumber}`}
        </span>

        {match.court ? (
          <span className="truncate font-mono text-[7px] uppercase tracking-[0.12em] text-[var(--tournament-primary)]/70">
            {match.court}
          </span>
        ) : null}
      </div>

      <div className="divide-y divide-white/[0.07]">
        <PlayerRow
          player={match.playerOne}
          entryId={match.playerOneEntryId}
          winnerEntryId={match.winnerEntryId}
          champion={
            match.round === "FINAL" &&
            match.winnerEntryId ===
              match.playerOneEntryId
          }
        />

        <PlayerRow
          player={match.playerTwo}
          entryId={match.playerTwoEntryId}
          winnerEntryId={match.winnerEntryId}
          champion={
            match.round === "FINAL" &&
            match.winnerEntryId ===
              match.playerTwoEntryId
          }
        />
      </div>

      <div className="flex min-h-11 items-center border-t border-white/10 px-4 py-2.5">
        {match.scoreSummary ? (
          <p className="font-mono text-[12px] font-black tracking-[0.06em] text-white/80 sm:text-[13px]">
            {match.scoreSummary}
          </p>
        ) : (
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-white/30">
            Result unavailable
          </p>
        )}
      </div>
    </article>
  );
}


export default function Masters1000TournamentDraw({
  tournamentName,
  year,
  matches,
}: Masters1000TournamentDrawProps) {
  const availableRounds =
    useMemo(
      () =>
        ROUNDS.filter(
          (round) =>
            matches.some(
              (match) =>
                match.round === round.key,
            ),
        ),
      [matches],
    );

  const [selectedRound, setSelectedRound] =
    useState<Masters1000DrawMatch["round"]>(
      availableRounds.at(-1)?.key ??
        "FINAL",
    );

  const selectedRoundIndex =
    Math.max(
      availableRounds.findIndex(
        (round) =>
          round.key === selectedRound,
      ),
      0,
    );

  const selectedRoundData =
    availableRounds[selectedRoundIndex];

  const selectedMatches =
    useMemo(
      () =>
        matches
          .filter(
            (match) =>
              match.round === selectedRound,
          )
          .sort(
            (left, right) =>
              left.matchNumber - right.matchNumber,
          ),
      [matches, selectedRound],
    );

  if (
    matches.length === 0 ||
    !selectedRoundData
  ) {
    return null;
  }

  const final =
    matches.find(
      (match) =>
        match.round === "FINAL",
    );

  let champion:
    string | null =
    null;

  if (final) {
    if (
      final.winnerEntryId ===
      final.playerOneEntryId
    ) {
      champion =
        final.playerOne?.name ??
        null;
    } else if (
      final.winnerEntryId ===
      final.playerTwoEntryId
    ) {
      champion =
        final.playerTwo?.name ??
        null;
    }
  }

  const previousRound =
    availableRounds[
      selectedRoundIndex - 1
    ];

  const nextRound =
    availableRounds[
      selectedRoundIndex + 1
    ];

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
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
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

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Road to
              <br />
              the title
            </h2>
          </div>

          <div className="lg:text-right">
            <p className="text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
              Browse every completed round of{" "}
              <span className="font-semibold text-white/75">
                {tournamentName}
              </span>
              , from the opening matches to the championship final.
            </p>

            {champion ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/[0.08] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)]">
                <Trophy
                  size={12}
                  aria-hidden="true"
                />
                Champion · {champion}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:none]">
          <div className="flex min-w-max items-center gap-2">
            {availableRounds.map(
              (round, index) => {
                const active =
                  round.key === selectedRound;

                const count =
                  matches.filter(
                    (match) =>
                      match.round === round.key,
                  ).length;

                return (
                  <div
                    key={round.key}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRound(round.key)
                      }
                      aria-pressed={active}
                      className={[
                        "min-h-12 rounded-full border px-5 py-3 text-left transition",
                        active
                          ? "border-[var(--tournament-primary)] bg-[var(--tournament-primary)] text-[#050B18]"
                          : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/25 hover:text-white",
                      ].join(" ")}
                    >
                      <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em]">
                        {round.shortLabel} · {count}
                      </span>
                    </button>

                    {index <
                    availableRounds.length - 1 ? (
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
              {selectedRoundData.shortLabel} · {selectedMatches.length} matches
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-4xl">
              {selectedRoundData.label}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!previousRound}
              onClick={() =>
                previousRound &&
                setSelectedRound(previousRound.key)
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/45 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              <ArrowLeft
                size={13}
                aria-hidden="true"
              />
              Previous
            </button>

            <button
              type="button"
              disabled={!nextRound}
              onClick={() =>
                nextRound &&
                setSelectedRound(nextRound.key)
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/45 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              Next
              <ArrowRight
                size={13}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {selectedRound === "FINAL" &&
        champion ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
            <div>
              {selectedMatches.map(
                (match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                  />
                ),
              )}
            </div>

            <div className="relative flex min-h-56 overflow-hidden rounded-[2rem] border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/[0.07] p-7 sm:min-h-64 sm:p-9 lg:items-center lg:p-12">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--tournament-primary) 22%, transparent), transparent 42%)",
                }}
              />

              <Trophy
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-5 h-52 w-52 text-[var(--tournament-primary)] opacity-[0.07] sm:h-64 sm:w-64"
                strokeWidth={1}
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--tournament-primary)] text-[#050B18] shadow-[0_0_35px_color-mix(in_srgb,var(--tournament-primary)_30%,transparent)]">
                    <Trophy
                      size={23}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                    Winner
                  </p>
                </div>

                <p className="mt-7 text-4xl font-black uppercase leading-[0.88] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {champion}
                </p>

                <p className="mt-5 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/35">
                  {tournamentName} · {year} Champion
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {selectedMatches.map(
              (match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                />
              ),
            )}
          </div>
        )}

        <p className="mt-10 font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
          Results are synchronized periodically. AGE202 does not provide point-by-point live scoring.
        </p>
      </div>
    </section>
  );
}
