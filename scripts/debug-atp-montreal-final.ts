import "dotenv/config";

import {
  chromium,
} from "playwright";


const TEST_URL =
  "https://www.atptour.com/en/scores/archive/montreal/421/2026/results";


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


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · MONTREAL FINAL DIAGNOSTIC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `🌐 ${TEST_URL}`,
  );
  console.log(
    "🛡️ Read-only mode · database unchanged",
  );
  console.log("");

  const browser =
    await chromium.launch({
      headless: true,
    });

  try {
    const context =
      await browser.newContext({
        locale: "en-US",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      });

    const page =
      await context.newPage();

    await page.goto(
      TEST_URL,
      {
        waitUntil:
          "domcontentloaded",
        timeout:
          60_000,
      },
    );

    await page.waitForTimeout(
      12_000,
    );

    const bodyText =
      await page
        .locator("body")
        .innerText();

    const lines =
      bodyText
        .split(/\r?\n/)
        .map(normalizeText)
        .filter(Boolean);

    const finalLineIndexes =
      lines
        .map(
          (line, index) => ({
            line,
            index,
          }),
        )
        .filter(
          ({ line }) =>
            /\bfinals?\b/i.test(line) &&
            !/quarter|semi|qualifying/i.test(line),
        );

    console.log(
      `Final text lines found: ${finalLineIndexes.length}`,
    );
    console.log("");

    for (
      const [candidateIndex, candidate]
      of finalLineIndexes.entries()
    ) {
      const start =
        Math.max(
          0,
          candidate.index - 8,
        );

      const end =
        Math.min(
          lines.length,
          candidate.index + 22,
        );

      console.log(
        `FINAL LINE CANDIDATE ${candidateIndex + 1}`,
      );

      for (
        let index = start;
        index < end;
        index += 1
      ) {
        const marker =
          index === candidate.index
            ? ">>>"
            : "   ";

        console.log(
          `${marker} ${index}: ${lines[index]}`,
        );
      }

      console.log(
        "────────────────────────────────────────────",
      );
    }

    const resultLines =
      lines.filter(
        (line) =>
          /wins the match|walkover|\bw\/o\b|retired|withdrawn|defaulted/i.test(
            line,
          ),
      );

    console.log("");
    console.log(
      `Result-like lines found: ${resultLines.length}`,
    );
    console.log("");

    for (
      const [index, line]
      of resultLines.entries()
    ) {
      console.log(
        `RESULT ${index + 1}: ${line}`,
      );
    }

    console.log("");
    console.log(
      "✅ Diagnostic completed.",
    );
    console.log(
      "🛡️ Database writes: 0",
    );
    console.log("");
  } finally {
    await browser.close();
  }
}


main().catch(
  (error: unknown) => {
    console.error("");
    console.error(
      "❌ Montreal final diagnostic failed.",
    );
    console.error(
      error instanceof Error
        ? error.message
        : error,
    );
    console.error("");

    process.exitCode =
      1;
  },
);
