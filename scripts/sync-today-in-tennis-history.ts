import "dotenv/config";

import {
  MuseumPageStatus,
  TennisHistoryEntryType,
  TennisHistoryEra,
} from "../generated/prisma/client";

import { prisma } from "../lib/prisma";

const TIME_ZONE = "Europe/Rome";

const WIKIPEDIA_API_URL =
  "https://en.wikipedia.org/w/api.php";

const WIKIPEDIA_BASE_URL =
  "https://en.wikipedia.org/wiki/";

const WRITE_MODE =
  process.argv.includes("--write");

const MAX_FALLBACK_PAGES = 30;

type RomeDate = {
  year: number;
  month: number;
  day: number;
  monthName: string;
  isoDate: string;
};

type WikipediaSection = {
  toclevel?: number;
  level?: string;
  line?: string;
  number?: string;
  index?: string;
};

type WikipediaSectionsResponse = {
  parse?: {
    title?: string;
    pageid?: number;
    sections?: WikipediaSection[];
  };
};

type WikipediaHtmlResponse = {
  parse?: {
    title?: string;
    pageid?: number;
    text?: {
      "*"?: string;
    };
  };
};

type WikipediaSearchResult = {
  pageid: number;
  title: string;
  snippet?: string;
};

type WikipediaSearchResponse = {
  query?: {
    search?: WikipediaSearchResult[];
  };
};

type WikipediaWikitextResponse = {
  parse?: {
    title?: string;
    pageid?: number;
    wikitext?: {
      "*"?: string;
    };
  };
};

type TennisCandidate = {
  pageId: number;
  pageTitle: string;
  sourceUrl: string;
  sentence: string;
  year: number;
  score: number;
  source:
    | "DATE_PAGE"
    | "SEARCH_FALLBACK";
};

function getRomeDate(): RomeDate {
  const now = new Date();

  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "long",
        day: "2-digit",
      },
    );

  const parts =
    formatter.formatToParts(now);

  const year = Number(
    parts.find(
      (part) =>
        part.type === "year",
    )?.value,
  );

  const monthName =
    parts.find(
      (part) =>
        part.type === "month",
    )?.value ?? "";

  const day = Number(
    parts.find(
      (part) =>
        part.type === "day",
    )?.value,
  );

  const numericMonthParts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: TIME_ZONE,
        month: "2-digit",
      },
    ).formatToParts(now);

  const month = Number(
    numericMonthParts.find(
      (part) =>
        part.type === "month",
    )?.value,
  );

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(
      "Unable to determine today's date in Europe/Rome.",
    );
  }

  const isoDate = [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");

  return {
    year,
    month,
    day,
    monthName,
    isoDate,
  };
}

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(
  value: string,
): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#039;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#8211;/gi, "–")
    .replace(/&#8212;/gi, "—")
    .replace(/&#160;/gi, " ")
    .replace(
      /&#(\d+);/g,
      (
        _match,
        code: string,
      ) => {
        const numericCode =
          Number(code);

        if (
          !Number.isFinite(
            numericCode,
          )
        ) {
          return "";
        }

        return String.fromCharCode(
          numericCode,
        );
      },
    );
}

function stripHtml(
  value: string,
): string {
  return normalizeWhitespace(
    decodeHtmlEntities(
      value
        .replace(
          /<sup\b[^>]*>[\s\S]*?<\/sup>/gi,
          "",
        )
        .replace(
          /<style\b[^>]*>[\s\S]*?<\/style>/gi,
          "",
        )
        .replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/gi,
          "",
        )
        .replace(
          /<[^>]+>/g,
          " ",
        ),
    ),
  );
}

