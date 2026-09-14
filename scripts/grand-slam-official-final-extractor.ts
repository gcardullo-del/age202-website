/**
 * AGE202 · Grand Slam official final extractor
 *
 * Purpose:
 *   Last-resort fallback when ATP / Stats Centre / ATP draw cannot be read.
 *
 * Safety:
 *   - official tournament websites only
 *   - men's singles final only
 *   - requires an explicit completion marker
 *   - requires two players + a non-empty score
 *   - never writes to the database
 *
 * The sync script remains responsible for validation and --write.
 */

export type OfficialGrandSlamSlug =
  | "australian-open"
  | "roland-garros"
  | "wimbledon"
  | "us-open";

export type OfficialGrandSlamFinal = {
  tournamentSlug: OfficialGrandSlamSlug;
  year: number;
  championName: string;
  runnerUpName: string;
  score: string;
  sourceUrl: string;
};

type OfficialSource = {
  label: string;
  urls: (year: number) => string[];
};

const OFFICIAL_SOURCES: Record<
  OfficialGrandSlamSlug,
  OfficialSource
> = {
  "australian-open": {
    label: "Australian Open",
    urls: (year) => [
      `https://ausopen.com/results#!mens-singles`,
      `https://ausopen.com/match/${year}`,
    ],
  },

  "roland-garros": {
    label: "Roland-Garros",
    urls: (year) => [
      `https://www.rolandgarros.com/en-us/matches/${year}/SM001`,
      `https://www.rolandgarros.com/en-us/results`,
    ],
  },

  wimbledon: {
    label: "Wimbledon",
    urls: (year) => [
      `https://www.wimbledon.com/en_GB/scores/stats/1701.html`,
      `https://www.wimbledon.com/en_GB/scores/results/day14.html`,
      `https://www.wimbledon.com/en_GB/scores/results/day13.html`,
      `https://www.wimbledon.com/en_GB/scores/results/day12.html`,
    ],
  },

  "us-open": {
    label: "US Open",
    urls: (year) => {
      const completedDays =
        Array.from(
          { length: 20 },
          (_, index) => 20 - index,
        ).map(
          (day) =>
            `https://www.usopen.org/en_US/scores/completed_matches/day${day}.html`,
        );

      return [
        ...completedDays,
        `https://www.usopen.org/en_US/scores/index.html`,
      ];
    },
  },
};


function decodeHtml(
  value: string,
): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&minus;/gi, "-")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/gi, "/")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    );
}


