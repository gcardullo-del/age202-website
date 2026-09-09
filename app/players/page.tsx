import type {
  Metadata,
} from "next";

import PlayersExperience, {
  type FeaturedPlayerCard,
  type NationSummary,
} from "@/components/players/PlayersExperience";

import {
  getFeaturedPlayers,
  getOtherPlayers,
} from "@/lib/repositories/player.repository";


const PLAYERS_URL =
  "https://www.age202.com/players";


/* =========================================================
   SEO
========================================================= */

export const metadata: Metadata = {
  title:
    "Tennis Players, Champions, ATP & WTA Archives | AGE202",

  description:
    "Explore AGE202 tennis players, champion collections, ATP and WTA archives, careers, rankings, memorabilia and stories from tennis history.",

  alternates: {
    canonical:
      "/players",
  },

  openGraph: {
    type:
      "website",

    title:
      "Tennis Players, Champions, ATP & WTA Archives | AGE202",

    description:
      "Explore champion collections, ATP and WTA player archives, careers, rankings and memorabilia inside the AGE202 Digital Tennis Museum.",

    url:
      "/players",

    siteName:
      "AGE202",

    locale:
      "en_US",

    images: [
      {
        url:
          "/players/federernew.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "AGE202 Tennis Players and Champions",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Tennis Players, Champions, ATP & WTA Archives | AGE202",

    description:
      "Explore AGE202 champion collections, ATP and WTA player archives, careers, rankings and memorabilia.",

    images: [
      "/players/federernew.jpg",
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
    "Tennis players",
};


/* =========================================================
   ARCHIVE ROUTES
========================================================= */

const ARCHIVE_SLUGS: Record<
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


function getArchiveHref(
  slug: string,
): string {
  const archiveSlug =
    ARCHIVE_SLUGS[
      slug
    ] ??
    slug.split("-").at(-1) ??
    slug;

  return `/archives/${archiveSlug}`;
}


/* =========================================================
   PLAYER NORMALIZATION
========================================================= */

function normalizeFeaturedPlayer(
  player: Awaited<
    ReturnType<
      typeof getFeaturedPlayers
    >
  >[number],
): FeaturedPlayerCard {
  return {
    id:
      player.id,

    name:
      player.name,

    slug:
      player.slug,

    country:
      player.country,

    biography:
      player.biography,

    heroImage:
      player.heroImage,

    portraitImage:
      player.portraitImage,

    debutYear:
      player.debutYear,

    accent:
      player.accent,

    artifactCount:
      player._count.artifacts,

    href:
      getArchiveHref(
        player.slug,
      ),
  };
}


/* =========================================================
   NATIONS
========================================================= */

function buildNationSummary(
  players: Awaited<
    ReturnType<
      typeof getOtherPlayers
    >
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
      player.atpPlayer?.country?.trim() ||
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

export default async function PlayersPage() {
  const [
    featuredPlayersData,
    atpPlayers,
  ] =
    await Promise.all([
      getFeaturedPlayers(),
      getOtherPlayers(),
    ]);


  const featuredPlayers =
    featuredPlayersData.map(
      normalizeFeaturedPlayer,
    );


  const totalArtifactCount =
    featuredPlayers.reduce(
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
          `${PLAYERS_URL}#collection`,

        url:
          PLAYERS_URL,

        name:
          "AGE202 Tennis Players",

        headline:
          "Tennis Players, Champions, ATP & WTA Archives",

        description:
          "Explore AGE202 tennis players, champion collections, ATP and WTA archives, careers, rankings, memorabilia and stories from tennis history.",

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
            `${PLAYERS_URL}#champions`,
        },

        hasPart: [
          {
            "@type":
              "CollectionPage",

            name:
              "ATP Players Archive",

            url:
              "https://www.age202.com/players/other-players",
          },

          {
            "@type":
              "CollectionPage",

            name:
              "Women's Tennis",

            url:
              "https://www.age202.com/players/women",
          },

          {
            "@type":
              "CollectionPage",

            name:
              "WTA Players Archive",

            url:
              "https://www.age202.com/players/women/archive",
          },
        ],
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${PLAYERS_URL}#champions`,

        name:
          "AGE202 Champion Collections",

        numberOfItems:
          featuredPlayers.length,

        itemListElement:
          featuredPlayers.map(
            (
              player,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index +
                1,

              name:
                player.name,

              url:
                `https://www.age202.com${player.href}`,

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
          `${PLAYERS_URL}#breadcrumb`,

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
              PLAYERS_URL,
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

      <PlayersExperience
        featuredPlayers={
          featuredPlayers
        }
        atpPlayerCount={
          atpPlayers.length
        }
        totalArtifactCount={
          totalArtifactCount
        }
        nations={
          buildNationSummary(
            atpPlayers,
          )
        }
      />
    </>
  );
}