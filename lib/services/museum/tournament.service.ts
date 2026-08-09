import "server-only";

import {
  getAllTournaments,
  getFeaturedTournaments,
  getTournamentBySlug,
  getTournamentEditionByYear,
  getTournamentEditions,
} from "@/lib/repositories/tournament.repository";

export type TournamentMuseumSummary = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  category: string;
  surface: string;
  city: string | null;
  country: string;
  countryCode: string | null;
  venue: string | null;
  foundedYear: number | null;
  logoUrl: string | null;
  heroImage: string | null;
  featured: boolean;
  displayOrder: number | null;
  updatedAt: Date;
};

export type TournamentEditionMuseumData = {
  id: string;
  year: number;
  startDate: Date | null;
  endDate: Date | null;
  drawSize: number | null;
  championName: string | null;
  runnerUpName: string | null;
  championCountryCode: string | null;
  runnerUpCountryCode: string | null;
  score: string | null;
  cancelled: boolean;
  championPlayer: {
    id: string;
    name: string;
    slug: string;
    country: string | null;
    portraitImage: string | null;
    heroImage: string | null;
  } | null;
  runnerUpPlayer: {
    id: string;
    name: string;
    slug: string;
    country: string | null;
    portraitImage: string | null;
    heroImage: string | null;
  } | null;
};

export type TournamentChampionMuseumData = {
  id: string;
  titles: number;
  firstTitleYear: number | null;
  lastTitleYear: number | null;

  name: string | null;
  country: string | null;
  countryCode: string | null;

  player: {
    id: string;
    name: string;
    slug: string;
    country: string | null;
    portraitImage: string | null;
    heroImage: string | null;
  } | null;
};

export type TournamentMuseumData = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  category: string;
  surface: string;
  city: string | null;
  country: string;
  countryCode: string | null;
  venue: string | null;
  foundedYear: number | null;
  description: string | null;
  history: string | null;
  logoUrl: string | null;
  heroImage: string | null;
  websiteUrl: string | null;
  featured: boolean;
  displayOrder: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: Date;
  editions: TournamentEditionMuseumData[];
  champions: TournamentChampionMuseumData[];
  statistics: {
    totalEditions: number;
    completedEditions: number;
    cancelledEditions: number;
    firstRecordedYear: number | null;
    latestRecordedYear: number | null;
    recordTitles: number;
  };
};

function mapTournamentSummary(
  tournament: Awaited<
    ReturnType<typeof getAllTournaments>
  >[number],
): TournamentMuseumSummary {
  return {
    id: tournament.id,
    name: tournament.name,
    slug: tournament.slug,
    shortName: tournament.shortName,
    category: tournament.category,
    surface: tournament.surface,
    city: tournament.city,
    country: tournament.country,
    countryCode: tournament.countryCode,
    venue: tournament.venue,
    foundedYear: tournament.foundedYear,
    logoUrl: tournament.logoUrl,
    heroImage: tournament.heroImage,
    featured: tournament.featured,
    displayOrder: tournament.displayOrder,
    updatedAt: tournament.updatedAt,
  };
}

function mapEdition(
  edition: NonNullable<
    Awaited<
      ReturnType<typeof getTournamentBySlug>
    >
  >["editions"][number],
): TournamentEditionMuseumData {
  return {
    id: edition.id,
    year: edition.year,
    startDate: edition.startDate,
    endDate: edition.endDate,
    drawSize: edition.drawSize,
    championName: edition.championName,
    runnerUpName: edition.runnerUpName,
    championCountryCode:
      edition.championCountryCode,
    runnerUpCountryCode:
      edition.runnerUpCountryCode,
    score: edition.score,
    cancelled: edition.cancelled,

    championPlayer:
      edition.championPlayer
        ? {
            id: edition.championPlayer.id,
            name: edition.championPlayer.name,
            slug: edition.championPlayer.slug,
            country:
              edition.championPlayer.country,
            portraitImage:
              edition.championPlayer
                .portraitImage,
            heroImage:
              edition.championPlayer.heroImage,
          }
        : null,

    runnerUpPlayer:
      edition.runnerUpPlayer
        ? {
            id: edition.runnerUpPlayer.id,
            name: edition.runnerUpPlayer.name,
            slug: edition.runnerUpPlayer.slug,
            country:
              edition.runnerUpPlayer.country,
            portraitImage:
              edition.runnerUpPlayer
                .portraitImage,
            heroImage:
              edition.runnerUpPlayer.heroImage,
          }
        : null,
  };
}