function htmlToText(
  html: string,
): string {
  return decodeHtml(
    html
      .replace(
        /<script\b[^>]*>[\s\S]*?<\/script>/gi,
        " ",
      )
      .replace(
        /<style\b[^>]*>[\s\S]*?<\/style>/gi,
        " ",
      )
      .replace(
        /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
        " ",
      )
      .replace(
        /<[^>]+>/g,
        "\n",
      ),
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


function cleanName(
  value: string,
): string {
  return value
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/\(\d+\)/g, " ")
    .replace(
      /\b(?:USA|ESP|GER|ITA|FRA|GBR|AUS|CAN|SRB|RUS|ARG|BRA|CZE|POL|GRE|NOR|DEN|NED|BEL|SUI|AUT|CRO|CHI|JPN|CHN|KOR|KAZ|UKR|BUL|HUN|ROU|POR|SVK|SLO|FIN|SWE)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}


function looksLikePlayerName(
  value: string,
): boolean {
  const cleaned =
    cleanName(value);

  if (
    cleaned.length < 3 ||
    cleaned.length > 60
  ) {
    return false;
  }

  if (
    !/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(
      cleaned,
    )
  ) {
    return false;
  }

  const blocked =
    /^(completed|final|men'?s singles|match recap|duration|court|results|scores|live scores|view draw|presented by|image)$/i;

  return !blocked.test(
    cleaned,
  );
}


function normalizeScore(
  value: string,
): string {
  return value
    .replace(/[–—−]/g, "-")
    .replace(
      /\s*-\s*/g,
      "-",
    )
    .replace(
      /\s*,\s*/g,
      ", ",
    )
    .replace(/\s+/g, " ")
    .trim();
}


function extractNarrativeFinal(
  text: string,
): {
  championName: string;
  runnerUpName: string;
  score: string;
} | null {
  const patterns = [
    /([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'’ -]{2,50}?)\s+(?:won|wins|defeated|defeats|beat|beats)\s+(?:the\s+\d{4}\s+)?(?:[A-Za-z-]+\s+)*(?:men'?s singles\s+)?(?:title\s+)?(?:on\s+\w+\s+)?(?:by\s+)?(?:defeating|beating)?\s*([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'’ -]{2,50}?),?\s+((?:\d{1,2}-\d{1,2}(?:\(\d+\))?)(?:\s*,\s*\d{1,2}-\d{1,2}(?:\(\d+\))?){1,4})/i,

    /([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'’ -]{2,50}?)\s+(?:def\.?|d\.|defeated|beat)\s+([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'’ -]{2,50}?),?\s+((?:\d{1,2}-\d{1,2}(?:\(\d+\))?)(?:\s*,\s*\d{1,2}-\d{1,2}(?:\(\d+\))?){1,4})/i,
  ];

  for (
    const pattern
    of patterns
  ) {
    const match =
      text.match(
        pattern,
      );

    if (!match) {
      continue;
    }

    const championName =
      cleanName(
        match[1],
      );

    const runnerUpName =
      cleanName(
        match[2],
      );

    const score =
      normalizeScore(
        match[3],
      );

    if (
      looksLikePlayerName(
        championName,
      ) &&
      looksLikePlayerName(
        runnerUpName,
      )
    ) {
      return {
        championName,
        runnerUpName,
        score,
      };
    }
  }

  return null;
}


function extractUsOpenFinal(
  text: string,
): {
  championName: string;
  runnerUpName: string;
  score: string;
} | null {
  const finalIndex =
    text.search(
      /Men'?s Singles\s+(?:F|Final)\b/i,
    );

  if (
    finalIndex < 0
  ) {
    return null;
  }


  const block =
    text.slice(
      finalIndex,
      finalIndex + 5000,
    );


  if (
    !/\bCompleted\b/i.test(
      block,
    )
  ) {
    return null;
  }


  /*
   * First try the safest route: a normal narrative sentence
   * such as "Player A defeated Player B 6-4, 6-3, 7-5".
   */
  const narrative =
    extractNarrativeFinal(
      block,
    );


  if (narrative) {
    return narrative;
  }


  /*
   * Structured US Open fallback.
   *
   * The official Completed Matches pages can render the match as:
   *
   *   Men's Singles F
   *   Completed
   *   Player One
   *   6
   *   7 7
   *   5
   *   6
   *   Player Two
   *   3
   *   6 2
   *   7
   *   2
   *
   * We only accept the result when:
   * - exactly two player rows are found;
   * - both have 3-5 set values;
   * - one player has exactly three won sets.
   *
   * If the structure is ambiguous, return null.
   */
  const lines =
    block
      .split("\n")
      .map(
        (line) =>
          line.trim(),
      )
      .filter(
        Boolean,
      );


  type StructuredPlayer = {
    name: string;
    scoreTokens: string[];
  };


  const players:
    StructuredPlayer[] =
      [];


  const isSeedLine = (
    value: string,
  ): boolean =>
    /^\[\d+\]$/.test(
      value,
    );


  const isScoreToken = (
    value: string,
  ): boolean =>
    /^\d{1,2}(?:\s+\d{1,2})?$/.test(
      value,
    );


  const isMetadataLine = (
    value: string,
  ): boolean =>
    /^(?:Men'?s Singles.*|Completed|Arthur Ashe Stadium.*|Louis Armstrong Stadium.*|Grandstand.*|Court \d+.*|Duration:.*|Match Recap|Image(?::\s*[A-Z]{3})?|Presented by|Preview|Replay|Summary|Live Scores|Completed Matches|View Draw)$/i.test(
      value,
    );


  for (
    let index = 0;
    index < lines.length;
    index += 1
  ) {
    const line =
      lines[index];


    if (
      isMetadataLine(
        line,
      ) ||
      isSeedLine(
        line,
      ) ||
      isScoreToken(
        line,
      ) ||
      !looksLikePlayerName(
        line,
      )
    ) {
      continue;
    }


    const scoreTokens:
      string[] =
        [];


    let cursor =
      index + 1;


    while (
      cursor <
      lines.length
    ) {
      const candidate =
        lines[cursor];


      if (
        isSeedLine(
          candidate,
        ) ||
        /^Image(?::\s*[A-Z]{3})?$/i.test(
          candidate,
        )
      ) {
        cursor +=
          1;

        continue;
      }


      if (
        isScoreToken(
          candidate,
        )
      ) {
        scoreTokens.push(
          candidate,
        );

        cursor +=
          1;

        continue;
      }


      break;
    }


    if (
      scoreTokens.length >=
      3 &&
      scoreTokens.length <=
      5
    ) {
      players.push({
        name:
          cleanName(
            line,
          ),

        scoreTokens,
      });


      index =
        cursor - 1;


      if (
        players.length ===
        2
      ) {
        break;
      }
    }
  }


  if (
    players.length !==
    2
  ) {
    return null;
  }


  const [
    firstPlayer,
    secondPlayer,
  ] =
    players;


  const setCount =
    Math.min(
      firstPlayer.scoreTokens.length,
      secondPlayer.scoreTokens.length,
    );


  if (
    setCount < 3 ||
    setCount > 5
  ) {
    return null;
  }


  let firstSetsWon =
    0;

  let secondSetsWon =
    0;


  const firstPerspectiveScores:
    string[] =
      [];


  for (
    let setIndex = 0;
    setIndex < setCount;
    setIndex += 1
  ) {
    const firstParts =
      firstPlayer.scoreTokens[
        setIndex
      ]
        .split(
          /\s+/,
        )
        .map(
          Number,
        );

    const secondParts =
      secondPlayer.scoreTokens[
        setIndex
      ]
        .split(
          /\s+/,
        )
        .map(
          Number,
        );


    const firstGames =
      firstParts[0];

    const secondGames =
      secondParts[0];


    if (
      !Number.isInteger(
        firstGames,
      ) ||
      !Number.isInteger(
        secondGames,
      ) ||
      firstGames ===
        secondGames
    ) {
      return null;
    }


    if (
      firstGames >
      secondGames
    ) {
      firstSetsWon +=
        1;
    } else {
      secondSetsWon +=
        1;
    }


    let formattedScore =
      `${firstGames}-${secondGames}`;


    if (
      firstGames === 7 &&
      secondGames === 6 &&
      secondParts.length >
        1
    ) {
      formattedScore =
        `7-6(${secondParts[1]})`;
    } else if (
      firstGames === 6 &&
      secondGames === 7 &&
      firstParts.length >
        1
    ) {
      formattedScore =
        `6-7(${firstParts[1]})`;
    }


    firstPerspectiveScores.push(
      formattedScore,
    );
  }


  if (
    firstSetsWon ===
      secondSetsWon ||
    Math.max(
      firstSetsWon,
      secondSetsWon,
    ) !==
      3
  ) {
    return null;
  }


  const firstPlayerWon =
    firstSetsWon >
    secondSetsWon;


  const champion =
    firstPlayerWon
      ? firstPlayer
      : secondPlayer;


  const runnerUp =
    firstPlayerWon
      ? secondPlayer
      : firstPlayer;


  const championPerspectiveScores =
    firstPlayerWon
      ? firstPerspectiveScores
      : firstPerspectiveScores.map(
          (setScore) => {
            const match =
              setScore.match(
                /^(\d+)-(\d+)(?:\((\d+)\))?$/,
              );


            if (!match) {
              return setScore;
            }


            const left =
              match[1];

            const right =
              match[2];

            const tieBreak =
              match[3];


            return tieBreak
              ? `${right}-${left}(${tieBreak})`
              : `${right}-${left}`;
          },
        );


  return {
    championName:
      champion.name,

    runnerUpName:
      runnerUp.name,

    score:
      normalizeScore(
        championPerspectiveScores.join(
          ", ",
        ),
      ),
  };
}


function extractRolandGarrosFinal(
  text: string,
): {
  championName: string;
  runnerUpName: string;
  score: string;
} | null {
  if (
    !/Final Men'?s Singles/i.test(
      text,
    ) ||
    !/\bCompleted\b/i.test(
      text,
    )
  ) {
    return null;
  }

  return extractNarrativeFinal(
    text,
  );
}


function parseOfficialPage(
  tournamentSlug:
    OfficialGrandSlamSlug,

  text:
    string,
): {
  championName: string;
  runnerUpName: string;
  score: string;
} | null {
  if (
    tournamentSlug ===
    "us-open"
  ) {
    return (
      extractUsOpenFinal(
        text,
      ) ??
      extractNarrativeFinal(
        text,
      )
    );
  }

  if (
    tournamentSlug ===
    "roland-garros"
  ) {
    return (
      extractRolandGarrosFinal(
        text,
      ) ??
      extractNarrativeFinal(
        text,
      )
    );
  }

  /*
   * Wimbledon / Australian Open:
   * use the conservative narrative parser.
   * If the official page structure changes and no explicit completed-final
   * sentence is available, extraction fails safely rather than guessing.
   */
  if (
    !/\b(?:Completed|Final|Champion|title)\b/i.test(
      text,
    )
  ) {
    return null;
  }

  return extractNarrativeFinal(
    text,
  );
}


async function fetchOfficialPage(
  url:
    string,
): Promise<string> {
  const response =
    await fetch(
      url,
      {
        redirect:
          "follow",

        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; AGE202Museum/1.0; +https://www.age202.com)",

          accept:
            "text/html,application/xhtml+xml",
        },

        signal:
          AbortSignal.timeout(
            15_000,
          ),
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `HTTP ${response.status}`,
    );
  }

  return response.text();
}


export async function extractOfficialGrandSlamFinal({
  tournamentSlug,
  year,
}: {
  tournamentSlug:
    OfficialGrandSlamSlug;

  year:
    number;
}): Promise<OfficialGrandSlamFinal> {
  const source =
    OFFICIAL_SOURCES[
      tournamentSlug
    ];

  if (!source) {
    throw new Error(
      `No official Grand Slam source registered for "${tournamentSlug}".`,
    );
  }

  const errors:
    string[] =
      [];


  for (
    const url
    of source.urls(
      year,
    )
  ) {
    try {
      console.log(
        `   🌐 Official fallback · ${source.label}`,
      );

      console.log(
        `      ${url}`,
      );


      const html =
        await fetchOfficialPage(
          url,
        );

      const text =
        htmlToText(
          html,
        );


      const parsed =
        parseOfficialPage(
          tournamentSlug,
          text,
        );


      if (!parsed) {
        errors.push(
          `${url} · no verified completed men's singles final`,
        );

        continue;
      }


      console.log(
        `   ✅ Official fallback resolved: ${parsed.championName} d. ${parsed.runnerUpName} · ${parsed.score}`,
      );


      return {
        tournamentSlug,
        year,

        championName:
          parsed.championName,

        runnerUpName:
          parsed.runnerUpName,

        score:
          parsed.score,

        sourceUrl:
          url,
      };
    } catch (
      error
    ) {
      const message =
        error instanceof Error
          ? error.message
          : String(
              error,
            );

      errors.push(
        `${url} · ${message}`,
      );
    }
  }


  throw new Error(
    [
      `Official ${source.label} fallback could not verify a completed men's singles final.`,
      ...errors.slice(
        0,
        5,
      ),
    ].join(
      " | ",
    ),
  );
}
