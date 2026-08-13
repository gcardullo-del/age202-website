"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDot,
  Crown,
  MapPin,
  Medal,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  getMasters1000Editions,
  type Masters1000Edition,
  type Masters1000EditionPlayer,
} from "@/lib/data/masters-1000-editions";

import {
  getPlayerArchiveHref,
} from "@/lib/player-links";

type Masters1000TournamentEditionsProps = {
  slug: string;
  tournamentName: string;
  cmsEditions?: Masters1000Edition[];
};

const INITIAL_VISIBLE_EDITIONS = 6;
const LOAD_MORE_EDITIONS = 10;

type DecadeFilter = "all" | number;

export default function Masters1000TournamentEditions({
  slug,
  tournamentName,
  cmsEditions = [],
}: Masters1000TournamentEditionsProps) {
  const staticData =
    getMasters1000Editions(
      slug,
    );

  const featuredEditions =
    useMemo(
      () =>
        cmsEditions.length > 0
          ? cmsEditions
          : staticData?.featuredEditions ??
            [],
      [
        cmsEditions,
        staticData,
      ],
    );

  const firstEditionYear =
    staticData?.firstEditionYear ??
    featuredEditions[
      featuredEditions.length -
        1
    ]?.year ??
    featuredEditions[0]?.year ??
    new Date().getFullYear();

  const [
    selectedDecade,
    setSelectedDecade,
  ] = useState<DecadeFilter>(
    "all",
  );

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(
    INITIAL_VISIBLE_EDITIONS,
  );

  const decades =
    useMemo(
      () =>
        Array.from(
          new Set(
            featuredEditions.map(
              (edition) =>
                Math.floor(
                  edition.year /
                    10,
                ) * 10,
            ),
          ),
        ).sort(
          (a, b) =>
            b - a,
        ),
      [featuredEditions],
    );

  const filteredEditions =
    useMemo(
      () =>
        selectedDecade ===
        "all"
          ? featuredEditions
          : featuredEditions.filter(
              (edition) =>
                Math.floor(
                  edition.year /
                    10,
                ) *
                  10 ===
                selectedDecade,
            ),
      [
        featuredEditions,
        selectedDecade,
      ],
    );

  const visibleEditions =
    filteredEditions.slice(
      0,
      visibleCount,
    );

  const hasMoreEditions =
    visibleCount <
    filteredEditions.length;

  const isArchiveExpanded =
    selectedDecade !==
      "all" ||
    visibleCount >
      INITIAL_VISIBLE_EDITIONS;

  const archiveFrom =
    featuredEditions[
      featuredEditions.length -
        1
    ]?.year ??
    firstEditionYear;

  const archiveTo =
    featuredEditions[0]?.year ??
    firstEditionYear;

  const selectDecade = (
    decade: DecadeFilter,
  ) => {
    setSelectedDecade(
      decade,
    );

    setVisibleCount(
      decade === "all"
        ? INITIAL_VISIBLE_EDITIONS
        : LOAD_MORE_EDITIONS,
    );
  };

  const showMoreEditions =
    () => {
      setVisibleCount(
        (current) =>
          current +
          LOAD_MORE_EDITIONS,
      );
    };

  const collapseArchive =
    () => {
      setSelectedDecade(
        "all",
      );
      setVisibleCount(
        INITIAL_VISIBLE_EDITIONS,
      );
    };

  if (
    !staticData &&
    cmsEditions.length === 0
  ) {
    return null;
  }

  if (
    featuredEditions.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="editions"
      className="scroll-mt-20 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[var(--tournament-primary)]">
              Tournament editions · Step 11.1
            </p>

            <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Selected editions from {tournamentName}.
            </h2>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <CalendarDays
                  size={18}
                  strokeWidth={
                    1.4
                  }
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/28">
                  Archive coverage
                </p>

                <p className="mt-2 text-sm font-black uppercase tracking-[-0.02em]">
                  {
                    featuredEditions.length
                  }{" "}
                  recorded editions
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-white/38">
              Champions, finalists, scores and defining context. The same data
              model is ready to scale across every Masters 1000 tournament.
            </p>
          </div>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute bottom-8 left-[31px] top-8 hidden w-px bg-gradient-to-b from-[var(--tournament-primary)] via-white/15 to-transparent md:block" />

          <div className="space-y-5">
            {visibleEditions.map(
              (
                edition,
                index,
              ) => (
                <EditionCard
                  key={
                    edition.year
                  }
                  edition={
                    edition
                  }
                  index={
                    index
                  }
                />
              ),
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D]">
          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                Explore the complete archive
              </p>

              <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                {featuredEditions.length} recorded editions · {archiveFrom}—{archiveTo}
              </h3>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">
                Start with the latest six editions, then explore the archive by decade or reveal ten more records at a time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {isArchiveExpanded ? (
                <button
                  type="button"
                  onClick={
                    collapseArchive
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/45 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
                >
                  <RotateCcw
                    size={13}
                    aria-hidden="true"
                  />
                  Collapse archive
                </button>
              ) : null}

              {hasMoreEditions ? (
                <button
                  type="button"
                  onClick={
                    showMoreEditions
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/45 bg-[var(--tournament-primary)]/10 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)] transition hover:bg-[var(--tournament-primary)]/15"
                >
                  View more editions
                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                  />
                </button>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/10 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  selectDecade(
                    "all",
                  )
                }
                className={`rounded-full border px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] transition ${
                  selectedDecade ===
                  "all"
                    ? "border-[var(--tournament-primary)] bg-[var(--tournament-primary)]/10 text-[var(--tournament-primary)]"
                    : "border-white/10 bg-white/[0.02] text-white/35 hover:border-white/20 hover:text-white/60"
                }`}
              >
                Latest
              </button>

              {decades.map(
                (decade) => (
                  <button
                    key={decade}
                    type="button"
                    onClick={() =>
                      selectDecade(
                        decade,
                      )
                    }
                    className={`rounded-full border px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] transition ${
                      selectedDecade ===
                      decade
                        ? "border-[var(--tournament-primary)] bg-[var(--tournament-primary)]/10 text-[var(--tournament-primary)]"
                        : "border-white/10 bg-white/[0.02] text-white/35 hover:border-white/20 hover:text-white/60"
                    }`}
                  >
                    {decade}s
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-3">
          <ArchiveStat
            value={`${featuredEditions[0]?.year ?? "—"}`}
            label="Latest edition"
            icon={Sparkles}
          />

          <ArchiveStat
            value={`${archiveFrom}`}
            label="Archive origin"
            icon={
              CalendarDays
            }
          />

          <ArchiveStat
            value={`${new Set(
              featuredEditions.map(
                (edition) =>
                  edition.champion
                    .name,
              ),
            ).size}`}
            label="Different champions"
            icon={Trophy}
          />
        </div>
      </div>
    </section>
  );
}

type EditionCardProps = {
  edition: Masters1000Edition;
  index: number;
};

function EditionCard({
  edition,
  index,
}: EditionCardProps) {
  return (
    <article className="group relative md:pl-20">
      <div className="absolute left-0 top-8 z-10 hidden h-16 w-16 place-items-center rounded-2xl border border-[var(--tournament-primary)]/35 bg-[#07101D] font-mono text-[9px] font-black text-[var(--tournament-primary)] shadow-[0_0_30px_var(--tournament-glow)] md:grid">
        {String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--tournament-primary)]/55">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />

        <div className="pointer-events-none absolute right-5 top-0 text-[8rem] font-black leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[11rem]">
          {edition.year}
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-7">
            <div className="flex items-center gap-5">
              <span className="text-5xl font-black tracking-[-0.06em] text-[var(--tournament-primary)] sm:text-6xl">
                {edition.year}
              </span>

              <div>
                <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
                  Men&apos;s singles final
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.08em] text-white/52">
                  {edition.date}
                </p>
              </div>
            </div>

            {edition.milestone ? (
              <span className="rounded-full border border-[var(--tournament-primary)]/35 bg-[var(--tournament-primary)]/10 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)]">
                {
                  edition.milestone
                }
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)] lg:items-stretch">
            <PlayerCard
              player={
                edition.champion
              }
              winner
            />

            <div className="grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/20 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/30">
                vs
              </span>
            </div>

            <PlayerCard
              player={
                edition.runnerUp
              }
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/15 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                  <Medal
                    size={16}
                    strokeWidth={
                      1.4
                    }
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
                    Edition story
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/46">
                    {
                      edition.note
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
                Championship score
              </p>

              <p className="mt-4 text-2xl font-black tracking-[-0.035em] text-white/82">
                {edition.score}
              </p>

              <p className="mt-4 inline-flex items-center gap-2 text-[10px] text-white/30">
                <MapPin
                  size={12}
                  aria-hidden="true"
                />
                {edition.venue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

type PlayerCardProps = {
  player: Masters1000EditionPlayer;
  winner?: boolean;
};

function PlayerCard({
  player,
  winner = false,
}: PlayerCardProps) {
  const archiveHref =
    getPlayerArchiveHref(
      player.name,
    );

  const playerHref =
    archiveHref ??
    (player.slug
      ? `/players/${player.slug}`
      : null);

  const content = (
    <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 transition hover:bg-white/[0.045]">
      <div className="flex items-start justify-between gap-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
          {winner ? (
            <Crown
              size={18}
              strokeWidth={
                1.4
              }
              aria-hidden="true"
            />
          ) : (
            <CircleDot
              size={18}
              strokeWidth={
                1.4
              }
              aria-hidden="true"
            />
          )}
        </span>

        {playerHref ? (
          <ArrowUpRight
            size={16}
            className="text-white/24 transition group-hover:text-[var(--tournament-primary)]"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <p className="mt-8 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
        {winner
          ? "Champion"
          : "Runner-up"}
      </p>

      <h3 className="mt-3 text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-3xl">
        {player.name}
      </h3>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.08em] text-white/34">
        {player.flag ? (
          <span aria-hidden="true">
            {player.flag}
          </span>
        ) : null}

        <span>
          {player.countryCode ||
            "—"}
        </span>

        {player.seed ? (
          <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[7px]">
            Seed {player.seed}
          </span>
        ) : null}
      </div>

      {playerHref ? (
        <p className="mt-6 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/24">
          {archiveHref
            ? "Open AGE202 player archive"
            : "Open AGE202 player profile"}
        </p>
      ) : null}
    </div>
  );

  if (!playerHref) {
    return content;
  }

  return (
    <Link
      href={playerHref}
      className="group block h-full"
    >
      {content}
    </Link>
  );
}

type ArchiveStatProps = {
  value: string;
  label: string;
  icon: typeof Trophy;
};

function ArchiveStat({
  value,
  label,
  icon: Icon,
}: ArchiveStatProps) {
  return (
    <div className="flex min-h-[122px] items-center justify-between bg-[#071021]/94 px-6 py-5">
      <div>
        <span className="block text-2xl font-black uppercase tracking-[-0.045em]">
          {value}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
          {label}
        </span>
      </div>

      <Icon
        size={19}
        strokeWidth={1.4}
        className="text-[var(--tournament-primary)]"
        aria-hidden="true"
      />
    </div>
  );
}