function mapChampion(
  champion: NonNullable<
    Awaited<
      ReturnType<typeof getTournamentBySlug>
    >
  >["champions"][number],
): TournamentChampionMuseumData {
  return {
    id: champion.id,
    titles: champion.titles,
    firstTitleYear:
      champion.firstTitleYear,
    lastTitleYear:
      champion.lastTitleYear,

    name:
      champion.name,
    country:
      champion.country,
    countryCode:
      champion.countryCode,

    player:
      champion.player
        ? {
            id:
              champion.player.id,
            name:
              champion.player.name,
            slug:
              champion.player.slug,
            country:
              champion.player.country,
            portraitImage:
              champion.player.portraitImage,
            heroImage:
              champion.player.heroImage,
          }
        : null,
  };
}

export async function getTournamentDirectory(): Promise<
  TournamentMuseumSummary[]
> {
  const tournaments =
    await getAllTournaments();

  return tournaments.map(
    mapTournamentSummary,
  );
}

export async function getFeaturedTournamentDirectory(): Promise<
  TournamentMuseumSummary[]
> {
  const tournaments =
    await getFeaturedTournaments();

  return tournaments.map(
    mapTournamentSummary,
  );
}

export async function getMuseumTournamentBySlug(
  slug: string,
): Promise<TournamentMuseumData | null> {
  const tournament =
    await getTournamentBySlug(
      slug,
    );

  if (!tournament) {
    return null;
  }

  const editions =
    tournament.editions.map(
      mapEdition,
    );

  const champions =
    tournament.champions.map(
      mapChampion,
    );

  const completedEditions =
    editions.filter(
      (edition) =>
        !edition.cancelled,
    );

  const recordedYears =
    editions.map(
      (edition) =>
        edition.year,
    );

  const recordTitles =
    champions.length > 0
      ? Math.max(
          ...champions.map(
            (champion) =>
              champion.titles,
          ),
        )
      : 0;

  return {
    id: tournament.id,
    name: tournament.name,
    slug: tournament.slug,
    shortName:
      tournament.shortName,
    category:
      tournament.category,
    surface:
      tournament.surface,
    city: tournament.city,
    country:
      tournament.country,
    countryCode:
      tournament.countryCode,
    venue: tournament.venue,
    foundedYear:
      tournament.foundedYear,
    description:
      tournament.description,
    history: tournament.history,
    logoUrl:
      tournament.logoUrl,
    heroImage:
      tournament.heroImage,
    websiteUrl:
      tournament.websiteUrl,
    featured:
      tournament.featured,
    displayOrder:
      tournament.displayOrder,
    metaTitle:
      tournament.metaTitle,
    metaDescription:
      tournament.metaDescription,
    updatedAt:
      tournament.updatedAt,
    editions,
    champions,

    statistics: {
      totalEditions:
        editions.length,

      completedEditions:
        completedEditions.length,

      cancelledEditions:
        editions.length -
        completedEditions.length,

      firstRecordedYear:
        recordedYears.length > 0
          ? Math.min(
              ...recordedYears,
            )
          : null,

      latestRecordedYear:
        recordedYears.length > 0
          ? Math.max(
              ...recordedYears,
            )
          : null,

      recordTitles,
    },
  };
}

export async function getMuseumTournamentEditions(
  tournamentId: string,
): Promise<TournamentEditionMuseumData[]> {
  const editions =
    await getTournamentEditions(
      tournamentId,
    );

  return editions.map(
    mapEdition,
  );
}

export async function getMuseumTournamentEditionByYear(
  tournamentId: string,
  year: number,
): Promise<TournamentEditionMuseumData | null> {
  if (
    !Number.isInteger(year) ||
    year < 1800 ||
    year > 2200
  ) {
    return null;
  }

  const edition =
    await getTournamentEditionByYear(
      tournamentId,
      year,
    );

  if (!edition) {
    return null;
  }

  return mapEdition(
    edition,
  );
}