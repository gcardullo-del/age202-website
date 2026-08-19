import type {
  AtpTournamentResultInput,
} from "@/lib/services/atp-tournament-sync.service";


export type RawAtpTournamentFinal = {
  tournamentSlug: string;
  year: number;

  editionKey?: string | null;
  editionLabel?: string | null;

  startDate?: string | Date | null;
  endDate?: string | Date | null;
  drawSize?: number | null;

  championName: string;
  championProfileSlug?: string | null;
  championCountryCode?: string | null;

  runnerUpName: string;
  runnerUpProfileSlug?: string | null;
  runnerUpCountryCode?: string | null;

  score?: string | null;
};


function normalizeText(
  value: string | null | undefined,
): string | null {
  const normalized =
    value
      ?.trim()
      .replace(/\s+/g, " ");

  return normalized || null;
}


function normalizeSlug(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    )
      ?.toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  return normalized || null;
}


function normalizeCountryCode(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    );

  return normalized
    ? normalized
        .toUpperCase()
        .slice(0, 3)
    : null;
}


function parseOptionalDate(
  value: string | Date | null | undefined,
  label: string,
): Date | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    value instanceof Date
  ) {
    if (
      Number.isNaN(
        value.getTime(),
      )
    ) {
      throw new Error(
        `${label} is invalid.`,
      );
    }

    return value;
  }

  const normalized =
    normalizeText(
      value,
    );

  if (!normalized) {
    return null;
  }

  const date =
    new Date(
      normalized,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      `${label} is invalid: ${value}.`,
    );
  }

  return date;
}


function normalizeScore(
  value: string | null | undefined,
): string | null {
  const score =
    normalizeText(
      value,
    );

  if (!score) {
    return null;
  }

  /*
   * ATP spesso espone score compatti:
   * "61 62", "76(5) 63", ecc.
   *
   * In questa fase NON tentiamo conversioni aggressive:
   * preserviamo il dato sportivo ricevuto dalla fonte.
   */
  return score;
}


export function parseAtpTournamentFinal(
  raw: RawAtpTournamentFinal,
): AtpTournamentResultInput {
  const tournamentSlug =
    normalizeSlug(
      raw.tournamentSlug,
    );

  const championName =
    normalizeText(
      raw.championName,
    );

  const runnerUpName =
    normalizeText(
      raw.runnerUpName,
    );

  if (!tournamentSlug) {
    throw new Error(
      "Unable to normalize tournament slug.",
    );
  }

  if (!championName) {
    throw new Error(
      "Champion name is missing.",
    );
  }

  if (!runnerUpName) {
    throw new Error(
      "Runner-up name is missing.",
    );
  }

  return {
    tournamentSlug,

    year:
      raw.year,

    editionKey:
      normalizeSlug(
        raw.editionKey,
      ) ??
      "main",

    editionLabel:
      normalizeText(
        raw.editionLabel,
      ),

    startDate:
      parseOptionalDate(
        raw.startDate,
        "Tournament startDate",
      ),

    endDate:
      parseOptionalDate(
        raw.endDate,
        "Tournament endDate",
      ),

    drawSize:
      raw.drawSize ??
      null,

    champion: {
      name:
        championName,

      profileSlug:
        normalizeSlug(
          raw.championProfileSlug,
        ),

      countryCode:
        normalizeCountryCode(
          raw.championCountryCode,
        ),
    },

    runnerUp: {
      name:
        runnerUpName,

      profileSlug:
        normalizeSlug(
          raw.runnerUpProfileSlug,
        ),

      countryCode:
        normalizeCountryCode(
          raw.runnerUpCountryCode,
        ),
    },

    score:
      normalizeScore(
        raw.score,
      ),
  };
}
