import type {
  Metadata,
} from "next";

import WomenPlayersExperience, {
  type NationSummary,
  type WomenFeaturedPlayerCard,
} from "@/components/players/WomenPlayersExperience";

import {
  getWomenPlayers,
} from "@/lib/repositories/player.repository";


export const dynamic =
  "force-dynamic";


const WTA_ARCHIVE_URL =
  "https://www.age202.com/players/women/archive";


/* =========================================================
   SEO
========================================================= */

export const metadata: Metadata = {
  title:
    "WTA Players Archive: Rankings, Profiles & Careers | AGE202",

  description:
    "Explore the AGE202 WTA Players Archive with current rankings, player profiles, careers, titles and the women shaping professional tennis today.",

  alternates: {
    canonical:
      "/players/women/archive",
  },

  openGraph: {
    type:
      "website",

    title:
      "WTA Players Archive: Rankings, Profiles & Careers | AGE202",

    description:
      "Explore the AGE202 WTA Players Archive with current rankings, player profiles, careers, titles and the women shaping professional tennis today.",

    url:
      "/players/women/archive",

    siteName:
      "AGE202",

    locale:
      "en_US",

    images: [
      {
        url:
          "/players/players-trophies-hero.png",

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
      "Explore the AGE202 WTA Players Archive with current rankings, player profiles, careers, titles and the women shaping professional tennis today.",

    images: [
      "/players/players-trophies-hero.png",
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
    "Tennis archive",
};


/* =========================================================
   TYPES / NORMALIZATION
========================================================= */

function normalizeWomenPlayer(
  player: Awaited<
    ReturnType<typeof getWomenPlayers>
  >[number],
): WomenFeaturedPlayerCard {
  return {
    id:
      player.id,

    name:
      player.name,

    slug:
      player.slug,

    country:
      player.wtaPlayer?.country ??
      player.country,

    countryCode:
      player.wtaPlayer?.countryCode ??
      null,

    rank:
      player.wtaPlayer?.rank ??
      null,

    previousRank:
      player.wtaPlayer?.previousRank ??
      null,

    points:
      player.wtaPlayer?.points ??
      null,

    age:
      player.wtaPlayer?.age ??
      null,

    portraitImage:
      player.portraitImage ??
      player.wtaPlayer?.imageUrl ??
      null,

    artifactCount:
      player._count.artifacts,

    href:
      `/players/women/${player.slug}`,
  };
}


/* =========================================================
   NATIONS
========================================================= */

function buildNationSummary(
  players: Awaited<
    ReturnType<typeof getWomenPlayers>
  >,
): NationSummary[] {
  const counts =
    new Map<
      string,
      number
    >();


  for (
    const player
    of players
  ) {
    const country =
      player.wtaPlayer?.country?.trim() ||
      player.country?.trim();


    if (!country) {
      continue;
    }


    counts.set(
      country,
      (
        counts.get(
          country,
        ) ??
        0
      ) +
      1,
    );
  }


  return [
    ...counts.entries(),
  ]
    .map(
      (
        [
          country,
          count,
        ],
      ) => ({
        country,
        count,
      }),
    )
    .sort(
      (
        first,
        second,
      ) => {
        if (
          first.count !==
          second.count
        ) {
          return (
            second.count -
            first.count
          );
        }


        return first.country.localeCompare(
          second.country,
        );
      },
    )
    .slice(
      0,
      6,
    );
}


/* =========================================================
   PAGE
========================================================= */

export default async function WomenPlayersPage() {
  const womenPlayersData =
    await getWomenPlayers();


  const womenPlayers =
    womenPlayersData.map(
      normalizeWomenPlayer,
    );


  const featuredPlayers =
    womenPlayers.slice(
      0,
      5,
    );


  const totalArtifactCount =
    womenPlayers.reduce(
      (
        total,
        player,
      ) =>
        total +
        player.artifactCount,
      0,
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
          `${WTA_ARCHIVE_URL}#collection`,

        url:
          WTA_ARCHIVE_URL,

        name:
          "WTA Players Archive",

        headline:
          "WTA Players Archive: Rankings, Profiles & Careers",

        description:
          "The AGE202 WTA Players Archive featuring current rankings, player profiles, careers, titles and digital tennis history.",

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
          womenPlayers.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:
          womenPlayers.map(
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
                `https://www.age202.com/players/women/${player.slug}`,

              name:
                player.name,

              item: {
                "@type":
                  "Person",

                "@id":
                  `https://www.age202.com/players/women/${player.slug}#person`,

                name:
                  player.name,

                url:
                  `https://www.age202.com/players/women/${player.slug}`,
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

      <WomenPlayersExperience
        featuredPlayers={
          featuredPlayers
        }
        wtaPlayerCount={
          womenPlayers.length
        }
        totalArtifactCount={
          totalArtifactCount
        }
        nations={
          buildNationSummary(
            womenPlayersData,
          )
        }
      />
    </>
  );
}