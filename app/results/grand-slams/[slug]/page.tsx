import type { CSSProperties } from "react";
import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import GrandSlamHallOfChampionsSection from "@/components/results/GrandSlamHallOfChampionsSection";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Crown,
  Flag,
  Globe2,
  History,
  Landmark,
  Layers3,
  MapPin,
  Medal,
  ShieldCheck,
  Sparkles,
  Building2,
  Trophy,
} from "lucide-react";

import {
  GRAND_SLAM_SLUGS,
  getGrandSlamBySlug,
  getGrandSlamHref,
  grandSlamList,
  type GrandSlamData,
  type GrandSlamIconicMoment,
  type GrandSlamRecord,
  type GrandSlamTimelineEntry,
} from "@/lib/data/grand-slams";

type GrandSlamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TournamentStyle = CSSProperties & {
  "--tournament-primary": string;
  "--tournament-secondary": string;
  "--tournament-glow": string;
};

export function generateStaticParams() {
  return GRAND_SLAM_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: GrandSlamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tournament = getGrandSlamBySlug(slug);

  if (!tournament) {
    return {
      title: "Tournament not found | AGE202",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${tournament.name} Archive | AGE202`;
  const description = `${tournament.introduction} Explore the history, timeline, identity and records of ${tournament.name}.`;

  return {
    title,
    description,
    keywords: [
      tournament.name,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      `${tournament.name} archive`,
      "Grand Slam tennis",
      "AGE202",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    category: "Grand Slam tennis",
  };
}

export default async function GrandSlamTournamentPage({
  params,
}: GrandSlamPageProps) {
  const { slug } = await params;
  const tournament = getGrandSlamBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const tournamentStyle: TournamentStyle = {
    "--tournament-primary": tournament.colors.primary,
    "--tournament-secondary": tournament.colors.secondary,
    "--tournament-glow": tournament.colors.glow,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    description: tournament.introduction,
    sport: "Tennis",
    location: {
      "@type": "Place",
      name: tournament.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: tournament.city,
        addressCountry: tournament.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: tournament.name,
    },
  };

  return (
    <main
      style={tournamentStyle}
      className="min-h-screen overflow-hidden bg-[#050B18] text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <TournamentHero tournament={tournament} />

      <TournamentNavigation tournament={tournament} />

      <TournamentOverview tournament={tournament} />

      <GrandSlamHallOfChampionsSection slug={tournament.slug} />

      <TournamentHistory tournament={tournament} />

      <TournamentTimeline
        tournamentName={tournament.name}
        entries={tournament.timeline}
      />

      <TournamentRecords
        tournamentName={tournament.name}
        records={tournament.records}
      />

      <IconicMoments
        tournamentName={tournament.name}
        moments={tournament.iconicMoments}
      />

      <ArchivePreview tournament={tournament} />

      <GrandSlamNavigation tournament={tournament} />

      <BackToTop />
    </main>
  );
}

type TournamentHeroProps = {
  tournament: GrandSlamData;
};

function TournamentHero({ tournament }: TournamentHeroProps) {
  return (
    <section className="relative isolate min-h-[900px] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              115deg,
              #020611 0%,
              ${tournament.colors.secondary} 52%,
              #020611 100%
            )
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(
              circle at 76% 28%,
              ${tournament.colors.glow},
              transparent 31%
            )
          `,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(255,255,255,0.055),transparent_27%)]" />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute -right-14 top-20 hidden select-none text-[20rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.025] xl:block">
        {tournament.visualCode}
      </div>

      <div className="relative mx-auto flex min-h-[900px] max-w-[1480px] flex-col px-6 pb-14 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results/grand-slams"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Grand Slams
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">
            <Globe2 size={12} aria-hidden="true" />
            {tournament.city} · {tournament.country}
          </span>
        </div>

        <div className="my-auto grid gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{
                  backgroundColor: tournament.colors.primary,
                }}
              />

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                {tournament.eyebrow}
              </span>
            </div>

            <p className="mt-9 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/24">
              {tournament.code} · Grand Slam archive
            </p>

            <h1 className="mt-5 max-w-6xl text-[clamp(4.1rem,9.8vw,9.6rem)] font-black uppercase leading-[0.76] tracking-[-0.085em]">
              {tournament.name}
            </h1>

            <p className="mt-9 max-w-4xl text-xl font-black uppercase leading-[1.05] tracking-[-0.035em] text-white/28 sm:text-2xl lg:text-3xl">
              {tournament.headline}
            </p>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/52 sm:text-lg">
              {tournament.introduction}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tournament-primary)] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Explore tournament
                <ArrowDown size={14} aria-hidden="true" />
              </a>

              <a
                href="#history"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
              >
                Discover history
                <History size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]/82 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                backgroundColor: tournament.colors.glow,
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--tournament-primary)]">
                    Tournament identity
                  </p>

                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                    {tournament.identity}
                  </h2>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--tournament-primary)]">
                  <Crown size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </div>

              <blockquote className="mt-8 border-l-2 border-[var(--tournament-primary)] pl-5 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white/70">
                “{tournament.motto}”
              </blockquote>

              <dl className="mt-9 space-y-1">
                <HeroDetail
                  label="Venue"
                  value={tournament.venue}
                  icon={Building2}
                />

                <HeroDetail
                  label="Surface"
                  value={tournament.surface}
                  icon={CircleDot}
                />

                <HeroDetail
                  label="Calendar"
                  value={tournament.calendar}
                  icon={CalendarDays}
                />

                <HeroDetail
                  label="Founded"
                  value={tournament.founded}
                  icon={Landmark}
                />
              </dl>
            </div>
          </aside>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {tournament.facts.map((fact, index) => (
            <div
              key={fact.label}
              className="flex min-h-[112px] items-center justify-between bg-[#071021]/94 px-6 py-5"
            >
              <div>
                <span className="block text-2xl font-black uppercase tracking-[-0.045em]">
                  {fact.value}
                </span>

                <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
                  {fact.label}
                </span>
              </div>

              <span className="font-mono text-[8px] font-black text-[var(--tournament-primary)]">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type HeroDetailProps = {
  label: string;
  value: string;
  icon: typeof Building2;
};

function HeroDetail({ label, value, icon: Icon }: HeroDetailProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-4 last:border-b-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">
        <Icon
          size={13}
          className="text-[var(--tournament-primary)]"
          aria-hidden="true"
        />
        {label}
      </dt>

      <dd className="max-w-[210px] text-right text-[11px] font-black uppercase leading-5 tracking-[0.04em] text-white/66">
        {value}
      </dd>
    </div>
  );
}

type TournamentNavigationProps = {
  tournament: GrandSlamData;
};

function TournamentNavigation({
  tournament,
}: TournamentNavigationProps) {
  return (
    <nav
      aria-label={`${tournament.name} page sections`}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/92 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)] sm:inline-flex">
          <Trophy size={13} aria-hidden="true" />
          {tournament.code}
        </span>

        <SectionLink href="#overview" label="Overview" />
        <SectionLink href="#champions" label="Champions" />
        <SectionLink href="#history" label="History" />
        <SectionLink href="#timeline" label="Timeline" />
        <SectionLink href="#records" label="Records" />
        <SectionLink href="#moments" label="Moments" />
        <SectionLink href="#archive" label="Archive" />
      </div>
    </nav>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
};

function SectionLink({ href, label }: SectionLinkProps) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 transition hover:border-[var(--tournament-primary)] hover:bg-white/[0.04] hover:text-[var(--tournament-primary)] sm:text-[8px]"
    >
      {label}
    </a>
  );
}

