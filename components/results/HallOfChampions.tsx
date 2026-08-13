import Link from "next/link";

import {
  getPlayerArchiveHref,
} from "@/lib/player-links";

import {
  ArrowUpRight,
  CalendarDays,
  Crown,
  Flag,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";

export type HallOfChampionsEntry = {
  year: number;
  champion: string;
  championCountryCode?: string;
  championCountry?: string;
  runnerUp?: string;
  runnerUpCountryCode?: string;
  score?: string;
  playerSlug?: string;
  editionHref?: string;
};

export type HallOfChampionsLeader = {
  player: string;
  titles: number;
  countryCode?: string;
  country?: string;
  playerSlug?: string;
};

type HallOfChampionsProps = {
  tournamentName: string;
  tournamentCode: string;
  entries: HallOfChampionsEntry[];
  leaders?: HallOfChampionsLeader[];
  eraLabel?: string;
  updatedAt: string;
  accentColor?: string;
};

export default function HallOfChampions({
  tournamentName,
  tournamentCode,
  entries,
  leaders = [],
  eraLabel = "Open Era",
  updatedAt,
  accentColor = "var(--tournament-primary)",
}: HallOfChampionsProps) {
  const sortedEntries = [...entries].sort((a, b) => b.year - a.year);
  const latestChampion = sortedEntries[0];

  const uniqueChampions = new Set(
    sortedEntries.map((entry) => entry.champion),
  ).size;

  return (
    <section
      id="champions"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      style={{
        "--hall-accent": accentColor,
      } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute -left-48 top-32 h-[34rem] w-[34rem] rounded-full bg-[var(--hall-accent)] opacity-[0.055] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--hall-accent)]" />

              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--hall-accent)]">
                {tournamentCode} · {eraLabel}
              </p>
            </div>

            <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Hall of Champions
            </h2>
          </div>

          <div className="lg:text-right">
            <p className="text-sm leading-7 text-white/43">
              The men&apos;s singles champions who shaped the history of{" "}
              {tournamentName}.
            </p>

            <p className="mt-3 inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
              <ShieldCheck
                size={11}
                className="text-[var(--hall-accent)]"
                aria-hidden="true"
              />
              Updated {updatedAt}
            </p>
          </div>
        </header>

        {latestChampion ? (
          <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <LatestChampionCard
              tournamentName={tournamentName}
              entry={latestChampion}
            />

            <div className="grid gap-6 sm:grid-cols-3 xl:grid-cols-1">
              <ArchiveStat
                icon={CalendarDays}
                value={String(sortedEntries.length)}
                label="Editions indexed"
              />

              <ArchiveStat
                icon={User}
                value={String(uniqueChampions)}
                label="Different champions"
              />

              <ArchiveStat
                icon={Trophy}
                value={String(latestChampion.year)}
                label="Latest edition"
              />
            </div>
          </div>
        ) : (
          <EmptyChampionsState tournamentName={tournamentName} />
        )}

        {leaders.length > 0 ? (
          <>
            <RecordHolderSpotlight
              tournamentName={tournamentName}
              leader={leaders[0]}
            />

            <TitleLeaders
              tournamentName={tournamentName}
              leaders={leaders}
            />
          </>
        ) : null}

      </div>
    </section>
  );
}

type LatestChampionCardProps = {
  tournamentName: string;
  entry: HallOfChampionsEntry;
};

