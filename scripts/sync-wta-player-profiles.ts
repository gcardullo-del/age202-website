import { config } from "dotenv";

import {
  chromium,
  type Page,
} from "playwright";

config();


const WTA_RANKING_URL =
  "https://www.wtatennis.com/rankings/singles";

const WRITE_FLAG =
  "--write";

const DEFAULT_LIMIT =
  50;

const DEFAULT_STALE_DAYS =
  30;

const FORCE_FLAG =
  "--force";


type WtaProfileLink = {
  slug: string;
  href: string;
};


type ExtractedWtaProfile = {
  profileUrl: string;

  birthDate: Date | null;
  birthPlace: string | null;

  height: number | null;

  plays: string | null;
  coach: string | null;

  careerHigh: number | null;

  australianOpen: number | null;
  rolandGarros: number | null;
  wimbledon: number | null;
  usOpen: number | null;
  grandSlams: number | null;
};


type SyncResult = {
  rank: number;
  name: string;

  status:
    | "passed"
    | "written"
    | "failed"
    | "skipped";

  detail: string;
};


function getRequestedLimit(): number {
  const argument =
    process.argv.find(
      (value) =>
        value.startsWith(
          "--limit=",
        ),
    );

  if (!argument) {
    return DEFAULT_LIMIT;
  }

  const parsed =
    Number.parseInt(
      argument.slice(
        "--limit=".length,
      ),
      10,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed < 1
  ) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    parsed,
    DEFAULT_LIMIT,
  );
}


function getRequestedStaleDays(): number {
  const argument =
    process.argv.find(
      (value) =>
        value.startsWith(
          "--stale-days=",
        ),
    );

  if (!argument) {
    return DEFAULT_STALE_DAYS;
  }

  const parsed =
    Number.parseInt(
      argument.slice(
        "--stale-days=".length,
      ),
      10,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed < 1
  ) {
    return DEFAULT_STALE_DAYS;
  }

  return parsed;
}


function isProfileIncomplete(
  profile:
    | {
        birthDate: Date | null;
        height: number | null;
        plays: string | null;
        careerHigh: number | null;
      }
    | null,
): boolean {
  if (!profile) {
    return true;
  }

  /*
   * Questi sono i quattro dati "core" che il profilo WTA
   * ufficiale espone in modo sufficientemente stabile.
   *
   * Coach e birthplace NON sono bloccanti:
   * possono legittimamente non essere pubblicati e non
   * vogliamo riscrapare la stessa giocatrice ogni giorno.
   */
  return (
    !profile.birthDate ||
    !profile.height ||
    !profile.plays ||
    !profile.careerHigh
  );
}


function isProfileStale(
  updatedAt: Date | null,
  staleDays: number,
): boolean {
  if (!updatedAt) {
    return true;
  }

  const staleBefore =
    new Date(
      Date.now() -
        staleDays *
          24 *
          60 *
          60 *
          1000,
    );

  return (
    updatedAt <
    staleBefore
  );
}


function normalizeSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
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
}


function cleanText(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const cleaned =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  return cleaned.length > 0
    ? cleaned
    : null;
}


function firstLineAfterLabel(
  bodyText: string,
  label: string,
): string | null {
  const lines =
    bodyText
      .split(
        /\r?\n/,
      )
      .map(
        (line) =>
          line.trim(),
      )
      .filter(
        Boolean,
      );

  const normalizedLabel =
    label
      .trim()
      .toLowerCase();

  const index =
    lines.findIndex(
      (line) =>
        line.toLowerCase() ===
        normalizedLabel,
    );

  if (
    index < 0 ||
    index + 1 >=
      lines.length
  ) {
    return null;
  }

  return cleanText(
    lines[
      index + 1
    ],
  );
}


