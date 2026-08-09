import HallOfChampions, {
  type HallOfChampionsEntry,
  type HallOfChampionsLeader,
} from "@/components/results/HallOfChampions";

import {
  getGrandSlamChampions,
} from "@/lib/data/grand-slam-champions";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamHallOfChampionsSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};

function formatUpdatedAt(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    date,
  );
}

export default async function GrandSlamHallOfChampionsSection({
  slug,
  cmsSlug,
}: GrandSlamHallOfChampionsSectionProps) {
  const fallback =
    getGrandSlamChampions(
      slug,
    );

  const cmsTournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const cmsEntries: HallOfChampionsEntry[] =
    cmsTournament?.editions
      .filter(
        (edition) =>
          !edition.cancelled &&
          Boolean(
            edition.championPlayer?.name ||
              edition.championName,
          ),
      )
      .map(
        (edition) => ({
          year:
            edition.year,

          champion:
            edition.championPlayer?.name ||
            edition.championName ||
            "Champion not recorded",

          championCountryCode:
            edition.championCountryCode ??
            undefined,

          championCountry:
            edition.championPlayer?.country ??
            undefined,

          runnerUp:
            edition.runnerUpPlayer?.name ||
            edition.runnerUpName ||
            undefined,

          runnerUpCountryCode:
            edition.runnerUpCountryCode ??
            undefined,

          score:
            edition.score ??
            undefined,

          playerSlug:
            edition.championPlayer?.slug ??
            undefined,
        }),
      ) ?? [];

  const cmsLeaders: HallOfChampionsLeader[] =
    cmsTournament?.champions
      .map(
        (champion) => ({
          player:
            champion.player?.name ||
            champion.name ||
            "Historical champion",

          titles:
            champion.titles,

          countryCode:
            champion.countryCode ??
            undefined,

          country:
            champion.player?.country ||
            champion.country ||
            undefined,

          playerSlug:
            champion.player?.slug ??
            undefined,
        }),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.titles -
          a.titles,
      ) ?? [];

  const hasCmsData =
    cmsEntries.length > 0 ||
    cmsLeaders.length > 0;

  if (
    !hasCmsData &&
    !fallback
  ) {
    return null;
  }

  return (
    <HallOfChampions
      tournamentName={
        cmsTournament?.shortName?.trim() ||
        cmsTournament?.name?.trim() ||
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
      eraLabel={
        fallback?.eraLabel ??
        "Open Era"
      }
      updatedAt={
        hasCmsData &&
        cmsTournament
          ? formatUpdatedAt(
              cmsTournament.updatedAt,
            )
          : fallback?.updatedAt ??
            "—"
      }
      entries={
        cmsEntries.length > 0
          ? cmsEntries
          : fallback?.entries ??
            []
      }
      leaders={
        cmsLeaders.length > 0
          ? cmsLeaders
          : fallback?.leaders ??
            []
      }
    />
  );
}