function LatestChampionCard({
  tournamentName,
  entry,
}: LatestChampionCardProps) {
  return (
    <article className="group relative min-h-[500px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,#081423_0%,#07101D_58%,#050B18_100%)] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-9 lg:p-11">
      <div className="pointer-events-none absolute -right-10 -top-14 text-[12rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
        {entry.year}
      </div>

      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[var(--hall-accent)] opacity-[0.08] blur-3xl" />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--hall-accent)]">
              Latest completed edition
            </p>

            <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">
              {tournamentName} {entry.year}
            </p>
          </div>

          <span className="grid h-13 w-13 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--hall-accent)]">
            <Crown size={21} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-14">
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-white/28">
            Men&apos;s singles champion
          </p>

          <ChampionName
            name={entry.champion}
            playerSlug={entry.playerSlug}
            className="mt-4 max-w-4xl text-5xl sm:text-6xl lg:text-7xl"
          />

          <CountryLabel
            countryCode={entry.championCountryCode}
            country={entry.championCountry}
            className="mt-6"
          />
        </div>

        <div className="mt-auto grid gap-px overflow-hidden rounded-[1.3rem] border border-white/10 bg-white/10 pt-10 sm:grid-cols-2">
          <FinalDetail
            label="Runner-up"
            value={entry.runnerUp ?? "To be added"}
          />

          <FinalDetail
            label="Final score"
            value={entry.score ?? "To be added"}
          />
        </div>

        {entry.editionHref ? (
          <div className="mt-7 flex justify-end">
            <Link
              href={entry.editionHref}
              className="inline-flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/40 transition hover:text-[var(--hall-accent)]"
            >
              Open edition
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}

type ArchiveStatProps = {
  icon: typeof Trophy;
  value: string;
  label: string;
};

function ArchiveStat({
  icon: Icon,
  value,
  label,
}: ArchiveStatProps) {
  return (
    <article className="flex min-h-[126px] items-center justify-between gap-5 rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6">
      <div>
        <span className="block text-3xl font-black uppercase tracking-[-0.05em]">
          {value}
        </span>

        <span className="mt-2 block font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
          {label}
        </span>
      </div>

      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--hall-accent)]">
        <Icon size={17} strokeWidth={1.4} aria-hidden="true" />
      </span>
    </article>
  );
}

type RecordHolderSpotlightProps = {
  tournamentName: string;
  leader: HallOfChampionsLeader;
};

function RecordHolderSpotlight({
  tournamentName,
  leader,
}: RecordHolderSpotlightProps) {
  return (
    <section className="relative mt-14 overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(120deg,#07101D_0%,#091625_58%,#050B18_100%)] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[var(--hall-accent)] opacity-[0.12] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 right-6 select-none text-[12rem] font-black leading-none tracking-[-0.09em] text-white/[0.025] sm:text-[16rem]">
        {leader.titles}
      </div>

      <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-center lg:p-10">
        <div>
          <div className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--hall-accent)]">
              <Crown
                size={18}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--hall-accent)]">
                Legend of the tournament
              </p>

              <p className="mt-1 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
                {tournamentName} · Men&apos;s singles
              </p>
            </div>
          </div>

          <ChampionName
            name={leader.player}
            playerSlug={leader.playerSlug}
            className="mt-8 max-w-4xl text-5xl sm:text-6xl lg:text-7xl"
          />

          <CountryLabel
            countryCode={leader.countryCode}
            country={leader.country}
            className="mt-4"
          />
        </div>

        <div className="relative flex min-h-[250px] flex-col rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
                Championship legacy
              </p>
              <p className="mt-3 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--hall-accent)]">
                All-time benchmark
              </p>
            </div>

            <Medal
              size={18}
              strokeWidth={1.35}
              className="text-[var(--hall-accent)]"
              aria-hidden="true"
            />
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-7xl font-black leading-none tracking-[-0.08em] text-[var(--hall-accent)] sm:text-8xl">
              {leader.titles}
            </span>
            <span className="pb-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/38">
              titles
            </span>
          </div>

          <div className="mt-auto border-t border-white/10 pt-5">
            <p className="text-xs leading-6 text-white/40">
              The men&apos;s singles record at {tournamentName}, preserved in
              the AGE202 championship archive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type TitleLeadersProps = {
  tournamentName: string;
  leaders: HallOfChampionsLeader[];
};

function TitleLeaders({
  tournamentName,
  leaders,
}: TitleLeadersProps) {
  const displayedLeaders = leaders.slice(1, 5);

  if (displayedLeaders.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-white/10 pt-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--hall-accent)]">
            All-time ranking
          </p>

          <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
            Chasing the record
          </h3>
        </div>

        <span className="inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
          <Medal
            size={12}
            className="text-[var(--hall-accent)]"
            aria-hidden="true"
          />
          Positions 02–05
        </span>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayedLeaders.map((leader, index) => (
          <LeaderCard
            key={`${leader.player}-${leader.titles}`}
            leader={leader}
            position={index + 2}
          />
        ))}
      </div>
    </section>
  );
}

