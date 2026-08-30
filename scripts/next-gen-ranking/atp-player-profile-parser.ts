import type {
  Page,
} from "playwright";


export type ParsedAtpPlayerProfile = {
  currentRank: number | null;

  careerHighRank: number | null;

  careerHighDate: string | null;
};


function parsePositiveInteger(
  value: string | null | undefined,
): number | null {
  if (!value) {
    return null;
  }


  const normalized =
    value
      .replace(
        /,/g,
        "",
      )
      .trim();


  const match =
    normalized.match(
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


  if (
    !Number.isFinite(
      parsed,
    ) ||
    parsed <= 0
  ) {
    return null;
  }


  return parsed;
}


export async function parseAtpPlayerProfile(
  page: Page,
): Promise<ParsedAtpPlayerProfile> {
  const bodyText =
    (
      await page
        .locator(
          "body",
        )
        .innerText()
        .catch(
          () => "",
        )
    )
      .replace(
        /\s+/g,
        " ",
      )
      .trim();


  if (!bodyText) {
    throw new Error(
      "Profilo ATP vuoto.",
    );
  }


  if (
    /performing security verification/i.test(
      bodyText,
    ) ||
    /just a moment/i.test(
      bodyText,
    )
  ) {
    throw new Error(
      "ATP Cloudflare challenge rilevata.",
    );
  }


  let currentRank:
    number | null =
      null;


  /*
   * Primo tentativo:
   * ATP espone normalmente il ranking
   * corrente attraverso elementi:
   *
   * <div class="stat">200</div>
   * <span class="stat-label">Rank</span>
   *
   * Cerchiamo quindi lo stat associato
   * alla label Rank.
   */
  const currentRankFromDom =
    await page.evaluate(
      () => {
        const labels =
          Array.from(
            document.querySelectorAll(
              ".stat-label",
            ),
          );


        for (
          const label
          of labels
        ) {
          const labelText =
            label.textContent
              ?.replace(
                /\s+/g,
                " ",
              )
              .trim() ??
            "";


          if (
            labelText.toLowerCase() !==
            "rank"
          ) {
            continue;
          }


          const parent =
            label.parentElement;


          if (!parent) {
            continue;
          }


          const stat =
            parent.querySelector(
              ".stat",
            );


          const statText =
            stat?.textContent
              ?.replace(
                /\s+/g,
                " ",
              )
              .trim() ??
            "";


          if (
            statText
          ) {
            return statText;
          }
        }


        return null;
      },
    );


  currentRank =
    parsePositiveInteger(
      currentRankFromDom,
    );


  /*
   * Fallback:
   * nel testo ATP compare anche
   *
   * YTD Rank: 200
   */
  if (
    currentRank ===
    null
  ) {
    const ytdRankMatch =
      bodyText.match(
        /YTD\s+Rank:\s*([0-9,]+)/i,
      );


    currentRank =
      parsePositiveInteger(
        ytdRankMatch?.[1],
      );
  }


  /*
   * Career High.
   *
   * Il formato osservato sul profilo ATP è:
   *
   * Career High Rank (2026.08.24): 200
   */
  const careerHighMatch =
    bodyText.match(
      /Career\s+High\s+Rank\s*\(([^)]+)\)\s*:\s*([0-9,]+)/i,
    );


  const careerHighDate =
    careerHighMatch?.[1]
      ?.trim() ??
    null;


  const careerHighRank =
    parsePositiveInteger(
      careerHighMatch?.[2],
    );


  return {
    currentRank,

    careerHighRank,

    careerHighDate,
  };
}