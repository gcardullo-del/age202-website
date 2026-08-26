import type {
  Locator,
  Page,
} from "playwright";

import {
  WTA_RANKING_LIMIT,
  type WtaLiveRankingEntry,
} from "./wta-ranking-types";


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

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : null;
}


function normalizeText(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim() ??
    ""
  );
}


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
        "https://www.wtatennis.com",
      );

    return url.pathname;
  } catch {
    return href;
  }
}


function extractProfileSlug(
  href: string | null,
): string | null {
  if (!href) {
    return null;
  }

  const normalized =
    normalizeProfileHref(
      href,
    );

  if (!normalized) {
    return null;
  }

  const match =
    normalized.match(
      /^\/players\/\d+\/([^/?#]+)\/?$/i,
    );

  return (
    match?.[1]
      ?.trim()
      .toLowerCase() ??
    null
  );
}


function splitName(
  name: string,
): {
  firstName: string | null;
  lastName: string | null;
} {
  const parts =
    normalizeText(
      name,
    )
      .split(" ")
      .filter(Boolean);

  if (
    parts.length === 0
  ) {
    return {
      firstName:
        null,

      lastName:
        null,
    };
  }

  if (
    parts.length === 1
  ) {
    return {
      firstName:
        parts[0] ??
        null,

      lastName:
        null,
    };
  }

  return {
    firstName:
      parts[0] ??
      null,

    lastName:
      parts
        .slice(1)
        .join(" ") ||
      null,
  };
}


async function extractCountryCode(
  playerCell: Locator,
  row: Locator,
): Promise<string | null> {
  /*
   * 1.
   * Cerchiamo prima negli attributi alt
   * delle immagini presenti nella cella.
   */
  const images =
    playerCell.locator(
      "img",
    );


  const imageCount =
    await images.count();


  for (
    let index = 0;
    index <
      imageCount;
    index += 1
  ) {
    const alt =
      normalizeText(
        await images
          .nth(
            index,
          )
          .getAttribute(
            "alt",
          ),
      );


    const code =
      normalizeCountryCode(
        alt,
      );


    if (code) {
      return code;
    }
  }


  /*
   * 2.
   * Testo della cella Player.
   *
   * Esempio:
   * Elena Rybakina KAZ
   */
  const playerText =
    normalizeText(
      await playerCell
        .innerText()
        .catch(
          () => "",
        ),
    );


  const playerMatch =
    playerText.match(
      /\b([A-Z]{3})\b/,
    );


  const playerCode =
    normalizeCountryCode(
      playerMatch?.[1],
    );


  if (playerCode) {
    return playerCode;
  }


  /*
   * 3.
   * Fallback sull'intera riga.
   */
  const rowText =
    normalizeText(
      await row
        .innerText()
        .catch(
          () => "",
        ),
    );


  const rowMatch =
    rowText.match(
      /\b([A-Z]{3})\b/,
    );


  return normalizeCountryCode(
    rowMatch?.[1],
  );
}


function cleanPlayerName(
  playerCellText: string,
  countryCode: string | null,
): string {
  let value =
    normalizeText(
      playerCellText,
    );


  if (
    countryCode
  ) {
    value =
      value.replace(
        new RegExp(
          `\\b${countryCode}\\b`,
          "gi",
        ),
        " ",
      );
  }


  value =
    value
      .replace(
        /\bview profile\b/gi,
        " ",
      )
      .replace(
        /\blatest matches\b/gi,
        " ",
      );


  return normalizeText(
    value,
  );
}


async function collectWtaProfileHrefs(
  page: Page,
): Promise<string[]> {
  /*
   * IMPORTANTE:
   *
   * Sul sito WTA i link profilo non sono
   * necessariamente figli della stessa <tr>
   * che contiene Rank / Player / Age / Points.
   *
   * Li raccogliamo quindi separatamente.
   *
   * Accettiamo SOLO il profilo base:
   *
   * /players/320760/aryna-sabalenka
   *
   * e scartiamo:
   *
   * /players/320760/aryna-sabalenka/matches
   */
  const hrefs =
    await page
      .locator(
        'a[href*="/players/"]',
      )
      .evaluateAll(
        (
          elements,
        ) =>
          elements
            .map(
              (
                element,
              ) =>
                element.getAttribute(
                  "href",
                ),
            )
            .filter(
              (
                href,
              ): href is string =>
                Boolean(
                  href,
                ),
            ),
      );


  const unique:
    string[] =
    [];


  const seen =
    new Set<
      string
    >();


  for (
    const href
    of hrefs
  ) {
    const normalized =
      normalizeProfileHref(
        href,
      );


    if (!normalized) {
      continue;
    }


    if (
      !/^\/players\/\d+\/[^/?#]+\/?$/i.test(
        normalized,
      )
    ) {
      continue;
    }


    if (
      seen.has(
        normalized,
      )
    ) {
      continue;
    }


    seen.add(
      normalized,
    );

    unique.push(
      normalized,
    );
  }


  return unique;
}


function deduplicateEntries(
  entries: WtaLiveRankingEntry[],
): WtaLiveRankingEntry[] {
  const byRank =
    new Map<
      number,
      WtaLiveRankingEntry
    >();


  for (
    const entry
    of entries
  ) {
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


    if (
      existing.profileSlug ===
      entry.profileSlug
    ) {
      continue;
    }


    throw new Error(
      [
        `Conflitto WTA sul rank ${entry.rank}.`,
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


async function parseRankingRows(
  page: Page,
  profileHrefs: string[],
): Promise<WtaLiveRankingEntry[]> {
  const rows =
    page.locator(
      "tr",
    );


  const rowCount =
    await rows.count();


  const entries:
    WtaLiveRankingEntry[] =
    [];


  for (
    let index = 0;
    index <
      rowCount;
    index += 1
  ) {
    const row =
      rows.nth(
        index,
      );


    const cells =
      row.locator(
        "td",
      );


    const cellCount =
      await cells.count();


    if (
      cellCount <
      5
    ) {
      continue;
    }


    /*
     * RANK
     */
    const rankText =
      normalizeText(
        await cells
          .nth(
            0,
          )
          .innerText()
          .catch(
            () => "",
          ),
      );


    const rankMatch =
      rankText.match(
        /^(\d{1,3})\b/,
      );


    const rank =
      rankMatch?.[1]
        ? Number.parseInt(
            rankMatch[1],
            10,
          )
        : null;


    if (
      rank === null ||
      !Number.isInteger(
        rank,
      ) ||
      rank < 1 ||
      rank >
        WTA_RANKING_LIMIT
    ) {
      continue;
    }


    /*
     * PROFILO
     *
     * I profili base WTA sono restituiti
     * nello stesso ordine della classifica.
     *
     * Rank 1 → indice 0
     * Rank 2 → indice 1
     * ...
     */
    const profileHref =
      profileHrefs[
        rank - 1
      ] ??
      null;


    const profileSlug =
      extractProfileSlug(
        profileHref,
      );


    if (!profileSlug) {
      continue;
    }


    /*
     * PLAYER CELL
     */
    const playerCell =
      cells.nth(
        1,
      );


    /*
     * COUNTRY CODE
     */
    const countryCode =
      await extractCountryCode(
        playerCell,
        row,
      );


    /*
     * NAME
     */
    const playerCellText =
      normalizeText(
        await playerCell
          .innerText()
          .catch(
            () => "",
          ),
      );


    const name =
      cleanPlayerName(
        playerCellText,
        countryCode,
      );


    if (!name) {
      continue;
    }


    const {
      firstName,
      lastName,
    } =
      splitName(
        name,
      );


    /*
     * AGE
     */
    const ageText =
      normalizeText(
        await cells
          .nth(
            2,
          )
          .innerText()
          .catch(
            () => "",
          ),
      );


    const ageValue =
      parseInteger(
        ageText,
      );


    const age =
      ageValue !== null &&
      ageValue > 0 &&
      ageValue < 60
        ? ageValue
        : null;


    /*
     * POINTS
     */
    const pointsText =
      normalizeText(
        await cells
          .nth(
            4,
          )
          .innerText()
          .catch(
            () => "",
          ),
      );


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


    entries.push({
      rank,

      name,

      firstName,

      lastName,

      country:
        null,

      countryCode,

      age,

      points,

      rankMovement:
        null,

      profileHref,

      profileSlug,
    });
  }


  return entries;
}


export async function parseWtaLiveRanking(
  page: Page,
): Promise<WtaLiveRankingEntry[]> {
  /*
   * Prima raccogliamo i profili.
   */
  const profileHrefs =
    await collectWtaProfileHrefs(
      page,
    );


  console.log(
    `🔗 WTA profili base trovati: ${profileHrefs.length}`,
  );


  /*
   * Protezione:
   *
   * se non abbiamo almeno 100 profili base,
   * non tentiamo di associare dati incompleti.
   */
  if (
    profileHrefs.length <
    WTA_RANKING_LIMIT
  ) {
    console.log(
      `⚠️ Profili WTA insufficienti: ${profileHrefs.length}/${WTA_RANKING_LIMIT}`,
    );
  }


  const entries =
    await parseRankingRows(
      page,
      profileHrefs,
    );


  const uniqueEntries =
    deduplicateEntries(
      entries,
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
        entry.rank >=
          1 &&
        entry.rank <=
          WTA_RANKING_LIMIT,
    )
    .slice(
      0,
      WTA_RANKING_LIMIT,
    );
}


export async function debugWtaRankingPage(
  page: Page,
): Promise<void> {
  const title =
    await page
      .title()
      .catch(
        () => "",
      );


  const rows =
    page.locator(
      "tr",
    );


  const rowCount =
    await rows.count();


  const playerLinks =
    await page
      .locator(
        'a[href*="/players/"]',
      )
      .count();


  const profileHrefs =
    await collectWtaProfileHrefs(
      page,
    );


  console.log("");
  console.log(
    "🧪 WTA RANKING DOM DIAGNOSTIC",
  );
  console.log(
    "────────────────────────────────────────",
  );


  console.log(
    `Title:          ${title || "unknown"}`,
  );

  console.log(
    `Table rows:     ${rowCount}`,
  );

  console.log(
    `Player links:   ${playerLinks}`,
  );

  console.log(
    `Base profiles:  ${profileHrefs.length}`,
  );


  console.log("");
  console.log(
    "First ranking rows:",
  );


  let printed =
    0;


  for (
    let index = 0;
    index <
      rowCount &&
    printed < 5;
    index += 1
  ) {
    const row =
      rows.nth(
        index,
      );


    const cells =
      row.locator(
        "td",
      );


    const cellCount =
      await cells.count();


    if (
      cellCount <
      5
    ) {
      continue;
    }


    const texts:
      string[] =
      [];


    for (
      let cellIndex = 0;
      cellIndex <
        Math.min(
          cellCount,
          5,
        );
      cellIndex += 1
    ) {
      texts.push(
        normalizeText(
          await cells
            .nth(
              cellIndex,
            )
            .innerText()
            .catch(
              () => "",
            ),
        ),
      );
    }


    console.log(
      `#${printed + 1}:`,
      {
        cells:
          texts,

        profileHref:
          profileHrefs[
            printed
          ] ??
          null,
      },
    );


    printed +=
      1;
  }


  console.log("");
}