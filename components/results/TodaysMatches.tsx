import {
  CalendarDays,
  CircleDot,
  Clock3,
  RefreshCw,
  Trophy,
} from "lucide-react";

import {
  getTournamentMatchesForDay,
} from "@/lib/repositories/tournament-results.repository";


type DailyMatches =
  Awaited<
    ReturnType<
      typeof getTournamentMatchesForDay
    >
  >;

type DailyMatch =
  DailyMatches[number];


const RESULTS_TIME_ZONE =
  "Europe/Rome";


function formatResultsDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        RESULTS_TIME_ZONE,

      weekday:
        "long",

      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric",
    },
  ).format(date);
}


function formatMatchTime(
  date: Date | null,
) {
  if (!date) {
    return "TBD";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        RESULTS_TIME_ZONE,

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    },
  ).format(date);
}


function formatRound(
  round: DailyMatch["round"],
) {
  const labels: Record<
    DailyMatch["round"],
    string
  > = {
    QUALIFYING:
      "Qualifying",

    ROUND_OF_128:
      "First round",

    ROUND_OF_64:
      "Second round",

    ROUND_OF_32:
      "Third round",

    ROUND_OF_16:
      "Round of 16",

    QUARTERFINAL:
      "Quarter-final",

    SEMIFINAL:
      "Semi-final",

    FINAL:
      "Final",
  };

  return labels[round];
}


function getStatusLabel(
  match: DailyMatch,
) {
  if (
    match.status ===
    "COMPLETED"
  ) {
    return "Final";
  }

  if (
    match.status ===
    "IN_PROGRESS"
  ) {
    return "In progress";
  }

  if (
    match.status ===
    "SUSPENDED"
  ) {
    return "Suspended";
  }

  if (
    match.status ===
    "POSTPONED"
  ) {
    return "Postponed";
  }

  if (
    match.status ===
    "CANCELLED"
  ) {
    return "Cancelled";
  }

  return formatMatchTime(
    match.scheduledAt,
  );
}


function getStatusClasses(
  match: DailyMatch,
) {
  if (
    match.status ===
    "IN_PROGRESS"
  ) {
    return "border-[#D7FF00]/30 bg-[#D7FF00]/10 text-[#D7FF00]";
  }

  if (
    match.status ===
    "COMPLETED"
  ) {
    return "border-white/10 bg-white/[0.035] text-white/45";
  }

  if (
    match.status ===
      "SUSPENDED" ||
    match.status ===
      "POSTPONED" ||
    match.status ===
      "CANCELLED"
  ) {
    return "border-amber-300/20 bg-amber-300/[0.07] text-amber-200";
  }

  return "border-sky-300/20 bg-sky-300/[0.07] text-sky-200";
}


function groupMatchesByEdition(
  matches: DailyMatches,
) {
  const groups =
    new Map<
      string,
      DailyMatches
    >();

  for (const match of matches) {
    const currentGroup =
      groups.get(
        match.editionId,
      );

    if (currentGroup) {
      currentGroup.push(
        match,
      );

      continue;
    }

    groups.set(
      match.editionId,
      [
        match,
      ],
    );
  }

  return Array.from(
    groups.values(),
  );
}


function MatchPlayerRow({
  match,
  player,
  position,
}: {
  match: DailyMatch;
  player:
    | DailyMatch["playerOne"]
    | DailyMatch["playerTwo"];
  position: "one" | "two";
}) {
  const isWinner =
    player !== null &&
    player.id ===
      match.winnerEntryId;

  return (
    <div
      className={[
        "grid min-h-11 grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3",
        isWinner
          ? "text-white"
          : "text-white/52",
      ].join(" ")}
    >
      <span
        className="text-center text-sm"
        aria-label={
          player?.countryCode
            ? `Country: ${player.countryCode}`
            : "Country unavailable"
        }
      >
        {player?.countryCode
          ? player.countryCode
          : "—"}
      </span>

      <div className="min-w-0">
        <span
          className={[
            "block truncate text-sm",
            isWinner
              ? "font-black"
              : "font-semibold",
          ].join(" ")}
        >
          {player?.name ??
            "To be determined"}
        </span>

        {player?.seed ? (
          <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-white/28">
            Seed {player.seed}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {match.sets.map(
          (set) => {
            const score =
              position === "one"
                ? set.playerOneScore
                : set.playerTwoScore;

            return (
              <span
                key={set.id}
                className={[
                  "grid size-7 place-items-center rounded-lg font-mono text-xs",
                  isWinner
                    ? "bg-[#D7FF00]/10 font-black text-[#D7FF00]"
                    : "bg-white/[0.035] text-white/48",
                ].join(" ")}
              >
                {score}
              </span>
            );
          },
        )}

        {match.sets.length ===
        0 ? (
          <span className="font-mono text-xs text-white/25">
            —
          </span>
        ) : null}
      </div>
    </div>
  );
}


function MatchCard({
  match,
}: {
  match: DailyMatch;
}) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#081321]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
            {formatRound(
              match.round,
            )}
          </span>

          {match.court ? (
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/28">
              {match.court}
            </span>
          ) : null}
        </div>

        <span
          className={[
            "rounded-full border px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em]",
            getStatusClasses(
              match,
            ),
          ].join(" ")}
        >
          {getStatusLabel(
            match,
          )}
        </span>
      </div>

      <div className="space-y-1 px-5 py-4">
        <MatchPlayerRow
          match={match}
          player={
            match.playerOne
          }
          position="one"
        />

        <div className="border-t border-white/[0.07]" />

        <MatchPlayerRow
          match={match}
          player={
            match.playerTwo
          }
          position="two"
        />
      </div>
    </article>
  );
}


