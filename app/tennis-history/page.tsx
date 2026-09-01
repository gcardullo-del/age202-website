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


export const metadata: Metadata = {
  title:
    "History of Tennis | Origins, Tournaments & Legends",

  description:
    "Explore the history of tennis from its origins and the world's oldest tournaments to the Open Era, legendary players, rivalries and defining moments.",

  alternates: {
    canonical:
      "/tennis-history",
  },

  openGraph: {
    title:
      "History of Tennis | AGE202 Digital Tennis Museum",

    description:
      "Discover world tennis history through its origins, oldest tournaments, legendary players, rivalries and defining eras.",

    url:
      "/tennis-history",

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "History of Tennis",

    description:
      "Explore world tennis history, from the origins of the sport to legendary tournaments, players and rivalries.",
  },
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


  return (
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
  );
}