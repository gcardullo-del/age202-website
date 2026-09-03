import {
   createHash,
} from "node:crypto";

import {
  chromium,
  type Locator,
} from "playwright";


export type ExtractedAtpDailyMatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED";


export type ExtractedAtpDailyPlayer = {
  name: string;
  href: string | null;
  profileSlug: string | null;
  externalId: string | null;
};


export type ExtractedAtpDailyMatch = {
  externalId: string;

  playerOne:
    ExtractedAtpDailyPlayer;

  playerTwo:
    ExtractedAtpDailyPlayer;

  status:
    ExtractedAtpDailyMatchStatus;

  scheduledAt:
    Date | null;

  court:
    string | null;

  roundLabel:
    string | null;

  winner:
    ExtractedAtpDailyPlayer | null;

  score:
    string | null;

  sourceText:
    string;
};


export type ExtractedAtpDailyMatches = {
  source: "ATP";

  sourceUrl: string;

  tournamentSlug: string;

  tournamentId: string;

  year: number;

  scheduleDate: string;

  scheduleLabel:
    string | null;

  matches:
    ExtractedAtpDailyMatch[];

  extractedAt:
    Date;
};


export type ExtractAtpDailyMatchesInput = {
  tournamentSlug: string;

  tournamentId: string;

  year: number;

  date?: string;
};


type PlayerLinkData = {
  text: string;
  href: string;
};


const ATP_TOURNAMENT_TIME_ZONES: Record<string, string> = {
  "560": "America/New_York",
};


const ATP_NAVIGATION_TIMEOUT_MS =
  30_000;

const ATP_ELEMENT_TIMEOUT_MS =
  2_500;

const ATP_SCHEDULE_WAIT_TIMEOUT_MS =
  15_000;

const ATP_DOM_SETTLE_MS =
  1_500;


function resolveTournamentTimeZone(
  tournamentId: string,
): string | null {
  return ATP_TOURNAMENT_TIME_ZONES[
    normalizeText(tournamentId)
  ] ?? null;
}


function normalizeText(
  value:
    | string
    | null
    | undefined,
): string {
  return (
    value
      ?.replace(
        /\u00a0/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim() ??
    ""
  );
}


function normalizeSlug(
  value:
    | string
    | null
    | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  return normalized ||
    null;
}


function stripPlayerDecorations(
  value: string,
): string {
  let normalized =
    normalizeText(
      value,
    );

  normalized =
    normalized.replace(
      /^\s*\((?:\d+|Q|WC|LL|PR|SE|ALT)\)\s*/i,
      "",
    );

  normalized =
    normalized.replace(
      /\s*\((?:\d+|Q|WC|LL|PR|SE|ALT)\)\s*$/i,
      "",
    );

  return normalizeText(
    normalized,
  );
}


function parsePlayer(
  text: string,
  href: string | null,
): ExtractedAtpDailyPlayer {
  const name =
    stripPlayerDecorations(
      text,
    );

  if (!href) {
    return {
      name,
      href: null,
      profileSlug: null,
      externalId: null,
    };
  }

  const match =
    href.match(
      /\/players\/([^/]+)\/([^/?#]+)/i,
    );

  return {
    name,

    href,

    profileSlug:
      normalizeSlug(
        match?.[1],
      ),

    externalId:
      normalizeText(
        match?.[2],
      )
        .toUpperCase() ||
      null,
  };
}


function isSinglesPlayerOverviewHref(
  href: string,
): boolean {
  return (
    /\/players\/[^/]+\/[^/?#]+\/overview(?:[?#].*)?$/i.test(
      href,
    )
  );
}


function createMatchExternalId(
  playerOne:
    ExtractedAtpDailyPlayer,

  playerTwo:
    ExtractedAtpDailyPlayer,

  roundLabel:
    string | null,
): string {
  const playerKeys = [
    playerOne.externalId ??
      playerOne.profileSlug ??
      playerOne.name.toLowerCase(),

    playerTwo.externalId ??
      playerTwo.profileSlug ??
      playerTwo.name.toLowerCase(),
  ].sort();

  const digest =
    createHash(
      "sha256",
    )
      .update(
        `${
          roundLabel ??
          "unknown-round"
        }:${playerKeys.join(":")}`,
      )
      .digest(
        "hex",
      )
      .slice(
        0,
        20,
      );

  return `atp:daily:${digest}`;
}


function isSecurityPage(
  text: string,
): boolean {
  return (
    /performing security verification/i.test(
      text,
    ) ||
    /protect against malicious bots/i.test(
      text,
    ) ||
    /cloudflare/i.test(
      text,
    )
  );
}


function parseRoundLabel(
  value: string,
): string | null {
  const text =
    normalizeText(
      value,
    );

  const shortRound =
    text.match(
      /\bR(128|64|32|16)\b/i,
    );

  if (shortRound) {
    return `Round of ${shortRound[1]}`;
  }

  if (
    /\bQF\b/i.test(
      text,
    )
  ) {
    return "Quarterfinal";
  }

  if (
    /\bSF\b/i.test(
      text,
    )
  ) {
    return "Semifinal";
  }

  if (
    /\bF\b/i.test(
      text,
    )
  ) {
    return "Final";
  }

  const longPatterns = [
    /\bRound of 128\b/i,
    /\bRound of 64\b/i,
    /\bRound of 32\b/i,
    /\bRound of 16\b/i,
    /\bQuarter[- ]?Finals?\b/i,
    /\bSemi[- ]?Finals?\b/i,
    /\bFinal\b/i,
  ];

  for (
    const pattern
    of longPatterns
  ) {
    const match =
      text.match(
        pattern,
      );

    if (match?.[0]) {
      return normalizeText(
        match[0],
      );
    }
  }

  return text ||
    null;
}


function resolveRequestedDate(
  value:
    | string
    | undefined,
): string {
  if (value) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        value,
      )
    ) {
      throw new Error(
        `Invalid date: ${value}. Expected YYYY-MM-DD.`,
      );
    }

    const parsed =
      new Date(
        `${value}T12:00:00.000Z`,
      );

    if (
      Number.isNaN(
        parsed.getTime(),
      )
    ) {
      throw new Error(
        `Invalid date: ${value}.`,
      );
    }

    return value;
  }

  return new Date()
    .toISOString()
    .slice(
      0,
      10,
    );
}