type LeaderCardProps = {
  leader: HallOfChampionsLeader;
  position: number;
};

function LeaderCard({
  leader,
  position,
}: LeaderCardProps) {
  return (
    <article className="group relative min-h-[220px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[var(--hall-accent)]">
      <div className="pointer-events-none absolute -right-5 -top-8 text-[7rem] font-black leading-none text-white/[0.025]">
        0{position}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--hall-accent)]">
            {position === 1 ? (
              <Crown size={16} strokeWidth={1.4} aria-hidden="true" />
            ) : (
              <Medal size={16} strokeWidth={1.4} aria-hidden="true" />
            )}
          </span>

          <span className="font-mono text-[8px] font-black uppercase tracking-[0.17em] text-white/25">
            Rank 0{position}
          </span>
        </div>

        <ChampionName
          name={leader.player}
          playerSlug={leader.playerSlug}
          className="mt-8 text-2xl"
        />

        <CountryLabel
          countryCode={leader.countryCode}
          country={leader.country}
          className="mt-4"
        />

        <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-6">
          <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
            Singles titles
          </span>

          <span className="text-4xl font-black tracking-[-0.06em] text-[var(--hall-accent)]">
            {leader.titles}
          </span>
        </div>
      </div>
    </article>
  );
}

type ChampionNameProps = {
  name: string;
  playerSlug?: string;
  className?: string;
};

function ChampionName({
  name,
  playerSlug,
  className = "",
}: ChampionNameProps) {
  const textClassName = `block font-black uppercase leading-[0.95] tracking-[-0.045em] ${className}`;

  const archiveHref =
    getPlayerArchiveHref(name);

  const playerHref =
    archiveHref ??
    (playerSlug
      ? `/players/${playerSlug}`
      : null);

  if (!playerHref) {
    return (
      <h3 className={textClassName}>
        {name}
      </h3>
    );
  }

  return (
    <h3>
      <Link
        href={playerHref}
        className={`${textClassName} transition hover:text-[var(--hall-accent)]`}
      >
        {name}
      </Link>
    </h3>
  );
}

type CountryLabelProps = {
  countryCode?: string;
  country?: string;
  className?: string;
};

function CountryLabel({
  countryCode,
  country,
  className = "",
}: CountryLabelProps) {
  if (!countryCode && !country) {
    return null;
  }

  return (
    <p
      className={`inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/27 ${className}`}
    >
      <Flag
        size={11}
        className="text-[var(--hall-accent)]"
        aria-hidden="true"
      />

      {[countryCode, country].filter(Boolean).join(" · ")}
    </p>
  );
}

type FinalDetailProps = {
  label: string;
  value: string;
};

function FinalDetail({
  label,
  value,
}: FinalDetailProps) {
  return (
    <div className="bg-[#081220] px-5 py-4">
      <dt className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
        {label}
      </dt>

      <dd className="mt-2 text-[11px] font-black uppercase leading-5 tracking-[0.03em] text-white/62">
        {value}
      </dd>
    </div>
  );
}

type EmptyChampionsStateProps = {
  tournamentName: string;
};

function EmptyChampionsState({
  tournamentName,
}: EmptyChampionsStateProps) {
  return (
    <div className="mt-12 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.018] p-8 sm:p-10">
      <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
        <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--hall-accent)]">
          <Sparkles size={20} strokeWidth={1.4} aria-hidden="true" />
        </span>

        <div>
          <h3 className="text-xl font-black uppercase tracking-[-0.025em]">
            {tournamentName} champions are being prepared
          </h3>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/38">
            The component is ready. The verified year-by-year results will be
            connected through the tournament data layer.
          </p>
        </div>
      </div>
    </div>
  );
}