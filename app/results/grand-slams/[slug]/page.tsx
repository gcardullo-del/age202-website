import type { CSSProperties } from "react";
import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import GrandSlamHallOfChampionsSection from "@/components/results/GrandSlamHallOfChampionsSection";
import GrandSlamGallerySection from "@/components/results/GrandSlamGallerySection";
import GrandSlamEditorialChaptersSection from "@/components/results/GrandSlamEditorialChaptersSection";
import GrandSlamIconicMomentsSection from "@/components/results/GrandSlamIconicMomentsSection";
import GrandSlamRecordsSection from "@/components/results/GrandSlamRecordsSection";
import GrandSlamTimelineSection from "@/components/results/GrandSlamTimelineSection";
import GrandSlamHistorySection from "@/components/results/GrandSlamHistorySection";
import GrandSlamEditionsSection from "@/components/results/GrandSlamEditionsSection";
import GrandSlamIconicFinalsSection from "@/components/results/GrandSlamIconicFinalsSection";
import GrandSlamHeroSection from "@/components/results/GrandSlamHeroSection";
import GrandSlamArchivePreviewSection from "@/components/results/GrandSlamArchivePreviewSection";
import GrandSlamNavigation from "@/components/results/GrandSlamNavigation";

import {
  ArrowDown,
  CalendarDays,
  CircleDot,
  Flag,
  MapPin,
  Building2,
  Trophy,
} from "lucide-react";

import {
  GRAND_SLAM_SLUGS,
  getGrandSlamBySlug,
  type GrandSlamData,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

import {
  mapGrandSlamMuseumData,
} from "@/lib/mappers/museum/grand-slam-museum.mapper";

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

  const fallbackTournament =
    getGrandSlamBySlug(slug);

  if (!fallbackTournament) {
    return {
      title: "Tournament not found | AGE202",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const museumTournament =
    await getMuseumTournamentBySlug(
      slug,
    );

  const tournament =
    mapGrandSlamMuseumData(
      fallbackTournament,
      museumTournament,
    );

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

  const fallbackTournament =
    getGrandSlamBySlug(slug);

  if (!fallbackTournament) {
    notFound();
  }

  const museumTournament =
    await getMuseumTournamentBySlug(
      slug,
    );

  const tournament =
    mapGrandSlamMuseumData(
      fallbackTournament,
      museumTournament,
    );

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

      <GrandSlamHeroSection tournament={tournament} />

      <TournamentNavigation tournament={tournament} />

      <TournamentOverview tournament={tournament} />
      
      <GrandSlamGallerySection slug={tournament.slug} />
      

      <GrandSlamHallOfChampionsSection slug={tournament.slug} />

      <GrandSlamEditionsSection slug={tournament.slug} />

      <GrandSlamIconicFinalsSection slug={tournament.slug} />


      <GrandSlamEditorialChaptersSection slug={tournament.slug} />

      <GrandSlamHistorySection
  slug={tournament.slug}
  fallbackHistory={tournament.history}
  fallbackFounded={tournament.founded}
/>

      <GrandSlamTimelineSection
  slug={tournament.slug}
  fallbackEntries={tournament.timeline}
/>

      <GrandSlamRecordsSection
  slug={tournament.slug}
  fallbackRecords={tournament.records}
/>

      <GrandSlamIconicMomentsSection
  slug={tournament.slug}
/>

      <GrandSlamArchivePreviewSection tournament={tournament} />

      <GrandSlamNavigation tournament={tournament} />

      <BackToTop />
    </main>
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
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/95 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex min-h-[74px] max-w-[1480px] items-center px-5 sm:px-8 lg:px-12">
        <div className="flex w-full items-center gap-4 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky left-0 z-10 hidden shrink-0 bg-[#050B18]/95 pr-4 sm:block">
            <div className="flex min-h-[48px] items-center gap-3.5 border-r border-white/10 pr-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/[0.06] text-[var(--tournament-primary)]">
                <Trophy
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <div>
                <span className="block font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Tournament
                </span>

                <span className="mt-0.5 block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                  {tournament.code}
                </span>
              </div>
            </div>
          </div>

          <SectionLink href="#overview" label="Overview" index="01" />
          <SectionLink href="#gallery" label="Gallery" index="02" />
          <SectionLink href="#champions" label="Champions" index="03" />
          <SectionLink href="#editions" label="Editions" index="04" />
          <SectionLink href="#iconic-finals" label="Iconic Finals" index="05" />
          <SectionLink href="#chapters" label="Chapters" index="06" />
          <SectionLink href="#history" label="History" index="07" />
          <SectionLink href="#timeline" label="Timeline" index="08" />
          <SectionLink href="#records" label="Records" index="09" />
          <SectionLink href="#moments" label="Moments" index="10" />
          <SectionLink href="#archive" label="Archive" index="11" />
        </div>
      </div>
    </nav>
  );
}

type SectionLinkProps = {
  href: string;
  label: string;
  index: string;
};

function SectionLink({
  href,
  label,
  index,
}: SectionLinkProps) {
  return (
    <a
      href={href}
      className="group relative flex min-h-[48px] shrink-0 items-center gap-2.5 rounded-xl border border-transparent px-4 py-2.5 transition duration-200 hover:border-white/10 hover:bg-white/[0.035]"
    >
      <span className="font-mono text-[7px] font-black tracking-[0.14em] text-[var(--tournament-primary)]/55 transition group-hover:text-[var(--tournament-primary)]">
        {index}
      </span>

      <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/52 transition group-hover:text-white sm:text-[10px]">
        {label}
      </span>

      <span className="absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-[var(--tournament-primary)] transition-transform duration-200 group-hover:scale-x-100" />
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
      className="scroll-mt-24 relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
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