type TournamentOverviewProps = {
  tournament: GrandSlamData;
};

function TournamentOverview({
  tournament,
}: TournamentOverviewProps) {
  return (
    <section
      id="overview"
      className="scroll-mt-16 relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          backgroundColor: tournament.colors.glow,
          opacity: 0.32,
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament overview"
          title={`Inside ${tournament.name}`}
          description="The essential identity, setting and sporting characteristics of the championship."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={MapPin}
            label="Location"
            value={`${tournament.city}, ${tournament.country}`}
            description="The host city and country of the championship."
          />

          <OverviewCard
            icon={Building2}
            label="Venue"
            value={tournament.venue}
            description="The permanent home and principal setting of the event."
          />

          <OverviewCard
            icon={CircleDot}
            label="Court"
            value={tournament.surface}
            description="The surface that shapes movement, rhythm and tactics."
          />

          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value={tournament.calendar}
            description="Its traditional position within the tennis season."
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-12 -top-20 text-[10rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]">
              {tournament.code}
            </div>

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Flag size={20} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                Tournament character
              </p>

              <h3 className="mt-4 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                {tournament.identity}
              </h3>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
                {tournament.introduction}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              Tournament statement
            </p>

            <blockquote className="mt-7 text-3xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-white/76">
              “{tournament.motto}”
            </blockquote>

            <div className="mt-9 border-t border-white/10 pt-6">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">
                AGE202 tournament archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type OverviewCardProps = {
  icon: typeof MapPin;
  label: string;
  value: string;
  description: string;
};

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <article className="group rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>

      <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
        {value}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/35">
        {description}
      </p>
    </article>
  );
}

