import {
  countryCodeToFlag,
  countryNameToCode,
  formatCmsEditionDate,
  formatCmsSurface,
  getInitials,
  splitCmsHistory,
} from "@/lib/mappers/masters-1000-cms.mapper";

export type Atp500CmsIdentity = {
  name: string;
  shortName: string | null;
  surface: string | null;
  foundedYear: number | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  venue: string | null;
  description: string | null;
  history: string | null;
  heroImage: string | null;
};

export type Atp500CmsIconicMoment = {
  year: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
};

export type Atp500CmsEdition = {
  year: number;
  endDate: Date | null;
  championName: string | null;
  runnerUpName: string | null;
  championCountryCode: string | null;
  runnerUpCountryCode: string | null;
  score: string | null;

  championPlayer: {
    slug: string;
    name: string;
    country: string | null;
  } | null;

  runnerUpPlayer: {
    slug: string;
    name: string;
    country: string | null;
  } | null;
};

export type Atp500CmsChampion = {
  titles: number;
  firstTitleYear: number | null;
  lastTitleYear: number | null;
  titleYears: number[];
  finals: number | null;
  wins: number | null;
  legend: boolean;
  featured: boolean;
  sortOrder: number;
  recordLabel: string | null;
  quote: string | null;
  imageUrl: string | null;
  name: string | null;
  country: string | null;
  countryCode: string | null;

  player: {
    slug: string;
    name: string;
    country: string | null;
  } | null;
};

export type Atp500PublicIdentity = {
  name: string;
  officialName: string;
  shortName: string;
  surface: string;
  founded: string;
  city: string;
  country: string;
  countryCode: string;
  venue: string;
  introduction: string;
  history: string[];
  heroImage: string;
};

export type Atp500PublicIconicMoment = {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
};

export type Atp500PublicLegend = {
  name: string;
  initials: string;
  country: string;
  countryCode: string;
  flag: string;
  titles: number;
  titleYears: number[];
  finals?: number;
  wins?: number;
  recordLabel: string;
  quote: string;
  image?: string;
  featured: boolean;
  playerSlug: string | null;
  playerHref: string | null;
};

export type Atp500PublicEditionPlayer = {
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  playerSlug: string | null;
  playerHref: string | null;
};

export type Atp500PublicEdition = {
  year: number;
  date: string;
  champion: Atp500PublicEditionPlayer;
  runnerUp: Atp500PublicEditionPlayer;
  score: string;
};

export type Atp500TournamentPageData = {
  identity: Atp500PublicIdentity;
  iconicMoments: Atp500PublicIconicMoment[];
  legends: Atp500PublicLegend[];
  recentEditions: Atp500PublicEdition[];
};

type Atp500StaticTournamentInput = {
  slug: string;
  name: string;
  shortName?: string;
  officialName?: string;
  surface: string;
  founded: string | number;
  city: string;
  country: string;
  countryCode?: string;
  venue: string;
  introduction: string;
  history: string[];
  heroImage?: string;
};

type Atp500CmsTournamentInput = Atp500CmsIdentity & {
  iconicMoments: readonly Atp500CmsIconicMoment[];
  editions: readonly Atp500CmsEdition[];
  champions: readonly Atp500CmsChampion[];
};

function getPlayerHref(
  slug: string | null | undefined,
): string | null {
  const normalized =
    slug?.trim();

  return normalized
    ? `/players/${normalized}`
    : null;
}

function resolveCountryCode(
  explicitCode: string | null | undefined,
  playerCountry: string | null | undefined,
  fallbackCountry: string | null | undefined,
): string {
  return (
    explicitCode?.trim().toUpperCase() ||
    countryNameToCode(
      playerCountry ||
        fallbackCountry,
    )
  );
}

function resolveIdentity(
  cmsTournament: Atp500CmsIdentity | null | undefined,
  staticTournament: Atp500StaticTournamentInput,
): Atp500PublicIdentity {
  const name =
    cmsTournament?.shortName?.trim() ||
    staticTournament.shortName?.trim() ||
    staticTournament.name;

  const officialName =
    cmsTournament?.name?.trim() ||
    staticTournament.officialName?.trim() ||
    staticTournament.name;

  const country =
    cmsTournament?.country?.trim() ||
    staticTournament.country;

  const countryCode =
    cmsTournament?.countryCode?.trim().toUpperCase() ||
    staticTournament.countryCode?.trim().toUpperCase() ||
    countryNameToCode(
      country,
    );

  return {
    name,
    officialName,
    shortName: name,

    surface:
      formatCmsSurface(
        cmsTournament?.surface,
        staticTournament.surface,
      ),

    founded:
      cmsTournament?.foundedYear != null
        ? String(
            cmsTournament.foundedYear,
          )
        : String(
            staticTournament.founded,
          ),

    city:
      cmsTournament?.city?.trim() ||
      staticTournament.city,

    country,
    countryCode,

    venue:
      cmsTournament?.venue?.trim() ||
      staticTournament.venue,

    introduction:
      cmsTournament?.description?.trim() ||
      staticTournament.introduction,

    history:
      splitCmsHistory(
        cmsTournament?.history,
        staticTournament.history,
      ),

    heroImage:
      cmsTournament?.heroImage?.trim() ||
      staticTournament.heroImage?.trim() ||
      `/tournaments/${staticTournament.slug}/hero.jpg`,
  };
}

