import "dotenv/config";

import {
  pathToFileURL,
} from "url";

import {
  chromium,
  type Locator,
  type Page,
} from "playwright";

import {
  parseAtpTournamentFinal,
  type RawAtpTournamentFinal,
} from "./atp-tournament-parser";

import {
  validateAtpTournamentResult,
} from "./atp-tournament-validator";


const ATP_BASE_URL =
  "https://www.atptour.com";


export class AtpSourceBlockedError extends Error {
  readonly code =
    "ATP_SOURCE_BLOCKED";

  constructor(
    message: string,
  ) {
    super(
      message,
    );

    this.name =
      "AtpSourceBlockedError";
  }
}


type ExtractTournamentOptions = {
  tournamentSlug: string;
  tournamentId: string;
  year: number;
};


type ExtractedPlayer = {
  name: string;
  profileSlug: string | null;
  countryCode: string | null;
  atpId: string | null;
};


type FinalCandidate = {
  text: string;
  links: Array<{
    text: string;
    href: string | null;
  }>;
  images: Array<{
    alt: string | null;
    src: string | null;
  }>;
};


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


function normalizeSlug(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    )
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

  return normalized || null;
}


function countryCodeFromText(
  text: string,
  playerName: string,
): string | null {
  const escapedName =
    playerName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const directPattern =
    new RegExp(
      `${escapedName}\\s*\\(([A-Z]{3})\\)`,
      "i",
    );

  const match =
    text.match(
      directPattern,
    );

  return match?.[1]
    ?.toUpperCase() ??
    null;
}


