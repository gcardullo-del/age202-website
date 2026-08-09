import type { Masters1000Edition } from "@/lib/data/masters-1000-editions";
import type {
  Masters1000Final,
  Masters1000TitleLeader,
} from "@/lib/data/masters-1000-champions";
import type {
  Masters1000LegendsData,
} from "@/lib/data/masters-1000-legends";
import type {
  TournamentConfig,
} from "@/lib/data/tournaments/types";
import type {
  Masters1000IconicMoment,
  Masters1000TimelineEntry,
} from "@/lib/data/masters-1000";

export type PublicMuseumChapter = {
  eyebrow: string;
  title: string;
  statement: string;
  code: string;
};

type CmsMuseumChapterInput = {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  yearLabel: string | null;
};

export function formatCmsSurface(
  surface: string | null | undefined,
  fallback: string,
) {
  if (!surface) {
    return fallback;
  }

  const normalized = surface
    .replaceAll("_", " ")
    .toLowerCase();

  return normalized.replace(
    /\b\w/g,
    (character) => character.toUpperCase(),
  );
}

export function splitCmsHistory(
  history: string | null | undefined,
  fallback: string[],
) {
  if (!history?.trim()) {
    return fallback;
  }

  const paragraphs = history
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.length > 0
    ? paragraphs
    : fallback;
}

export function countryCodeToFlag(
  countryCode: string | null | undefined,
) {
  const normalized =
    countryCode?.trim().toUpperCase();

  if (
    !normalized ||
    normalized.length !== 3
  ) {
    return "";
  }

  const alpha3ToAlpha2: Record<string, string> = {
    ARG: "AR",
    AUS: "AU",
    AUT: "AT",
    BEL: "BE",
    BRA: "BR",
    CAN: "CA",
    CHI: "CL",
    CHN: "CN",
    CRO: "HR",
    CZE: "CZ",
    DEN: "DK",
    ESP: "ES",
    FRA: "FR",
    GBR: "GB",
    GEO: "GE",
    GER: "DE",
    GRE: "GR",
    HUN: "HU",
    IND: "IN",
    ITA: "IT",
    JPN: "JP",
    KAZ: "KZ",
    NED: "NL",
    NOR: "NO",
    POL: "PL",
    POR: "PT",
    ROU: "RO",
    RSA: "ZA",
    RUS: "RU",
    SRB: "RS",
    SUI: "CH",
    SWE: "SE",
    USA: "US",
  };

  const alpha2 =
    alpha3ToAlpha2[normalized];

  if (!alpha2) {
    return "";
  }

  return String.fromCodePoint(
    ...alpha2
      .split("")
      .map(
        (character) =>
          127397 +
          character.charCodeAt(
            0,
          ),
      ),
  );
}

export function countryNameToCode(
  country: string | null | undefined,
) {
  if (!country?.trim()) {
    return "";
  }

  const normalized =
    country.trim().toLowerCase();

  const countryCodes: Record<string, string> = {
    argentina: "ARG",
    australia: "AUS",
    austria: "AUT",
    belgium: "BEL",
    brazil: "BRA",
    canada: "CAN",
    chile: "CHI",
    china: "CHN",
    croatia: "CRO",
    "czech republic": "CZE",
    czechia: "CZE",
    denmark: "DEN",
    france: "FRA",
    georgia: "GEO",
    germany: "GER",
    greece: "GRE",
    hungary: "HUN",
    india: "IND",
    italy: "ITA",
    japan: "JPN",
    kazakhstan: "KAZ",
    netherlands: "NED",
    norway: "NOR",
    poland: "POL",
    portugal: "POR",
    romania: "ROU",
    russia: "RUS",
    serbia: "SRB",
    "south africa": "RSA",
    spain: "ESP",
    sweden: "SWE",
    switzerland: "SUI",
    "united kingdom": "GBR",
    "great britain": "GBR",
    "united states": "USA",
    usa: "USA",
  };

  return (
    countryCodes[normalized] ??
    country.trim().toUpperCase().slice(0, 3)
  );
}

