import TournamentEditions, {
  type TournamentEdition,
} from "@/components/results/TournamentEditions";

import {
  getGrandSlamEditions,
} from "@/lib/data/grand-slam-editions";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";


type GrandSlamEditionsSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};


function formatDate(
  date: Date | null,
): string | undefined {
  if (!date) {
    return undefined;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}


function formatUpdatedAt(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}


export default async function GrandSlamEditionsSection({
  slug,
  cmsSlug,
}: GrandSlamEditionsSectionProps) {
  const fallback =
    getGrandSlamEditions(
      slug,
    );

  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const cmsEditions: TournamentEdition[] =
    tournament?.editions.map(
      (edition) => ({
        year:
          edition.year,

        editionKey:
          edition.editionKey,

        editionLabel:
          edition.editionLabel ??
          undefined,

        champion:
          edition.championPlayer?.name ||
          edition.championName ||
          (edition.cancelled
            ? "Tournament cancelled"
            : "Champion not recorded"),

        championCountry:
          edition.championPlayer?.country ??
          undefined,

        championCountryCode:
          edition.championCountryCode ??
          undefined,

        championPlayerSlug:
          edition.championPlayer?.slug ??
          undefined,

        runnerUp:
          edition.runnerUpPlayer?.name ||
          edition.runnerUpName ||
          undefined,

        runnerUpCountry:
          edition.runnerUpPlayer?.country ??
          undefined,

        runnerUpCountryCode:
          edition.runnerUpCountryCode ??
          undefined,

        runnerUpPlayerSlug:
          edition.runnerUpPlayer?.slug ??
          undefined,

        finalScore:
          edition.score ??
          undefined,

        startDate:
          formatDate(
            edition.startDate,
          ),

        endDate:
          formatDate(
            edition.endDate,
          ),

        venue:
          tournament.venue ??
          undefined,

        surface:
          tournament.surface ||
          undefined,

        drawSize:
          edition.drawSize ??
          undefined,

        status:
          edition.cancelled
            ? "cancelled"
            : "complete",
      }),
    ) ?? [];

  const hasCmsEditions =
    cmsEditions.length > 0;

  if (
    !hasCmsEditions &&
    !fallback
  ) {
    return null;
  }

  return (
    <TournamentEditions
      tournamentName={
        tournament?.shortName?.trim() ||
        tournament?.name?.trim() ||
        fallback?.tournamentName ||
        slug
      }
      tournamentCode={
        fallback?.tournamentCode ||
        slug
          .replaceAll(
            "-",
            " ",
          )
          .toUpperCase()
      }
      editions={
        hasCmsEditions
          ? cmsEditions
          : fallback?.editions ??
            []
      }
      updatedAt={
        hasCmsEditions &&
        tournament
          ? formatUpdatedAt(
              tournament.updatedAt,
            )
          : fallback?.updatedAt
      }
    />
  );
}