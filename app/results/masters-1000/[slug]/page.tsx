import type { CSSProperties } from "react";
import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

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
  Building2,
  Trophy,
} from "lucide-react";

import Masters1000ChampionsTimeline from "@/components/results/Masters1000ChampionsTimeline";
import Masters1000HallOfChampionsSection from "@/components/results/Masters1000HallOfChampionsSection";
import Masters1000LegendsSection from "@/components/results/Masters1000LegendsSection";
import Masters1000TournamentGallery from "@/components/results/Masters1000TournamentGallery";
import Masters1000TournamentFacts from "@/components/results/Masters1000TournamentFacts";
import Masters1000TournamentEditions from "@/components/results/Masters1000TournamentEditions";
import Masters1000TournamentRecords from "@/components/results/Masters1000TournamentRecords";
import Masters1000ChampionSpotlight from "@/components/results/Masters1000ChampionSpotlight";
import Masters1000MuseumChapter from "@/components/results/Masters1000MuseumChapter";

import {
  getMasters1000Href,
  masters1000List,
  type Masters1000IconicMoment,
  type Masters1000TimelineEntry,
} from "@/lib/data/masters-1000";
import type { TournamentConfig } from "@/lib/data/tournaments/types";
import { MASTERS_1000_SLUGS, getTournament } from "@/lib/tournament-engine";

type Masters1000PageProps = {
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
  return MASTERS_1000_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: Masters1000PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tournament = getTournament(slug);

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
  const description = `${tournament.introduction} Explore the history, identity, timeline, records and defining moments of ${tournament.name}.`;

  return {
    title,
    description,
    keywords: [
      tournament.name,
      tournament.officialName,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      `${tournament.name} archive`,
      "ATP Masters 1000",
      "tennis history",
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
    category: "ATP Masters 1000 tennis",
  };
}

export default async function Masters1000TournamentPage({
  params,
}: Masters1000PageProps) {
  const { slug } = await params;
  const tournament = getTournament(slug);

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
    name: tournament.officialName,
    alternateName: tournament.name,
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
      name: tournament.officialName,
    },
  };

  return (
    <main
      style={tournamentStyle}
      className="min-h-screen overflow-hidden bg-[#050B18] text-white selection:bg-[var(--tournament-primary)] selection:text-[#050B18]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <TournamentHero tournament={tournament} />

      <TournamentNavigation tournament={tournament} />

      <Masters1000TournamentGallery slug={tournament.slug} />

      <Masters1000MuseumChapter
        eyebrow="Chapter I · The place"
        title="The desert became a cathedral of tennis."
        statement="A tournament shaped by scale, light, heat and the vast California landscape."
        code={tournament.code}
      />

      <TournamentOverview tournament={tournament} />

      <Masters1000TournamentFacts slug={tournament.slug} />

      <Masters1000ChampionSpotlight
        slug={tournament.slug}
        index={0}
        chapter="Chapter II · The king"
      />

      <Masters1000HallOfChampionsSection slug={tournament.slug} />

      <Masters1000ChampionsTimeline
        tournamentName={tournament.name}
        entries={tournament.championsTimeline}
      />

      <Masters1000ChampionSpotlight
        slug={tournament.slug}
        index={1}
        chapter="Chapter III · The rival"
        reverse
      />

      <Masters1000LegendsSection slug={tournament.slug} />

      <Masters1000MuseumChapter
        eyebrow="Chapter IV · The archive"
        title="Every edition adds another layer to the mythology."
        statement="Champions, finals, turning points and memories arranged as a living historical collection."
        code="ARCHIVE"
      />

      <Masters1000TournamentEditions slug={tournament.slug} />

      <TournamentHistory tournament={tournament} />

      <TournamentTimeline
        tournamentName={tournament.name}
        entries={tournament.timeline}
      />

      <Masters1000TournamentRecords slug={tournament.slug} />

      <Masters1000ChampionSpotlight
        slug={tournament.slug}
        index={2}
        chapter="Chapter V · The legacy"
      />

      <IconicMoments
        tournamentName={tournament.name}
        moments={tournament.iconicMoments}
      />

      <ArchivePreview tournament={tournament} />

      <MastersNavigation tournament={tournament} />

      <BackToTop />
    </main>
  );
}