export function getInitials(
  name: string,
) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function formatCmsEditionDate(
  date: Date | null,
) {
  if (!date) {
    return "Final date not recorded";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}

export function resolveCmsMuseumChapter(
  chapter:
    | CmsMuseumChapterInput
    | undefined,
  fallback: PublicMuseumChapter,
): PublicMuseumChapter {
  if (!chapter) {
    return fallback;
  }

  return {
    eyebrow:
      chapter.eyebrow?.trim() ||
      fallback.eyebrow,

    title:
      chapter.title.trim() ||
      fallback.title,

    statement:
      chapter.description?.trim() ||
      chapter.subtitle?.trim() ||
      fallback.statement,

    code:
      chapter.yearLabel?.trim() ||
      fallback.code,
  };
}

export function mapCmsMuseumChapters(
  chapters:
    | readonly CmsMuseumChapterInput[]
    | null
    | undefined,
  tournament: Pick<
    TournamentConfig,
    "name" | "venue" | "code"
  >,
) {
  const placeChapter =
    resolveCmsMuseumChapter(
      chapters?.[0],
      {
        eyebrow:
          "Chapter I · The place",
        title:
          `The stage that defines ${tournament.name}.`,
        statement:
          `${tournament.venue} gives ${tournament.name} its setting, atmosphere and competitive identity.`,
        code:
          tournament.code,
      },
    );

  const archiveChapter =
    resolveCmsMuseumChapter(
      chapters?.[1],
      {
        eyebrow:
          "Chapter IV · The archive",
        title:
          "Every edition adds another layer to the mythology.",
        statement:
          "Champions, finals, turning points and memories arranged as a living historical collection.",
        code:
          "ARCHIVE",
      },
    );

  return {
    placeChapter,
    archiveChapter,
  };
}



type CmsTournamentIdentityInput = {
  name: string;
  shortName: string | null;
  surface: string | null;
  foundedYear: number | null;
  city: string | null;
  country: string | null;
  venue: string | null;
  description: string | null;
  history: string | null;
};

export function mapCmsTournamentConfig(
  cmsTournament: CmsTournamentIdentityInput | null | undefined,
  staticTournament: TournamentConfig,
): TournamentConfig {
  return {
    ...staticTournament,

    name:
      cmsTournament?.shortName?.trim() ||
      cmsTournament?.name?.trim() ||
      staticTournament.name,

    officialName:
      cmsTournament?.name?.trim() ||
      staticTournament.officialName,

    city:
      cmsTournament?.city?.trim() ||
      staticTournament.city,

    country:
      cmsTournament?.country?.trim() ||
      staticTournament.country,

    venue:
      cmsTournament?.venue?.trim() ||
      staticTournament.venue,

    surface: formatCmsSurface(
      cmsTournament?.surface,
      staticTournament.surface,
    ),

    founded:
      cmsTournament?.foundedYear != null
        ? String(cmsTournament.foundedYear)
        : staticTournament.founded,

    introduction:
      cmsTournament?.description?.trim() ||
      staticTournament.introduction,

    history: splitCmsHistory(
      cmsTournament?.history,
      staticTournament.history,
    ),
  };
}


export function resolveTournamentHeroImage(
  cmsHeroImage: string | null | undefined,
  staticTournament: Pick<
    TournamentConfig,
    "slug"
  >,
): string {
  return (
    cmsHeroImage?.trim() ||
    `/tournaments/${staticTournament.slug}/hero.jpg`
  );
}


export function resolveTournamentTimeline(
  cmsEntries: Masters1000TimelineEntry[],
  fallbackEntries: Masters1000TimelineEntry[],
): Masters1000TimelineEntry[] {
  return cmsEntries.length > 0
    ? cmsEntries
    : fallbackEntries;
}


export function resolveTournamentIconicMoments(
  cmsMoments: Masters1000IconicMoment[],
  fallbackMoments: Masters1000IconicMoment[],
): Masters1000IconicMoment[] {
  return cmsMoments.length > 0
    ? cmsMoments
    : fallbackMoments;
}


type CmsTournamentMilestoneInput = {
  year: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
};

export function mapCmsTournamentTimeline(
  milestones: readonly CmsTournamentMilestoneInput[] | null | undefined,
): Masters1000TimelineEntry[] {
  return (
    milestones?.map(
      (milestone) => ({
        year:
          milestone.year != null
            ? String(milestone.year)
            : "—",
        title:
          milestone.title.trim(),
        description:
          milestone.description?.trim() ||
          milestone.subtitle?.trim() ||
          "",
      }),
    ) ?? []
  );
}


type CmsTournamentIconicMomentInput = {
  year: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
};

export function mapCmsTournamentIconicMoments(
  moments: readonly CmsTournamentIconicMomentInput[] | null | undefined,
): Masters1000IconicMoment[] {
  return (
    moments?.map(
      (moment) => ({
        year:
          moment.year != null
            ? String(moment.year)
            : "—",

        title:
          moment.title.trim(),

        description:
          moment.description?.trim() ||
          moment.subtitle?.trim() ||
          "",
      }),
    ) ?? []
  );
}


type CmsTournamentGalleryItemInput = {
  imageUrl: string;
  title: string | null;
  eyebrow: string | null;
  caption: string | null;
  alt: string | null;
};

export function mapCmsTournamentGallery(
  items: readonly CmsTournamentGalleryItemInput[] | null | undefined,
  tournamentName: string,
) {
  return (
    items?.map(
      (item) => ({
        src: item.imageUrl,
        title:
          item.title?.trim() ||
          item.alt?.trim() ||
          tournamentName,
        label:
          item.eyebrow?.trim() ||
          "Tournament gallery",
        description:
          item.caption?.trim() ||
          item.alt?.trim() ||
          "",
      }),
    ) ?? []
  );
}


type CmsTournamentEditionInput = {
  year: number;
  endDate: Date | null;
  championName: string | null;
  runnerUpName: string | null;
  championCountryCode: string | null;
  runnerUpCountryCode: string | null;
  score: string | null;
  championPlayer: {
    name: string;
    country: string | null;
  } | null;
  runnerUpPlayer: {
    name: string;
    country: string | null;
  } | null;
};

export function mapCmsTournamentEditions(
  editions: readonly CmsTournamentEditionInput[] | null | undefined,
  venue: string,
): Masters1000Edition[] {
  return (
    editions
      ?.filter(
        (edition) =>
          edition.championName ||
          edition.championPlayer?.name,
      )
      .map(
        (edition) => {
          const championName =
            edition.championPlayer?.name ||
            edition.championName ||
            "Champion not recorded";

          const runnerUpName =
            edition.runnerUpPlayer?.name ||
            edition.runnerUpName ||
            "Runner-up not recorded";

          const championCode =
            edition.championCountryCode?.trim().toUpperCase() ||
            "";

          const runnerUpCode =
            edition.runnerUpCountryCode?.trim().toUpperCase() ||
            "";

          return {
            year:
              edition.year,

            champion: {
              name:
                championName,
              countryCode:
                championCode,
              flag:
                countryCodeToFlag(
                  championCode,
                ),
            },

            runnerUp: {
              name:
                runnerUpName,
              countryCode:
                runnerUpCode,
              flag:
                countryCodeToFlag(
                  runnerUpCode,
                ),
            },

            score:
              edition.score?.trim() ||
              "Score not recorded",

            date:
              formatCmsEditionDate(
                edition.endDate,
              ),

            venue,

            note:
              "Edition recorded in the AGE202 Tournament Studio.",
          };
        },
      ) ?? []
  );
}

export function mapCmsRecentFinals(
  editions: readonly CmsTournamentEditionInput[] | null | undefined,
): Masters1000Final[] {
  return (
    editions
      ?.filter(
        (edition) =>
          Boolean(
            edition.championName ||
              edition.championPlayer?.name,
          ),
      )
      .slice(0, 6)
      .map(
        (edition) => {
          const championCode =
            edition.championCountryCode?.trim().toUpperCase() ||
            "";

          const runnerUpCode =
            edition.runnerUpCountryCode?.trim().toUpperCase() ||
            "";

          return {
            year:
              edition.year,

            champion:
              edition.championPlayer?.name ||
              edition.championName ||
              "Champion not recorded",

            championNation: {
              code:
                championCode,
              name:
                edition.championPlayer?.country ||
                championCode ||
                "Unknown",
              flag:
                countryCodeToFlag(
                  championCode,
                ),
            },

            runnerUp:
              edition.runnerUpPlayer?.name ||
              edition.runnerUpName ||
              "Runner-up not recorded",

            runnerUpNation: {
              code:
                runnerUpCode,
              name:
                edition.runnerUpPlayer?.country ||
                runnerUpCode ||
                "Unknown",
              flag:
                countryCodeToFlag(
                  runnerUpCode,
                ),
            },

            score:
              edition.score?.trim() ||
              "Score not recorded",
          };
        },
      ) ?? []
  );
}


type CmsTournamentChampionInput = {
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
    name: string;
    country: string | null;
  } | null;
};