function mapIconicMoments(
  moments:
    | readonly Atp500CmsIconicMoment[]
    | null
    | undefined,
): Atp500PublicIconicMoment[] {
  return (
    moments?.map(
      (moment) => ({
        year:
          moment.year != null
            ? String(
                moment.year,
              )
            : "—",

        title:
          moment.title.trim(),

        subtitle:
          moment.subtitle?.trim() ||
          "",

        description:
          moment.description?.trim() ||
          moment.subtitle?.trim() ||
          "",

        ...(moment.imageUrl?.trim()
          ? {
              imageUrl:
                moment.imageUrl.trim(),
            }
          : {}),
      }),
    ) ?? []
  );
}

function mapLegends(
  champions:
    | readonly Atp500CmsChampion[]
    | null
    | undefined,
): Atp500PublicLegend[] {
  return (
    champions
      ?.filter(
        (champion) =>
          champion.legend,
      )
      .sort(
        (
          a,
          b,
        ) =>
          Number(
            b.featured,
          ) -
            Number(
              a.featured,
            ) ||
          a.sortOrder -
            b.sortOrder ||
          b.titles -
            a.titles ||
          (b.lastTitleYear ??
            0) -
            (a.lastTitleYear ??
              0),
      )
      .map(
        (champion) => {
          const name =
            champion.player?.name ||
            champion.name ||
            "Historical legend";

          const country =
            champion.player?.country?.trim() ||
            champion.country?.trim() ||
            "Unknown";

          const countryCode =
            resolveCountryCode(
              champion.countryCode,
              champion.player?.country,
              champion.country,
            );

          const playerSlug =
            champion.player?.slug?.trim() ||
            null;

          const titleYears =
            champion.titleYears.length >
            0
              ? champion.titleYears
              : [
                  champion.firstTitleYear,
                  champion.lastTitleYear,
                ].filter(
                  (
                    year,
                    index,
                    array,
                  ): year is number =>
                    year !== null &&
                    array.indexOf(
                      year,
                    ) ===
                      index,
                );

          return {
            name,

            initials:
              getInitials(
                name,
              ),

            country,
            countryCode,

            flag:
              countryCodeToFlag(
                countryCode,
              ),

            titles:
              champion.titles,

            titleYears,

            finals:
              champion.finals ??
              undefined,

            wins:
              champion.wins ??
              undefined,

            recordLabel:
              champion.recordLabel?.trim() ||
              `${champion.titles}-time champion`,

            quote:
              champion.quote?.trim() ||
              `${name} is part of this tournament's championship legacy.`,

            image:
              champion.imageUrl?.trim() ||
              undefined,

            featured:
              champion.featured,

            playerSlug,

            playerHref:
              getPlayerHref(
                playerSlug,
              ),
          };
        },
      ) ?? []
  );
}

function mapEditionPlayer({
  player,
  historicalName,
  countryCode,
}: {
  player: Atp500CmsEdition["championPlayer"];
  historicalName: string | null;
  countryCode: string | null;
}): Atp500PublicEditionPlayer {
  const name =
    player?.name ||
    historicalName ||
    "Not recorded";

  const resolvedCountry =
    player?.country?.trim() ||
    countryCode?.trim().toUpperCase() ||
    "Unknown";

  const resolvedCountryCode =
    resolveCountryCode(
      countryCode,
      player?.country,
      resolvedCountry,
    );

  const playerSlug =
    player?.slug?.trim() ||
    null;

  return {
    name,

    country:
      player?.country?.trim() ||
      resolvedCountry,

    countryCode:
      resolvedCountryCode,

    flag:
      countryCodeToFlag(
        resolvedCountryCode,
      ),

    playerSlug,

    playerHref:
      getPlayerHref(
        playerSlug,
      ),
  };
}

function mapRecentEditions(
  editions:
    | readonly Atp500CmsEdition[]
    | null
    | undefined,
): Atp500PublicEdition[] {
  return (
    editions
      ?.filter(
        (edition) =>
          Boolean(
            edition.championName ||
              edition.championPlayer?.name,
          ),
      )
      .slice(0, 5)
      .map(
        (edition) => ({
          year:
            edition.year,

          date:
            formatCmsEditionDate(
              edition.endDate,
            ),

          champion:
            mapEditionPlayer({
              player:
                edition.championPlayer,
              historicalName:
                edition.championName,
              countryCode:
                edition.championCountryCode,
            }),

          runnerUp:
            mapEditionPlayer({
              player:
                edition.runnerUpPlayer,
              historicalName:
                edition.runnerUpName,
              countryCode:
                edition.runnerUpCountryCode,
            }),

          score:
            edition.score?.trim() ||
            "Score not recorded",
        }),
      ) ?? []
  );
}

export function mapAtp500TournamentPageData(
  cmsTournament:
    | Atp500CmsTournamentInput
    | null
    | undefined,
  staticTournament: Atp500StaticTournamentInput,
): Atp500TournamentPageData {
  return {
    identity:
      resolveIdentity(
        cmsTournament,
        staticTournament,
      ),

    iconicMoments:
      mapIconicMoments(
        cmsTournament?.iconicMoments,
      ),

    legends:
      mapLegends(
        cmsTournament?.champions,
      ),

    recentEditions:
      mapRecentEditions(
        cmsTournament?.editions,
      ),
  };
}