import Link from "next/link";

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
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      style={{
        "--hall-accent": accentColor,
      } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1440px]">
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
          <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
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
          <TitleLeaders
            tournamentName={tournamentName}
            leaders={leaders}
          />
        ) : null}

        {sortedEntries.length > 0 ? (
          <ChampionsTable
            tournamentName={tournamentName}
            entries={sortedEntries}
          />
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
    <article className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 sm:p-9 lg:p-11">
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
            className="mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl"
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

type TitleLeadersProps = {
  tournamentName: string;
  leaders: HallOfChampionsLeader[];
};

function TitleLeaders({
  tournamentName,
  leaders,
}: TitleLeadersProps) {
  const displayedLeaders = leaders.slice(0, 4);

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--hall-accent)]">
            Tournament leaders
          </p>

          <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
            Most titles at {tournamentName}
          </h3>
        </div>

        <span className="inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25">
          <Medal
            size={12}
            className="text-[var(--hall-accent)]"
            aria-hidden="true"
          />
          Open Era ranking
        </span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {displayedLeaders.map((leader, index) => (
          <LeaderCard
            key={`${leader.player}-${leader.titles}`}
            leader={leader}
            position={index + 1}
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
    <article className="group relative min-h-[250px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[var(--hall-accent)]">
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

type ChampionsTableProps = {
  tournamentName: string;
  entries: HallOfChampionsEntry[];
};

function ChampionsTable({
  tournamentName,
  entries,
}: ChampionsTableProps) {
  return (
    <section className="mt-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--hall-accent)]">
            Year-by-year archive
          </p>

          <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
            Men&apos;s singles champions
          </h3>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
          {entries.length} editions
        </span>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
        <div className="hidden grid-cols-[100px_minmax(220px,1fr)_minmax(200px,0.8fr)_minmax(210px,1fr)_48px] gap-5 border-b border-white/10 bg-white/[0.018] px-7 py-5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/25 lg:grid">
          <span>Year</span>
          <span>Champion</span>
          <span>Runner-up</span>
          <span>Score</span>
          <span aria-hidden="true" />
        </div>

        <div>
          {entries.map((entry, index) => (
            <ChampionRow
              key={`${entry.year}-${entry.champion}`}
              entry={entry}
              tournamentName={tournamentName}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ChampionRowProps = {
  entry: HallOfChampionsEntry;
  tournamentName: string;
  isLast: boolean;
};

function ChampionRow({
  entry,
  tournamentName,
  isLast,
}: ChampionRowProps) {
  const rowContent = (
    <>
      <div>
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/24 lg:hidden">
          Edition
        </span>

        <span className="mt-2 block text-2xl font-black tracking-[-0.045em] text-[var(--hall-accent)] lg:mt-0">
          {entry.year}
        </span>
      </div>

      <div>
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/24 lg:hidden">
          Champion
        </span>

        <ChampionName
          name={entry.champion}
          playerSlug={entry.playerSlug}
          className="mt-2 text-base lg:mt-0"
        />

        <CountryLabel
          countryCode={entry.championCountryCode}
          country={entry.championCountry}
          className="mt-2"
        />
      </div>

      <div>
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/24 lg:hidden">
          Runner-up
        </span>

        <p className="mt-2 text-sm font-black uppercase tracking-[-0.015em] text-white/55 lg:mt-0">
          {entry.runnerUp ?? "To be added"}
        </p>
      </div>

      <div>
        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/24 lg:hidden">
          Final score
        </span>

        <p className="mt-2 font-mono text-[9px] leading-6 text-white/38 lg:mt-0">
          {entry.score ?? "To be added"}
        </p>
      </div>

      <span className="hidden h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/20 transition group-hover:border-[var(--hall-accent)] group-hover:text-[var(--hall-accent)] lg:grid">
        {entry.editionHref ? (
          <ArrowUpRight size={14} aria-hidden="true" />
        ) : (
          <Trophy size={14} strokeWidth={1.4} aria-hidden="true" />
        )}
      </span>
    </>
  );

  const className = `group grid gap-6 p-7 transition hover:bg-white/[0.02] lg:grid-cols-[100px_minmax(220px,1fr)_minmax(200px,0.8fr)_minmax(210px,1fr)_48px] lg:items-center ${
    isLast ? "" : "border-b border-white/10"
  }`;

  if (entry.editionHref) {
    return (
      <Link
        href={entry.editionHref}
        aria-label={`Open ${tournamentName} ${entry.year} edition`}
        className={className}
      >
        {rowContent}
      </Link>
    );
  }

  return <article className={className}>{rowContent}</article>;
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

  if (!playerSlug) {
    return <h3 className={textClassName}>{name}</h3>;
  }

  return (
    <h3>
      <Link
        href={`/players/${playerSlug}`}
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