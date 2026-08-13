import type {
  CSSProperties,
} from "react";
import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import ATP500IconicMoments from "./components/ATP500IconicMoments";
import ATP500Legends from "./components/ATP500Legends";
import ATP500RecentEditions from "./components/ATP500RecentEditions";
import ATP500TournamentHero from "./components/ATP500TournamentHero";
import ATP500TournamentIdentity from "./components/ATP500TournamentIdentity";
import ATP500TournamentNavigation from "./components/ATP500TournamentNavigation";

import {
  ATP_500_SLUGS,
  getAtp500Tournament,
} from "@/lib/data/atp-500";

import {
  mapAtp500TournamentPageData,
} from "@/lib/mappers/atp-500-cms.mapper";

import {
  prisma,
} from "@/lib/prisma";

type Atp500TournamentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TournamentStyle =
  CSSProperties & {
    "--tournament-primary": string;
    "--tournament-secondary": string;
    "--tournament-glow": string;
  };

export function generateStaticParams() {
  return ATP_500_SLUGS.map(
    (slug) => ({
      slug,
    }),
  );
}

export async function generateMetadata({
  params,
}: Atp500TournamentPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const tournament =
    getAtp500Tournament(
      slug,
    );

  if (!tournament) {
    return {
      title:
        "Tournament not found | AGE202",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    `${tournament.name} | ATP 500 Archive | AGE202`;

  const description =
    `${tournament.introduction} Explore the history, iconic moments, legends and recent finals of ${tournament.name}.`;

  return {
    title,
    description,

    keywords: [
      tournament.name,
      tournament.officialName,
      tournament.city,
      tournament.country,
      `${tournament.name} history`,
      `${tournament.name} champions`,
      `${tournament.name} results`,
      "ATP 500",
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

    category:
      "ATP 500 tennis",
  };
}

export default async function Atp500TournamentPage({
  params,
}: Atp500TournamentPageProps) {
  const {
    slug,
  } = await params;

  const staticTournament =
    getAtp500Tournament(
      slug,
    );

  if (!staticTournament) {
    notFound();
  }

  const cmsTournament =
    await prisma.tournament.findFirst({
      where: {
        slug,
        category: "ATP_500",
        active: true,
      },

      select: {
        name: true,
        shortName: true,
        surface: true,
        foundedYear: true,
        city: true,
        country: true,
        countryCode: true,
        venue: true,
        description: true,
        history: true,
        heroImage: true,

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
            year: true,
            title: true,
            subtitle: true,
            description: true,
            imageUrl: true,
          },
        },

        editions: {
          where: {
            cancelled: false,
          },

          orderBy: {
            year: "desc",
          },

          take: 5,

          select: {
            year: true,
            endDate: true,
            championName: true,
            runnerUpName: true,
            championCountryCode: true,
            runnerUpCountryCode: true,
            score: true,

            championPlayer: {
              select: {
                slug: true,
                name: true,
                country: true,
              },
            },

            runnerUpPlayer: {
              select: {
                slug: true,
                name: true,
                country: true,
              },
            },
          },
        },

        champions: {
          where: {
            legend: true,
          },

          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              titles: "desc",
            },
            {
              lastTitleYear: "desc",
            },
          ],

          select: {
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
                slug: true,
                name: true,
                country: true,
              },
            },
          },
        },
      },
    });

  const {
    identity,
    iconicMoments,
    legends,
    recentEditions,
  } =
    mapAtp500TournamentPageData(
      cmsTournament,
      staticTournament,
    );

  const tournamentStyle: TournamentStyle = {
    "--tournament-primary":
      staticTournament.colors.primary,

    "--tournament-secondary":
      staticTournament.colors.secondary,

    "--tournament-glow":
      staticTournament.colors.glow,
  };

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "SportsEvent",

    name:
      identity.officialName,

    alternateName:
      identity.name,

    description:
      identity.introduction,

    sport:
      "Tennis",

    location: {
      "@type":
        "Place",

      name:
        identity.venue,

      address: {
        "@type":
          "PostalAddress",

        addressLocality:
          identity.city,

        addressCountry:
          identity.country,
      },
    },

    organizer: {
      "@type":
        "Organization",

      name:
        identity.officialName,
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
          __html:
            JSON.stringify(
              structuredData,
            ).replace(
              /</g,
              "\\u003c",
            ),
        }}
      />

      <ATP500TournamentHero
        tournament={
          staticTournament
        }
        identity={
          identity
        }
      />

      <ATP500TournamentIdentity
        tournament={
          staticTournament
        }
        identity={
          identity
        }
      />

      <ATP500IconicMoments
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        moments={
          iconicMoments
        }
      />

      <ATP500Legends
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        legends={
          legends
        }
      />

      <ATP500RecentEditions
        tournament={
          staticTournament
        }
        tournamentName={
          identity.name
        }
        editions={
          recentEditions
        }
      />

      <ATP500TournamentNavigation
        currentSlug={
          staticTournament.slug
        }
      />
    </main>
  );
}