export type AtpCountryRecord = {
  country: string;
  countryCode: string;
};


export type AtpCountryResolution = {
  countryCode: string;
  country: string | null;
  resolved: boolean;
};


function normalizeCountryCode(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const normalized =
    value
      .trim()
      .toUpperCase();

  if (
    !/^[A-Z]{3}$/.test(
      normalized,
    )
  ) {
    return null;
  }

  return normalized;
}


function normalizeCountry(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const normalized =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  return normalized ||
    null;
}


export function buildAtpCountryMap(
  records: AtpCountryRecord[],
): Map<string, string> {
  const candidates =
    new Map<
      string,
      Set<string>
    >();


  for (
    const record
    of records
  ) {
    const countryCode =
      normalizeCountryCode(
        record.countryCode,
      );

    const country =
      normalizeCountry(
        record.country,
      );


    if (
      !countryCode ||
      !country
    ) {
      continue;
    }


    const existing =
      candidates.get(
        countryCode,
      );


    if (existing) {
      existing.add(
        country,
      );

      continue;
    }


    candidates.set(
      countryCode,
      new Set([
        country,
      ]),
    );
  }


  const countryMap =
    new Map<
      string,
      string
    >();


  for (
    const [
      countryCode,
      countries,
    ]
    of candidates
  ) {
    /*
     * Sicurezza fondamentale:
     *
     * uno stesso countryCode non deve risolvere
     * verso due nomi differenti.
     *
     * In presenza di conflitto NON scegliamo
     * arbitrariamente un valore.
     */
    if (
      countries.size !==
      1
    ) {
      continue;
    }


    const country =
      Array.from(
        countries,
      )[0];


    if (!country) {
      continue;
    }


    countryMap.set(
      countryCode,
      country,
    );
  }


  return countryMap;
}


export function resolveAtpCountry(
  countryCode:
    | string
    | null
    | undefined,
  countryMap:
    Map<
      string,
      string
    >,
): AtpCountryResolution | null {
  const normalizedCountryCode =
    normalizeCountryCode(
      countryCode,
    );


  if (
    !normalizedCountryCode
  ) {
    return null;
  }


  const country =
    countryMap.get(
      normalizedCountryCode,
    ) ??
    null;


  return {
    countryCode:
      normalizedCountryCode,

    country,

    resolved:
      country !== null,
  };
}