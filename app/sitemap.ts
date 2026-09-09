import type {
     MetadataRoute,
} from "next";

import {
  getPublishedArtifactSlugs,
} from "@/lib/repositories/artifact.repository";

import {
  getPublishedLegends,
} from "@/lib/repositories/legend.repository";

import {
  getPublishedMemorabiliaSlugs,
} from "@/lib/repositories/memorabilia.repository";

import {
  getPublishedOriginalProductSlugs,
} from "@/lib/repositories/original-product.repository";

import {
  getAllActivePlayers,
  getArchivePlayers,
  getWomenArchiveRanking,
} from "@/lib/repositories/player.repository";

import {
  getPublishedTennisHistoryEntries,
} from "@/lib/repositories/tennis-history.repository";

import {
  getAllTournaments,
} from "@/lib/repositories/tournament.repository";


const siteUrl =
  "https://www.age202.com";


/* =========================================================
   CHAMPION ARCHIVE ROUTES
========================================================= */

const CHAMPION_ARCHIVE_SLUGS: Record<
  string,
  string
> = {
  "roger-federer":
    "federer",

  federer:
    "federer",

  "rafael-nadal":
    "nadal",

  nadal:
    "nadal",

  "novak-djokovic":
    "djokovic",

  djokovic:
    "djokovic",

  "jannik-sinner":
    "sinner",

  sinner:
    "sinner",

  "carlos-alcaraz":
    "alcaraz",

  alcaraz:
    "alcaraz",
};


function getChampionArchiveSlug(
  slug: string,
): string {
  return (
    CHAMPION_ARCHIVE_SLUGS[
      slug
    ] ??
    slug
  );
}


/* =========================================================
   HELPERS
========================================================= */

function extractSlug(
  value: unknown,
): string | null {
  if (
    typeof value ===
    "string"
  ) {
    const slug =
      value.trim();

    return slug.length >
      0
      ? slug
      : null;
  }


  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return null;
  }


  if (
    !(
      "slug" in
      value
    )
  ) {
    return null;
  }


  const slug =
    (
      value as {
        slug?: unknown;
      }
    ).slug;


  if (
    typeof slug !==
    "string"
  ) {
    return null;
  }


  const normalized =
    slug.trim();


  return normalized.length >
    0
    ? normalized
    : null;
}


function extractTournamentCategory(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "object" ||
    value === null ||
    !(
      "category" in
      value
    )
  ) {
    return null;
  }


  const category =
    (
      value as {
        category?: unknown;
      }
    ).category;


  return typeof category ===
    "string"
    ? category
        .trim()
        .toUpperCase()
    : null;
}


/* =========================================================
   STATIC PUBLIC ROUTES
========================================================= */

const staticRoutes = [
  {
    path:
      "",

    changeFrequency:
      "weekly",

    priority:
      1,
  },

  {
    path:
      "/about",

    changeFrequency:
      "monthly",

    priority:
      0.7,
  },

  {
    path:
      "/players",

    changeFrequency:
      "weekly",

    priority:
      0.95,
  },

  {
    path:
      "/players/other-players",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/players/women",

    changeFrequency:
      "weekly",

    priority:
      0.85,
  },

  {
    path:
      "/players/women/archive",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/legends",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/next-gen",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/age202-originals",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/memorabilia",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/atp-ranking",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/tennis-history",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/collaborations",

    changeFrequency:
      "monthly",

    priority:
      0.75,
  },

  {
    path:
      "/contribute",

    changeFrequency:
      "monthly",

    priority:
      0.8,
  },

  {
    path:
      "/results",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/results/atp-500",

    changeFrequency:
      "daily",

    priority:
      0.9,
  },

  {
    path:
      "/results/masters-1000",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/results/grand-slams",

    changeFrequency:
      "daily",

    priority:
      0.95,
  },

  {
    path:
      "/results/grand-slams/australian-open",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/results/grand-slams/roland-garros",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/results/grand-slams/wimbledon",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },

  {
    path:
      "/results/grand-slams/us-open",

    changeFrequency:
      "weekly",

    priority:
      0.9,
  },
] as const;