function parseClockTime(
  text: string,
): {
  hours: number;
  minutes: number;
} | null {
  const match =
    text.match(
      /\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/i,
    );

  if (!match) {
    return null;
  }

  let hours =
    Number.parseInt(
      match[1],
      10,
    );

  const minutes =
    Number.parseInt(
      match[2],
      10,
    );

  const period =
    match[3]
      .toUpperCase();

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  return {
    hours,
    minutes,
  };
}


function getTimeZoneOffsetMilliseconds(
  value: Date,
  timeZone: string,
): number {
  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    },
  ).formatToParts(value);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number.parseInt(values.year, 10),
    Number.parseInt(values.month, 10) - 1,
    Number.parseInt(values.day, 10),
    Number.parseInt(values.hour, 10),
    Number.parseInt(values.minute, 10),
    Number.parseInt(values.second, 10),
  );

  return asUtc - value.getTime();
}


function createUtcDateFromTournamentLocalTime(
  date: string,
  hours: number,
  minutes: number,
  timeZone: string,
): Date | null {
  const [yearText, monthText, dayText] =
    date.split("-");

  const wallClockUtc = Date.UTC(
    Number.parseInt(yearText, 10),
    Number.parseInt(monthText, 10) - 1,
    Number.parseInt(dayText, 10),
    hours,
    minutes,
    0,
    0,
  );

  if (Number.isNaN(wallClockUtc)) {
    return null;
  }

  let candidate = new Date(wallClockUtc);

  try {
    const firstOffset =
      getTimeZoneOffsetMilliseconds(
        candidate,
        timeZone,
      );

    candidate = new Date(
      wallClockUtc - firstOffset,
    );

    const secondOffset =
      getTimeZoneOffsetMilliseconds(
        candidate,
        timeZone,
      );

    candidate = new Date(
      wallClockUtc - secondOffset,
    );
  } catch {
    return null;
  }

  return Number.isNaN(candidate.getTime())
    ? null
    : candidate;
}


function createScheduledAt(
  date: string,
  locationTimestamp: string,
  timeZone: string | null,
): Date | null {
  if (
    !/\b(?:Starts at|Not Before)\b/i.test(
      locationTimestamp,
    )
  ) {
    return null;
  }

  const time =
    parseClockTime(
      locationTimestamp,
    );

  if (!time) {
    return null;
  }

  /*
   * ATP pubblica l'orario nel fuso locale del torneo.
   * Con una timezone IANA salviamo il vero istante UTC.
   */
  if (timeZone) {
    return createUtcDateFromTournamentLocalTime(
      date,
      time.hours,
      time.minutes,
      timeZone,
    );
  }

  /*
   * Fallback temporaneo per i tornei non ancora mappati:
   * preserva il comportamento precedente senza bloccare il sync.
   */
  const value = new Date(
    `${date}T${String(time.hours).padStart(2, "0")}:${String(
      time.minutes,
    ).padStart(2, "0")}:00.000Z`,
  );

  return Number.isNaN(value.getTime())
    ? null
    : value;
}