function stripWikiMarkup(
  value: string,
): string {
  return normalizeWhitespace(
    value
      .replace(
        /<ref\b[^>]*>[\s\S]*?<\/ref>/gi,
        " ",
      )
      .replace(
        /<ref\b[^>]*\/>/gi,
        " ",
      )
      .replace(
        /\{\{[^{}]*\}\}/g,
        " ",
      )
      .replace(
        /\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g,
        "$1",
      )
      .replace(
        /\[(?:https?:\/\/[^\s\]]+)\s*([^\]]*)\]/g,
        "$1",
      )
      .replace(
        /'''?/g,
        "",
      )
      .replace(
        /==+/g,
        " ",
      ),
  );
}

function buildWikipediaUrl(
  title: string,
): string {
  return (
    WIKIPEDIA_BASE_URL +
    encodeURIComponent(
      title.replace(
        / /g,
        "_",
      ),
    )
  );
}

function getWikipediaHeaders():
  Record<string, string> {
  return {
    Accept: "application/json",
    "User-Agent":
      "AGE202/1.0 (https://www.age202.com; Digital Tennis Museum)",
  };
}

function containsTennisContext(
  value: string,
): boolean {
  const text =
    value.toLowerCase();

  const strongTerms = [
    "tennis",
    "atp",
    "wta",
    "wimbledon",
    "roland garros",
    "french open",
    "australian open",
    "us open tennis",
    "u.s. open tennis",
    "grand slam tennis",
    "davis cup",
    "fed cup",
    "billie jean king cup",
    "laver cup",
    "tennis player",
    "tennis tournament",
    "tennis championship",
  ];

  return strongTerms.some(
    (term) =>
      text.includes(term),
  );
}

function isBiographicalDateEvent(
  value: string,
): boolean {
  const text =
    ` ${value.toLowerCase()} `;

  const excludedTerms = [
    " born ",
    " was born ",
    " birthday",
    " birth date",
    " date of birth",
    " died ",
    " death ",
    " passed away",
    " was killed",
  ];

  return excludedTerms.some(
    (term) =>
      text.includes(term),
  );
}

function scoreCandidate(
  candidate: Omit<
    TennisCandidate,
    "score"
  >,
): number {
  if (
    isBiographicalDateEvent(
      candidate.sentence,
    )
  ) {
    return -1000;
  }

  const text =
    `${candidate.pageTitle} ${candidate.sentence}`
      .toLowerCase();

  let score = 0;

  if (
    candidate.source ===
    "DATE_PAGE"
  ) {
    score += 35;
  }

  if (
    text.includes("tennis")
  ) {
    score += 35;
  }

  if (
    text.includes("wimbledon")
  ) {
    score += 35;
  }

  if (
    text.includes("roland garros") ||
    text.includes("french open")
  ) {
    score += 35;
  }

  if (
    text.includes("australian open")
  ) {
    score += 35;
  }

  if (
    text.includes("us open") ||
    text.includes("u.s. open") ||
    text.includes(
      "u.s. national championships",
    ) ||
    text.includes(
      "us national championships",
    )
  ) {
    score += 40;
  }

  if (
    text.includes("grand slam")
  ) {
    score += 25;
  }

  if (
    text.includes("davis cup")
  ) {
    score += 22;
  }

  if (
    text.includes("championship") ||
    text.includes("championships")
  ) {
    score += 20;
  }

  if (
    text.includes("tournament")
  ) {
    score += 18;
  }

  if (
    text.includes("won") ||
    text.includes("wins") ||
    text.includes("defeated") ||
    text.includes(
      "claimed the title",
    )
  ) {
    score += 25;
  }

  if (
    text.includes("final")
  ) {
    score += 15;
  }

  if (
    text.includes("record")
  ) {
    score += 12;
  }

  if (
    text.includes("world no. 1") ||
    text.includes(
      "world number one",
    )
  ) {
    score += 15;
  }

  if (
    candidate.year >= 1968
  ) {
    score += 8;
  }

  return score;
}

function extractLeadingYear(
  value: string,
): number | null {
  const match =
    value.match(
      /^\s*(18\d{2}|19\d{2}|20\d{2})\b/,
    );

  if (
    !match?.[1]
  ) {
    return null;
  }

  return Number(
    match[1],
  );
}

function extractAnyYear(
  value: string,
  currentYear: number,
): number | null {
  const years =
    Array.from(
      value.matchAll(
        /\b(18\d{2}|19\d{2}|20\d{2})\b/g,
      ),
    )
      .map(
        (match) =>
          Number(match[1]),
      )
      .filter(
        (year) =>
          year >= 1800 &&
          year <= currentYear,
      );

  return years[0] ?? null;
}

function getDatePageTitle(
  date: RomeDate,
): string {
  return (
    `${date.monthName} ${date.day}`
  );
}

async function fetchDatePageSections(
  pageTitle: string,
): Promise<
  WikipediaSection[]
> {
  const params =
    new URLSearchParams({
      action: "parse",
      format: "json",
      origin: "*",
      page: pageTitle,
      prop: "sections",
    });

  const response =
    await fetch(
      `${WIKIPEDIA_API_URL}?${params.toString()}`,
      {
        headers:
          getWikipediaHeaders(),
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Wikipedia sections request failed with status ${response.status}.`,
    );
  }

  const data =
    (await response.json()) as
      WikipediaSectionsResponse;

  return (
    data.parse?.sections ??
    []
  );
}

function findEventsSectionIndex(
  sections: WikipediaSection[],
): string | null {
  const section =
    sections.find(
      (item) =>
        item.line
          ?.trim()
          .toLowerCase() ===
        "events",
    );

  return (
    section?.index ??
    null
  );
}

async function fetchDateEventsHtml(
  pageTitle: string,
  sectionIndex: string,
): Promise<{
  pageId: number;
  pageTitle: string;
  html: string;
}> {
  const params =
    new URLSearchParams({
      action: "parse",
      format: "json",
      origin: "*",
      page: pageTitle,
      prop: "text",
      section: sectionIndex,
      disableeditsection: "1",
    });

  const response =
    await fetch(
      `${WIKIPEDIA_API_URL}?${params.toString()}`,
      {
        headers:
          getWikipediaHeaders(),
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Wikipedia Events request failed with status ${response.status}.`,
    );
  }

  const data =
    (await response.json()) as
      WikipediaHtmlResponse;

  const html =
    data.parse?.text?.["*"] ??
    "";

  return {
    pageId:
      data.parse?.pageid ??
      0,

    pageTitle:
      data.parse?.title ??
      pageTitle,

    html,
  };
}

function extractListItemsFromHtml(
  html: string,
): string[] {
  const matches =
    Array.from(
      html.matchAll(
        /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
      ),
    );

  return matches
    .map(
      (match) =>
        stripHtml(
          match[1] ?? "",
        ),
    )
    .filter(Boolean);
}

function buildCandidatesFromDatePage(
  pageId: number,
  pageTitle: string,
  items: string[],
  date: RomeDate,
): TennisCandidate[] {
  const candidates:
    TennisCandidate[] = [];

  for (
    const item
    of items
  ) {
    if (
      isBiographicalDateEvent(
        item,
      )
    ) {
      continue;
    }

    if (
      !containsTennisContext(
        item,
      )
    ) {
      continue;
    }

    const year =
      extractLeadingYear(item) ??
      extractAnyYear(
        item,
        date.year,
      );

    if (
      !year ||
      year > date.year
    ) {
      continue;
    }

    const baseCandidate:
      Omit<
        TennisCandidate,
        "score"
      > = {
      pageId,
      pageTitle,
      sourceUrl:
        buildWikipediaUrl(
          pageTitle,
        ),
      sentence: item,
      year,
      source:
        "DATE_PAGE",
    };

    candidates.push({
      ...baseCandidate,
      score:
        scoreCandidate(
          baseCandidate,
        ),
    });
  }

  return candidates;
}

async function searchWikipedia(
  date: RomeDate,
): Promise<
  WikipediaSearchResult[]
> {
  const phrase =
    `${date.monthName} ${date.day}`;

  const queries = [
    `"${phrase}" tennis`,
    `"${phrase}" "US Open"`,
    `"${phrase}" Wimbledon`,
    `"${phrase}" "Australian Open"`,
    `"${phrase}" "French Open"`,
    `"${phrase}" "Roland Garros"`,
    `"${phrase}" ATP`,
    `"${phrase}" WTA`,
    `"${phrase}" "Davis Cup"`,
  ];

  const results =
    new Map<
      number,
      WikipediaSearchResult
    >();

  for (
    const query
    of queries
  ) {
    const params =
      new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        list: "search",
        srsearch: query,
        srnamespace: "0",
        srlimit: "20",
      });

    const response =
      await fetch(
        `${WIKIPEDIA_API_URL}?${params.toString()}`,
        {
          headers:
            getWikipediaHeaders(),
        },
      );

    if (
      !response.ok
    ) {
      console.warn(
        `⚠️ Search fallita: ${query}`,
      );

      continue;
    }

    const data =
      (await response.json()) as
        WikipediaSearchResponse;

    for (
      const result
      of data.query?.search ??
      []
    ) {
      if (
        !results.has(
          result.pageid,
        )
      ) {
        results.set(
          result.pageid,
          result,
        );
      }

      if (
        results.size >=
        MAX_FALLBACK_PAGES
      ) {
        break;
      }
    }

    if (
      results.size >=
      MAX_FALLBACK_PAGES
    ) {
      break;
    }
  }

  return Array.from(
    results.values(),
  ).slice(
    0,
    MAX_FALLBACK_PAGES,
  );
}

async function fetchPageWikitext(
  title: string,
): Promise<{
  pageId: number;
  pageTitle: string;
  wikitext: string;
} | null> {
  const params =
    new URLSearchParams({
      action: "parse",
      format: "json",
      origin: "*",
      page: title,
      prop: "wikitext",
    });

  const response =
    await fetch(
      `${WIKIPEDIA_API_URL}?${params.toString()}`,
      {
        headers:
          getWikipediaHeaders(),
      },
    );

  if (
    !response.ok
  ) {
    return null;
  }

  const data =
    (await response.json()) as
      WikipediaWikitextResponse;

  const wikitext =
    data.parse
      ?.wikitext?.["*"];

  if (
    !wikitext
  ) {
    return null;
  }

  return {
    pageId:
      data.parse?.pageid ??
      0,

    pageTitle:
      data.parse?.title ??
      title,

    wikitext,
  };
}

function containsExactDate(
  value: string,
  date: RomeDate,
): boolean {
  const month =
    date.monthName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const monthFirst =
    new RegExp(
      `\\b${month}\\s+${date.day}(?:st|nd|rd|th)?\\b`,
      "i",
    );

  const dayFirst =
    new RegExp(
      `\\b${date.day}(?:st|nd|rd|th)?\\s+${month}\\b`,
      "i",
    );

  return (
    monthFirst.test(value) ||
    dayFirst.test(value)
  );
}

function buildFallbackCandidatesFromPage(
  page: {
    pageId: number;
    pageTitle: string;
    wikitext: string;
  },
  date: RomeDate,
): TennisCandidate[] {
  const lines =
    page.wikitext
      .split(/\r?\n/)
      .map(stripWikiMarkup)
      .map(
        normalizeWhitespace,
      )
      .filter(Boolean);

  const candidates:
    TennisCandidate[] = [];

  for (
    let index = 0;
    index < lines.length;
    index += 1
  ) {
    const current =
      lines[index];

    if (
      !containsExactDate(
        current,
        date,
      )
    ) {
      continue;
    }

    const previous =
      index > 0
        ? lines[index - 1]
        : "";

    const next =
      index <
      lines.length - 1
        ? lines[index + 1]
        : "";

    const combined =
      normalizeWhitespace(
        `${previous} ${current} ${next}`,
      );

    if (
      isBiographicalDateEvent(
        combined,
      )
    ) {
      continue;
    }

    if (
      !containsTennisContext(
        `${page.pageTitle} ${combined}`,
      )
    ) {
      continue;
    }

    const year =
      extractAnyYear(
        combined,
        date.year,
      );

    if (
      !year ||
      year > date.year
    ) {
      continue;
    }

    const baseCandidate:
      Omit<
        TennisCandidate,
        "score"
      > = {
      pageId:
        page.pageId,

      pageTitle:
        page.pageTitle,

      sourceUrl:
        buildWikipediaUrl(
          page.pageTitle,
        ),

      sentence:
        combined,

      year,

      source:
        "SEARCH_FALLBACK",
    };

    candidates.push({
      ...baseCandidate,
      score:
        scoreCandidate(
          baseCandidate,
        ),
    });
  }

  return candidates;
}

async function getFallbackCandidates(
  date: RomeDate,
): Promise<
  TennisCandidate[]
> {
  console.log(
    "\n🔍 Avvio ricerca Wikipedia estesa...",
  );

  const searchResults =
    await searchWikipedia(
      date,
    );

  console.log(
    `📚 Pagine fallback trovate: ${searchResults.length}`,
  );

  const candidates:
    TennisCandidate[] = [];

  for (
    const result
    of searchResults
  ) {
    const page =
      await fetchPageWikitext(
        result.title,
      );

    if (
      !page
    ) {
      continue;
    }

    candidates.push(
      ...buildFallbackCandidatesFromPage(
        page,
        date,
      ),
    );
  }

  return candidates;
}

function sortCandidates(
  candidates:
    TennisCandidate[],
): TennisCandidate[] {
  const unique =
    new Map<
      string,
      TennisCandidate
    >();

  for (
    const candidate
    of candidates
  ) {
    const key = [
      candidate.year,
      candidate.pageTitle,
      candidate.sentence,
    ].join("::");

    const existing =
      unique.get(key);

    if (
      !existing ||
      candidate.score >
        existing.score
    ) {
      unique.set(
        key,
        candidate,
      );
    }
  }

  return Array.from(
    unique.values(),
  )
    .filter(
      (candidate) =>
        candidate.score >= 0,
    )
    .sort(
      (
        first,
        second,
      ) => {
        if (
          first.score !==
          second.score
        ) {
          return (
            second.score -
            first.score
          );
        }

        return (
          second.year -
          first.year
        );
      },
    );
}

function cleanPageTitle(
  value: string,
): string {
  return value
    .replace(
      /\s*\(tennis\)\s*/gi,
      "",
    )
    .trim();
}

function isTournamentStartText(
  value: string,
): boolean {
  const text =
    value.toLowerCase();

  return (
    text.includes("began") ||
    text.includes("begins") ||
    text.includes("started") ||
    text.includes("opened") ||
    text.includes("ran from") ||
    text.includes("held from") ||
    text.includes("took place from")
  );
}

function buildMuseumTitle(
  candidate: TennisCandidate,
): string {
  const text =
    candidate.sentence
      .toLowerCase();

  const pageTitle =
    cleanPageTitle(
      candidate.pageTitle,
    );

  const startsTournament =
    isTournamentStartText(
      candidate.sentence,
    );

  if (
    (
      text.includes("us open") ||
      text.includes("u.s. open")
    ) &&
    startsTournament
  ) {
    return (
      `The ${candidate.year} US Open Begins`
    );
  }

  if (
    text.includes("wimbledon") &&
    startsTournament
  ) {
    return (
      `Wimbledon ${candidate.year} Begins`
    );
  }

  if (
    (
      text.includes("french open") ||
      text.includes("roland garros")
    ) &&
    startsTournament
  ) {
    return (
      `Roland Garros ${candidate.year} Begins`
    );
  }

  if (
    text.includes(
      "australian open",
    ) &&
    startsTournament
  ) {
    return (
      `Australian Open ${candidate.year} Begins`
    );
  }

  return pageTitle;
}

function buildDescription(
  candidate: TennisCandidate,
  date: RomeDate,
): string {
  const raw =
    normalizeWhitespace(
      candidate.sentence,
    );

  const pageTitle =
    cleanPageTitle(
      candidate.pageTitle,
    );

  const text =
    raw.toLowerCase();

  const startsTournament =
    isTournamentStartText(raw);

  if (
    (
      text.includes("us open") ||
      text.includes("u.s. open")
    ) &&
    startsTournament
  ) {
    return (
      `On ${date.monthName} ${date.day}, ${candidate.year}, ` +
      `the ${pageTitle} began in New York, marking the start ` +
      "of the final Grand Slam tournament of the tennis season."
    );
  }

  if (
    text.includes("wimbledon") &&
    startsTournament
  ) {
    return (
      `On ${date.monthName} ${date.day}, ${candidate.year}, ` +
      `${pageTitle} began at the All England Club in London, ` +
      "opening another chapter in the history of the Championships."
    );
  }

  if (
    (
      text.includes("french open") ||
      text.includes("roland garros")
    ) &&
    startsTournament
  ) {
    return (
      `On ${date.monthName} ${date.day}, ${candidate.year}, ` +
      `${pageTitle} began in Paris, marking another chapter ` +
      "in the history of the clay-court Grand Slam."
    );
  }

  if (
    text.includes(
      "australian open",
    ) &&
    startsTournament
  ) {
    return (
      `On ${date.monthName} ${date.day}, ${candidate.year}, ` +
      `${pageTitle} began in Australia, marking another chapter ` +
      "in the history of the season's opening Grand Slam."
    );
  }

  if (
    raw.length <= 420
  ) {
    return raw;
  }

  return (
    raw
      .slice(0, 417)
      .trimEnd() +
    "..."
  );
}

function determineEra(
  year: number,
): TennisHistoryEra {
  if (
    year < 1877
  ) {
    return (
      TennisHistoryEra.ORIGINS
    );
  }

  if (
    year < 1968
  ) {
    return (
      TennisHistoryEra.CLASSIC_ERA
    );
  }

  if (
    year < 2000
  ) {
    return (
      TennisHistoryEra.OPEN_ERA
    );
  }

  return (
    TennisHistoryEra.MODERN_ERA
  );
}

function slugify(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .slice(0, 70);
}

function buildEntrySlug(
  candidate:
    TennisCandidate,
  date:
    RomeDate,
): string {
  return [
    "today-in-tennis-history",
    candidate.year,
    String(
      date.month,
    ).padStart(2, "0"),
    String(
      date.day,
    ).padStart(2, "0"),
    slugify(
      candidate.pageTitle,
    ),
    candidate.pageId,
  ].join("-");
}

async function findExistingEntry(
  date: RomeDate,
) {
  return prisma
    .tennisHistoryEntry
    .findFirst({
      where: {
        month:
          date.month,

        day:
          date.day,

        status:
          MuseumPageStatus.PUBLISHED,
      },

      orderBy: [
        {
          featured:
            "desc",
        },
        {
          sortOrder:
            "asc",
        },
        {
          year:
            "desc",
        },
      ],

      select: {
        id: true,
        slug: true,
        year: true,
        title: true,
        featured: true,
      },
    });
}

async function saveCandidate(
  candidate:
    TennisCandidate,
  date:
    RomeDate,
) {
  const slug =
    buildEntrySlug(
      candidate,
      date,
    );

  const existing =
    await prisma
      .tennisHistoryEntry
      .findUnique({
        where: {
          slug,
        },

        select: {
          id: true,
          slug: true,
          title: true,
        },
      });

  if (
    existing
  ) {
    console.log(
      "\nℹ️ Entry già presente.",
    );

    return existing;
  }

  return prisma
    .tennisHistoryEntry
    .create({
      data: {
        type:
          TennisHistoryEntryType.MILESTONE,

        slug,

        year:
          candidate.year,

        month:
          date.month,

        day:
          date.day,

        sortOrder:
          1000,

        era:
          determineEra(
            candidate.year,
          ),

        gender:
          null,

        eyebrow:
          "Today in Tennis History",

        title:
          buildMuseumTitle(
            candidate,
          ),

        subtitle:
          `${date.monthName} ${date.day}, ${candidate.year}`,

        description:
          buildDescription(
            candidate,
            date,
          ),

        quote:
          null,

        achievement:
          null,

        period:
          null,

        country:
          null,

        countryCode:
          null,

        playerOne:
          null,

        playerTwo:
          null,

        players: [],

        href:
          candidate.sourceUrl,

        imageUrl:
          null,

        mediaId:
          null,

        featured:
          false,

        status:
          MuseumPageStatus.PUBLISHED,

        publishedAt:
          new Date(),
      },

      select: {
        id: true,
        slug: true,
        year: true,
        month: true,
        day: true,
        title: true,
        description: true,
        href: true,
        status: true,
      },
    });
}

function printCandidates(
  candidates:
    TennisCandidate[],
) {
  console.log(
    "\n🏆 TOP CANDIDATES",
  );

  for (
    const candidate
    of candidates.slice(
      0,
      5,
    )
  ) {
    console.log(
      "\n------------------------------------",
    );

    console.log(
      `Score: ${candidate.score}`,
    );

    console.log(
      `Source: ${candidate.source}`,
    );

    console.log(
      `Year: ${candidate.year}`,
    );

    console.log(
      `Page: ${candidate.pageTitle}`,
    );

    console.log(
      `Event: ${candidate.sentence}`,
    );

    console.log(
      `URL: ${candidate.sourceUrl}`,
    );
  }
}

async function main() {
  const date =
    getRomeDate();

  console.log(
    "\n🎾 AGE202 — Today in Tennis History",
  );

  console.log(
    "====================================",
  );

  console.log(
    `📅 Data AGE202: ${date.day} ${date.monthName} ${date.year}`,
  );

  console.log(
    `🌍 Timezone: ${TIME_ZONE}`,
  );

  console.log(
    `🧪 Modalità: ${
      WRITE_MODE
        ? "WRITE"
        : "DRY RUN"
    }`,
  );

  console.log(
    "\n🔎 Controllo database AGE202...",
  );

  const existingEntry =
    await findExistingEntry(
      date,
    );

  if (
    existingEntry
  ) {
    console.log(
      "\n✅ Esiste già una voce pubblicata per oggi.",
    );

    console.log(
      `${existingEntry.year} — ${existingEntry.title}`,
    );

    console.log(
      `Slug: ${existingEntry.slug}`,
    );

    console.log(
      "\nNessuna nuova entry necessaria.",
    );

    return;
  }

  console.log(
    "ℹ️ Nessuna voce pubblicata trovata per questa data.",
  );

  const datePageTitle =
    getDatePageTitle(
      date,
    );

  console.log(
    `\n📅 Analisi pagina Wikipedia: ${datePageTitle}`,
  );

  const sections =
    await fetchDatePageSections(
      datePageTitle,
    );

  const eventsSectionIndex =
    findEventsSectionIndex(
      sections,
    );

  let candidates:
    TennisCandidate[] = [];

  if (
    eventsSectionIndex
  ) {
    console.log(
      `✅ Sezione Events trovata: index ${eventsSectionIndex}`,
    );

    const events =
      await fetchDateEventsHtml(
        datePageTitle,
        eventsSectionIndex,
      );

    const items =
      extractListItemsFromHtml(
        events.html,
      );

    console.log(
      `📚 Eventi del giorno analizzati: ${items.length}`,
    );

    candidates =
      buildCandidatesFromDatePage(
        events.pageId,
        events.pageTitle,
        items,
        date,
      );

    console.log(
      `🎾 Eventi tennis trovati nella pagina del giorno: ${candidates.length}`,
    );
  } else {
    console.log(
      "⚠️ Sezione Events non trovata.",
    );
  }

  if (
    candidates.length === 0
  ) {
    console.log(
      "\nℹ️ Nessun evento tennis nella pagina principale del giorno.",
    );

    const fallbackCandidates =
      await getFallbackCandidates(
        date,
      );

    candidates.push(
      ...fallbackCandidates,
    );
  }

  const sortedCandidates =
    sortCandidates(
      candidates,
    );

  if (
    sortedCandidates.length ===
    0
  ) {
    console.log(
      "\n⚠️ Nessun evento tennistico sufficientemente pertinente trovato.",
    );

    console.log(
      "Il database NON è stato modificato.",
    );

    return;
  }

  printCandidates(
    sortedCandidates,
  );

  const selected =
    sortedCandidates[0];

  console.log(
    "\n====================================",
  );

  console.log(
    "⭐ EVENTO SELEZIONATO",
  );

  console.log(
    "====================================",
  );

  console.log(
    `Anno: ${selected.year}`,
  );

  console.log(
    `Titolo museo: ${buildMuseumTitle(
      selected,
    )}`,
  );

  console.log(
    `Fonte ricerca: ${selected.source}`,
  );

  console.log(
    `Descrizione: ${buildDescription(
      selected,
      date,
    )}`,
  );

  console.log(
    `Fonte: ${selected.sourceUrl}`,
  );

  console.log(
    `Score: ${selected.score}`,
  );

  console.log(
    `Slug: ${buildEntrySlug(
      selected,
      date,
    )}`,
  );

  if (
    !WRITE_MODE
  ) {
    console.log(
      "\n🧪 DRY RUN completato.",
    );

    console.log(
      "✅ Il database NON è stato modificato.",
    );

    console.log(
      "\nPer salvare questo evento:",
    );

    console.log(
      "npx tsx scripts/sync-today-in-tennis-history.ts --write",
    );

    return;
  }

  console.log(
    "\n💾 Salvataggio nel database AGE202...",
  );

  const saved =
    await saveCandidate(
      selected,
      date,
    );

  console.log(
    "\n✅ Today in Tennis History salvato.",
  );

  console.log(saved);
}

main()
  .catch(
    (error) => {
      console.error(
        "\n❌ Today in Tennis History sync failed.",
      );

      console.error(
        error,
      );

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );