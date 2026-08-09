import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  Masters1000Final,
  Masters1000TitleLeader,
} from "@/lib/data/masters-1000-champions";

import {
  getTournamentChampions,
} from "@/lib/tournament-engine";

import type {
  Masters1000Slug,
} from "@/lib/data/masters-1000";

import {
  getPlayerArchiveHref,
} from "@/lib/player-links";

type Props = {
  slug: Masters1000Slug;
  tournamentName: string;
  cmsRecentFinals?: Masters1000Final[];
  cmsTitleLeaders?: Masters1000TitleLeader[];
};

export default function Masters1000HallOfChampionsSection({
  slug,
  tournamentName,
  cmsRecentFinals = [],
  cmsTitleLeaders = [],
}: Props) {
  const staticArchive =
    getTournamentChampions(
      slug,
    );

  const recentFinals =
    cmsRecentFinals.length > 0
      ? cmsRecentFinals
      : staticArchive?.recentFinals ?? [];

  const titleLeaders =
    cmsTitleLeaders.length > 0
      ? cmsTitleLeaders
      : staticArchive?.titleLeaders ?? [];

  if (
    recentFinals.length === 0 &&
    titleLeaders.length === 0
  ) {
    return null;
  }

  const archiveFrom =
    staticArchive?.archiveFrom ??
    recentFinals.at(-1)?.year ??
    recentFinals[0]?.year ??
    new Date().getFullYear();

  const archiveTo =
    staticArchive?.archiveTo ??
    recentFinals[0]?.year ??
    new Date().getFullYear();

  const editionsPlayed =
    staticArchive?.editionsPlayed ??
    recentFinals.length;

  const uniqueChampions =
    staticArchive?.uniqueChampions ??
    new Set(
      recentFinals.map(
        (final) =>
          final.champion,
      ),
    ).size;

  const recordTitles =
    staticArchive?.recordTitles ??
    titleLeaders[0]?.titles ??
    0;

  const recordHolders =
    staticArchive?.recordHolders ??
    titleLeaders
      .filter(
        (leader) =>
          leader.titles ===
          recordTitles,
      )
      .map(
        (leader) =>
          leader.player,
      );

  const latestFinal =
    recentFinals[0];

  const latestChampion =
    latestFinal?.champion ??
    staticArchive?.latestChampion ??
    "Champion pending";

  const latestChampionNation =
    latestFinal?.championNation ??
    staticArchive?.latestChampionNation ?? {
      code: "",
      name: "Nation pending",
      flag: "",
    };

  const latestHref =
    getPlayerArchiveHref(
      latestChampion,
    );

  return (
    <section
      id="champions"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="pointer-events-none absolute -right-56 top-10 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Hall of Champions
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              The champions who defined {tournamentName}.
            </h2>

            <p className="mt-7 max-w-3xl text-sm leading-7 text-white/44 sm:text-base">
              A museum-style record of the champions, finalists and title
              leaders who shaped {tournamentName} history.
            </p>
          </div>

          <div className="rounded-[1.65rem] border border-white/10 bg-[#07101D]/92 p-6 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-white/28">
                  Reigning champion
                </p>

                {latestHref ? (
                  <Link
                    href={latestHref}
                    className="group mt-4 inline-flex items-center gap-2 text-3xl font-black uppercase leading-none tracking-[-0.045em] transition hover:text-[var(--tournament-primary)]"
                  >
                    {latestChampion}

                    <ArrowUpRight
                      size={16}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                ) : (
                  <h3 className="mt-4 text-3xl font-black uppercase leading-none tracking-[-0.045em]">
                    {latestChampion}
                  </h3>
                )}

                <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.17em] text-white/42">
                  {latestChampionNation.flag}{" "}
                  {latestChampionNation.name} ·{" "}
                  {latestFinal?.year ??
                    archiveTo}
                </p>
              </div>

              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--tournament-primary)]">
                <Crown size={20} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <ArchiveFact
            value={`${archiveFrom}–${archiveTo}`}
            label="Archive span"
            icon={CalendarDays}
          />

          <ArchiveFact
            value={String(
              editionsPlayed,
            )}
            label="Editions played"
            icon={Trophy}
          />

          <ArchiveFact
            value={String(
              uniqueChampions,
            )}
            label="Different champions"
            icon={Medal}
          />

          <ArchiveFact
            value={`${recordTitles} titles`}
            label={recordHolders.join(
              " · ",
            )}
            icon={ShieldCheck}
          />
        </div>

        <div className="mt-12 grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              Championship matches
            </p>

            <h3 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
              Recent finals
            </h3>

            <div className="mt-7 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07101D]">
              {recentFinals.map(
                (
                  final,
                  index,
                ) => (
                  <FinalRow
                    key={
                      final.year
                    }
                    final={final}
                    isLast={
                      index ===
                      recentFinals.length -
                        1
                    }
                  />
                ),
              )}
            </div>
          </div>

          <aside>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              Tournament royalty
            </p>

            <h3 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
              Title leaders
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {titleLeaders.map(
                (
                  leader,
                  index,
                ) => (
                  <TitleLeaderCard
                    key={
                      leader.player
                    }
                    leader={
                      leader
                    }
                    rank={
                      index + 1
                    }
                  />
                ),
              )}
            </div>
          </aside>
        </div>

        <div className="mt-8 rounded-[1.7rem] border border-dashed border-white/12 bg-white/[0.018] p-7">
          <div className="flex items-start gap-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
              <Sparkles
                size={18}
              />
            </span>

            <div>
              <h3 className="text-lg font-black uppercase">
                Smart archive links
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/38">
                Champions, finalists and title leaders are linked automatically
                whenever an AGE202 player archive exists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchiveFact({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: typeof Trophy;
}) {
  return (
    <div className="flex min-h-[124px] items-center justify-between bg-[#071021]/94 px-6 py-5">
      <div>
        <span className="block text-2xl font-black uppercase">
          {value}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
          {label}
        </span>
      </div>

      <Icon
        size={19}
        className="text-[var(--tournament-primary)]"
      />
    </div>
  );
}