function parseCourtFromLocationTimestamp(
  value: string,
): string | null {
  const text =
    normalizeText(
      value,
    );

  if (!text) {
    return null;
  }

  const court =
    text
      .replace(
        /\s+(?:Starts at|Not Before)\s+\d{1,2}:\d{2}\s*(?:AM|PM).*$/i,
        "",
      )
      .trim();

  return court ||
    null;
}


function normalizeScore(
  value: string,
): string | null {
  const text =
    normalizeText(
      value,
    );

  if (
    !text ||
    /^[-–—]+$/.test(
      text,
    ) ||
    /^H2H$/i.test(
      text,
    )
  ) {
    return null;
  }

  return text;
}


function determineMatchStatus(
  sourceText: string,
  score: string | null,
): ExtractedAtpDailyMatchStatus {
  if (
    /\bGame Set and Match\b/i.test(
      sourceText,
    ) ||
    /\bwins the match\b/i.test(
      sourceText,
    ) ||
    /\bcompleted\b/i.test(
      sourceText,
    )
  ) {
    return "COMPLETED";
  }

  if (
    /\bLive\b/i.test(
      sourceText,
    ) ||
    /\bin progress\b/i.test(
      sourceText,
    )
  ) {
    return "LIVE";
  }

  if (
    score &&
    /\d/.test(
      score,
    )
  ) {
    return "LIVE";
  }

  return "SCHEDULED";
}


function resolveWinner(
  sourceText: string,
  players:
    ExtractedAtpDailyPlayer[],
): ExtractedAtpDailyPlayer | null {
  const lowerText =
    sourceText.toLowerCase();

  return (
    players.find(
      (player) =>
        lowerText.includes(
          `${player.name.toLowerCase()} wins the match`,
        ),
    ) ??
    null
  );
}


async function readOptionalText(
  locator: Locator,
): Promise<string> {
  const count =
    await locator
      .count()
      .catch(
        () => 0,
      );

  if (count === 0) {
    return "";
  }

  return normalizeText(
    await locator
      .first()
      .innerText({
        timeout:
          ATP_ELEMENT_TIMEOUT_MS,
      })
      .catch(
        () => "",
      ),
  );
}


async function readPlayerLinks(
  candidate: Locator,
): Promise<PlayerLinkData[]> {
  const locator =
    candidate.locator(
      'a[href*="/players/"]',
    );

  const count =
    await locator.count();

  const links:
    PlayerLinkData[] =
    [];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const link =
      locator.nth(
        index,
      );

    const href =
      normalizeText(
        await link
          .getAttribute(
            "href",
          )
          .catch(
            () => "",
          ),
      );

    if (
      !href ||
      !isSinglesPlayerOverviewHref(
        href,
      )
    ) {
      continue;
    }

    const text =
      normalizeText(
        await link
          .innerText()
          .catch(
            () => "",
          ),
      );

    if (!text) {
      continue;
    }

    links.push({
      text,
      href,
    });
  }

  return links;
}


