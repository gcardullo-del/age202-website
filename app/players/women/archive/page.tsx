import type {
  Metadata,
} from "next";

import WomenArchiveExperience, {
  type WomenArchiveEntry,
} from "@/components/players/WomenArchiveExperience";

import {
  getWomenArchiveRanking,
} from "@/lib/repositories/player.repository";


export const dynamic =
  "force-dynamic";


const WTA_ARCHIVE_URL =
  "https://www.age202.com/players/women/archive";


export const metadata: Metadata = {
  title:
    "WTA Players Archive: Rankings, Profiles & Careers | AGE202",

  description:
    "Explore the AGE202 WTA Players Archive with current rankings, player profiles, careers, titles and the women shaping today's professional tennis tour.",

  alternates: {
    canonical:
      "/players/women/archive",
  },

  openGraph: {
    type:
      "website",

    url:
      "/players/women/archive",

    title:
      "WTA Players Archive: Rankings, Profiles & Careers | AGE202",

    description:
      "Explore the AGE202 WTA Players Archive with current rankings, player profiles, careers, titles and the women shaping today's professional tennis tour.",

    siteName:
      "AGE202",

    locale:
      "en_US",

    images: [
      {
        url:
          "/players/women/wta-archive-hero.png",

        width:
          1200,

        height:
          630,

        alt:
          "AGE202 WTA Players Archive",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "WTA Players Archive: Rankings, Profiles & Careers | AGE202",

    description:
      "Explore current WTA rankings, player profiles, careers, titles and the living AGE202 women's tennis archive.",

    images: [
      "/players/women/wta-archive-hero.png",
    ],
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
    "Women's tennis archive",
};


function normalizeArchiveEntry(
  player: Awaited<
    ReturnType<
      typeof getWomenArchiveRanking
    >
  >[number],
): WomenArchiveEntry {
  const hasProfile =
    Boolean(
      player.player?.active &&
      player.player?.slug,
    );

  return {
    id:
      player.id,

    rank:
      player.rank,

    previousRank:
      player.previousRank,

    name:
      player.name,

    slug:
      player.slug,

    country:
      player.country,

    countryCode:
      player.countryCode,

    points:
      player.points,

    age:
      player.age,

    imageUrl:
      player.imageUrl,

    hasProfile,

    href:
      hasProfile &&
      player.player?.slug
        ? `/players/women/${player.player.slug}`
        : null,
  };
}


export default async function WomenArchivePage() {
  const ranking =
    await getWomenArchiveRanking();

  const players =
    ranking.map(
      normalizeArchiveEntry,
    );


  const seoPlayers =
    players.filter(
      (
        player,
      ): player is WomenArchiveEntry & {
        href: string;
      } =>
        Boolean(
          player.hasProfile &&
          player.href,
        ),
    );


  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${WTA_ARCHIVE_URL}#collection`,

        url:
          WTA_ARCHIVE_URL,

        name:
          "WTA Players Archive",

        headline:
          "WTA Players Archive: Rankings, Profiles & Careers",

        description:
          "The AGE202 WTA Players Archive featuring current rankings, player profiles, careers, titles and women's professional tennis history.",

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
            `${WTA_ARCHIVE_URL}#players`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${WTA_ARCHIVE_URL}#players`,

        name:
          "AGE202 WTA Player Directory",

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
                index + 1,

              url:
                `https://www.age202.com${player.href}`,

              name:
                player.name,

              item: {
                "@type":
                  "Person",

                "@id":
                  `https://www.age202.com${player.href}#person`,

                name:
                  player.name,

                url:
                  `https://www.age202.com${player.href}`,
              },
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${WTA_ARCHIVE_URL}#breadcrumb`,

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
              "Women's Tennis",

            item:
              "https://www.age202.com/players/women",
          },

          {
            "@type":
              "ListItem",

            position:
              4,

            name:
              "WTA Players Archive",

            item:
              WTA_ARCHIVE_URL,
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

      <WomenArchiveExperience
        players={
          players
        }
      />
    </>
  );
}