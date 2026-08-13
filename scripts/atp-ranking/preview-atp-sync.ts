import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  prisma,
} from "@/lib/prisma";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  validateAtpLiveRanking,
} from "./atp-live-validator";

import {
  buildAtpRankingPreview,
} from "./atp-ranking-preview";

import {
  ATP_LIVE_RANKING_URL,
} from "./types";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


function formatMovement(
  oldRank: number,
  newRank: number,
): string {
  if (newRank < oldRank) {
    return `▲ ${oldRank - newRank}`;
  }

  if (newRank > oldRank) {
    return `▼ ${newRank - oldRank}`;
  }

  return "—";
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP Live Sync Preview",
  );
  console.log(
    "────────────────────────────────────",
  );
  console.log(
    "🛡️ Modalità PREVIEW: il database NON verrà modificato.",
  );
  console.log("");

  const browser =
    await chromium.launch({
      headless: true,
    });

  try {
    const page =
      await browser.newPage({
        viewport: {
          width: 1440,
          height: 1200,
        },
        locale:
          "en-US",
        userAgent:
          USER_AGENT,
      });

    console.log(
      "🌐 Lettura ATP Live Rankings...",
    );

    const response =
      await page.goto(
        ATP_LIVE_RANKING_URL,
        {
          waitUntil:
            "domcontentloaded",
          timeout:
            60_000,
        },
      );

    const status =
      response?.status() ??
      null;

    console.log(
      `📡 HTTP: ${status ?? "unknown"}`,
    );

    if (
      status !== null &&
      status >= 400
    ) {
      throw new Error(
        `ATP ha risposto con HTTP ${status}.`,
      );
    }

    await page.waitForTimeout(
      5_000,
    );

    const entries =
      await parseAtpLiveRanking(
        page,
      );

    const validation =
      validateAtpLiveRanking(
        entries,
      );

    if (!validation.valid) {
      throw new Error(
        [
          "Dataset ATP non valido.",
          ...validation.errors,
        ].join("\n"),
      );
    }

    console.log(
      `✅ ATP Top 100 validata: ${entries.length} giocatori.`,
    );

    const preview =
      await buildAtpRankingPreview(
        entries,
      );

    console.log("");
    console.log(
      "📊 CONFRONTO ATP LIVE → AGE202",
    );
    console.log(
      "────────────────────────────────────",
    );

    console.log(
      `✅ Match AGE202:       ${preview.matched}`,
    );
    console.log(
      `🆕 Nuovi giocatori:    ${preview.newPlayers}`,
    );
    console.log(
      `⬆️  Saliti:             ${preview.movedUp}`,
    );
    console.log(
      `⬇️  Scesi:              ${preview.movedDown}`,
    );
    console.log(
      `➖ Invariati:          ${preview.unchanged}`,
    );
    console.log(
      `💰 Punti modificati:   ${preview.pointsChanged}`,
    );
    console.log(
      `🚪 Fuori Top 100:      ${preview.leavingTop100.length}`,
    );

    console.log("");
    console.log(
      "🔎 PRIME 20 POSIZIONI",
    );
    console.log(
      "────────────────────────────────────",
    );

    for (
      const row
      of preview.rows.slice(
        0,
        20,
      )
    ) {
      const oldRank =
        row.existing?.rank ??
        null;

      const movement =
        oldRank === null
          ? "NEW"
          : formatMovement(
              oldRank,
              row.incoming.rank,
            );

      const oldPoints =
        row.existing?.points;

      const pointsLabel =
        oldPoints === null ||
        oldPoints === undefined
          ? `${row.incoming.points.toLocaleString("en-US")} pts`
          : `${oldPoints.toLocaleString("en-US")} → ${row.incoming.points.toLocaleString("en-US")} pts`;

      console.log(
        `${String(row.incoming.rank).padStart(3, " ")}  ${row.incoming.name.padEnd(28, " ")} ${movement.padEnd(6, " ")} ${pointsLabel}`,
      );
    }

    const newPlayers =
      preview.rows.filter(
        (row) =>
          row.status === "new",
      );

    if (
      newPlayers.length > 0
    ) {
      console.log("");
      console.log(
        "🆕 GIOCATORI NON PRESENTI IN AGE202",
      );
      console.log(
        "────────────────────────────────────",
      );

      for (
        const row
        of newPlayers
      ) {
        console.log(
          `${String(row.incoming.rank).padStart(3, " ")}  ${row.incoming.name}  (${row.incoming.profileSlug ?? "slug missing"})`,
        );

        console.log(
          `     countryCode ATP: ${row.incoming.countryCode ?? "—"}`,
        );

        console.log(
          `     country:         ${row.incoming.country ?? "—"}`,
        );

        console.log(
          `     age:             ${row.incoming.age ?? "—"}`,
        );
      }
    }

    if (
      preview.leavingTop100.length > 0
    ) {
      console.log("");
      console.log(
        "🚪 GIOCATORI CHE USCIREBBERO DALLA TOP 100",
      );
      console.log(
        "────────────────────────────────────",
      );

      for (
        const player
        of preview.leavingTop100
      ) {
        console.log(
          `${String(player.rank).padStart(3, " ")}  ${player.name}  (${player.slug})`,
        );
      }
    }

    console.log("");
    console.log(
      "────────────────────────────────────",
    );
    console.log(
      "🛡️ PREVIEW COMPLETATA — database invariato.",
    );
    console.log("");
  } finally {
    await browser.close();
  }
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP Live Sync Preview fallita.",
      );

      if (
        error instanceof Error
      ) {
        console.error(
          error.message,
        );
      } else {
        console.error(
          error,
        );
      }

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );