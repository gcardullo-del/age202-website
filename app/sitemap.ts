import type {
  MetadataRoute,
} from "next";

import {
  getPublishedArtifactSlugs,
} from "@/lib/repositories/artifact.repository";

import {
  getAllActivePlayers,
  getArchivePlayers,
  getWomenArchiveRanking,
} from "@/lib/repositories/player.repository";


const siteUrl =
  "https://www.age202.com";


const staticRoutes = [
  {
    path: "",
    changeFrequency: "weekly",
    priority: 1,
  },

  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
  },

  {
    path: "/players/other-players",
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    path: "/players/women",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/players/women/archive",
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    path: "/legends",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/next-gen",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/brands",
    changeFrequency: "weekly",
    priority: 0.8,
  },

  {
    path: "/age202-originals",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/memorabilia",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/collections",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/atp-ranking",
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    path: "/tennis-history",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/collaborations",
    changeFrequency: "monthly",
    priority: 0.75,
  },

  {
    path: "/contribute",
    changeFrequency: "monthly",
    priority: 0.8,
  },

  {
    path: "/results",
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    path: "/results/grand-slams",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/results/grand-slams/australian-open",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/results/grand-slams/roland-garros",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/results/grand-slams/wimbledon",
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    path: "/results/grand-slams/us-open",
    changeFrequency: "weekly",
    priority: 0.85,
  },
] as const;


export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const [
    allPlayers,
    atpPlayers,
    wtaRanking,
    artifacts,
  ] = await Promise.all([
    getAllActivePlayers(),
    getArchivePlayers(),
    getWomenArchiveRanking(),
    getPublishedArtifactSlugs(),
  ]);


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


  /*
   * AGE202 Champion Archives
   *
   * These are the permanent featured
   * exhibitions such as Federer, Nadal,
   * Djokovic, Sinner and Alcaraz.
   */
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
            `${siteUrl}/archives/${player.slug}`,

          changeFrequency:
            "weekly",

          priority:
            0.95,
        }),
      );


  /*
   * ATP Player Dossiers
   *
   * Current ATP players with a complete
   * AGE202 Player record use /players/[slug].
   *
   * FEATURED players are excluded here
   * because their canonical museum
   * destination is /archives/[slug].
   */
  const atpPlayerEntries:
    MetadataRoute.Sitemap =
    atpPlayers
      .filter(
        (player) =>
          player.collectionType !==
          "FEATURED",
      )
      .map(
        (player) => ({
          url:
            `${siteUrl}/players/${player.slug}`,

          changeFrequency:
            "weekly",

          priority:
            player.atpPlayer?.rank &&
            player.atpPlayer.rank <= 50
              ? 0.85
              : 0.75,
        }),
      );


  /*
   * WTA Player Dossiers
   *
   * Only ranking entries already linked
   * to an active AGE202 Player receive a
   * profile URL in the sitemap.
   */
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
            entry.rank <= 50
              ? 0.85
              : 0.75,
        }),
      );


  const artifactEntries:
    MetadataRoute.Sitemap =
    artifacts.map(
      (artifact) => ({
        url:
          `${siteUrl}/artifacts/${artifact.slug}`,

        changeFrequency:
          "monthly",

        priority:
          0.8,
      }),
    );


  /*
   * Safety net:
   * prevent duplicate URLs if the same
   * destination is returned by more than
   * one data source.
   */
  const entries = [
    ...staticEntries,
    ...featuredPlayerEntries,
    ...atpPlayerEntries,
    ...wtaPlayerEntries,
    ...artifactEntries,
  ];


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