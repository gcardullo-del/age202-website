import type {
  AtpTournamentResultInput,
} from "@/lib/services/atp-tournament-sync.service";


export type AtpTournamentValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};


function normalizeText(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .replace(/\s+/g, " ") ??
    ""
  );
}


function normalizeSlug(
  value: string | null | undefined,
): string {
  return normalizeText(
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
}


function normalizeCountryCode(
  value: string | null | undefined,
): string {
  return normalizeText(
    value,
  )
    .toUpperCase()
    .slice(
      0,
      3,
    );
}


function isValidYear(
  year: number,
): boolean {
  return (
    Number.isInteger(
      year,
    ) &&
    year >= 1800 &&
    year <= 2200
  );
}


function isValidDate(
  value: Date | null | undefined,
): boolean {
  return (
    value === null ||
    value === undefined ||
    !Number.isNaN(
      value.getTime(),
    )
  );
}


function hasSuspiciousScore(
  score: string,
): boolean {
  const normalized =
    score.toLowerCase();

  return (
    normalized.includes(
      "undefined",
    ) ||
    normalized.includes(
      "null",
    ) ||
    normalized.includes(
      "[object",
    )
  );
}


export function validateAtpTournamentResult(
  input: AtpTournamentResultInput,
): AtpTournamentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];


  const tournamentSlug =
    normalizeSlug(
      input.tournamentSlug,
    );


  if (!tournamentSlug) {
    errors.push(
      "Tournament slug is missing.",
    );
  }


  if (
    !isValidYear(
      input.year,
    )
  ) {
    errors.push(
      `Invalid tournament year: ${input.year}.`,
    );
  }


  if (
    !isValidDate(
      input.startDate,
    )
  ) {
    errors.push(
      "Tournament startDate is invalid.",
    );
  }


  if (
    !isValidDate(
      input.endDate,
    )
  ) {
    errors.push(
      "Tournament endDate is invalid.",
    );
  }


  if (
    input.startDate &&
    input.endDate &&
    input.startDate.getTime() >
      input.endDate.getTime()
  ) {
    errors.push(
      "Tournament startDate cannot be after endDate.",
    );
  }


  if (
    input.drawSize !==
      null &&
    input.drawSize !==
      undefined &&
    (
      !Number.isInteger(
        input.drawSize,
      ) ||
      input.drawSize < 2 ||
      input.drawSize > 256
    )
  ) {
    errors.push(
      `Invalid draw size: ${input.drawSize}.`,
    );
  }


  const championName =
    normalizeText(
      input.champion.name,
    );


  const runnerUpName =
    normalizeText(
      input.runnerUp.name,
    );


  if (!championName) {
    errors.push(
      "Champion name is missing.",
    );
  }


  if (!runnerUpName) {
    errors.push(
      "Runner-up name is missing.",
    );
  }


  if (
    championName &&
    runnerUpName &&
    championName.localeCompare(
      runnerUpName,
      undefined,
      {
        sensitivity:
          "base",
      },
    ) ===
      0
  ) {
    errors.push(
      "Champion and runner-up are the same player.",
    );
  }


  const championSlug =
    normalizeSlug(
      input.champion.profileSlug,
    );


  const runnerUpSlug =
    normalizeSlug(
      input.runnerUp.profileSlug,
    );


  if (
    championSlug &&
    runnerUpSlug &&
    championSlug ===
      runnerUpSlug
  ) {
    errors.push(
      "Champion and runner-up have the same ATP profile slug.",
    );
  }


  if (!championSlug) {
    warnings.push(
      `Champion ATP profile slug is missing for "${championName || "unknown"}". AGE202 will fall back to exact-name resolution.`,
    );
  }


  if (!runnerUpSlug) {
    warnings.push(
      `Runner-up ATP profile slug is missing for "${runnerUpName || "unknown"}". AGE202 will fall back to exact-name resolution.`,
    );
  }


  const championCountryCode =
    normalizeCountryCode(
      input.champion.countryCode,
    );


  const runnerUpCountryCode =
    normalizeCountryCode(
      input.runnerUp.countryCode,
    );


  if (
    championCountryCode &&
    championCountryCode.length !==
      3
  ) {
    warnings.push(
      `Champion country code "${championCountryCode}" is not a 3-letter code.`,
    );
  }


  if (
    runnerUpCountryCode &&
    runnerUpCountryCode.length !==
      3
  ) {
    warnings.push(
      `Runner-up country code "${runnerUpCountryCode}" is not a 3-letter code.`,
    );
  }


  const score =
    normalizeText(
      input.score,
    );


  if (!score) {
    warnings.push(
      "Final score is missing.",
    );
  } else if (
    hasSuspiciousScore(
      score,
    )
  ) {
    errors.push(
      `Final score looks malformed: "${score}".`,
    );
  }


  if (
    input.editionKey &&
    !normalizeSlug(
      input.editionKey,
    )
  ) {
    errors.push(
      "editionKey cannot be normalized to a valid value.",
    );
  }


  return {
    valid:
      errors.length ===
      0,

    errors,
    warnings,
  };
}


export function assertValidAtpTournamentResult(
  input: AtpTournamentResultInput,
): void {
  const validation =
    validateAtpTournamentResult(
      input,
    );


  if (validation.valid) {
    return;
  }


  throw new Error(
    [
      "ATP tournament result validation failed.",
      ...validation.errors.map(
        (error) =>
          `• ${error}`,
      ),
    ].join(
      "\n",
    ),
  );
}