export function mapCmsTitleLeaders(
  champions: readonly CmsTournamentChampionInput[] | null | undefined,
): Masters1000TitleLeader[] {
  return (
    champions?.map(
      (champion) => {
        const years = [
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
            ) === index,
        );

        const countryCode =
          champion.countryCode?.trim().toUpperCase() ||
          countryNameToCode(
            champion.player?.country ||
            champion.country,
          );

        return {
          player:
            champion.player?.name ||
            champion.name ||
            "Historical champion",

          nation: {
            code:
              countryCode,
            name:
              champion.player?.country ||
              champion.country ||
              "Unknown",
            flag:
              countryCodeToFlag(
                countryCode,
              ),
          },

          titles:
            champion.titles,

          years,
        };
      },
    ) ?? []
  );
}

export function mapCmsLegends(
  champions: readonly CmsTournamentChampionInput[] | null | undefined,
  tournamentName: string,
): Masters1000LegendsData | null {
  const legends =
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
          const playerName =
            champion.player?.name ||
            champion.name ||
            "Historical legend";

          const country =
            champion.player?.country?.trim() ||
            champion.country?.trim() ||
            "Unknown";

          const countryCode =
            champion.countryCode?.trim().toUpperCase() ||
            countryNameToCode(
              country,
            );

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
            name:
              playerName,

            initials:
              getInitials(
                playerName,
              ),

            country,
            countryCode,

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
              `${playerName} is part of the ${tournamentName} championship legacy.`,

            image:
              champion.imageUrl?.trim() ||
              undefined,
          };
        },
      ) ?? [];

  if (
    legends.length === 0
  ) {
    return null;
  }

  return {
    tournamentName,

    eyebrow:
      "Tournament legends",

    title:
      `Legends of ${tournamentName}`,

    description:
      `The champions whose repeat titles, defining runs and lasting records shaped the identity of ${tournamentName}.`,

    legends,
  };
}

