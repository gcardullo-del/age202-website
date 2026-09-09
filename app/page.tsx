import type {
  Metadata,
} from "next";

import MuseumHome from "@/components/public/MuseumHome";

import {
  getAvailableArtifacts,
  getRecentlyAcquiredArtifacts,
} from "@/lib/repositories/artifact.repository";

import {
  getPublicHomepageSettings,
} from "@/lib/repositories/public/homepage.repository";


const SITE_URL =
  "https://www.age202.com";


export const metadata: Metadata = {
  title:
    "AGE202: Digital Tennis Museum, Players, History & Memorabilia",

  description:
    "Explore AGE202, the digital tennis museum dedicated to players, tournaments, tennis history, memorabilia, iconic apparel, archives and collectible artifacts.",

  alternates: {
    canonical:
      "/",
  },

  openGraph: {
    type:
      "website",

    url:
      "/",

    title:
      "AGE202: Digital Tennis Museum, Players, History & Memorabilia",

    description:
      "Explore AGE202, the digital tennis museum dedicated to players, tournaments, tennis history, memorabilia, iconic apparel, archives and collectible artifacts.",

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "AGE202: Digital Tennis Museum, Players, History & Memorabilia",

    description:
      "Explore AGE202, the digital tennis museum dedicated to players, tournaments, tennis history, memorabilia, iconic apparel, archives and collectible artifacts.",
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
    "Tennis museum",
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


  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebSite",

        "@id":
          `${SITE_URL}/#website`,

        url:
          SITE_URL,

        name:
          "AGE202",

        alternateName:
          "AGE202 Digital Tennis Museum",

        description:
          "AGE202 is a digital tennis museum dedicated to players, tournaments, tennis history, memorabilia, iconic apparel and collectible artifacts.",

        inLanguage:
          "en",
      },

      {
        "@type":
          "Organization",

        "@id":
          `${SITE_URL}/#organization`,

        name:
          "AGE202",

        url:
          SITE_URL,

        description:
          "Digital tennis museum preserving tennis history, player archives, memorabilia and collectible artifacts.",
      },

      {
        "@type":
          "WebPage",

        "@id":
          `${SITE_URL}/#homepage`,

        url:
          SITE_URL,

        name:
          "AGE202: Digital Tennis Museum",

        description:
          "Explore AGE202, the digital tennis museum dedicated to players, tournaments, tennis history, memorabilia, iconic apparel, archives and collectible artifacts.",

        isPartOf: {
          "@id":
            `${SITE_URL}/#website`,
        },

        about: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        mainEntity: {
          "@type":
            "CollectionPage",

          name:
            "AGE202 Digital Tennis Museum",

          url:
            SITE_URL,
        },
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
    </>
  );
}