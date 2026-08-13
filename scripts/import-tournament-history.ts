import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  syncTournamentChampionSummaries,
} from "./tournament-history/champion-summary";

import {
  importTournamentEditions,
} from "./tournament-history/edition-importer";

import {
  importTournamentEditorialContent,
} from "./tournament-history/editorial-importer";

import {
  importTournamentLegends,
} from "./tournament-history/legend-importer";

import {
  importTournamentProfile,
} from "./tournament-history/tournament-importer";

import type {
  TournamentHistoryDataset,
} from "./tournament-history/types";

type DatasetModule = {
  default?: TournamentHistoryDataset;
  dataset?: TournamentHistoryDataset;
};

function getDatasetModulePath(
  tournamentSlug: string,
): string {
  const normalizedSlug =
    tournamentSlug
      .trim()
      .toLowerCase();

  if (!normalizedSlug) {
    throw new Error(
      "Slug torneo mancante.",
    );
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      normalizedSlug,
    )
  ) {
    throw new Error(
      `Slug torneo non valido: "${tournamentSlug}"`,
    );
  }

  return `./data/tournaments/${normalizedSlug}`;
}

async function loadDataset(
  tournamentSlug: string,
): Promise<TournamentHistoryDataset> {
  const normalizedSlug =
    tournamentSlug
      .trim()
      .toLowerCase();

  const modulePath =
    getDatasetModulePath(
      normalizedSlug,
    );

  let datasetModule: DatasetModule;

  try {
    datasetModule =
      (await import(
        modulePath
      )) as DatasetModule;
  } catch (error) {
    throw new Error(
      `Dataset non trovato per "${normalizedSlug}" (${modulePath}).`,
      {
        cause: error,
      },
    );
  }

  const dataset =
    datasetModule.default ??
    datasetModule.dataset;

  if (!dataset) {
    throw new Error(
      `Il modulo "${modulePath}" non esporta un dataset valido.`,
    );
  }

  if (
    dataset.tournamentSlug !==
    normalizedSlug
  ) {
    throw new Error(
      `Slug dataset non coerente: richiesto "${normalizedSlug}", trovato "${dataset.tournamentSlug}".`,
    );
  }

  return dataset;
}

function getTournamentSlugFromArgs(): string {
  const tournamentSlug =
    process.argv[2]
      ?.trim()
      .toLowerCase();

  if (!tournamentSlug) {
    throw new Error(
      [
        "Specifica lo slug del torneo.",
        "Esempio:",
        "npx tsx scripts/import-tournament-history.ts canada",
      ].join("\n"),
    );
  }

  return tournamentSlug;
}

async function main() {
  try {
    const tournamentSlug =
      getTournamentSlugFromArgs();

    console.log(
      "🏛️ AGE202 Full Tournament Import Engine",
    );
    console.log(
      `🎾 Dataset: ${tournamentSlug}`,
    );

    const dataset =
      await loadDataset(
        tournamentSlug,
      );

    console.log(
      "🪪 Sincronizzazione profilo torneo / SEO...",
    );

    const profileResult =
      await importTournamentProfile(
        dataset,
      );

    if (profileResult.updated) {
      console.log(
        `✅ Profilo sincronizzato per ${profileResult.tournamentName}.`,
      );
    } else {
      console.log(
        `↪️ Nessun profilo nel dataset: ${profileResult.tournamentName} invariato.`,
      );
    }

    console.log(
      "📜 Sincronizzazione contenuti editoriali...",
    );

    const editorialResult =
      await importTournamentEditorialContent(
        dataset,
      );

    console.log(
      [
        "✅ Editorial:",
        `${editorialResult.milestones.created} milestones creati,`,
        `${editorialResult.milestones.updated} aggiornati;`,
        `${editorialResult.chapters.created} chapters creati,`,
        `${editorialResult.chapters.updated} aggiornati;`,
        `${editorialResult.iconicMoments.created} iconic moments creati,`,
        `${editorialResult.iconicMoments.updated} aggiornati.`,
      ].join(" "),
    );

    console.log(
      "📚 Importazione edizioni storiche...",
    );

    const importResult =
      await importTournamentEditions(
        dataset,
      );

    console.log(
      `✅ ${importResult.importedEditions} edizioni sincronizzate per ${importResult.tournamentName}.`,
    );

    console.log(
      "👑 Sincronizzazione Hall of Champions...",
    );

    const championResult =
      await syncTournamentChampionSummaries(
        importResult.tournamentId,
      );

    console.log(
      `✅ ${championResult.champions} campioni presenti nella Hall of Champions.`,
    );

    console.log(
      "🏆 Sincronizzazione AGE202 Legends...",
    );

    const legendResult =
      await importTournamentLegends(
        dataset,
      );

    console.log(
      [
        `✅ ${legendResult.legends} legends sincronizzate.`,
        `${legendResult.linkedPlayers} nuovi collegamenti AGE202 applicati.`,
      ].join(" "),
    );

    console.log(
      "🎉 Full Tournament Import completato.",
    );
  } catch (error) {
    console.error(
      "❌ Full Tournament Import fallito:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();