function TournamentGroup({
  matches,
}: {
  matches: DailyMatches;
}) {
  const firstMatch =
    matches[0];

  if (!firstMatch) {
    return null;
  }

  const {
    edition,
  } = firstMatch;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
      <header className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07] px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.17em] text-[#D7FF00]">
              {edition.circuit}
            </span>

            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
              {edition.year}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-black uppercase leading-none tracking-[-0.04em] sm:text-3xl">
            {edition.tournament.name}
          </h3>

          <p className="mt-3 text-xs text-white/36">
            {edition.tournament.city
              ? `${edition.tournament.city}, `
              : ""}
            {edition.tournament.country}
            {" · "}
            {edition.tournament.surface.replaceAll(
              "_",
              " ",
            )}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/32">
          <Trophy
            size={14}
            className="text-[#D7FF00]"
            aria-hidden="true"
          />

          {matches.length}{" "}
          {matches.length === 1
            ? "match"
            : "matches"}
        </div>
      </header>

      <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
        {matches.map(
          (match) => (
            <MatchCard
              key={match.id}
              match={match}
            />
          ),
        )}
      </div>
    </section>
  );
}


function EmptyMatchesState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] px-6 py-14 text-center sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-[#D7FF00]/[0.06] blur-3xl" />

      <div className="relative">
        <div className="flex w-full justify-center">
  <span className="flex size-14 items-center justify-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.06] text-[#D7FF00]">
    <CalendarDays
      size={22}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  </span>
</div>

        <h3 className="mt-6 text-2xl font-black uppercase tracking-[-0.035em]">
          No matches scheduled
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
          There are currently no supported ATP or WTA matches stored for
          today. New fixtures and completed results will appear here
          automatically after synchronization.
        </p>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/32">
          <RefreshCw
            size={12}
            aria-hidden="true"
          />

          Awaiting tournament data
        </div>
      </div>
    </div>
  );
}


export default async function TodaysMatches() {
  const now =
    new Date();

  const matches =
    await getTournamentMatchesForDay(
      now,
    );

  const groups =
    groupMatchesByEdition(
      matches,
    );

  return (
    <section
      id="todays-matches"
      className="scroll-mt-20 border-b border-white/10 bg-[#050B18] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[#D7FF00]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                Daily match centre
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Matches of the day
              </h2>

              <span className="inline-flex min-h-9 items-center gap-2.5 rounded-full border border-[#D7FF00]/25 bg-[#D7FF00]/[0.06] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] sm:text-[9px]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D7FF00] opacity-35" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D7FF00]" />
                </span>

                <span className="text-[#D7FF00]">
                  Live
                </span>

                <span className="text-white/35">
                  Every 5 minutes
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/42">
              Today’s fixtures and final scores from Grand Slams, ATP
              Masters 1000, WTA 1000 and ATP 500 tournaments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/38">
              <CalendarDays
                size={13}
                className="text-[#D7FF00]"
                aria-hidden="true"
              />

              {formatResultsDate(
                now,
              )}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/38">
              <Clock3
                size={13}
                className="text-[#D7FF00]"
                aria-hidden="true"
              />

              Europe/Rome
            </span>
          </div>
        </div>

        {groups.length > 0 ? (
          <div className="space-y-6">
            {groups.map(
              (group) => (
                <TournamentGroup
                  key={
                    group[0]
                      ?.editionId
                  }
                  matches={group}
                />
              ),
            )}
          </div>
        ) : (
          <EmptyMatchesState />
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-5 py-4">
          <CircleDot
            size={14}
            className="mt-0.5 shrink-0 text-[#D7FF00]"
            aria-hidden="true"
          />

          <p className="text-xs leading-6 text-white/30">
            Results are synchronized periodically. AGE202 does not provide
            point-by-point live scoring.
          </p>
        </div>
      </div>
    </section>
  );
}