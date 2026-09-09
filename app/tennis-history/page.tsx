import type {
 Metadata,
} from "next";

import {
  TennisHistoryEntryType,
  TennisHistoryEra,
  TennisHistoryGender,
} from "@/generated/prisma/client";

import TennisHistoryClient, {
  type TennisHistoryMilestone,
} from "@/components/tennis-history/TennisHistoryClient";

import type {
  TennisHistoryGeneration,
  TennisHistoryLegend,
  TennisHistoryRivalry,
} from "@/components/tennis-history/tennis-history.data";

import {
  listPublishedTennisHistoryEntries,
} from "@/lib/services/tennis-history.service";


export const dynamic =
  "force-dynamic";


const SITE_URL =
  "https://www.age202.com";

const TENNIS_HISTORY_URL =
  `${SITE_URL}/tennis-history`;


export const metadata: Metadata = {
  title:
    "Tennis History: Origins, Legends, Rivalries & Eras | AGE202",

  description:
    "Explore tennis history from the origins of the sport and historic tournaments to the Open Era, legendary players, iconic rivalries and defining moments.",

  alternates: {
    canonical:
      "/tennis-history",
  },

  openGraph: {
    title:
      "Tennis History: Origins, Legends, Rivalries & Eras | AGE202",

    description:
      "Explore tennis history from the origins of the sport and historic tournaments to the Open Era, legendary players, iconic rivalries and defining moments.",

    url:
      "/tennis-history",

    type:
      "website",

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Tennis History: Origins, Legends, Rivalries & Eras | AGE202",

    description:
      "Explore tennis history from the origins of the sport to legendary players, iconic rivalries, historic tournaments and defining eras.",
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
    "Tennis History",
};


function mapEra(
  era: TennisHistoryEra,
): TennisHistoryLegend["era"] {
  switch (era) {
    case TennisHistoryEra.OPEN_ERA:
      return "OPEN_ERA";

    case TennisHistoryEra.MODERN_ERA:
      return "MODERN_ERA";

    case TennisHistoryEra.ORIGINS:
    case TennisHistoryEra.CLASSIC_ERA:
    default:
      return "GOLDEN_ERA";
  }
}


function mapMilestoneEra(
  era: TennisHistoryEra,
): TennisHistoryMilestone["era"] {
  switch (era) {
    case TennisHistoryEra.ORIGINS:
      return "Origins";

    case TennisHistoryEra.CLASSIC_ERA:
      return "Classic Era";

    case TennisHistoryEra.OPEN_ERA:
      return "Open Era";

    case TennisHistoryEra.MODERN_ERA:
    default:
      return "Modern Era";
  }
}


function mapGender(
  gender: TennisHistoryGender | null,
): TennisHistoryLegend["gender"] {
  return gender ===
    TennisHistoryGender.WOMEN
    ? "WOMEN"
    : "MEN";
}


export default async function TennisHistoryPage() {
  const entries =
    await listPublishedTennisHistoryEntries();


  const milestones:
    TennisHistoryMilestone[] =
    entries
      .filter(
        (
          entry,
        ) =>
          entry.type ===
          TennisHistoryEntryType.MILESTONE,
      )
      .map(
        (
          entry,
        ) => ({
          year:
            entry.year,

          month:
            entry.month,

          day:
            entry.day,

          sortOrder:
            entry.sortOrder,

          era:
            mapMilestoneEra(
              entry.era,
            ),

          title:
            entry.title,

          description:
            entry.description ??
            "",

          accent:
            entry.achievement ??
            entry.subtitle ??
            entry.period ??
            "Historical milestone",

          href:
            entry.href ??
            undefined,
        }),
      );


  const legends:
    TennisHistoryLegend[] =
    entries
      .filter(
        (
          entry,
        ) =>
          entry.type ===
          TennisHistoryEntryType.LEGEND,
      )
      .map(
        (
          entry,
        ) => ({
          type:
            "legend",

          year:
            entry.year,

          name:
            entry.title,

          slug:
            entry.slug,

          gender:
            mapGender(
              entry.gender,
            ),

          country:
            entry.country ??
            "",

          countryCode:
            entry.countryCode ??
            "",

          era:
            mapEra(
              entry.era,
            ),

          eyebrow:
            entry.eyebrow ??
            "Legend of History",

          title:
            entry.subtitle ??
            "",

          description:
            entry.description ??
            "",

          quote:
            entry.quote ??
            "",

          achievement:
            entry.achievement ??
            "",

          period:
            entry.period ??
            "",

          imageUrl:
            entry.media?.url ??
            entry.imageUrl ??
            null,

          href:
            entry.href ??
            null,
        }),
      );


  const rivalries:
    TennisHistoryRivalry[] =
    entries
      .filter(
        (
          entry,
        ) =>
          entry.type ===
          TennisHistoryEntryType.RIVALRY,
      )
      .map(
        (
          entry,
        ) => ({
          type:
            "rivalry",

          year:
            entry.year,

          slug:
            entry.slug,

          eyebrow:
            entry.eyebrow ??
            "Iconic Rivalry",

          title:
            entry.title,

          playerOne:
            entry.playerOne ??
            "",

          playerTwo:
            entry.playerTwo ??
            "",

          description:
            entry.description ??
            "",

          period:
            entry.period ??
            "",

          imageUrl:
            entry.media?.url ??
            entry.imageUrl ??
            null,
        }),
      );


  const generations:
    TennisHistoryGeneration[] =
    entries
      .filter(
        (
          entry,
        ) =>
          entry.type ===
          TennisHistoryEntryType.GENERATION,
      )
      .map(
        (
          entry,
        ) => ({
          type:
            "generation",

          year:
            entry.year,

          slug:
            entry.slug,

          eyebrow:
            entry.eyebrow ??
            "Generation of History",

          title:
            entry.title,

          players:
            entry.players,

          description:
            entry.description ??
            "",

          period:
            entry.period ??
            "",

          imageUrl:
            entry.media?.url ??
            entry.imageUrl ??
            null,
        }),
      );


  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${TENNIS_HISTORY_URL}#webpage`,

        url:
          TENNIS_HISTORY_URL,

        name:
          "Tennis History: Origins, Legends, Rivalries & Eras",

        description:
          "Explore tennis history from the origins of the sport and historic tournaments to the Open Era, legendary players, iconic rivalries and defining moments.",

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

        about: {
          "@type":
            "Thing",

          name:
            "History of tennis",
        },

        breadcrumb: {
          "@id":
            `${TENNIS_HISTORY_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${TENNIS_HISTORY_URL}#breadcrumb`,

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
              "Tennis History",

            item:
              TENNIS_HISTORY_URL,
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

      <TennisHistoryClient
        milestones={
          milestones
        }
        legends={
          legends
        }
        rivalries={
          rivalries
        }
        generations={
          generations
        }
      />
    </>
  );
}
