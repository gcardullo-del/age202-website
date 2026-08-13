import "dotenv/config";

import {
  writeFile,
} from "node:fs/promises";

import {
  resolve,
} from "node:path";

import {
  fetchAtpLiveRankingHtml,
} from "./atp-live-fetcher";


async function main() {
  console.log(
    "🎾 AGE202 ATP Live Ranking Debug",
  );

  console.log(
    "🌐 Download pagina ATP...",
  );


  const html =
    await fetchAtpLiveRankingHtml();


  const outputPath =
    resolve(
      process.cwd(),
      "atp-live-debug.html",
    );


  await writeFile(
    outputPath,
    html,
    "utf8",
  );


  console.log(
    `✅ HTML ricevuto: ${html.length.toLocaleString("en-US")} caratteri`,
  );

  console.log(
    `📄 Salvato in: ${outputPath}`,
  );


  const playerLinks =
    html.match(
      /\/en\/players\/[^"'<>\\s]+\/[^"'<>\\s]+\/overview/gi,
    ) ?? [];


  console.log(
    `🎾 Player links rilevati: ${new Set(playerLinks).size}`,
  );


  console.log(
    "🟢 Debug completato.",
  );
}


main().catch(
  (error) => {
    console.error(
      "❌ ATP Live Ranking debug fallito:",
      error,
    );

    process.exitCode = 1;
  },
);