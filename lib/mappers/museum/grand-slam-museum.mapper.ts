import type {
  TournamentMuseumData,
} from "@/lib/services/museum/tournament.service";

import type {
  GrandSlamData,
  GrandSlamIconicMoment,
  GrandSlamTimelineEntry,
} from "@/lib/data/grand-slams";

function formatSurface(
  surface: string,
): string {
  return surface
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function splitHistory(
  history: string | null,
): string[] {
  if (!history) {
    return [];
  }

  return history
    .split(/\n\s*\n/)
    .map(
      (paragraph) =>
        paragraph.trim(),
    )
    .filter(Boolean);
}

function mapTimeline(
  tournament:
    TournamentMuseumData,
): GrandSlamTimelineEntry[] {
  return tournament.milestones
    .filter(
      (milestone) =>
        milestone.year !== null,
    )
    .map(
      (milestone) => ({
        year:
          String(
            milestone.year,
          ),

        title:
          milestone.title,

        description:
          milestone.description ??
          milestone.subtitle ??
          "",
      }),
    );
}

function mapIconicMoments(
  tournament:
    TournamentMuseumData,
): GrandSlamIconicMoment[] {
  return tournament.iconicMoments.map(
    (moment) => ({
      year:
        moment.year !== null
          ? String(moment.year)
          : moment.momentDate
            ? String(
                moment.momentDate
                  .getUTCFullYear(),
              )
            : "—",

      title:
        moment.title,

      description:
        moment.description ??
        moment.subtitle ??
        "",
    }),
  );
}

export function mapGrandSlamMuseumData(
  fallback: GrandSlamData,
  tournament:
    TournamentMuseumData | null,
): GrandSlamData {
  if (!tournament) {
    return fallback;
  }

  const cmsHistory =
    splitHistory(
      tournament.history,
    );

  const cmsTimeline =
    mapTimeline(
      tournament,
    );

  const cmsIconicMoments =
    mapIconicMoments(
      tournament,
    );

  const city =
    tournament.city ??
    fallback.city;

  const venue =
    tournament.venue ??
    fallback.venue;

  const founded =
    tournament.foundedYear !==
    null
      ? String(
          tournament.foundedYear,
        )
      : fallback.founded;

  const surface =
    tournament.surface
      ? formatSurface(
          tournament.surface,
        )
      : fallback.surface;

  return {
    ...fallback,

    name:
      tournament.name ||
      fallback.name,

    shortName:
      tournament.shortName ??
      fallback.shortName,

    introduction:
      tournament.description ??
      fallback.introduction,

    history:
      cmsHistory.length > 0
        ? cmsHistory
        : fallback.history,

    city,

    country:
      tournament.country ||
      fallback.country,

    venue,

    surface,

    founded,

    facts: [
      {
        label: "Founded",
        value: founded,
      },
      {
        label: "Host city",
        value: city,
      },
      {
        label: "Surface",
        value: surface,
      },
      {
        label: "Season",
        value:
          fallback.calendar,
      },
    ],

    timeline:
      cmsTimeline.length > 0
        ? cmsTimeline
        : fallback.timeline,

    iconicMoments:
      cmsIconicMoments.length >
      0
        ? cmsIconicMoments
        : fallback.iconicMoments,
  };
}