type CmsTournamentPageDataInput =
  CmsTournamentIdentityInput & {
    heroImage: string | null;
    galleryItems: readonly CmsTournamentGalleryItemInput[];
    milestones: readonly CmsTournamentMilestoneInput[];
    chapters: readonly CmsMuseumChapterInput[];
    iconicMoments: readonly CmsTournamentIconicMomentInput[];
    editions: readonly CmsTournamentEditionInput[];
    champions: readonly CmsTournamentChampionInput[];
  };

export function mapCmsTournamentPageData(
  cmsTournament: CmsTournamentPageDataInput | null | undefined,
  staticTournament: TournamentConfig,
) {
  const tournament =
    mapCmsTournamentConfig(
      cmsTournament,
      staticTournament,
    );

  const heroImage =
    resolveTournamentHeroImage(
      cmsTournament?.heroImage,
      staticTournament,
    );

  const cmsGalleryImages =
    mapCmsTournamentGallery(
      cmsTournament?.galleryItems,
      tournament.name,
    );

  const cmsTimelineEntries =
    mapCmsTournamentTimeline(
      cmsTournament?.milestones,
    );

  const publicTimelineEntries =
    resolveTournamentTimeline(
      cmsTimelineEntries,
      tournament.timeline,
    );

  const {
    placeChapter,
    archiveChapter,
  } = mapCmsMuseumChapters(
    cmsTournament?.chapters,
    tournament,
  );

  const cmsIconicMoments =
    mapCmsTournamentIconicMoments(
      cmsTournament?.iconicMoments,
    );

  const publicIconicMoments =
    resolveTournamentIconicMoments(
      cmsIconicMoments,
      tournament.iconicMoments,
    );

  const cmsEditions =
    mapCmsTournamentEditions(
      cmsTournament?.editions,
      tournament.venue,
    );

  const cmsRecentFinals =
    mapCmsRecentFinals(
      cmsTournament?.editions,
    );

  const cmsTitleLeaders =
    mapCmsTitleLeaders(
      cmsTournament?.champions,
    );

  const cmsLegends =
    mapCmsLegends(
      cmsTournament?.champions,
      tournament.name,
    );

  return {
    tournament,
    heroImage,
    cmsGalleryImages,
    publicTimelineEntries,
    placeChapter,
    archiveChapter,
    publicIconicMoments,
    cmsEditions,
    cmsRecentFinals,
    cmsTitleLeaders,
    cmsLegends,
  };
}