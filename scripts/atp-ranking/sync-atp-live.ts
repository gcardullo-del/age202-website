import "dotenv/config";


import {
  prisma,
} from "@/lib/prisma";

import {
  getStoredAtpPlayers,
  replaceAtpRanking,
  type AtpPlayerImportData,
} from "@/lib/repositories/atp-player.repository";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  validateAtpLiveRanking,
} from "./atp-live-validator";

import {
  buildAtpCountryMap,
  resolveAtpCountry,
} from "./atp-country-resolver";

import {
  ATP_LIVE_RANKING_URL,
  ATP_RANKING_LIMIT,
  ATP_RANKING_SOURCE,
} from "./types";


const REQUEST_HEADERS = {
  Accept:
    "text/plain,text/markdown;q=0.9,*/*;q=0.8",

  "User-Agent":
    "AGE202-Ranking-Sync/1.0",
};


function normalizeSlug(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .toLowerCase() ??
    ""
  );
}


async function fetchRankingSource():
  Promise<string> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      60_000,
    );

  try {
    const response =
      await fetch(
        ATP_LIVE_RANKING_URL,
        {
          headers:
            REQUEST_HEADERS,

          redirect:
            "follow",

          signal:
            controller.signal,
        },
      );

    console.log(
      `📡 HTTP: ${response.status}`,
    );

    if (!response.ok) {
      throw new Error(
        `La sorgente ATP Live ha risposto con HTTP ${response.status}.`,
      );
    }

    const content =
      await response.text();

    if (!content.trim()) {
      throw new Error(
        "La sorgente ATP Live ha restituito una risposta vuota.",
      );
    }

    console.log(
      `📄 Risposta ricevuta: ${content.length} caratteri.`,
    );

    return content;
  } finally {
    clearTimeout(
      timeout,
    );
  }
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP LIVE RANKING SYNC",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    "⚠️ MODALITÀ LIVE — la classifica verrà sostituita.",
  );
  console.log("");

  const storedPlayers =
    await prisma.atpPlayer.findMany({
      select: {
        id: true,
        rank: true,
        previousRank: true,
        name: true,
        firstName: true,
        lastName: true,
        slug: true,
        country: true,
        countryCode: true,
        points: true,
        age: true,
        imageUrl: true,
        playerId: true,
        active: true,
      },
    });

  console.log(
    `📦 Snapshot AGE202: ${storedPlayers.length} giocatori.`,
  );

  const storedReferences =
    await getStoredAtpPlayers();

  if (
    storedReferences.length !==
    storedPlayers.length
  ) {
    throw new Error(
      [
        "Snapshot ATP AGE202 incoerente.",
        `Repository=${storedReferences.length}`,
        `Snapshot=${storedPlayers.length}`,
      ].join(" "),
    );
  }

  const countryMap =
    buildAtpCountryMap(
      storedPlayers.map(
        (player) => ({
          country:
            player.country,

          countryCode:
            player.countryCode,
        }),
      ),
    );

  console.log(
    `🌍 Country resolver: ${countryMap.size} codici disponibili.`,
  );

  const storedBySlug =
    new Map(
      storedPlayers.map(
        (player) => [
          normalizeSlug(
            player.slug,
          ),

          player,
        ],
      ),
    );

  console.log("");
  console.log(
    "🌐 Lettura ATP Live Rankings...",
  );

  const sourceText =
    await fetchRankingSource();

  const entries =
    await parseAtpLiveRanking(
      sourceText,
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

  if (
    entries.length !==
    ATP_RANKING_LIMIT
  ) {
    throw new Error(
      [
        "SYNC BLOCCATO.",
        `Attesi ${ATP_RANKING_LIMIT} giocatori ATP,`,
        `ricevuti ${entries.length}.`,
      ].join(" "),
    );
  }

  console.log(
    `✅ ATP Top ${ATP_RANKING_LIMIT} validata.`,
  );

  if (
    validation.warnings.length >
    0
  ) {
    console.log("");
    console.log(
      "⚠️ WARNING VALIDAZIONE",
    );

    for (
      const warning
      of validation.warnings
    ) {
      console.log(
        `• ${warning}`,
      );
    }
  }

  const rankingDate =
    new Date();

  const preparedPlayers:
    AtpPlayerImportData[] = [];

  const unresolved:
    string[] = [];

  let matched = 0;
  let created = 0;

  for (
    const incoming
    of entries
  ) {
    const slug =
      normalizeSlug(
        incoming.profileSlug,
      );

    if (!slug) {
      unresolved.push(
        `#${incoming.rank} ${incoming.name}: profileSlug mancante.`,
      );

      continue;
    }

    const existing =
      storedBySlug.get(
        slug,
      ) ??
      null;

    if (existing) {
      matched += 1;
    } else {
      created += 1;
    }

    const resolution =
      resolveAtpCountry(
        incoming.countryCode,
        countryMap,
      );

    const countryCode =
      resolution?.countryCode ??
      existing?.countryCode ??
      null;

    const country =
      incoming.country ??
      resolution?.country ??
      existing?.country ??
      null;

    if (
      !existing &&
      (
        !countryCode ||
        !country
      )
    ) {
      unresolved.push(
        [
          `#${incoming.rank} ${incoming.name}:`,
          "nuovo giocatore con nazione non risolta.",
          `countryCode=${countryCode ?? "null"}`,
          `country=${country ?? "null"}`,
        ].join(" "),
      );

      continue;
    }

    if (
      !countryCode ||
      !country
    ) {
      unresolved.push(
        [
          `#${incoming.rank} ${incoming.name}:`,
          "metadati nazione incompleti.",
        ].join(" "),
      );

      continue;
    }

    preparedPlayers.push({
      rank:
        incoming.rank,

      previousRank:
        existing?.rank ??
        null,

      name:
        incoming.name,

      firstName:
        incoming.firstName ??
        existing?.firstName ??
        null,

      lastName:
        incoming.lastName ??
        existing?.lastName ??
        null,

      slug,

      country,

      countryCode,

      points:
        incoming.points,

      age:
        incoming.age ??
        existing?.age ??
        null,

      imageUrl:
        existing?.imageUrl ??
        null,

      rankingDate,

      source:
        ATP_RANKING_SOURCE,
    });
  }

  console.log("");
  console.log(
    "📊 PREFLIGHT SYNC",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    `✅ Match esistenti:   ${matched}`,
  );
  console.log(
    `🆕 Nuovi ingressi:    ${created}`,
  );
  console.log(
    `📋 Record preparati:  ${preparedPlayers.length}/${ATP_RANKING_LIMIT}`,
  );
  console.log(
    `⚠️ Non risolti:       ${unresolved.length}`,
  );

  if (
    unresolved.length >
    0
  ) {
    console.log("");
    console.log(
      "❌ RECORD NON RISOLTI",
    );
    console.log(
      "────────────────────────────────────────",
    );

    for (
      const error
      of unresolved
    ) {
      console.log(
        `• ${error}`,
      );
    }

    throw new Error(
      "SYNC BLOCCATO: almeno un giocatore ATP non è completamente risolvibile.",
    );
  }

  if (
    preparedPlayers.length !==
    ATP_RANKING_LIMIT
  ) {
    throw new Error(
      [
        "SYNC BLOCCATO.",
        `Preparati ${preparedPlayers.length}/${ATP_RANKING_LIMIT} giocatori.`,
      ].join(" "),
    );
  }

  const orderedPlayers =
    [...preparedPlayers].sort(
      (
        first,
        second,
      ) =>
        first.rank -
        second.rank,
    );

  for (
    let index = 0;
    index <
    orderedPlayers.length;
    index += 1
  ) {
    const expectedRank =
      index + 1;

    if (
      orderedPlayers[index]
        ?.rank !==
      expectedRank
    ) {
      throw new Error(
        [
          "SYNC BLOCCATO.",
          `Rank atteso ${expectedRank},`,
          `ricevuto ${orderedPlayers[index]?.rank ?? "missing"}.`,
        ].join(" "),
      );
    }
  }

  const newPlayers =
    orderedPlayers.filter(
      (player) =>
        !storedBySlug.has(
          normalizeSlug(
            player.slug,
          ),
        ),
    );

  if (
    newPlayers.length >
    0
  ) {
    console.log("");
    console.log(
      "🆕 NUOVI GIOCATORI DA CREARE",
    );
    console.log(
      "────────────────────────────────────────",
    );

    for (
      const player
      of newPlayers
    ) {
      console.log(
        `${String(player.rank).padStart(3, " ")}  ${player.name}`,
      );
      console.log(
        `     slug:        ${player.slug}`,
      );
      console.log(
        `     countryCode: ${player.countryCode}`,
      );
      console.log(
        `     country:     ${player.country}`,
      );
      console.log(
        `     age:         ${player.age ?? "null"}`,
      );
      console.log(
        `     imageUrl:    ${player.imageUrl ?? "null"}`,
      );
    }
  }

  console.log("");
  console.log(
    "💾 Avvio replaceAtpRanking()...",
  );

  const result =
    await replaceAtpRanking(
      orderedPlayers,
    );

  if (
    result.length !==
    ATP_RANKING_LIMIT
  ) {
    throw new Error(
      [
        "Risultato sync inatteso.",
        `Repository ha restituito ${result.length}/${ATP_RANKING_LIMIT} giocatori.`,
      ].join(" "),
    );
  }

  console.log("");
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    "🏆 ATP LIVE SYNC COMPLETATO",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    `✅ Classifica:       ${result.length}/${ATP_RANKING_LIMIT}`,
  );
  console.log(
    `🔄 Già presenti:     ${matched}`,
  );
  console.log(
    `🆕 Nuovi ingressi:   ${created}`,
  );
  console.log(
    `🌍 Country resolver: ${countryMap.size} codici`,
  );
  console.log(
    `📅 Ranking date:     ${rankingDate.toISOString()}`,
  );
  console.log(
    "🔒 Transazione AGE202 completata.",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP LIVE SYNC FALLITO.",
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
