import type { Metadata } from "next";

import MuseumHome from "@/components/public/MuseumHome";

import {
  getAvailableArtifacts,
  getRecentlyAcquiredArtifacts,
} from "@/lib/repositories/artifact.repository";

import {
  getPublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";

export const metadata: Metadata = {
  title: "AGE202 | Digital Tennis Museum",

  description:
    "Explore AGE202, the digital tennis museum preserving iconic apparel, champions and stories from tennis history.",

  alternates: {
    canonical: "/",
  },
};

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export default async function HomePage() {
  const [
    settings,
    availableArtifacts,
    recentlyAcquiredArtifacts,
  ] = await Promise.all([
    getPublicHomepageSettings(),
    getAvailableArtifacts(3),
    getRecentlyAcquiredArtifacts(3),
  ]);

  const serializedAvailableArtifacts =
    availableArtifacts.map(
      (artifact) => ({
        id:
          artifact.id,

        slug:
          artifact.slug,

        title:
          artifact.title,

        subtitle:
          artifact.subtitle,

        archiveNumber:
          artifact.archiveNumber,

        currency:
          artifact.currency,

        price:
          artifact.price !== null &&
          artifact.price !== undefined
            ? artifact.price.toString()
            : null,

        tournament:
          artifact.tournament,

        year:
          artifact.year,

        player: {
          name:
            artifact.player.name,
        },

        brand: {
          name:
            artifact.brand.name,
        },

        images:
          artifact.images.map(
            (image) => ({
              url:
                image.url,

              alt:
                image.alt,

              isCover:
                image.isCover,
            }),
          ),
      }),
    );

  const serializedRecentlyAcquiredArtifacts =
    recentlyAcquiredArtifacts.map(
      (artifact) => ({
        id:
          artifact.id,

        slug:
          artifact.slug,

        title:
          artifact.title,

        subtitle:
          artifact.subtitle,

        archiveNumber:
          artifact.archiveNumber,

        currency:
          artifact.currency,

        price:
          artifact.price !== null &&
          artifact.price !== undefined
            ? artifact.price.toString()
            : null,

        tournament:
          artifact.tournament,

        year:
          artifact.year,

        player: {
          name:
            artifact.player.name,
        },

        brand: {
          name:
            artifact.brand.name,
        },

        images:
          artifact.images.map(
            (image) => ({
              url:
                image.url,

              alt:
                image.alt,

              isCover:
                image.isCover,
            }),
          ),
      }),
    );

  return (
    <MuseumHome
      settings={
        settings
      }
      availableArtifacts={
        serializedAvailableArtifacts
      }
      recentlyAcquiredArtifacts={
        serializedRecentlyAcquiredArtifacts
      }
    />
  );
}