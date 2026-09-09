import type { Metadata } from "next";

import MastersWorldTourMap from "@/components/results/MastersWorldTourMap";

import BackToResults from "./components/BackToResults";
import MastersArchivePreview from "./components/MastersArchivePreview";
import MastersGrid from "./components/MastersGrid";
import MastersHero from "./components/MastersHero";
import MastersOverview from "./components/MastersOverview";
import SeasonRoute from "./components/SeasonRoute";

const SITE_URL =
  "https://www.age202.com";

const PAGE_URL =
  `${SITE_URL}/results/masters-1000`;

const PAGE_TITLE =
  "ATP Masters 1000 Results, Tournaments, Champions & History";

const PAGE_DESCRIPTION =
  "Explore ATP Masters 1000 results, tournaments, champions and history across Indian Wells, Miami, Monte Carlo, Madrid, Rome, Canada, Cincinnati, Shanghai and Paris.";

const mastersTournaments = [
  {
    name: "Indian Wells",
    href: "/results/masters-1000/indian-wells",
  },
  {
    name: "Miami Open",
    href: "/results/masters-1000/miami",
  },
  {
    name: "Monte-Carlo Masters",
    href: "/results/masters-1000/monte-carlo",
  },
  {
    name: "Madrid Open",
    href: "/results/masters-1000/madrid",
  },
  {
    name: "Italian Open",
    href: "/results/masters-1000/rome",
  },
  {
    name: "Canadian Open",
    href: "/results/masters-1000/canada",
  },
  {
    name: "Cincinnati Open",
    href: "/results/masters-1000/cincinnati",
  },
  {
    name: "Shanghai Masters",
    href: "/results/masters-1000/shanghai",
  },
  {
    name: "Paris Masters",
    href: "/results/masters-1000/paris",
  },
];

export const metadata: Metadata = {
  title:
    PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  alternates: {
    canonical:
      "/results/masters-1000",
  },

  keywords: [
    "ATP Masters 1000",
    "ATP Masters 1000 results",
    "ATP Masters 1000 tournaments",
    "ATP Masters 1000 champions",
    "Masters 1000 history",
    "Indian Wells",
    "Miami Open",
    "Monte-Carlo Masters",
    "Madrid Open",
    "Italian Open",
    "Canadian Open",
    "Cincinnati Open",
    "Shanghai Masters",
    "Paris Masters",
    "tennis results",
    "tennis history",
    "AGE202",
  ],

  openGraph: {
    type:
      "website",

    url:
      "/results/masters-1000",

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,
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
    "ATP Masters 1000 tennis",
};

function serializeJsonLd(
  value: unknown,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}

export default function Masters1000Page() {
  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          "ATP Masters 1000 Results, Tournaments, Champions & History",

        headline:
          PAGE_TITLE,

        description:
          PAGE_DESCRIPTION,

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            `${SITE_URL}/#website`,

          name:
            "AGE202",

          url:
            SITE_URL,
        },

        mainEntity: {
          "@id":
            `${PAGE_URL}#masters-tournaments`,
        },

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${PAGE_URL}#masters-tournaments`,

        name:
          "ATP Masters 1000 tournaments",

        numberOfItems:
          mastersTournaments.length,

        itemListElement:
          mastersTournaments.map(
            (
              tournament,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index + 1,

              name:
                tournament.name,

              url:
                `${SITE_URL}${tournament.href}`,
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${PAGE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Results",

            item:
              `${SITE_URL}/results`,
          },

          {
            "@type":
              "ListItem",

            position:
              3,

            name:
              "ATP Masters 1000",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              structuredData,
            ),
        }}
      />

      <MastersHero />
      <MastersOverview />
      <MastersWorldTourMap />
      <SeasonRoute />
      <MastersGrid />
      <MastersArchivePreview />
      <BackToResults />
    </main>
  );
}