/* =========================================================
   SITEMAP
========================================================= */

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const [
    allPlayers,
    atpPlayers,
    wtaRanking,
    artifacts,
    legends,
    memorabilia,
    originalProducts,
    tennisHistoryEntries,
    tournaments,
  ] =
    await Promise.all([
      getAllActivePlayers(),

      getArchivePlayers(),

      getWomenArchiveRanking(),

      getPublishedArtifactSlugs(),

      getPublishedLegends(),

      getPublishedMemorabiliaSlugs(),

      getPublishedOriginalProductSlugs(),

      getPublishedTennisHistoryEntries(),

      getAllTournaments(),
    ]);


  /* =======================================================
     STATIC
  ======================================================= */

  const staticEntries:
    MetadataRoute.Sitemap =
    staticRoutes.map(
      (route) => ({
        url:
          `${siteUrl}${route.path}`,

        changeFrequency:
          route.changeFrequency,

        priority:
          route.priority,
      }),
    );


  /* =======================================================
     CHAMPION ARCHIVES
  ======================================================= */

  const featuredPlayerEntries:
    MetadataRoute.Sitemap =
    allPlayers
      .filter(
        (player) =>
          player.collectionType ===
          "FEATURED",
      )
      .map(
        (player) => ({
          url:
            `${siteUrl}/archives/${getChampionArchiveSlug(
              player.slug,
            )}`,

          changeFrequency:
            "weekly",

          priority:
            0.95,
        }),
      );


  /* =======================================================
     ATP PLAYERS
  ======================================================= */

  const atpPlayerEntries:
    MetadataRoute.Sitemap =
    atpPlayers
      .filter(
        (player) =>
          player.collectionType !==
            "FEATURED" ||
          player.atpPlayer?.rank !=
            null,
      )
      .map(
        (player) => ({
          url:
            `${siteUrl}/players/${player.slug}`,

          changeFrequency:
            "weekly",

          priority:
            player.atpPlayer?.rank &&
            player.atpPlayer.rank <=
              50
              ? 0.85
              : 0.75,
        }),
      );


  /* =======================================================
     WTA PLAYERS
  ======================================================= */

  const wtaPlayerEntries:
    MetadataRoute.Sitemap =
    wtaRanking
      .filter(
        (entry) =>
          Boolean(
            entry.player?.active &&
            entry.player?.slug,
          ),
      )
      .map(
        (entry) => ({
          url:
            `${siteUrl}/players/women/${entry.player!.slug}`,

          changeFrequency:
            "weekly",

          priority:
            entry.rank <=
            50
              ? 0.85
              : 0.75,
        }),
      );


  /* =======================================================
     ARTIFACTS
  ======================================================= */

  const artifactEntries:
    MetadataRoute.Sitemap =
    artifacts
      .map(
        (
          artifact,
        ) =>
          extractSlug(
            artifact,
          ),
      )
      .filter(
        (
          slug,
        ): slug is string =>
          slug !== null,
      )
      .map(
        (slug) => ({
          url:
            `${siteUrl}/artifacts/${slug}`,

          changeFrequency:
            "monthly",

          priority:
            0.8,
        }),
      );


  /* =======================================================
     LEGENDS
  ======================================================= */

  const legendEntries:
    MetadataRoute.Sitemap =
    legends
      .map(
        (
          legend,
        ) =>
          extractSlug(
            legend,
          ),
      )
      .filter(
        (
          slug,
        ): slug is string =>
          slug !== null,
      )
      .map(
        (slug) => ({
          url:
            `${siteUrl}/legends/${slug}`,

          changeFrequency:
            "monthly",

          priority:
            0.85,
        }),
      );


  /* =======================================================
     MEMORABILIA
  ======================================================= */

  const memorabiliaEntries:
    MetadataRoute.Sitemap =
    memorabilia
      .map(
        (
          item,
        ) =>
          extractSlug(
            item,
          ),
      )
      .filter(
        (
          slug,
        ): slug is string =>
          slug !== null,
      )
      .map(
        (slug) => ({
          url:
            `${siteUrl}/memorabilia/${slug}`,

          changeFrequency:
            "monthly",

          priority:
            0.85,
        }),
      );


  /* =======================================================
     AGE202 ORIGINALS
  ======================================================= */

  const originalProductEntries:
    MetadataRoute.Sitemap =
    originalProducts
      .map(
        (
          product,
        ) =>
          extractSlug(
            product,
          ),
      )
      .filter(
        (
          slug,
        ): slug is string =>
          slug !== null,
      )
      .map(
        (slug) => ({
          url:
            `${siteUrl}/age202-originals/${slug}`,

          changeFrequency:
            "weekly",

          priority:
            0.8,
        }),
      );


  /* =======================================================
     TENNIS HISTORY
  ======================================================= */

  /*
   * Tennis History currently has a public hub at
   * /tennis-history, but no public [slug] route.
   *
   * Published history entries are therefore intentionally
   * not emitted as standalone sitemap URLs.
   */
  void tennisHistoryEntries;


  /* =======================================================
     TOURNAMENTS
  ======================================================= */

  const tournamentEntries:
    MetadataRoute.Sitemap =
    tournaments
      .map(
        (
          tournament,
        ) =>
          extractSlug(
            tournament,
          ),
      )
      .filter(
        (
          slug,
        ): slug is string =>
          slug !== null,
      )
      .map(
        (slug) => ({
          url:
            `${siteUrl}/tournaments/${slug}`,

          changeFrequency:
            "weekly",

          priority:
            0.85,
        }),
      );


  /* =======================================================
     RESULT PAGES FROM TOURNAMENT CATEGORY
  ======================================================= */

  const tournamentResultEntries:
    MetadataRoute.Sitemap =
    tournaments.flatMap(
      (
        tournament,
      ) => {
        const slug =
          extractSlug(
            tournament,
          );

        const category =
          extractTournamentCategory(
            tournament,
          );


        if (
          !slug ||
          !category
        ) {
          return [];
        }


        if (
          category ===
            "ATP_500" ||
          category ===
            "ATP500"
        ) {
          return [
            {
              url:
                `${siteUrl}/results/atp-500/${slug}`,

              changeFrequency:
                "daily" as const,

              priority:
                0.85,
            },
          ];
        }


        if (
          category ===
            "MASTERS_1000" ||
          category ===
            "ATP_MASTERS_1000" ||
          category ===
            "ATP_1000"
        ) {
          return [
            {
              url:
                `${siteUrl}/results/masters-1000/${slug}`,

              changeFrequency:
                "daily" as const,

              priority:
                0.9,
            },
          ];
        }


        if (
          category ===
            "GRAND_SLAM"
        ) {
          return [
            {
              url:
                `${siteUrl}/results/grand-slams/${slug}`,

              changeFrequency:
                "daily" as const,

              priority:
                0.9,
            },
          ];
        }


        return [];
      },
    );


  /* =======================================================
     MERGE + DEDUPLICATE
  ======================================================= */

  const entries = [
    ...staticEntries,

    ...featuredPlayerEntries,

    ...atpPlayerEntries,

    ...wtaPlayerEntries,

    ...artifactEntries,

    ...legendEntries,

    ...memorabiliaEntries,

    ...originalProductEntries,

    ...tournamentEntries,

    ...tournamentResultEntries,
  ];


  /*
   * Safety net:
   *
   * If the same public URL is returned
   * by more than one source, only one
   * entry is emitted.
   */
  return Array.from(
    new Map(
      entries.map(
        (entry) => [
          entry.url,
          entry,
        ],
      ),
    ).values(),
  );
}