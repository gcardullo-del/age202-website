import type {
  Metadata,
} from "next";

import {
  getArchiveDirectory,
  getPremiumPlayers,
} from "@/lib/repositories/player.repository";

import AtpArchiveExplorer, {
  type AtpArchivePlayer,
} from "./AtpArchiveExplorer";

import type {
  AtpArchiveDirectoryPlayer,
} from "@/components/players/atp/ArchiveDirectory";

const ATP_ARCHIVE_URL =
  "https://www.age202.com/players/other-players";

/* =========================================================
   SEO
========================================================= */

export const metadata: Metadata = {
  title:
    "ATP Players Archive: Rankings, Profiles & Careers | AGE202",

  description:
    "Explore the AGE202 ATP Players Archive with current rankings, player profiles, careers, titles, tournament results and digital tennis history.",

  alternates: {
    canonical:
      "/players/other-players",
  },

  openGraph: {
    type:
      "website",

    url:
      "/players/other-players",

    title:
      "ATP Players Archive: Rankings, Profiles & Careers | AGE202",

    description:
      "Explore the AGE202 ATP Players Archive with current rankings, player profiles, careers, titles, tournament results and digital tennis history.",

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "ATP Players Archive: Rankings, Profiles & Careers | AGE202",

    description:
      "Explore the AGE202 ATP Players Archive with current rankings, player profiles, careers, titles, tournament results and digital tennis history.",
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

  category:
    "Tennis archive",
};

/* =========================================================
   TYPES
========================================================= */

type PremiumDatabasePlayer = Awaited<
  ReturnType<typeof getPremiumPlayers>
>[number];

type DirectoryDatabasePlayer = Awaited<
  ReturnType<typeof getArchiveDirectory>
>[number];

/* =========================================================
   NORMALIZERS
========================================================= */

function normalizePremiumPlayer(
  player: PremiumDatabasePlayer,
): AtpArchivePlayer {
  return {
    id:
      player.id,

    name:
      player.name,

    slug:
      player.slug,

    country:
      player.atpPlayer?.country ??
      player.country,

    biography:
      player.biography,

    heroImage:
      player.heroImage,

    portraitImage:
      player.portraitImage ??
      player.atpPlayer?.imageUrl ??
      null,

    collectionType:
      player.collectionType,

    ranking:
      player.atpPlayer?.rank ??
      null,

    points:
      player.atpPlayer?.points ??
      null,

    artifactCount:
      player._count.artifacts,
  };
}

function normalizeDirectoryPlayer(
  record: DirectoryDatabasePlayer,
): AtpArchiveDirectoryPlayer {
  const linkedPlayer =
    record.player;

  return {
    id:
      record.id,

    name:
      linkedPlayer?.name ??
      record.name,

    slug:
      linkedPlayer?.slug ??
      record.slug,

    country:
      record.country ??
      linkedPlayer?.country ??
      null,

    ranking:
      record.rank,

    points:
      record.points,

    hasPage:
      Boolean(
        linkedPlayer?.active,
      ),

    profileComplete:
      Boolean(
        linkedPlayer?.active &&
        linkedPlayer.playerProfile &&
        (
          linkedPlayer.heroImage ||
          linkedPlayer.portraitImage ||
          linkedPlayer.biography ||
          linkedPlayer._count.artifacts >
            0
        ),
      ),
  };
}

/* =========================================================
   SORTING
========================================================= */

function sortByRanking<
  T extends {
    ranking: number | null;
  },
>(
  first: T,
  second: T,
): number {
  return (
    (
      first.ranking ??
      Number.MAX_SAFE_INTEGER
    ) -
    (
      second.ranking ??
      Number.MAX_SAFE_INTEGER
    )
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function OtherPlayersPage() {
  const [
    premiumRecords,
    directoryRecords,
  ] = await Promise.all([
    getPremiumPlayers(),
    getArchiveDirectory(),
  ]);

  const premiumPlayers =
    premiumRecords
      .map(
        normalizePremiumPlayer,
      )
      .filter(
        (player) =>
          player.ranking !==
            null &&
          player.ranking >=
            1 &&
          player.ranking <=
            50,
      )
      .sort(
        sortByRanking,
      );

  const archiveDirectory =
    directoryRecords
      .map(
        normalizeDirectoryPlayer,
      )
      .sort(
        sortByRanking,
      );

  /* =======================================================
     SEO PLAYER DIRECTORY
  ======================================================= */

  const directorySeoPlayers =
    archiveDirectory
      .filter(
        (player) =>
          player.hasPage &&
          Boolean(
            player.slug,
          ),
      )
      .map(
        (player) => ({
          name:
            player.name,

          slug:
            player.slug,

          ranking:
            player.ranking,
        }),
      );

  const premiumSeoPlayers =
    premiumPlayers.map(
      (player) => ({
        name:
          player.name,

        slug:
          player.slug,

        ranking:
          player.ranking,
      }),
    );

  /*
   * Premium e directory possono contenere lo stesso player.
   * Manteniamo un solo URL per slug.
   */
  const seoPlayerMap =
    new Map<
      string,
      {
        name: string;
        slug: string;
        ranking: number | null;
      }
    >();

  for (
    const player of [
      ...premiumSeoPlayers,
      ...directorySeoPlayers,
    ]
  ) {
    if (
      !seoPlayerMap.has(
        player.slug,
      )
    ) {
      seoPlayerMap.set(
        player.slug,
        player,
      );
    }
  }

  const seoPlayers =
    Array.from(
      seoPlayerMap.values(),
    ).sort(
      sortByRanking,
    );

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${ATP_ARCHIVE_URL}#collection`,

        url:
          ATP_ARCHIVE_URL,

        name:
          "ATP Players Archive",

        headline:
          "ATP Players Archive: Rankings, Profiles & Careers",

        description:
          "The AGE202 ATP Players Archive featuring current rankings, player profiles, careers, titles, tournament results and digital tennis history.",

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            "https://www.age202.com/#website",

          name:
            "AGE202",

          url:
            "https://www.age202.com",
        },

        mainEntity: {
          "@id":
            `${ATP_ARCHIVE_URL}#players`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${ATP_ARCHIVE_URL}#players`,

        name:
          "AGE202 ATP Player Directory",

        numberOfItems:
          seoPlayers.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:
          seoPlayers.map(
            (
              player,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index +
                1,

              url:
                `https://www.age202.com/players/${player.slug}`,

              name:
                player.name,

              item: {
                "@type":
                  "Person",

                "@id":
                  `https://www.age202.com/players/${player.slug}#person`,

                name:
                  player.name,

                url:
                  `https://www.age202.com/players/${player.slug}`,
              },
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${ATP_ARCHIVE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              "https://www.age202.com",
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Players",

            item:
              "https://www.age202.com/players",
          },

          {
            "@type":
              "ListItem",

            position:
              3,

            name:
              "ATP Players Archive",

            item:
              ATP_ARCHIVE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
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

      <AtpArchiveExplorer
        premiumPlayers={
          premiumPlayers
        }
        archiveDirectory={
          archiveDirectory
        }
      />
    </>
  );
}