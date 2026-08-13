import {
  TennisHistoryEntryType,
  TennisHistoryEra,
  TennisHistoryGender,
} from "@/generated/prisma/client";

import TennisHistoryClient from "@/components/tennis-history/TennisHistoryClient";

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