function parseHeightCm(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const metricMatch =
    value.match(
      /\((\d(?:\.\d{1,2})?)\s*m\)/i,
    );

  if (metricMatch) {
    const metres =
      Number.parseFloat(
        metricMatch[1],
      );

    if (
      Number.isFinite(
        metres,
      )
    ) {
      return Math.round(
        metres * 100,
      );
    }
  }

  const centimetreMatch =
    value.match(
      /(\d{3})\s*cm/i,
    );

  if (centimetreMatch) {
    const centimetres =
      Number.parseInt(
        centimetreMatch[1],
        10,
      );

    if (
      Number.isInteger(
        centimetres,
      )
    ) {
      return centimetres;
    }
  }

  return null;
}


function parseBirthday(
  value: string | null,
): Date | null {
  if (!value) {
    return null;
  }

  const match =
    value.match(
      /([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/,
    );

  if (!match) {
    return null;
  }

  const date =
    new Date(
      `${match[1]} ${match[2]}, ${match[3]} 12:00:00 UTC`,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}


function parsePositiveInteger(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const match =
    value.match(
      /\d+/,
    );

  if (!match) {
    return null;
  }

  const parsed =
    Number.parseInt(
      match[0],
      10,
    );

  return Number.isInteger(
    parsed,
  )
    ? parsed
    : null;
}


function parseCoach(
  bodyText: string,
): string | null {
  const match =
    bodyText.match(
      /(?:^|\n)\s*Coached by\s+([^\n]+)/i,
    );

  if (!match) {
    return null;
  }

  return cleanText(
    match[1],
  );
}


function parseSlamTitles(
  bodyText: string,
  tournamentName: string,
): number | null {
  const escapedName =
    tournamentName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const sectionMatch =
    bodyText.match(
      new RegExp(
        `${escapedName}[\\s\\S]{0,220}?(?:(\\d+)x\\s+Winner|\\bWinner\\b)`,
        "i",
      ),
    );

  if (!sectionMatch) {
    return 0;
  }

  if (
    sectionMatch[1]
  ) {
    return Number.parseInt(
      sectionMatch[1],
      10,
    );
  }

  return 1;
}


async function acceptCookies(
  page: Page,
): Promise<void> {
  const button =
    page.locator(
      "#onetrust-accept-btn-handler",
    );

  try {
    if (
      await button
        .first()
        .isVisible({
          timeout:
            1200,
        })
    ) {
      await button
        .first()
        .click({
          timeout:
            3000,
        });
    }
  } catch {
    /*
     * Il banner non è sempre presente.
     * Non è un errore bloccante.
     */
  }
}


async function readBodyText(
  page: Page,
): Promise<string> {
  return (
    await page
      .locator(
        "body",
      )
      .innerText({
        timeout:
          15000,
      })
  );
}


async function discoverWtaProfileLinks(
  page: Page,
): Promise<WtaProfileLink[]> {
  console.log("");
  console.log(
    "🌐 Discovery profili WTA...",
  );
  console.log(
    WTA_RANKING_URL,
  );

  await page.goto(
    WTA_RANKING_URL,
    {
      waitUntil:
        "domcontentloaded",

      timeout:
        60000,
    },
  );

  await acceptCookies(
    page,
  );

  await page.waitForTimeout(
    2500,
  );

  /*
   * La pagina ranking mostra inizialmente solo una parte
   * della classifica. Proviamo ad espanderla senza rendere
   * il click obbligatorio: se il bottone non è disponibile,
   * continuiamo con i link già presenti.
   */
  for (
    let attempt = 0;
    attempt < 4;
    attempt += 1
  ) {
    const loadMore =
      page.getByRole(
        "button",
        {
          name:
            /load more/i,
        },
      );

    try {
      if (
        await loadMore
          .first()
          .isVisible({
            timeout:
              1000,
          })
      ) {
        await loadMore
          .first()
          .click({
            timeout:
              5000,

            force:
              true,
          });

        await page.waitForTimeout(
          1200,
        );
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  const hrefs =
    await page
      .locator(
        'a[href^="/players/"]',
      )
      .evaluateAll(
        (
          elements,
        ) =>
          elements
            .map(
              (element) =>
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

  const discovered =
    new Map<
      string,
      WtaProfileLink
    >();

  for (
    const href
    of hrefs
  ) {
    const match =
      href.match(
        /^\/players\/\d+\/([^/?#]+)\/?$/,
      );

    if (!match) {
      continue;
    }

    const slug =
      normalizeSlug(
        match[1],
      );

    if (
      !discovered.has(
        slug,
      )
    ) {
      discovered.set(
        slug,
        {
          slug,

          href:
            new URL(
              href,
              "https://www.wtatennis.com",
            ).toString(),
        },
      );
    }
  }

  console.log(
    `✅ Profili WTA scoperti: ${discovered.size}`,
  );

  return [
    ...discovered.values(),
  ];
}


function resolveProfileLink(
  links: WtaProfileLink[],
  player: {
    slug: string;
    name: string;
  },
): WtaProfileLink | null {
  const playerSlug =
    normalizeSlug(
      player.slug,
    );

  const exact =
    links.find(
      (link) =>
        link.slug ===
        playerSlug,
    );

  if (exact) {
    return exact;
  }

  const nameSlug =
    normalizeSlug(
      player.name,
    );

  const byName =
    links.find(
      (link) =>
        link.slug ===
        nameSlug,
    );

  if (byName) {
    return byName;
  }

  const relaxed =
    links.find(
      (link) =>
        link.slug.includes(
          nameSlug,
        ) ||
        nameSlug.includes(
          link.slug,
        ),
    );

  return (
    relaxed ??
    null
  );
}


async function extractWtaProfile(
  page: Page,
  profileUrl: string,
): Promise<ExtractedWtaProfile> {
  await page.goto(
    profileUrl,
    {
      waitUntil:
        "domcontentloaded",

      timeout:
        60000,
    },
  );

  await acceptCookies(
    page,
  );

  await page.waitForTimeout(
    1400,
  );

  const bodyText =
    await readBodyText(
      page,
    );

  const birthDate =
    parseBirthday(
      firstLineAfterLabel(
        bodyText,
        "Birthday",
      ),
    );

  const birthPlace =
    firstLineAfterLabel(
      bodyText,
      "Birthplace",
    );

  const height =
    parseHeightCm(
      firstLineAfterLabel(
        bodyText,
        "Height",
      ),
    );

  const plays =
    firstLineAfterLabel(
      bodyText,
      "Plays",
    );

  const careerHigh =
    parsePositiveInteger(
      firstLineAfterLabel(
        bodyText,
        "Career High",
      ),
    );

  const coach =
    parseCoach(
      bodyText,
    );


  /*
   * IMPORTANTE:
   * non deduciamo i titoli Slam dalla pagina /record.
   *
   * Quella pagina contiene più occorrenze di "Winner" e può
   * produrre falsi positivi. I titoli verranno sincronizzati
   * in un passaggio dedicato e verificato.
   */
  const australianOpen = null;
  const rolandGarros = null;
  const wimbledon = null;
  const usOpen = null;
  const grandSlams = null;

  return {
    profileUrl,

    birthDate,
    birthPlace,

    height,

    plays,
    coach,

    careerHigh,

    australianOpen,
    rolandGarros,
    wimbledon,
    usOpen,
    grandSlams,
  };
}


function describeProfile(
  profile: ExtractedWtaProfile,
): string {
  return [
    profile.birthDate
      ? `DOB ${profile.birthDate.toISOString().slice(0, 10)}`
      : "DOB —",

    profile.birthPlace
      ? `Born ${profile.birthPlace}`
      : "Born —",

    profile.height
      ? `${profile.height} cm`
      : "Height —",

    profile.plays
      ? `Plays ${profile.plays}`
      : "Plays —",

    profile.careerHigh
      ? `High #${profile.careerHigh}`
      : "High —",

    profile.coach
      ? `Coach ${profile.coach}`
      : "Coach —",

    `Slams deferred`,
  ].join(
    " · ",
  );
}


async function main() {
  /*
   * Import dinamico intenzionale:
   * carichiamo .env PRIMA di importare lib/prisma,
   * così il controllo DATABASE_URL del progetto trova
   * sicuramente le variabili d'ambiente.
   */
  const {
    prisma,
  } =
    await import(
      "../lib/prisma"
    );

  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );

  const limit =
    getRequestedLimit();

  const staleDays =
    getRequestedStaleDays();

  const forceEnabled =
    process.argv.includes(
      FORCE_FLAG,
    );

  console.log("");
  console.log(
    "🎾 AGE202 · WTA PLAYER PROFILE SYNC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    writeEnabled
      ? "🔴 WRITE MODE"
      : "🛡️ DRY RUN · DATABASE UNCHANGED",
  );
  console.log(
    `🎯 Limit: Top ${limit}`,
  );

  console.log(
    `🕒 Refresh threshold: ${staleDays} days`,
  );

  console.log(
    forceEnabled
      ? "⚡ Force refresh: ON"
      : "🧠 Smart refresh: ON",
  );


  const rankingPlayers =
    await prisma.wtaPlayer.findMany({
      where: {
        active:
          true,

        rank: {
          lte:
            limit,
        },

        playerId: {
          not:
            null,
        },
      },

      orderBy: {
        rank:
          "asc",
      },

      select: {
        rank:
          true,

        name:
          true,

        slug:
          true,

        playerId:
          true,

        player: {
          select: {
            id:
              true,

            name:
              true,

            slug:
              true,

            playerProfile: {
              select: {
                birthDate:
                  true,

                height:
                  true,

                plays:
                  true,

                careerHigh:
                  true,

                updatedAt:
                  true,
              },
            },
          },
        },
      },
    });


  console.log(
    `📦 Giocatrici AGE202 collegate: ${rankingPlayers.length}`,
  );


  const candidates =
    rankingPlayers.filter(
      (
        rankingPlayer,
      ) => {
        if (
          forceEnabled
        ) {
          return true;
        }

        const profile =
          rankingPlayer.player
            ?.playerProfile ??
          null;

        return (
          isProfileIncomplete(
            profile,
          ) ||
          isProfileStale(
            profile?.updatedAt ??
              null,
            staleDays,
          )
        );
      },
    );


  const skippedUpToDate =
    rankingPlayers.filter(
      (
        rankingPlayer,
      ) =>
        !candidates.some(
          (
            candidate,
          ) =>
            candidate.rank ===
            rankingPlayer.rank,
        ),
    );


  console.log(
    `🔄 Profili da aggiornare: ${candidates.length}`,
  );

  console.log(
    `✅ Profili già completi/recenti: ${skippedUpToDate.length}`,
  );


  if (
    candidates.length ===
    0
  ) {
    console.log("");
    console.log(
      "✅ Nessun profilo WTA richiede aggiornamento.",
    );
    console.log(
      "🛡️ Nessuno scraping necessario.",
    );

    await prisma.$disconnect();

    return;
  }


  const browser =
    await chromium.launch({
      headless:
        true,
    });

  const context =
    await browser.newContext({
      locale:
        "en-US",
    });

  const page =
    await context.newPage();

  const results:
    SyncResult[] = [];


  try {
    const profileLinks =
      await discoverWtaProfileLinks(
        page,
      );


    for (
      const rankingPlayer
      of candidates
    ) {
      console.log("");
      console.log(
        `🎾 #${rankingPlayer.rank} ${rankingPlayer.name}`,
      );

      if (
        !rankingPlayer.playerId ||
        !rankingPlayer.player
      ) {
        console.log(
          "   ⏭️ SKIPPED · Player AGE202 non collegato",
        );

        results.push({
          rank:
            rankingPlayer.rank,

          name:
            rankingPlayer.name,

          status:
            "skipped",

          detail:
            "Player AGE202 non collegato",
        });

        continue;
      }

      const profileLink =
        resolveProfileLink(
          profileLinks,
          {
            slug:
              rankingPlayer.slug,

            name:
              rankingPlayer.name,
          },
        );

      if (!profileLink) {
        console.log(
          "   🔴 FAILED · profilo WTA ufficiale non trovato",
        );

        results.push({
          rank:
            rankingPlayer.rank,

          name:
            rankingPlayer.name,

          status:
            "failed",

          detail:
            "Profilo WTA ufficiale non trovato",
        });

        continue;
      }

      try {
        console.log(
          `   🌐 ${profileLink.href}`,
        );

        const extracted =
          await extractWtaProfile(
            page,
            profileLink.href,
          );

        const detail =
          describeProfile(
            extracted,
          );

        console.log(
          `   📋 ${detail}`,
        );


        if (!writeEnabled) {
          console.log(
            "   🟢 PASSED · dry run",
          );

          results.push({
            rank:
              rankingPlayer.rank,

            name:
              rankingPlayer.name,

            status:
              "passed",

            detail,
          });

          continue;
        }


        await prisma.playerProfile.upsert({
          where: {
            playerId:
              rankingPlayer.playerId,
          },

          create: {
            playerId:
              rankingPlayer.playerId,

            birthDate:
              extracted.birthDate ??
              undefined,

            birthPlace:
              extracted.birthPlace ??
              undefined,

            height:
              extracted.height ??
              undefined,

            plays:
              extracted.plays ??
              undefined,

            coach:
              extracted.coach ??
              undefined,

            careerHigh:
              extracted.careerHigh ??
              undefined,

          },

          update: {
            birthDate:
              extracted.birthDate ??
              undefined,

            birthPlace:
              extracted.birthPlace ??
              undefined,

            height:
              extracted.height ??
              undefined,

            plays:
              extracted.plays ??
              undefined,

            coach:
              extracted.coach ??
              undefined,

            careerHigh:
              extracted.careerHigh ??
              undefined,

          },
        });


        console.log(
          "   💾 WRITTEN · PlayerProfile updated",
        );

        results.push({
          rank:
            rankingPlayer.rank,

          name:
            rankingPlayer.name,

          status:
            "written",

          detail,
        });
      } catch (
        error
      ) {
        const message =
          error instanceof Error
            ? error.message
            : String(
                error,
              );

        console.log(
          `   🔴 FAILED · ${message}`,
        );

        results.push({
          rank:
            rankingPlayer.rank,

          name:
            rankingPlayer.name,

          status:
            "failed",

          detail:
            message,
        });
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }


  for (
    const rankingPlayer
    of skippedUpToDate
  ) {
    results.push({
      rank:
        rankingPlayer.rank,

      name:
        rankingPlayer.name,

      status:
        "skipped",

      detail:
        `Complete and refreshed within ${staleDays} days`,
    });
  }


  const passed =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "passed",
    ).length;

  const written =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "written",
    ).length;

  const failed =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "failed",
    ).length;

  const skipped =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "skipped",
    ).length;


  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    "🏆 AGE202 WTA PROFILE REPORT",
  );
  console.log(
    "════════════════════════════════════════════",
  );

  for (
    const result
    of results
  ) {
    const icon =
      result.status ===
      "failed"
        ? "🔴"
        : result.status ===
          "written"
          ? "💾"
          : result.status ===
            "passed"
            ? "🟢"
            : "⏭️";

    console.log(
      `${icon} #${result.rank} ${result.name} · ${result.status.toUpperCase()} · ${result.detail}`,
    );
  }

  console.log("");
  console.log(
    `🟢 Passed:  ${passed}`,
  );
  console.log(
    `💾 Written: ${written}`,
  );
  console.log(
    `🔴 Failed:  ${failed}`,
  );
  console.log(
    `⏭️ Skipped: ${skipped}`,
  );

  if (!writeEnabled) {
    console.log(
      "🛡️ Database writes: 0",
    );
  }

  console.log("");


  if (
    failed > 0
  ) {
    process.exitCode =
      1;
  }

  await prisma.$disconnect();
}


main()
  .catch(
    (
      error: unknown,
    ) => {
      console.error("");
      console.error(
        "❌ WTA player profile sync crashed.",
      );
      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  )
;
