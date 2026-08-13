"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  getPlayerArchiveHref,
} from "@/lib/player-links";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDot,
  Clock3,
  Crown,
  Flag,
  Landmark,
  Layers3,
  Medal,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export type TournamentEdition = {
  year: number;
  editionKey?: string;
  editionLabel?: string;
  champion: string;
  championCountry?: string;
  championCountryCode?: string;
  runnerUp?: string;
  runnerUpCountry?: string;
  runnerUpCountryCode?: string;
  finalScore?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  surface?: string;
  drawSize?: number;
  prizeMoney?: string;
  editionNumber?: number;
  summary?: string;
  championPlayerSlug?: string;
  runnerUpPlayerSlug?: string;
  playerSlug?: string;
  href?: string;
  status?: "complete" | "upcoming" | "cancelled";
};

type TournamentEditionsProps = {
  tournamentName: string;
  tournamentCode: string;
  editions: TournamentEdition[];
  updatedAt?: string;
  initialLimit?: number;
};

const DEFAULT_INITIAL_VISIBLE_EDITIONS = 6;
const LOAD_MORE_EDITIONS = 10;

type DecadeFilter = "all" | number;

export default function TournamentEditions({
  tournamentName,
  tournamentCode,
  editions,
  updatedAt,
  initialLimit,
}: TournamentEditionsProps) {
  const orderedEditions = useMemo(
    () =>
      [...editions].sort(
        (firstEdition, secondEdition) => {
          const yearDifference =
            secondEdition.year -
            firstEdition.year;

          if (yearDifference !== 0) {
            return yearDifference;
          }

          return (
            secondEdition.editionKey ?? "main"
          ).localeCompare(
            firstEdition.editionKey ?? "main",
          );
        },
      ),
    [editions],
  );

  const latestEdition =
    orderedEditions[0];

  const archiveEditions =
    useMemo(
      () =>
        orderedEditions.slice(1),
      [orderedEditions],
    );

  const defaultVisibleArchiveCount =
    Math.max(
      1,
      (
        initialLimit &&
        initialLimit > 0
          ? initialLimit
          : DEFAULT_INITIAL_VISIBLE_EDITIONS
      ) - 1,
    );

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
    defaultVisibleArchiveCount,
  );

  const decades = useMemo(
    () =>
      Array.from(
        new Set(
          orderedEditions.map(
            (edition) =>
              Math.floor(
                edition.year / 10,
              ) * 10,
          ),
        ),
      ).sort(
        (first, second) =>
          second - first,
      ),
    [orderedEditions],
  );

  const filteredEditions =
    useMemo(
      () =>
        selectedDecade === "all"
          ? archiveEditions
          : archiveEditions.filter(
              (edition) =>
                Math.floor(
                  edition.year / 10,
                ) *
                  10 ===
                selectedDecade,
            ),
      [
        archiveEditions,
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
    selectedDecade !== "all" ||
    visibleCount >
      defaultVisibleArchiveCount;

  const archiveFrom =
    orderedEditions[
      orderedEditions.length - 1
    ]?.year;

  const archiveTo =
    orderedEditions[0]?.year;

  const selectDecade = (
    decade: DecadeFilter,
  ) => {
    setSelectedDecade(
      decade,
    );

    setVisibleCount(
      decade === "all"
        ? defaultVisibleArchiveCount
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
        defaultVisibleArchiveCount,
      );
    };

  return (
    <section
      id="editions"
      className="scroll-mt-16 relative border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-52 top-24 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                Tournament editions
              </p>
            </div>

            <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Every chapter of {tournamentName}
            </h2>
          </div>

          <div className="lg:text-right">
            <p className="text-sm leading-7 text-white/43">
              Explore the tournament season by season, including champions,
              finalists, scores and historical context.
            </p>

            {updatedAt ? (
              <p className="mt-4 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/24">
                Archive updated {updatedAt}
              </p>
            ) : null}
          </div>
        </header>

        {orderedEditions.length > 0 ? (
          <>
            {latestEdition ? (
              <LatestEditionCard
                tournamentName={
                  tournamentName
                }
                tournamentCode={
                  tournamentCode
                }
                edition={
                  latestEdition
                }
              />
            ) : null}

            {archiveEditions.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
                  <div className="hidden grid-cols-[100px_minmax(190px,1fr)_minmax(190px,1fr)_minmax(170px,0.8fr)_70px] gap-5 border-b border-white/10 bg-white/[0.025] px-7 py-5 lg:grid">
                    <TableHeading label="Edition" />
                    <TableHeading label="Champion" />
                    <TableHeading label="Final" />
                    <TableHeading label="Tournament profile" />
                    <span />
                  </div>

                  <div>
                    {visibleEditions.map(
                      (
                        edition,
                        index,
                      ) => (
                        <EditionRow
                          key={`${tournamentCode}-${edition.year}-${edition.editionKey ?? "main"}`}
                          edition={
                            edition
                          }
                          index={
                            index
                          }
                          isLast={
                            index ===
                            visibleEditions.length -
                              1
                          }
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D]">
                  <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                        Explore the complete archive
                      </p>

                      <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                        {orderedEditions.length} recorded editions
                        {archiveFrom &&
                        archiveTo
                          ? ` · ${archiveFrom}—${archiveTo}`
                          : ""}
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
                            key={
                              decade
                            }
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
              </>
            ) : null}
          </>
        ) : (
          <EmptyEditionsState
            tournamentName={
              tournamentName
            }
          />
        )}
      </div>
    </section>
  );
}

type LatestEditionCardProps = {
  tournamentName: string;
  tournamentCode: string;
  edition: TournamentEdition;
};

function LatestEditionCard({
  tournamentName,
  tournamentCode,
  edition,
}: LatestEditionCardProps) {
  const status = edition.status ?? "complete";

  return (
    <article className="relative mt-12 mb-12 min-h-[460px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07101D] p-7 pb-12 sm:p-9 sm:pb-14 lg:p-12 lg:pb-16">
      <div className="pointer-events-none absolute -right-16 -top-24 text-[13rem] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.025]">
        {edition.year}
      </div>

      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[var(--tournament-glow)] opacity-35 blur-3xl" />

      <div className="relative grid gap-10 lg:min-h-[360px] lg:grid-cols-[minmax(0,1fr)_390px] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-between pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/30 bg-[var(--tournament-primary)]/10 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]">
              <Sparkles size={12} aria-hidden="true" />
              Latest edition
            </span>

            <EditionStatus status={status} />
          </div>

          <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/28">
            {tournamentCode} · {tournamentName}
          </p>

          <div className="mt-3">
            <p className="text-6xl font-black tracking-[-0.065em] text-[var(--tournament-primary)] sm:text-7xl">
              {edition.year}
            </p>

            {edition.editionLabel ? (
              <p className="mt-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                {edition.editionLabel}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex items-start gap-5">
            <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-[var(--tournament-primary)]">
              <Crown size={23} strokeWidth={1.4} aria-hidden="true" />
            </span>

            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
                Men&apos;s singles champion
              </p>

              <ChampionLink edition={edition} />
            </div>
          </div>

          {edition.summary ? (
            <p className="mt-8 max-w-3xl text-sm leading-7 text-white/44 sm:text-base">
              {edition.summary}
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/15">
          <EditionPlayerDetail
            icon={Medal}
            label="Runner-up"
            name={edition.runnerUp}
            playerSlug={
              edition.runnerUpPlayerSlug
            }
          />

          <EditionDetail
            icon={Trophy}
            label="Final score"
            value={edition.finalScore}
          />

          <EditionDetail
            icon={CalendarDays}
            label="Dates"
            value={formatEditionDates(edition)}
          />

          <EditionDetail
            icon={CircleDot}
            label="Surface"
            value={edition.surface}
          />

          <EditionDetail
            icon={Users}
            label="Draw"
            value={
              edition.drawSize
                ? `${edition.drawSize} players`
                : undefined
            }
          />

          {edition.href ? (
            <Link
              href={edition.href}
              className="flex items-center justify-between gap-5 border-t border-white/10 px-6 py-5 text-[9px] font-black uppercase tracking-[0.17em] text-white/52 transition hover:bg-white/[0.025] hover:text-[var(--tournament-primary)]"
            >
              View complete edition
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type EditionRowProps = {
  edition: TournamentEdition;
  index: number;
  isLast: boolean;
};

function EditionRow({
  edition,
  index,
  isLast,
}: EditionRowProps) {
  const content = (
    <article
      className={`group grid gap-6 px-7 py-7 transition hover:bg-white/[0.02] lg:grid-cols-[100px_minmax(190px,1fr)_minmax(190px,1fr)_minmax(170px,0.8fr)_70px] lg:items-center ${
        isLast ? "" : "border-b border-white/10"
      }`}
    >
      <div>
        <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/22">
          Edition {String(index + 1).padStart(2, "0")}
        </p>

        <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--tournament-primary)]">
          {edition.year}
        </p>

        {edition.editionLabel ? (
          <p className="mt-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/30">
            {edition.editionLabel}
          </p>
        ) : null}
      </div>

      <div>
        <MobileLabel label="Champion" />

        <div className="flex items-start gap-3">
          <span className="mt-1 text-[var(--tournament-primary)]">
            <Crown size={14} strokeWidth={1.5} aria-hidden="true" />
          </span>

          <div>
            <PlayerNameLink
              name={edition.champion}
              playerSlug={
                edition.championPlayerSlug ??
                edition.playerSlug
              }
              className="text-sm font-black uppercase tracking-[-0.02em] text-white/76 transition hover:text-[var(--tournament-primary)]"
            />

            <CountryLabel
              country={edition.championCountry}
              code={edition.championCountryCode}
            />
          </div>
        </div>
      </div>

      <div>
        <MobileLabel label="Final" />

        {edition.runnerUp ? (
          <PlayerNameLink
            name={edition.runnerUp}
            playerSlug={
              edition.runnerUpPlayerSlug
            }
            className="text-sm font-black uppercase tracking-[-0.02em] text-white/62 transition hover:text-[var(--tournament-primary)]"
          />
        ) : (
          <p className="text-sm font-black uppercase tracking-[-0.02em] text-white/62">
            Final data unavailable
          </p>
        )}

        {edition.finalScore ? (
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">
            {edition.finalScore}
          </p>
        ) : null}
      </div>

      <div>
        <MobileLabel label="Tournament profile" />

        <div className="space-y-2">
          <CompactDetail
            icon={CircleDot}
            value={edition.surface}
          />

          <CompactDetail
            icon={CalendarDays}
            value={formatEditionDates(edition)}
          />

          <CompactDetail
            icon={Landmark}
            value={edition.venue}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 lg:justify-end">
        <EditionStatus status={edition.status ?? "complete"} />

        {edition.href ? (
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/24 transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </article>
  );

  if (!edition.href) {
    return content;
  }

  return (
    <Link
      href={edition.href}
      aria-label={`View ${edition.year}${edition.editionLabel ? ` ${edition.editionLabel}` : ""} edition`}
      className="block"
    >
      {content}
    </Link>
  );
}

type PlayerNameLinkProps = {
  name: string;
  playerSlug?: string;
  className: string;
  showArrow?: boolean;
};

function PlayerNameLink({
  name,
  playerSlug,
  className,
  showArrow = false,
}: PlayerNameLinkProps) {
  const archiveHref =
    getPlayerArchiveHref(name);

  const href =
    archiveHref ??
    (playerSlug
      ? `/players/${playerSlug}`
      : null);

  if (!href) {
    return (
      <span className={className}>
        {name}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {name}

      {showArrow ? (
        <ArrowUpRight
          size={17}
          aria-hidden="true"
        />
      ) : null}
    </Link>
  );
}

type ChampionLinkProps = {
  edition: TournamentEdition;
};

function ChampionLink({
  edition,
}: ChampionLinkProps) {
  const className =
    "mt-3 inline-flex items-center gap-2 text-3xl font-black uppercase leading-none tracking-[-0.045em] text-white transition hover:text-[var(--tournament-primary)] sm:text-4xl";

  return (
    <h3>
      <PlayerNameLink
        name={edition.champion}
        playerSlug={
          edition.championPlayerSlug ??
          edition.playerSlug
        }
        className={className}
        showArrow
      />
    </h3>
  );
}

type EditionPlayerDetailProps = {
  icon: typeof Trophy;
  label: string;
  name?: string;
  playerSlug?: string;
};

function EditionPlayerDetail({
  icon: Icon,
  label,
  name,
  playerSlug,
}: EditionPlayerDetailProps) {
  if (!name) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-5 last:border-b-0">
      <div className="inline-flex items-center gap-3">
        <Icon
          size={14}
          className="text-[var(--tournament-primary)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
          {label}
        </span>
      </div>

      <PlayerNameLink
        name={name}
        playerSlug={playerSlug}
        className="max-w-[210px] text-right text-[10px] font-black uppercase leading-5 tracking-[0.035em] text-white/58 transition hover:text-[var(--tournament-primary)]"
      />
    </div>
  );
}

type EditionDetailProps = {
  icon: typeof Trophy;
  label: string;
  value?: string;
};

function EditionDetail({
  icon: Icon,
  label,
  value,
}: EditionDetailProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-5 last:border-b-0">
      <div className="inline-flex items-center gap-3">
        <Icon
          size={14}
          className="text-[var(--tournament-primary)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
          {label}
        </span>
      </div>

      <span className="max-w-[210px] text-right text-[10px] font-black uppercase leading-5 tracking-[0.035em] text-white/58">
        {value}
      </span>
    </div>
  );
}

type CompactDetailProps = {
  icon: typeof CircleDot;
  value?: string;
};

function CompactDetail({
  icon: Icon,
  value,
}: CompactDetailProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.13em] text-white/28">
      <Icon
        size={11}
        className="shrink-0 text-[var(--tournament-primary)]"
        aria-hidden="true"
      />
      {value}
    </div>
  );
}

type CountryLabelProps = {
  country?: string;
  code?: string;
};

function CountryLabel({
  country,
  code,
}: CountryLabelProps) {
  if (!country && !code) {
    return null;
  }

  return (
    <p className="mt-2 inline-flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/27">
      <Flag size={10} aria-hidden="true" />
      {code ?? country}
      {code && country ? ` · ${country}` : ""}
    </p>
  );
}

type EditionStatusProps = {
  status: NonNullable<TournamentEdition["status"]>;
};

function EditionStatus({ status }: EditionStatusProps) {
  const labels: Record<
    NonNullable<TournamentEdition["status"]>,
    string
  > = {
    complete: "Complete",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
  };

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/30">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "complete"
            ? "bg-[var(--tournament-primary)]"
            : status === "upcoming"
              ? "bg-white/45"
              : "bg-white/20"
        }`}
      />

      {labels[status]}
    </span>
  );
}

function TableHeading({ label }: { label: string }) {
  return (
    <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
      {label}
    </span>
  );
}

function MobileLabel({ label }: { label: string }) {
  return (
    <p className="mb-3 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/22 lg:hidden">
      {label}
    </p>
  );
}

function formatEditionDates(edition: TournamentEdition) {
  if (edition.startDate && edition.endDate) {
    return `${edition.startDate} – ${edition.endDate}`;
  }

  return edition.startDate ?? edition.endDate;
}

function EmptyEditionsState({
  tournamentName,
}: {
  tournamentName: string;
}) {
  return (
    <div className="mt-12 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.018] px-7 py-16 text-center sm:px-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
        <Layers3 size={22} strokeWidth={1.4} aria-hidden="true" />
      </span>

      <h3 className="mt-7 text-2xl font-black uppercase tracking-[-0.035em]">
        Editions archive in preparation
      </h3>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/38">
        The season-by-season archive for {tournamentName} will appear here as
        soon as the historical data is connected.
      </p>

      <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
        <Clock3 size={12} aria-hidden="true" />
        Data layer ready
      </div>
    </div>
  );
}