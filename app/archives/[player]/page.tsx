import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  CareerEventCategory,
} from "@/generated/prisma/client";

import ChampionArchive from "@/components/archive/ChampionArchive";

import {
  champions,
  getChampionBySlug,
} from "@/data/champions";

import {
  getPlayerBySlug,
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

import {
  prisma,
} from "@/lib/prisma";

import {
  getMuseumPlayerBySlug,
} from "@/lib/services/museum/player-museum.service";

export const dynamic =
  "force-dynamic";

type ArchivePageProps = {
  params: Promise<{
    player: string;
  }>;
};

const LIVE_ARCHIVE_SLUGS =
  new Set([
    "sinner",
    "alcaraz",
    "djokovic",
  ]);

/* =========================================================
   SEO
========================================================= */

type ChampionSeoConfig = {
  title: string;
  description: string;
};

const CHAMPION_SEO: Record<
  string,
  ChampionSeoConfig
> = {
  sinner: {
    title:
      "Jannik Sinner: Career, Grand Slams & Tennis Archive",

    description:
      "Explore Jannik Sinner's career, Grand Slam achievements, titles, milestones and tennis story through the AGE202 digital tennis archive.",
  },

  alcaraz: {
    title:
      "Carlos Alcaraz: Career, Grand Slams & Tennis Archive",

    description:
      "Explore Carlos Alcaraz's career, Grand Slam achievements, titles, milestones and tennis story through the AGE202 digital tennis archive.",
  },

  federer: {
    title:
      "Roger Federer: Career, Grand Slams & Tennis Archive",

    description:
      "Explore Roger Federer's legendary career, Grand Slam achievements, titles, milestones and tennis legacy through the AGE202 digital tennis archive.",
  },

  nadal: {
    title:
      "Rafael Nadal: Career, Grand Slams & Tennis Archive",

    description:
      "Explore Rafael Nadal's legendary career, Grand Slam achievements, titles, milestones and tennis legacy through the AGE202 digital tennis archive.",
  },

  djokovic: {
    title:
      "Novak Djokovic: Career, Grand Slams & Tennis Archive",

    description:
      "Explore Novak Djokovic's career, Grand Slam achievements, titles, records, milestones and tennis legacy through the AGE202 digital tennis archive.",
  },
};

/* =========================================================
   STATIC ROUTES
========================================================= */

export function generateStaticParams() {
  return champions.map(
    (champion) => ({
      player:
        champion.slug,
    }),
  );
}

/* =========================================================
   PAGE METADATA
========================================================= */

export async function generateMetadata({
  params,
}: ArchivePageProps): Promise<Metadata> {
  const {
    player,
  } = await params;

  const champion =
    getChampionBySlug(
      player,
    );

  if (!champion) {
    return {
      title:
        "Archive Not Found",

      description:
        "The requested AGE202 champion archive could not be found.",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const seo =
    CHAMPION_SEO[
      champion.slug
    ];

  const title =
    seo?.title ??
    `${champion.name}: Career & Tennis Archive`;

  const description =
    seo?.description ??
    champion.description;

  const canonical =
    `/archives/${champion.slug}`;

  return {
    title,

    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type:
        "profile",

      url:
        canonical,

      title:
        `${title} | AGE202`,

      description,

      siteName:
        "AGE202",

      locale:
        "en_US",
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${title} | AGE202`,

      description,
    },

    robots: {
      index:
        true,

      follow:
        true,

      googleBot: {
        index:
          true,

        follow:
          true,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },
  };
}

/* =========================================================
   ARCHIVE PAGE
========================================================= */

export default async function ArchivePage({
  params,
}: ArchivePageProps) {
  const {
    player,
  } = await params;

  const champion =
    getChampionBySlug(
      player,
    );

  if (!champion) {
    notFound();
  }

  /*
   * Durante la migrazione, i contenuti narrativi
   * continuano a provenire da data/champions,
   * mentre gli artifact pubblicati vengono letti
   * dal CMS tramite il Museum Domain.
   *
   * Per Sinner, Alcaraz e Djokovic colleghiamo anche
   * il Player AGE202 usando champion.id:
   *
   * jannik-sinner
   * carlos-alcaraz
   * novak-djokovic
   *
   * Gli stessi TournamentEdition alimentano quindi
   * sia /players/[slug] sia /archives/[player].
   *
   * I trofei Davis Cup vengono invece letti dai
   * PlayerCareerEvent con categoria DAVIS_CUP.
   */
  const shouldLoadTournamentArchive =
    LIVE_ARCHIVE_SLUGS.has(
      champion.slug,
    );

  const [
    museumPlayer,
    archivePlayer,
  ] = await Promise.all([
    getMuseumPlayerBySlug(
      champion.slug,
    ),

    shouldLoadTournamentArchive
      ? getPlayerBySlug(
          champion.id,
        )
      : Promise.resolve(
          null,
        ),
  ]);

  const [
    tournamentEditions,
    davisCupCareerEvents,
  ] = archivePlayer
    ? await Promise.all([
        getPlayerTournamentEditions(
          archivePlayer.id,
        ),

        prisma.playerCareerEvent.findMany({
          where: {
            playerId:
              archivePlayer.id,

            category:
              CareerEventCategory.DAVIS_CUP,
          },

          select: {
            year:
              true,
          },

          orderBy: {
            year:
              "asc",
          },
        }),
      ])
    : [
        [],
        [],
      ];

  /*
   * La Davis Cup viene conteggiata per anno unico.
   * Questo impedisce a eventuali eventi narrativi duplicati
   * dello stesso anno di gonfiare il numero dei trofei.
   */
  const davisCupTitles =
    new Set(
      davisCupCareerEvents.map(
        (event) =>
          event.year,
      ),
    ).size;

  /* =======================================================
     NEXT CHAMPION
  ======================================================= */

  const currentChampionIndex =
    champions.findIndex(
      (item) =>
        item.slug ===
        champion.slug,
    );

  const nextChampion =
    champions[
      (currentChampionIndex +
        1) %
        champions.length
    ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <ChampionArchive
        champion={
          champion
        }
        nextChampion={
          nextChampion
        }
        museumPlayer={
          museumPlayer
        }
        archivePlayerId={
          archivePlayer?.id ??
          null
        }
        tournamentEditions={
          tournamentEditions
        }
        davisCupTitles={
          davisCupTitles
        }
      />
    </main>
  );
}