export async function extractAtpTournamentDailyMatches(
  input:
    ExtractAtpDailyMatchesInput,
): Promise<ExtractedAtpDailyMatches> {
  const requestedDate =
    resolveRequestedDate(
      input.date,
    );

  const sourceUrl =
    `https://www.atptour.com/en/scores/current/${input.tournamentSlug}/${input.tournamentId}/daily-schedule`;

  const tournamentTimeZone =
    resolveTournamentTimeZone(
      input.tournamentId,
    );

  const browser =
    await chromium.launch({
      headless:
        true,
    });

  try {
    const context =
      await browser.newContext({
        locale:
          "en-US",

        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      });

    const page =
      await context.newPage();

    page.setDefaultTimeout(
      ATP_ELEMENT_TIMEOUT_MS,
    );

    page.setDefaultNavigationTimeout(
      ATP_NAVIGATION_TIMEOUT_MS,
    );

    await page.goto(
      sourceUrl,
      {
        waitUntil:
          "domcontentloaded",

        timeout:
          ATP_NAVIGATION_TIMEOUT_MS,
      },
    );

    /*
     * Evitiamo attese fisse molto lunghe.
     *
     * ATP carica il programma dopo il DOM iniziale:
     * aspettiamo il primo blocco .schedule fino a un
     * massimo controllato, poi concediamo soltanto un
     * breve tempo di stabilizzazione al DOM.
     */
    await page
      .locator(
        ".schedule",
      )
      .first()
      .waitFor({
        state:
          "attached",

        timeout:
          ATP_SCHEDULE_WAIT_TIMEOUT_MS,
      })
      .catch(
        () => undefined,
      );

    await page.waitForTimeout(
      ATP_DOM_SETTLE_MS,
    );

    const rawBodyText =
      await page
        .locator(
          "body",
        )
        .innerText()
        .catch(
          () => "",
        );

    const bodyText =
      normalizeText(
        rawBodyText,
      );

    if (
      isSecurityPage(
        bodyText,
      )
    ) {
      throw new Error(
        "ATP security verification blocked automated access.",
      );
    }

    const scheduleLabel =
      (
        await readOptionalText(
          page.locator(
            ".tournament-day .day",
          ),
        )
      ) ||
      null;

    /*
     * Il DOM ATP reale usa .schedule
     * per i blocchi del programma.
     *
     * Consideriamo soltanto quelli
     * che contengono .schedule-players.
     */
    const candidates =
      page.locator(
        ".schedule",
      );

    const candidateCount =
      await candidates.count();

    const matches:
      ExtractedAtpDailyMatch[] =
      [];

    const signatures =
      new Set<string>();

    let currentCourt:
      string | null =
      null;

    for (
      let index = 0;
      index < candidateCount;
      index += 1
    ) {
      const candidate =
        candidates.nth(
          index,
        );

      const playerContainer =
        candidate.locator(
          ".schedule-players",
        );

      if (
        await playerContainer.count() ===
        0
      ) {
        continue;
      }

      const sourceText =
        normalizeText(
          await candidate
            .innerText({
              timeout:
                ATP_ELEMENT_TIMEOUT_MS,
            })
            .catch(
              () => "",
            ),
        );

      if (!sourceText) {
        continue;
      }

      /*
       * ATP e WTA sono presenti
       * nella stessa pagina Slam.
       *
       * I match WTA hanno
       * .match-type = WTA.
       */
      const matchType =
        await readOptionalText(
          candidate.locator(
            ".match-type",
          ),
        );

      if (
        /^WTA$/i.test(
          matchType,
        )
      ) {
        continue;
      }

      const playerLinks =
        await readPlayerLinks(
          candidate,
        );

      /*
       * Due profili ATP = singolare.
       *
       * In questo modo non importiamo
       * accidentalmente il doppio.
       */
      if (
        playerLinks.length !==
        2
      ) {
        continue;
      }

      const players =
        playerLinks.map(
          (link) =>
            parsePlayer(
              link.text,
              link.href,
            ),
        );

      if (
        !players[0]?.name ||
        !players[1]?.name
      ) {
        continue;
      }

      const roundText =
        await readOptionalText(
          candidate.locator(
            ".schedule-type",
          ),
        );

      const roundLabel =
        parseRoundLabel(
          roundText,
        );

      const locationTimestamp =
        await readOptionalText(
          candidate.locator(
            ".schedule-location-timestamp",
          ),
        );

      /*
       * ATP mostra il nome del campo
       * soltanto sul primo match
       * del relativo blocco.
       */
      const explicitCourt =
        parseCourtFromLocationTimestamp(
          locationTimestamp,
        );

      if (explicitCourt) {
        currentCourt =
          explicitCourt;
      }

      const court =
        explicitCourt ??
        currentCourt;

      /*
       * Non ereditiamo invece l'orario:
       * "Starts at" vale soltanto
       * per il primo match del campo.
       */
      const scheduledAt =
        locationTimestamp
          ? createScheduledAt(
              requestedDate,
              locationTimestamp,
              tournamentTimeZone,
            )
          : null;

      const scoreText =
        await readOptionalText(
          candidate.locator(
            ".schedule-cta-score",
          ),
        );

      const score =
        normalizeScore(
          scoreText,
        );

      const status =
        determineMatchStatus(
          sourceText,
          score,
        );

      const winner =
        status ===
        "COMPLETED"
          ? resolveWinner(
              sourceText,
              players,
            )
          : null;

      const externalId =
        createMatchExternalId(
          players[0],
          players[1],
          roundLabel,
        );

      if (
        signatures.has(
          externalId,
        )
      ) {
        continue;
      }

      signatures.add(
        externalId,
      );

      matches.push({
        externalId,

        playerOne:
          players[0],

        playerTwo:
          players[1],

        status,

        scheduledAt,

        court,

        roundLabel,

        winner,

        score,

        sourceText,
      });
    }

    if (
      matches.length ===
      0
    ) {
      throw new Error(
        `No ATP singles daily matches found at ${sourceUrl}.`,
      );
    }

    return {
      source:
        "ATP",

      sourceUrl,

      tournamentSlug:
        input.tournamentSlug,

      tournamentId:
        input.tournamentId,

      year:
        input.year,

      scheduleDate:
        requestedDate,

      scheduleLabel,

      matches,

      extractedAt:
        new Date(),
    };
  } finally {
    await browser.close();
  }
}