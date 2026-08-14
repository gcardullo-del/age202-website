import type {
  MetadataRoute,
} from "next";

import {
  getPublishedArtifactSlugs,
} from "@/lib/repositories/artifact.repository";

import {
  getAllActivePlayers,
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
    path: "/archive",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/players",
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
    path: "/hall-of-fame",
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    path: "/atp-ranking",
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    path: "/tournaments",
    changeFrequency: "weekly",
    priority: 0.9,
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
    path: "/results",
    changeFrequency: "weekly",
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

  {
    path: "/vault",
    changeFrequency: "weekly",
    priority: 0.8,
  },
] as const;


export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const [
    players,
    artifacts,
  ] = await Promise.all([
    getAllActivePlayers(),
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


  const playerEntries:
    MetadataRoute.Sitemap =
    players.map(
      (player) => ({
        url:
          `${siteUrl}/archives/${player.slug}`,

        changeFrequency:
          "weekly",

        priority:
          player.collectionType ===
          "FEATURED"
            ? 0.9
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


  return [
    ...staticEntries,
    ...playerEntries,
    ...artifactEntries,
  ];
}