type TournamentHeroProps = {
  tournament: TournamentConfig;
};

function TournamentHero({ tournament }: TournamentHeroProps) {
  const heroFacts = tournament.facts?.facts ?? [];

  return (
    <section className="relative isolate min-h-[calc(100svh-3rem)] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div
        className="absolute inset-0 scale-[1.01] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/tournaments/${tournament.slug}/hero.jpg)`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#020611]/92 via-[#020611]/62 to-[#020611]/16"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#020611]/82 via-[#020611]/10 to-[#020611]/18"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-28 mix-blend-color"
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
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-48"
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

      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] max-w-[1480px] flex-col px-5 pb-8 pt-7 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results/masters-1000"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Masters 1000
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">
            <Globe2 size={12} aria-hidden="true" />
            {tournament.city} · {tournament.country}
          </span>
        </div>

        <div className="my-auto grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-end lg:py-20">
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

            <p className="mt-8 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/42">
              {tournament.code} · ATP Masters 1000 archive
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/20 px-4 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tournament-primary)] shadow-[0_0_18px_var(--tournament-glow)]" />
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-white/55">
                {tournament.founded} — Today
              </span>
            </div>

            <h1 className="mt-6 max-w-6xl text-[clamp(4.6rem,11vw,11rem)] font-black uppercase leading-[0.72] tracking-[-0.095em] drop-shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
              {tournament.name}
            </h1>

            <p className="mt-8 max-w-4xl text-xl font-black uppercase leading-[1.02] tracking-[-0.045em] text-white/46 sm:text-2xl lg:text-4xl">
              {tournament.headline}
            </p>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
              {tournament.introduction}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
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

          <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#07101D]/76 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
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

              <blockquote className="mt-7 border-l-2 border-[var(--tournament-primary)] pl-5 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white/70">
                “{tournament.motto}”
              </blockquote>

              <dl className="mt-7 space-y-1">
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

        <div className="grid gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:grid-cols-2 xl:grid-cols-4">
          {heroFacts.map((fact, index) => (
            <div
              key={fact.label}
              className="flex min-h-[88px] items-center justify-between bg-[#071021]/88 px-5 py-4 transition hover:bg-[#0A1628]"
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
                {String(index + 1).padStart(2, "0")}
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

function HeroDetail({
  label,
  value,
  icon: Icon,
}: HeroDetailProps) {
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
  tournament: TournamentConfig;
};

function TournamentNavigation({
  tournament,
}: TournamentNavigationProps) {
  return (
    <nav
      aria-label={`${tournament.name} page sections`}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/88 px-4 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)] sm:inline-flex">
          <Trophy size={13} aria-hidden="true" />
          {tournament.code}
        </span>

        <SectionLink href="#gallery" label="Gallery" />
        <SectionLink href="#overview" label="Overview" />
        <SectionLink href="#facts" label="Facts" />
        <SectionLink href="#champions" label="Champions" />
        <SectionLink href="#champions-timeline" label="Finals" />
        <SectionLink href="#legends" label="Legends" />
        <SectionLink href="#editions" label="Editions" />
        <SectionLink href="#history" label="History" />
        <SectionLink href="#timeline" label="Milestones" />
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
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 transition hover:-translate-y-px hover:border-[var(--tournament-primary)] hover:bg-[var(--tournament-primary)]/10 hover:text-[var(--tournament-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)] sm:text-[8px]"
    >
      {label}
    </a>
  );
}

type TournamentOverviewProps = {
  tournament: TournamentConfig;
};

function TournamentOverview({
  tournament,
}: TournamentOverviewProps) {
  return (
    <section
      id="overview"
      className="relative scroll-mt-16 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
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
          description="The essential identity, setting and competitive characteristics of this Masters 1000 tournament."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={MapPin}
            label="Location"
            value={`${tournament.city}, ${tournament.country}`}
            description="The city and country connected to the tournament."
          />

          <OverviewCard
            icon={Building2}
            label="Venue"
            value={tournament.venue}
            description="The principal setting and permanent home of the championship."
          />

          <OverviewCard
            icon={CircleDot}
            label="Court"
            value={tournament.surface}
            description="The surface that shapes movement, rhythm and strategy."
          />

          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value={tournament.calendar}
            description="Its traditional position within the ATP season."
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
                AGE202 Masters 1000 archive
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
  tournament: TournamentConfig;
};

function TournamentHistory({
  tournament,
}: TournamentHistoryProps) {
  return (
    <section
      id="history"
      className="scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
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
            The evolution of {tournament.name}, its venue and its role within
            the ATP Masters 1000 season.
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
                key={`${index}-${paragraph}`}
                className="grid gap-5 border-b border-white/10 p-7 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)] sm:p-9"
              >
                <span className="text-4xl font-black tracking-[-0.06em] text-white/[0.1]">
                  {String(index + 1).padStart(2, "0")}
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
  entries: Masters1000TimelineEntry[];
};

function TournamentTimeline({
  tournamentName,
  entries,
}: TournamentTimelineProps) {
  return (
    <section
      id="timeline"
      className="relative scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
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
  entry: Masters1000TimelineEntry;
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

type IconicMomentsProps = {
  tournamentName: string;
  moments: Masters1000IconicMoment[];
};

function IconicMoments({
  tournamentName,
  moments,
}: IconicMomentsProps) {
  return (
    <section
      id="moments"
      className="scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
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
  moment: Masters1000IconicMoment;
  index: number;
};

function MomentCard({
  moment,
  index,
}: MomentCardProps) {
  return (
    <article className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8">
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
  tournament: TournamentConfig;
};

function ArchivePreview({
  tournament,
}: ArchivePreviewProps) {
  const archiveItems = [
    {
      icon: Crown,
      title: "Hall of Champions",
      description:
        "A complete record of tournament winners across every edition.",
      status: "Next phase",
    },
    {
      icon: CalendarDays,
      title: "Tournament Editions",
      description:
        "Season-by-season finals, champions, runners-up and results.",
      status: "Next phase",
    },
    {
      icon: Medal,
      title: "Greatest Finals",
      description:
        "Championship matches that became part of Masters history.",
      status: "Planned",
    },
    {
      icon: Trophy,
      title: "AGE202 Collection",
      description:
        "Apparel and memorabilia connected to the tournament and its champions.",
      status: "Planned",
    },
  ];

  return (
    <section
      id="archive"
      className="scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
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
                The architecture is ready to receive champions, editions,
                finals, detailed records and memorabilia.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {archiveItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="flex items-start gap-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                      <Icon
                        size={18}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-base font-black uppercase tracking-[-0.02em]">
                          {item.title}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/28">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-white/35">
                        {item.description}
                      </p>
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

type MastersNavigationProps = {
  tournament: TournamentConfig;
};

function MastersNavigation({
  tournament,
}: MastersNavigationProps) {
  return (
    <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {tournament.previousTournament ? (
            <TournamentDirectionCard
              direction="previous"
              name={tournament.previousTournament.name}
              href={getMasters1000Href(
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
              href={getMasters1000Href(
                tournament.nextTournament.slug,
              )}
            />
          ) : (
            <TournamentIndexCard />
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                Masters 1000 world tour
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">
                Explore all nine tournaments
              </h2>
            </div>

            <Link
              href="/results/masters-1000"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/38 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
            >
              Masters hub
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {masters1000List.map((mastersTournament) => {
              const isCurrent =
                mastersTournament.slug === tournament.slug;

              return (
                <Link
                  key={mastersTournament.slug}
                  href={getMasters1000Href(
                    mastersTournament.slug,
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`group flex min-h-[115px] items-center justify-between gap-4 bg-[#07101D] px-6 py-5 transition ${
                    isCurrent
                      ? "text-[var(--tournament-primary)]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                      {mastersTournament.code}
                    </span>

                    <h3 className="mt-2 text-sm font-black uppercase tracking-[-0.02em]">
                      {mastersTournament.name}
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
          {isPrevious ? "Previous Masters" : "Next Masters"}
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
      href="/results/masters-1000"
      className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8"
    >
      <div>
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          Masters 1000 index
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