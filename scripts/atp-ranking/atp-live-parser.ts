import type {
  Locator,
  Page,
} from "playwright";

import {
  ATP_RANKING_LIMIT,
  type AtpLiveRankingEntry,
} from "./types";


function parseInteger(
  value: string,
): number | null {
  const normalized =
    value
      .replace(/[^\d-]/g, "")
      .trim();

  if (!normalized) {
    return null;
  }

  const parsed =
    Number.parseInt(
      normalized,
      10,
    );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}


function extractProfileSlug(
  href: string | null,
): string | null {
  if (!href) {
    return null;
  }

  const match =
    href.match(
      /\/players\/([^/]+)\/[^/]+\/overview/i,
    );

  return match?.[1] ?? null;
}


function humanizeProfileSlug(
  slug: string,
): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map(
      (part) =>
        part.length > 0
          ? `${part[0].toUpperCase()}${part.slice(1)}`
          : part,
    )
    .join(" ");
}


function normalizeProfileHref(
  href: string | null,
): string | null {
  if (!href) {
    return null;
  }

  try {
    const url =
      new URL(
        href,
        "https://www.atptour.com",
      );

    return `${url.pathname}${url.search}`;
  } catch {
    return href;
  }
}


function normalizeCountryCode(
  value: string | null,
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


async function extractCountryCode(
  row: Locator,
): Promise<string | null> {
  /*
   * ATP rappresenta la nazione tramite uno sprite SVG.
   *
   * Esempio osservato:
   *
   * <svg class="atp-flag flag-usa">
   *   <use
   *     href="/assets/atptour/assets/flags.svg#flag-usa"
   *   />
   * </svg>
   *
   * Proviamo prima l'href del <use>, perché contiene
   * direttamente il codice della bandiera.
   */
  const flagUse =
    row
      .locator(
        'svg.atp-flag use[href*="#flag-"], svg.atp-flag use[xlink\\:href*="#flag-"]',
      )
      .first();

  if (
    await flagUse.count() >
    0
  ) {
    const href =
      (
        await flagUse.getAttribute(
          "href",
        )
      ) ??
      (
        await flagUse.getAttribute(
          "xlink:href",
        )
      );

    const match =
      href?.match(
        /#flag-([a-z]{3})(?:$|[^a-z])/i,
      );

    const countryCode =
      normalizeCountryCode(
        match?.[1] ?? null,
      );

    if (countryCode) {
      return countryCode;
    }
  }

  /*
   * Fallback:
   *
   * <svg class="atp-flag flag-usa">
   *
   * Se ATP modifica il riferimento allo sprite ma
   * mantiene la classe della bandiera, continuiamo
   * comunque a poter recuperare il codice.
   */
  const flagSvg =
    row
      .locator(
        "svg.atp-flag",
      )
      .first();

  if (
    await flagSvg.count() >
    0
  ) {
    const className =
      await flagSvg.getAttribute(
        "class",
      );

    const match =
      className?.match(
        /(?:^|\s)flag-([a-z]{3})(?:\s|$)/i,
      );

    const countryCode =
      normalizeCountryCode(
        match?.[1] ?? null,
      );

    if (countryCode) {
      return countryCode;
    }
  }

  return null;
}


function deduplicateEntries(
  entries: AtpLiveRankingEntry[],
): AtpLiveRankingEntry[] {
  const byRank =
    new Map<
      number,
      AtpLiveRankingEntry
    >();


  for (const entry of entries) {
    const existing =
      byRank.get(
        entry.rank,
      );


    if (!existing) {
      byRank.set(
        entry.rank,
        entry,
      );

      continue;
    }


    /*
     * ATP può renderizzare nel DOM più versioni
     * della stessa classifica, ad esempio desktop
     * e responsive/mobile.
     *
     * Se rank e profilo coincidono, si tratta
     * semplicemente della stessa riga duplicata.
     */
    if (
      existing.profileSlug ===
      entry.profileSlug
    ) {
      continue;
    }


    /*
     * Due giocatori differenti con lo stesso rank
     * sono invece un'anomalia che NON vogliamo
     * nascondere.
     */
    throw new Error(
      [
        `Conflitto ATP sul rank ${entry.rank}.`,
        `"${existing.name}" (${existing.profileSlug})`,
        "e",
        `"${entry.name}" (${entry.profileSlug})`,
        "occupano lo stesso rank.",
      ].join(" "),
    );
  }


  return Array.from(
    byRank.values(),
  );
}


export async function parseAtpLiveRanking(
  page: Page,
): Promise<AtpLiveRankingEntry[]> {
  const rows =
    page.locator(
      "tr",
    );


  const rowCount =
    await rows.count();


  const rawEntries:
    AtpLiveRankingEntry[] = [];


  for (
    let index = 0;
    index < rowCount;
    index += 1
  ) {
    const row =
      rows.nth(
        index,
      );


    const playerLink =
      row
        .locator(
          'a[href*="/players/"][href*="/overview"]',
        )
        .first();


    if (
      await playerLink.count() ===
      0
    ) {
      continue;
    }


    const cells =
      row.locator(
        "td",
      );


    const cellCount =
      await cells.count();


    if (
      cellCount < 3
    ) {
      continue;
    }


    const rankText =
      (
        await cells
          .nth(0)
          .innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    const rank =
      parseInteger(
        rankText,
      );


    if (
      rank === null ||
      rank < 1
    ) {
      continue;
    }


    const href =
      await playerLink.getAttribute(
        "href",
      );


    const profileSlug =
      extractProfileSlug(
        href,
      );


    if (!profileSlug) {
      continue;
    }


    const pointsText =
      (
        await cells
          .nth(2)
          .innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    const pointsMatch =
      pointsText.match(
        /[\d,.]+/,
      );


    const points =
      pointsMatch
        ? parseInteger(
            pointsMatch[0],
          )
        : null;


    if (
      points === null ||
      points < 0
    ) {
      continue;
    }


    const linkText =
      (
        await playerLink.innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    const name =
      linkText &&
      !/^[A-Z]\.\s+/i.test(
        linkText,
      )
        ? linkText
        : humanizeProfileSlug(
            profileSlug,
          );


    /*
     * Nuovo metadato ATP:
     * estraiamo il codice nazione direttamente
     * dalla bandiera presente nella stessa riga.
     */
    const countryCode =
      await extractCountryCode(
        row,
      );


    rawEntries.push({
      rank,

      name,

      firstName:
        null,

      lastName:
        null,

      /*
       * Il nome esteso della nazione verrà risolto
       * separatamente dal countryCode.
       *
       * Il parser non inventa dati.
       */
      country:
        null,

      countryCode,

      age:
        null,

      points,

      rankMovement:
        null,

      profileHref:
        normalizeProfileHref(
          href,
        ),

      profileSlug,
    });
  }


  const uniqueEntries =
    deduplicateEntries(
      rawEntries,
    );


  return uniqueEntries
    .sort(
      (
        first,
        second,
      ) =>
        first.rank -
        second.rank,
    )
    .filter(
      (entry) =>
        entry.rank <=
        ATP_RANKING_LIMIT,
    )
    .slice(
      0,
      ATP_RANKING_LIMIT,
    );
}