function PlayerName({
  name,
}: {
  name: string;
}) {
  const href =
    getPlayerArchiveHref(
      name,
    );

  return href ? (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 font-black uppercase transition hover:text-[var(--tournament-primary)]"
    >
      {name}

      <ArrowUpRight
        size={12}
        className="opacity-0 transition group-hover:opacity-100"
      />
    </Link>
  ) : (
    <span className="font-black uppercase">
      {name}
    </span>
  );
}

function FinalRow({
  final,
  isLast,
}: {
  final: Masters1000Final;
  isLast: boolean;
}) {
  return (
    <article
      className={`grid gap-6 p-6 hover:bg-white/[0.035] lg:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_150px] lg:items-center ${
        isLast
          ? ""
          : "border-b border-white/10"
      }`}
    >
      <div>
        <span className="text-2xl font-black text-[var(--tournament-primary)]">
          {final.year}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase text-white/24">
          Final
        </span>
      </div>

      <div>
        <p className="font-mono text-[7px] uppercase text-[var(--tournament-primary)]">
          Champion
        </p>

        <p className="mt-2">
          <PlayerName
            name={
              final.champion
            }
          />
        </p>

        <p className="mt-2 text-xs text-white/30">
          {
            final.championNation
              .flag
          }{" "}
          {
            final.championNation
              .code
          }
        </p>
      </div>

      <div>
        <p className="font-mono text-[7px] uppercase text-white/25">
          Runner-up
        </p>

        <p className="mt-2">
          <PlayerName
            name={
              final.runnerUp
            }
          />
        </p>

        <p className="mt-2 text-xs text-white/30">
          {
            final.runnerUpNation
              .flag
          }{" "}
          {
            final.runnerUpNation
              .code
          }
        </p>
      </div>

      <div className="lg:text-right">
        <p className="font-mono text-[10px] font-black text-white/68">
          {final.score}
        </p>

        {final.note ? (
          <p className="mt-2 text-[10px] leading-5 text-white/28">
            {final.note}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function TitleLeaderCard({
  leader,
  rank,
}: {
  leader: Masters1000TitleLeader;
  rank: number;
}) {
  const href =
    getPlayerArchiveHref(
      leader.player,
    );

  const body = (
    <article className="group rounded-[1.6rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-0.5 hover:border-[var(--tournament-primary)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="font-mono text-[7px] uppercase text-white/24">
            Rank 0{rank}
          </p>

          <h4 className="mt-3 text-xl font-black uppercase">
            {
              leader.player
            }
          </h4>

          <p className="mt-3 text-xs text-white/30">
            {
              leader.nation
                .flag
            }{" "}
            {
              leader.nation
                .code
            }
          </p>
        </div>

        <div className="text-right">
          <span className="block text-4xl font-black text-[var(--tournament-primary)]">
            {
              leader.titles
            }
          </span>

          <span className="font-mono text-[7px] uppercase text-white/25">
            Titles
          </span>
        </div>
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[8px] text-white/36">
        {leader.years.length >
        0
          ? leader.years.join(
              " · ",
            )
          : "Years pending"}
      </p>

      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 font-mono text-[7px] uppercase text-white/28 group-hover:text-[var(--tournament-primary)]">
          View archive{" "}
          <ArrowUpRight
            size={11}
          />
        </span>
      ) : null}
    </article>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-[1.6rem] focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]"
    >
      {body}
    </Link>
  ) : (
    body
  );
}