type TournamentHistoryProps = {
  tournament: GrandSlamData;
};

function TournamentHistory({ tournament }: TournamentHistoryProps) {
  return (
    <section
      id="history"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-28 xl:self-start">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
            Tournament history
          </p>

          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl">
            From {tournament.founded} to the modern era.
          </h2>

          <p className="mt-6 text-sm leading-7 text-white/43">
            The evolution of {tournament.name}, its venue and its place within
            the Grand Slam calendar.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3">
            <Landmark
              size={13}
              className="text-[var(--tournament-primary)]"
              aria-hidden="true"
            />

            <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
              Founded {tournament.founded}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
          <div className="border-b border-white/10 p-7 sm:p-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                  Historical profile
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em]">
                  The story of {tournament.name}
                </h3>
              </div>

              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <History size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
            </div>
          </div>

          <div>
            {tournament.history.map((paragraph, index) => (
              <article
                key={paragraph}
                className="grid gap-5 border-b border-white/10 p-7 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)] sm:p-9"
              >
                <span className="text-4xl font-black tracking-[-0.06em] text-white/[0.1]">
                  0{index + 1}
                </span>

                <p className="text-sm leading-8 text-white/48 sm:text-base">
                  {paragraph}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type TournamentTimelineProps = {
  tournamentName: string;
  entries: GrandSlamTimelineEntry[];
};

function TournamentTimeline({
  tournamentName,
  entries,
}: TournamentTimelineProps) {
  return (
    <section
      id="timeline"
      className="scroll-mt-16 relative border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Historical timeline"
          title="Defining milestones"
          description={`Key stages in the evolution of ${tournamentName}.`}
        />

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
          {entries.map((entry, index) => (
            <TimelineEntry
              key={`${entry.year}-${entry.title}`}
              entry={entry}
              index={index}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type TimelineEntryProps = {
  entry: GrandSlamTimelineEntry;
  index: number;
  isLast: boolean;
};

function TimelineEntry({
  entry,
  index,
  isLast,
}: TimelineEntryProps) {
  return (
    <article
      className={`group grid gap-6 p-7 transition hover:bg-white/[0.02] sm:grid-cols-[90px_130px_minmax(0,1fr)_48px] sm:items-center sm:p-8 ${
        isLast ? "" : "border-b border-white/10"
      }`}
    >
      <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/22">
        0{index + 1}
      </span>

      <span className="text-3xl font-black tracking-[-0.05em] text-[var(--tournament-primary)]">
        {entry.year}
      </span>

      <div>
        <h3 className="text-xl font-black uppercase tracking-[-0.03em]">
          {entry.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/40">
          {entry.description}
        </p>
      </div>

      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/24 transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
        <ChevronRight size={15} aria-hidden="true" />
      </span>
    </article>
  );
}

type TournamentRecordsProps = {
  tournamentName: string;
  records: GrandSlamRecord[];
};

function TournamentRecords({
  tournamentName,
  records,
}: TournamentRecordsProps) {
  return (
    <section
      id="records"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament records"
          title="Archive profile"
          description={`The defining competitive and historical characteristics of ${tournamentName}.`}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {records.map((record, index) => (
            <RecordCard
              key={`${record.label}-${record.value}`}
              record={record}
              index={index}
            />
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.018] p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Layers3 size={18} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-lg font-black uppercase tracking-[-0.025em]">
                  Detailed records coming later
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/38">
                  The final data phase will add complete champions, finals,
                  editions and statistical tournament records without changing
                  this page architecture.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
              Structure ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

type RecordCardProps = {
  record: GrandSlamRecord;
  index: number;
};

function RecordCard({ record, index }: RecordCardProps) {
  const icons = [Trophy, CircleDot, Sparkles, ShieldCheck];
  const Icon = icons[index % icons.length];

  return (
    <article className="group relative min-h-[320px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)]">
      <div className="pointer-events-none absolute -right-5 -top-8 text-[7rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
        0{index + 1}
      </div>

      <div className="relative flex h-full flex-col">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
          <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
        </span>

        <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
          {record.label}
        </p>

        <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
          {record.value}
        </h3>

        <p className="mt-auto pt-8 text-xs leading-6 text-white/36">
          {record.description}
        </p>
      </div>
    </article>
  );
}

type IconicMomentsProps = {
  tournamentName: string;
  moments: GrandSlamIconicMoment[];
};

function IconicMoments({
  tournamentName,
  moments,
}: IconicMomentsProps) {
  return (
    <section
      id="moments"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Iconic moments"
          title="Chapters that shaped the tournament"
          description={`Selected milestones from the history of ${tournamentName}.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {moments.map((moment, index) => (
            <MomentCard
              key={`${moment.year}-${moment.title}`}
              moment={moment}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type MomentCardProps = {
  moment: GrandSlamIconicMoment;
  index: number;
};

function MomentCard({ moment, index }: MomentCardProps) {
  return (
    <article className="group relative min-h-[400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8">
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          backgroundColor: "var(--tournament-glow)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/23">
            Moment 0{index + 1}
          </span>

          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
            <Medal size={16} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>

        <p className="mt-14 text-5xl font-black tracking-[-0.06em] text-[var(--tournament-primary)]">
          {moment.year}
        </p>

        <h3 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
          {moment.title}
        </h3>

        <p className="mt-auto pt-8 text-sm leading-7 text-white/40">
          {moment.description}
        </p>
      </div>
    </article>
  );
}

type ArchivePreviewProps = {
  tournament: GrandSlamData;
};

function ArchivePreview({ tournament }: ArchivePreviewProps) {
  const archiveItems = [
    {
      icon: CalendarDays,
      title: "Tournament Editions",
      description:
        "Season-by-season pages containing finals, dates and historical context.",
      status: "Next phase",
    },
    {
      icon: Medal,
      title: "Iconic Finals",
      description:
        "The championship matches that became part of tennis history.",
      status: "Next phase",
    },
    {
      icon: Trophy,
      title: "AGE202 Collection",
      description:
        "Memorabilia and apparel connected to the tournament and its champions.",
      status: "Planned",
    },
  ];

  return (
    <section
      id="archive"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07101D] p-7 sm:p-10 lg:p-14">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl"
            style={{
              backgroundColor: tournament.colors.glow,
            }}
          />

          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                  AGE202 tournament archive
                </p>

                <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                  The next layers of {tournament.name}
                </h2>
              </div>

              <p className="text-sm leading-7 text-white/42 lg:text-right">
                The Hall of Champions is now part of the live archive. The next
                phase expands {tournament.name} with editions, iconic finals and
                the AGE202 Collection.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {archiveItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group flex min-h-[190px] items-start gap-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-6 transition duration-300 hover:border-[var(--tournament-primary)]/40 hover:bg-white/[0.025]"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                      <Icon
                        size={18}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="flex h-full flex-1 flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-base font-black uppercase tracking-[-0.02em]">
                          {item.title}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/28">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-4 text-xs leading-6 text-white/35">
                        {item.description}
                      </p>

                      <div className="mt-auto pt-6">
                        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]/55">
                          Archive expansion
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type GrandSlamNavigationProps = {
  tournament: GrandSlamData;
};

function GrandSlamNavigation({
  tournament,
}: GrandSlamNavigationProps) {
  return (
    <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {tournament.previousTournament ? (
            <TournamentDirectionCard
              direction="previous"
              name={tournament.previousTournament.name}
              href={getGrandSlamHref(
                tournament.previousTournament.slug,
              )}
            />
          ) : (
            <TournamentIndexCard />
          )}

          {tournament.nextTournament ? (
            <TournamentDirectionCard
              direction="next"
              name={tournament.nextTournament.name}
              href={getGrandSlamHref(tournament.nextTournament.slug)}
            />
          ) : (
            <TournamentIndexCard />
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                Grand Slam circuit
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">
                Explore all four majors
              </h2>
            </div>

            <Link
              href="/results/grand-slams"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/38 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
            >
              Grand Slam hub
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {grandSlamList.map((slam) => {
              const isCurrent = slam.slug === tournament.slug;

              return (
                <Link
                  key={slam.slug}
                  href={getGrandSlamHref(slam.slug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`group flex min-h-[115px] items-center justify-between gap-4 bg-[#07101D] px-6 py-5 transition ${
                    isCurrent
                      ? "text-[var(--tournament-primary)]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                      {slam.code}
                    </span>

                    <h3 className="mt-2 text-sm font-black uppercase tracking-[-0.02em]">
                      {slam.name}
                    </h3>
                  </div>

                  {isCurrent ? (
                    <CircleDot size={15} aria-hidden="true" />
                  ) : (
                    <ChevronRight
                      size={15}
                      className="text-white/18 transition group-hover:text-white/55"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

type TournamentDirectionCardProps = {
  direction: "previous" | "next";
  name: string;
  href: string;
};

function TournamentDirectionCard({
  direction,
  name,
  href,
}: TournamentDirectionCardProps) {
  const isPrevious = direction === "previous";

  return (
    <Link
      href={href}
      className={`group flex min-h-[180px] items-center gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8 ${
        isPrevious ? "" : "justify-between text-right"
      }`}
    >
      {isPrevious && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
          <ChevronLeft size={19} aria-hidden="true" />
        </span>
      )}

      <div className={isPrevious ? "" : "order-first ml-auto"}>
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          {isPrevious ? "Previous major" : "Next major"}
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          {name}
        </h2>
      </div>

      {!isPrevious && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
          <ChevronRight size={19} aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}

function TournamentIndexCard() {
  return (
    <Link
      href="/results/grand-slams"
      className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8"
    >
      <div>
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          Grand Slam index
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          All tournaments
        </h2>
      </div>

      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
        <Layers3 size={19} aria-hidden="true" />
      </span>
    </Link>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/43 lg:text-right">
        {description}
      </p>
    </div>
  );
}

function BackToTop() {
  return (
    <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
      >
        Back to top
        <ArrowDown
          size={13}
          className="rotate-180"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}