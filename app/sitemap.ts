import type { MetadataRoute } from "next";

const siteUrl = "https://www.age202.com";

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
    path: "/brands",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/hall-of-fame",
    changeFrequency: "weekly",
    priority: 0.9,
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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}