function atpIdFromCandidate(
  candidate: FinalCandidate,
  playerName: string,
): string | null {
  /*
   * ATP espone spesso l'identificativo nelle immagini:
   * Player-Photo-s0ag
   * Player-Photo-z355
   */
  for (
    const image
    of candidate.images
  ) {
    const alt =
      normalizeText(
        image.alt,
      );

    const match =
      alt.match(
        /Player-Photo-([a-z0-9]+)/i,
      );

    if (match?.[1]) {
      /*
       * Non possiamo associare l'immagine al giocatore
       * usando soltanto l'alt se il DOM non conserva
       * vicinanza semantica. Proviamo prima il src.
       */
      const src =
        normalizeText(
          image.src,
        );

      if (
        src &&
        src.toLowerCase().includes(
          normalizeSlug(
            playerName,
          ) ?? "",
        )
      ) {
        return match[1]
          .toLowerCase();
      }
    }
  }

  /*
   * Fallback: gli href ATP dei profili contengono
   * normalmente /players/<slug>/<ATP-ID>/overview.
   */
  for (
    const link
    of candidate.links
  ) {
    if (
      normalizeText(
        link.text,
      ).localeCompare(
        playerName,
        undefined,
        {
          sensitivity:
            "base",
        },
      ) !== 0
    ) {
      continue;
    }

    const href =
      link.href ??
      "";

    const match =
      href.match(
        /\/players\/[^/]+\/([^/?#]+)(?:\/|$)/i,
      );

    if (match?.[1]) {
      return match[1]
        .toLowerCase();
    }
  }

  return null;
}


function profileSlugFromHref(
  href: string | null,
): string | null {
  if (!href) {
    return null;
  }

  const match =
    href.match(
      /\/players\/([^/]+)\/[^/?#]+(?:\/|$)/i,
    );

  return normalizeSlug(
    match?.[1],
  );
}


function extractPlayerFromLinks(
  candidate: FinalCandidate,
  playerName: string,
): ExtractedPlayer {
  const link =
    candidate.links.find(
      (entry) =>
        normalizeText(
          entry.text,
        ).localeCompare(
          playerName,
          undefined,
          {
            sensitivity:
              "base",
          },
        ) === 0,
    );

  return {
    name:
      playerName,

    profileSlug:
      profileSlugFromHref(
        link?.href ??
        null,
      ),

    countryCode:
      countryCodeFromText(
        candidate.text,
        playerName,
      ),

    atpId:
      atpIdFromCandidate(
        candidate,
        playerName,
      ),
  };
}


function scoreFromFinalText(
  text: string,
  winnerName: string,
): string | null {
  const escapedWinner =
    winnerName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const patterns = [
    new RegExp(
      `${escapedWinner}\\s+wins\\s+the\\s+match\\s+(.+?)(?:\\.|$)`,
      "i",
    ),

    /wins\s+the\s+match\s+(.+?)(?:\.|$)/i,
  ];

  for (
    const pattern
    of patterns
  ) {
    const match =
      text.match(
        pattern,
      );

    const score =
      normalizeText(
        match?.[1],
      );

    if (score) {
      return score;
    }
  }

  return null;
}


function winnerFromFinalText(
  text: string,
): string | null {
  const patterns = [
    /Game Set and Match\s+(.+?)\.\s+.+?\s+wins the match/i,
    /([A-ZÀ-ÖØ-Ý][\p{L}'’.\- ]+?)\s+wins\s+the\s+match/iu,
  ];

  for (
    const pattern
    of patterns
  ) {
    const match =
      text.match(
        pattern,
      );

    const winner =
      normalizeText(
        match?.[1],
      );

    if (winner) {
      return winner;
    }
  }

  return null;
}


function findRunnerUpName(
  candidate: FinalCandidate,
  winnerName: string,
): string | null {
  /*
   * Normal ATP Results pages expose player names through
   * /players/ anchors.
   *
   * ATP Stats Centre, however, can render the final without
   * player profile anchors. In that fallback we intentionally
   * create synthetic candidate links with href = null.
   *
   * Therefore:
   * - real links must point to /players/;
   * - synthetic links with href = null are also valid;
   * - unrelated links are ignored.
   */
  const playerLinks =
    candidate.links
      .map(
        (link) => ({
          name:
            normalizeText(
              link.text,
            ),

          href:
            link.href,
        }),
      )
      .filter(
        (link) => {
          if (!link.name) {
            return false;
          }

          if (link.href === null) {
            return true;
          }

          return /\/players\//i.test(
            link.href,
          );
        },
      );

  const uniqueNames =
    Array.from(
      new Set(
        playerLinks.map(
          (link) =>
            link.name,
        ),
      ),
    );

  return (
    uniqueNames.find(
      (name) =>
        name.localeCompare(
          winnerName,
          undefined,
          {
            sensitivity:
              "base",
          },
        ) !== 0,
    ) ??
    null
  );
}

async function candidateFromLocator(
  locator: Locator,
): Promise<FinalCandidate> {
  const text =
    normalizeText(
      await locator
        .innerText()
        .catch(
          () => "",
        ),
    );

  const links =
    await locator
      .locator(
        'a[href*="/players/"]',
      )
      .evaluateAll(
        (anchors) =>
          anchors.map(
            (anchor) => ({
              text:
                anchor.textContent ??
                "",

              href:
                anchor.getAttribute(
                  "href",
                ),
            }),
          ),
      )
      .catch(
        () => [],
      );

  const images =
    await locator
      .locator(
        "img",
      )
      .evaluateAll(
        (elements) =>
          elements.map(
            (image) => ({
              alt:
                image.getAttribute(
                  "alt",
                ),

              src:
                image.getAttribute(
                  "src",
                ),
            }),
          ),
      )
      .catch(
        () => [],
      );

  return {
    text,
    links,
    images,
  };
}


async function findSinglesFinalCandidate(
  page: Page,
): Promise<FinalCandidate> {
  /*
   * VERSIONE DOM-SAFE
   *
   * Non usiamo XPath e non richiediamo visibilità.
   * ATP può mantenere le match-notes nascoste via CSS
   * (come accade per Canada), ma i dati sono comunque
   * presenti nel DOM.
   *
   * Cerchiamo tutti gli elementi che contengono
   * "wins the match" e risaliamo con parentElement fino
   * a 8 livelli, scegliendo il primo blocco che:
   *
   * - contiene "Final";
   * - contiene "wins the match";
   * - contiene almeno due link ATP /players/.
   */
  const candidates =
    await page.evaluate(() => {
      type BrowserCandidate = {
        text: string;
        links: Array<{
          text: string;
          href: string | null;
        }>;
        images: Array<{
          alt: string | null;
          src: string | null;
        }>;
      };

      const allElements =
        Array.from(
          document.querySelectorAll(
            "body *",
          ),
        );

      const winningNodes =
        allElements.filter(
          (element) => {
            const ownText =
              (
                element.textContent ??
                ""
              )
                .replace(/\u00a0/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            if (
              !/wins the match/i.test(
                ownText,
              )
            ) {
              return false;
            }

            /*
             * Preferiamo nodi relativamente piccoli per
             * evitare di partire subito da body/main.
             */
            return (
              element.children.length <=
              8
            );
          },
        );

      const results:
        BrowserCandidate[] =
        [];

      const seen =
        new Set<string>();

      for (
        const node
        of winningNodes
      ) {
        let current:
          Element | null =
          node;

        for (
          let depth = 0;
          depth <= 8 &&
          current;
          depth += 1
        ) {
          const text =
            (
              current.textContent ??
              ""
            )
              .replace(/\u00a0/g, " ")
              .replace(/\s+/g, " ")
              .trim();

          if (
            /\bFinal\b/i.test(
              text,
            ) &&
            /wins the match/i.test(
              text,
            )
          ) {
            const playerAnchors =
              Array.from(
                current.querySelectorAll(
                  'a[href*="/players/"]',
                ),
              );

            if (
              playerAnchors.length >=
              2
            ) {
              const links =
                playerAnchors.map(
                  (anchor) => ({
                    text:
                      (
                        anchor.textContent ??
                        ""
                      )
                        .replace(/\u00a0/g, " ")
                        .replace(/\s+/g, " ")
                        .trim(),

                    href:
                      anchor.getAttribute(
                        "href",
                      ),
                  }),
                );

              const images =
                Array.from(
                  current.querySelectorAll(
                    "img",
                  ),
                ).map(
                  (image) => ({
                    alt:
                      image.getAttribute(
                        "alt",
                      ),

                    src:
                      image.getAttribute(
                        "src",
                      ),
                  }),
                );

              const signature =
                `${text}::${links
                  .map(
                    (link) =>
                      `${link.text}|${link.href ?? ""}`,
                  )
                  .join("::")}`;

              if (
                !seen.has(
                  signature,
                )
              ) {
                seen.add(
                  signature,
                );

                results.push({
                  text,
                  links,
                  images,
                });
              }
            }
          }

          current =
            current.parentElement;
        }
      }

      return results;
    });


  /*
   * La finale singolare deve contenere almeno due nomi
   * giocatore differenti.
   *
   * Preferiamo il candidato più piccolo: normalmente è
   * il match-card specifico e non il contenitore di un
   * intero round o dell'intera pagina.
   */
  const orderedCandidates =
    [...candidates].sort(
      (
        first,
        second,
      ) =>
        first.text.length -
        second.text.length,
    );


  for (
    const candidate
    of orderedCandidates
  ) {
    const playerNames =
      Array.from(
        new Set(
          candidate.links
            .map(
              (link) =>
                normalizeText(
                  link.text,
                ),
            )
            .filter(
              Boolean,
            ),
        ),
      );

    if (
      playerNames.length >=
      2
    ) {
      return candidate;
    }
  }


  throw new Error(
    "Unable to locate the completed Men's Singles Final on the ATP results page.",
  );
}

async function findStatsCentreFinalCandidate(
  page: Page,
): Promise<FinalCandidate> {
  /*
   * MS001 is already the official Men's Singles Final.
   *
   * IMPORTANT:
   * ATP Stats Centre does not always render player names as
   * /players/ anchors. Hong Kong 2026 is one such case.
   *
   * Therefore this fallback is intentionally TEXT-FIRST:
   * - wait for "wins the match";
   * - read the rendered body;
   * - extract the winner from the official completion sentence;
   * - infer the opponent from the rendered match header/text;
   * - create synthetic link entries with href = null.
   *
   * The normal AGE202 resolver can still match players by exact
   * display name even when ATP profile slugs are unavailable.
   */
  const bodyText =
    normalizeText(
      await page
        .locator("body")
        .innerText()
        .catch(() => ""),
    );

  if (
    !/wins the match/i.test(
      bodyText,
    )
  ) {
    throw new Error(
      "ATP Stats Centre rendered no completed-match text.",
    );
  }

  const winnerName =
    winnerFromFinalText(
      bodyText,
    );

  if (!winnerName) {
    throw new Error(
      "Unable to determine the winner from ATP Stats Centre text.",
    );
  }

  const escapedWinner =
    winnerName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  /*
   * Stats Centre commonly renders:
   *   Singles Final ... <player 1> <player 2> ...
   * and later:
   *   Game Set and Match <winner>. <winner> wins the match ...
   *
   * Prefer the name immediately surrounding the winner in the
   * final header. This keeps the fallback independent from ATP
   * profile anchors.
   */
  const nameToken =
    String.raw`[A-ZÀ-ÖØ-Ý][\p{L}'’.\-]+(?:\s+[A-ZÀ-ÖØ-Ý][\p{L}'’.\-]+){1,3}`;

  const opponentPatterns = [
    new RegExp(
      `Singles\\s+Final[\\s\\S]{0,500}?(${nameToken})\\s+${escapedWinner}\\b`,
      "iu",
    ),
    new RegExp(
      `Singles\\s+Final[\\s\\S]{0,500}?${escapedWinner}\\s+(${nameToken})\\b`,
      "iu",
    ),
  ];

  let runnerUpName:
    string | null =
    null;

  for (
    const pattern
    of opponentPatterns
  ) {
    const match =
      bodyText.match(
        pattern,
      );

    const value =
      normalizeText(
        match?.[1],
      );

    if (
      value &&
      value.localeCompare(
        winnerName,
        undefined,
        {
          sensitivity:
            "base",
        },
      ) !== 0
    ) {
      runnerUpName =
        value;
      break;
    }
  }

  /*
   * Defensive fallback for ATP's repeated accessibility text.
   * Look for a plausible full name immediately before/after the
   * winner within a short section preceding "Game Set and Match".
   */
  if (!runnerUpName) {
    const completionIndex =
      bodyText.search(
        /Game Set and Match/i,
      );

    const prefix =
      completionIndex >= 0
        ? bodyText.slice(
            Math.max(
              0,
              completionIndex -
                1500,
            ),
            completionIndex,
          )
        : bodyText.slice(
            0,
            3000,
          );

    const names =
      Array.from(
        prefix.matchAll(
          new RegExp(
            `\\b(${nameToken})\\b`,
            "giu",
          ),
        ),
      )
        .map(
          (match) =>
            normalizeText(
              match[1],
            ),
        )
        .filter(
          (name) =>
            Boolean(
              name,
            ) &&
            name.localeCompare(
              winnerName,
              undefined,
              {
                sensitivity:
                  "base",
              },
            ) !== 0,
        );

    runnerUpName =
      names.at(-1) ??
      null;
  }

  if (!runnerUpName) {
    throw new Error(
      "Unable to determine the runner-up from ATP Stats Centre text.",
    );
  }

  return {
    text:
      bodyText,

    links: [
      {
        text:
          winnerName,
        href:
          null,
      },
      {
        text:
          runnerUpName,
        href:
          null,
      },
    ],

    images:
      [],
  };
}


export async function extractAtpTournamentFinal(
  options: ExtractTournamentOptions,
): Promise<RawAtpTournamentFinal> {
  const tournamentSlug =
    normalizeSlug(
      options.tournamentSlug,
    );

  if (!tournamentSlug) {
    throw new Error(
      "Tournament slug is invalid.",
    );
  }

  if (
    !/^\d+$/.test(
      options.tournamentId,
    )
  ) {
    throw new Error(
      "ATP tournament ID must be numeric.",
    );
  }

  if (
    !Number.isInteger(
      options.year,
    )
  ) {
    throw new Error(
      "Tournament year must be an integer.",
    );
  }

  const url =
    `${ATP_BASE_URL}/en/scores/archive/${tournamentSlug}/${options.tournamentId}/${options.year}/results`;

  console.log("");
  console.log(
    "🌐 ATP extractor",
  );
  console.log(
    `   ${url}`,
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

    let extractionPage =
      page;

    await page.goto(
      url,
      {
        waitUntil:
          "domcontentloaded",

        timeout:
          60_000,
      },
    );

    /*
     * ATP può lasciare le match-notes nascoste via CSS.
     * Aspettiamo quindi la presenza TESTUALE nel DOM,
     * non la visibilità grafica.
     *
     * Alcuni eventi ATP hanno inoltre una pagina Results
     * incompleta/non popolata anche se il torneo è concluso
     * (Hong Kong 2026 è un caso reale).
     *
     * In quel caso usiamo il FINAL match ufficiale dello
     * Stats Centre ATP:
     *
     * /scores/stats-centre/archive/<year>/<tournamentId>/ms001
     *
     * MS001 è la finale singolare.
     */
    let finalSource =
      "results";

    try {
      await page.waitForFunction(
        () =>
          Array.from(
            document.querySelectorAll(
              "body *",
            ),
          ).some(
            (element) =>
              /wins the match/i.test(
                element.textContent ??
                "",
              ),
          ),
        undefined,
        {
          timeout:
            12_000,
        },
      );
    } catch {
      const statsCentreUrl =
        `${ATP_BASE_URL}/en/scores/stats-centre/archive/${options.year}/${options.tournamentId}/ms001`;

      console.log(
        "   ⚠️ Results page has no completed match data.",
      );
      console.log(
        "   ↪ Falling back to ATP Stats Centre final.",
      );
      console.log(
        `   ${statsCentreUrl}`,
      );

      /*
       * IMPORTANT:
       * The isolated Hong Kong diagnostic rendered the match
       * correctly when Stats Centre was opened directly as a
       * fresh page. Reusing the Results tab can leave ATP's SPA
       * in a state where the match never appears.
       *
       * So the fallback always boots Stats Centre in a NEW tab.
       */
      const statsPage =
        await context.newPage();

      extractionPage =
        statsPage;

      await statsPage.goto(
        statsCentreUrl,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );

      /*
       * The diagnostic showed Stats Plus needs a few seconds to
       * be received and rendered. Warm up first, then poll the
       * actual rendered body text from Node/Playwright.
       */
      await statsPage.waitForTimeout(
        15_000,
      );

      const statsDeadline =
        Date.now() +
        45_000;

      let statsReady =
        false;

      while (
        Date.now() <
        statsDeadline
      ) {
        const statsBodyText =
          normalizeText(
            await statsPage
              .locator(
                "body",
              )
              .innerText()
              .catch(
                () =>
                  "",
              ),
          );

        if (
          /wins the match/i.test(
            statsBodyText,
          )
        ) {
          statsReady =
            true;
          break;
        }

        await statsPage.waitForTimeout(
          2_000,
        );
      }

      if (!statsReady) {
        const debugBody =
          normalizeText(
            await statsPage
              .locator(
                "body",
              )
              .innerText()
              .catch(
                () =>
                  "",
              ),
          );

        console.log(
          "   🧪 Stats Centre body preview:",
        );
        console.log(
          `   ${debugBody.slice(0, 900)}`,
        );

        const securityVerificationDetected =
          /performing security verification/i.test(
            debugBody,
          ) ||
          /protect against malicious bots/i.test(
            debugBody,
          ) ||
          /cloudflare/i.test(
            debugBody,
          );

        if (
          securityVerificationDetected
        ) {
          throw new AtpSourceBlockedError(
            "ATP Stats Centre security verification blocked automated access.",
          );
        }

        throw new Error(
          "ATP Stats Centre did not render completed-match text in a fresh page within 45 seconds.",
        );
      }

      finalSource =
        "stats-centre";    }

    const candidate =
      finalSource ===
      "stats-centre"
        ? await findStatsCentreFinalCandidate(
            extractionPage,
          )
        : await findSinglesFinalCandidate(
            extractionPage,
          );

    if (
      finalSource ===
      "stats-centre"
    ) {
      console.log(
        "   ✅ ATP Stats Centre fallback resolved the final.",
      );
    }

    const winnerName =
      winnerFromFinalText(
        candidate.text,
      );

    if (!winnerName) {
      throw new Error(
        "Unable to determine the winner from the ATP final.",
      );
    }

    const runnerUpName =
      findRunnerUpName(
        candidate,
        winnerName,
      );

    if (!runnerUpName) {
      throw new Error(
        "Unable to determine the runner-up from the ATP final.",
      );
    }

    const score =
      scoreFromFinalText(
        candidate.text,
        winnerName,
      );

    if (!score) {
      throw new Error(
        "Unable to determine the final score from the ATP final.",
      );
    }

    const champion =
      extractPlayerFromLinks(
        candidate,
        winnerName,
      );

    const runnerUp =
      extractPlayerFromLinks(
        candidate,
        runnerUpName,
      );

    console.log("");
    console.log(
      "🎯 ATP final extracted",
    );
    console.log(
      `   Champion:  ${champion.name}`,
    );
    console.log(
      `   Runner-up: ${runnerUp.name}`,
    );
    console.log(
      `   Score:     ${score}`,
    );
    console.log(
      `   ATP IDs:   ${champion.atpId ?? "?"} / ${runnerUp.atpId ?? "?"}`,
    );
    console.log(
      `   Slugs:     ${champion.profileSlug ?? "?"} / ${runnerUp.profileSlug ?? "?"}`,
    );

    return {
      tournamentSlug,

      year:
        options.year,

      editionKey:
        "main",

      championName:
        champion.name,

      championProfileSlug:
        champion.profileSlug,

      championCountryCode:
        champion.countryCode,

      runnerUpName:
        runnerUp.name,

      runnerUpProfileSlug:
        runnerUp.profileSlug,

      runnerUpCountryCode:
        runnerUp.countryCode,

      score,
    };
  } finally {
    await browser.close();
  }
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ATP LIVE EXTRACTOR · DRY RUN",
  );
  console.log(
    "────────────────────────────────────────",
  );

  /*
   * Primo test controllato:
   * Mutua Madrid Open 2026
   * ATP tournament ID: 1536
   */
  const raw =
  await extractAtpTournamentFinal({
    tournamentSlug:
      "miami",

    tournamentId:
      "403",

    year:
      2026,
  });

  const parsed =
    parseAtpTournamentFinal(
      raw,
    );

  const validation =
    validateAtpTournamentResult(
      parsed,
    );

  console.log("");
  console.log(
    "📦 AGE202 normalized result",
  );

  console.dir(
    parsed,
    {
      depth:
        null,
    },
  );

  console.log("");

  if (
    validation.warnings.length >
    0
  ) {
    console.log(
      "⚠️ Warnings",
    );

    for (
      const warning
      of validation.warnings
    ) {
      console.log(
        `   • ${warning}`,
      );
    }

    console.log("");
  }

  if (
    !validation.valid
  ) {
    console.log(
      "🔴 VALIDATION FAILED",
    );

    for (
      const error
      of validation.errors
    ) {
      console.log(
        `   • ${error}`,
      );
    }

    process.exitCode =
      1;

    return;
  }

  console.log(
    "🟢 VALIDATION PASSED",
  );

  console.log("");
  console.log(
    "🛡️ DATABASE UNCHANGED",
  );
  console.log(
    "   Live ATP extraction completed, but syncAtpTournamentResult() was NOT called.",
  );
  console.log("");
}


const isDirectExecution =
  Boolean(
    process.argv[1],
  ) &&
  import.meta.url ===
    pathToFileURL(
      process.argv[1],
    ).href;


if (isDirectExecution) {
  main().catch(
    (error) => {
      console.error("");
      console.error(
        "❌ ATP live extraction failed.",
      );
      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );
}