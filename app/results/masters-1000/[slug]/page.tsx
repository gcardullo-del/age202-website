import type { CSSProperties } from "react";
import type { Metadata } from "next";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Crown,
  Flag,
  History,
  Landmark,
  Layers3,
  MapPin,
  Medal,
  Trophy,
  ArrowDown,
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
import Masters1000TournamentHero from "@/components/results/Masters1000TournamentHero";
import Masters1000TournamentNavigation from "@/components/results/Masters1000TournamentNavigation";
import Masters1000SectionHeading from "@/components/results/Masters1000SectionHeading";
import Masters1000TournamentOverview from "@/components/results/Masters1000TournamentOverview";
import Masters1000TournamentHistory from "@/components/results/Masters1000TournamentHistory";
import Masters1000TournamentTimeline from "@/components/results/Masters1000TournamentTimeline";
import Masters1000IconicMoments from "@/components/results/Masters1000IconicMoments";
import Masters1000ArchivePreview from "@/components/results/Masters1000ArchivePreview";
import Masters1000MastersNavigation from "@/components/results/Masters1000MastersNavigation";
import Masters1000BackToTop from "@/components/results/Masters1000BackToTop";

import {
  getMasters1000Href,
  masters1000List,
  type Masters1000IconicMoment,
  type Masters1000TimelineEntry,
} from "@/lib/data/masters-1000";

import type { TournamentConfig } from "@/lib/data/tournaments/types";
import { prisma } from "@/lib/prisma";
import {
  mapCmsTournamentPageData,
} from "@/lib/mappers/masters-1000-cms.mapper";
import {
  MASTERS_1000_SLUGS,
  getTournament,
  resolveTournamentSlugs,
} from "@/lib/tournament-engine";

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

  const { publicSlug } =
    resolveTournamentSlugs(
      slug,
    );

  const tournament =
    getTournament(
      publicSlug,
    );

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

  const {
    publicSlug,
    cmsSlug,
  } = resolveTournamentSlugs(
    slug,
  );

  if (slug !== publicSlug) {
    redirect(
      `/results/masters-1000/${publicSlug}`,
    );
  }

  const staticTournament =
    getTournament(
      publicSlug,
    );

  if (!staticTournament) {
    notFound();
  }

  const cmsTournament =
    await prisma.tournament.findUnique({
      where: {
        slug: cmsSlug,
      },
      select: {
        name: true,
        shortName: true,
        surface: true,
        foundedYear: true,
        city: true,
        country: true,
        venue: true,
        heroImage: true,
        logoUrl: true,
        description: true,
        history: true,

        galleryItems: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          select: {
            id: true,
            imageUrl: true,
            title: true,
            eyebrow: true,
            caption: true,
            alt: true,
          },
        },

        milestones: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              year: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          select: {
            id: true,
            year: true,
            title: true,
            subtitle: true,
            description: true,
          },
        },

        chapters: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          select: {
            id: true,
            eyebrow: true,
            title: true,
            subtitle: true,
            description: true,
            yearLabel: true,
          },
        },

        iconicMoments: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              year: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

          select: {
            id: true,
            year: true,
            title: true,
            subtitle: true,
            description: true,
          },
        },

        editions: {
          where: {
            cancelled: false,
          },

          orderBy: {
            year: "desc",
          },

          select: {
            id: true,
            year: true,
            endDate: true,
            championName: true,
            runnerUpName: true,
            championCountryCode: true,
            runnerUpCountryCode: true,
            score: true,

            championPlayer: {
              select: {
                name: true,
                country: true,
              },
            },

            runnerUpPlayer: {
              select: {
                name: true,
                country: true,
              },
            },
          },
        },

        champions: {
          orderBy: [
            {
              titles: "desc",
            },
            {
              lastTitleYear: "desc",
            },
          ],

          select: {
            id: true,
            titles: true,
            firstTitleYear: true,
            lastTitleYear: true,
            titleYears: true,
            finals: true,
            wins: true,
            legend: true,
            featured: true,
            sortOrder: true,
            recordLabel: true,
            quote: true,
            imageUrl: true,
            name: true,
            country: true,
            countryCode: true,

            player: {
              select: {
                name: true,
                country: true,
              },
            },
          },
        },
      },
    });

  /*
   * STEP 1 — CMS → PUBLIC MASTERS 1000
   *
   * Keep the existing TournamentConfig as the visual/content fallback.
   * Only identity + hero/overview fields are overridden by Tournament Studio.
   * Gallery, milestones, museum chapters and iconic moments now use CMS
   * records when present and preserve the existing static data as fallbacks.
   * Editions and Hall of Champions now accept CMS championship data with
   * static fallbacks. Records remain on the existing data layer for now.
   */
  const {
    tournament,
    heroImage,
    cmsGalleryImages,
    publicTimelineEntries,
    placeChapter,
    archiveChapter,
    publicIconicMoments,
    cmsEditions,
    cmsRecentFinals,
    cmsTitleLeaders,
    cmsLegends,
  } = mapCmsTournamentPageData(
    cmsTournament,
    staticTournament,
  );

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

      <Masters1000TournamentHero
        tournament={tournament}
        heroImage={heroImage}
      />

      <Masters1000TournamentNavigation tournament={tournament} />

      <Masters1000TournamentGallery
        slug={tournament.slug}
        cmsImages={cmsGalleryImages}
      />

      <Masters1000MuseumChapter
        eyebrow={placeChapter.eyebrow}
        title={placeChapter.title}
        statement={placeChapter.statement}
        code={placeChapter.code}
      />

      <Masters1000TournamentOverview tournament={tournament} />

      <Masters1000TournamentFacts slug={tournament.slug} />

      <Masters1000ChampionSpotlight
        slug={tournament.slug}
        index={0}
        chapter="Chapter II · The king"
      />

      <Masters1000HallOfChampionsSection
        slug={tournament.slug}
        tournamentName={tournament.name}
        cmsRecentFinals={cmsRecentFinals}
        cmsTitleLeaders={cmsTitleLeaders}
      />

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

      <Masters1000LegendsSection
        slug={tournament.slug}
        data={cmsLegends}
      />

      <Masters1000MuseumChapter
        eyebrow={archiveChapter.eyebrow}
        title={archiveChapter.title}
        statement={archiveChapter.statement}
        code={archiveChapter.code}
      />

      <Masters1000TournamentEditions
        slug={tournament.slug}
        tournamentName={tournament.name}
        cmsEditions={cmsEditions}
      />

      <Masters1000TournamentHistory tournament={tournament} />

      <Masters1000TournamentTimeline
        tournamentName={tournament.name}
        entries={publicTimelineEntries}
      />

      <Masters1000TournamentRecords slug={tournament.slug} />

      <Masters1000ChampionSpotlight
        slug={tournament.slug}
        index={2}
        chapter="Chapter V · The legacy"
      />

      <Masters1000IconicMoments
        tournamentName={tournament.name}
        moments={publicIconicMoments}
      />

      <Masters1000ArchivePreview tournament={tournament} />

      <Masters1000MastersNavigation tournament={tournament} />

      <Masters1000BackToTop />
    </main>
  );
}
