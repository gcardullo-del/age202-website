import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  ATP_RANKING_FILE_PATH,
  MAX_ATP_PLAYERS,
} from "@/lib/atp/constants";
import {
  validateAtpRankingSource,
  type AtpRankingSourceFile,
} from "@/lib/atp/validator";
import {
  replaceAtpRanking,
  type AtpPlayerImportData,
} from "@/lib/repositories/atp-player.repository";

const localRankingFilePath = path.join(
  process.cwd(),
  ...ATP_RANKING_FILE_PATH,
);

function parseRankingJson(
  content: string,
): AtpRankingSourceFile {
  let parsedData: unknown;

  try {
    parsedData = JSON.parse(content);
  } catch (error) {
    throw new Error(
      "Il file data/atp-ranking.json non contiene un JSON valido.",
      { cause: error },
    );
  }

  validateAtpRankingSource(parsedData);

  return parsedData;
}

async function readLocalRankingFile(): Promise<AtpRankingSourceFile> {
  let fileContent: string;

  try {
    fileContent = await readFile(
      localRankingFilePath,
      "utf8",
    );
  } catch (error) {
    throw new Error(
      `Impossibile leggere il file ${localRankingFilePath}.`,
      { cause: error },
    );
  }

  return parseRankingJson(fileContent);
}

function mapSourcePlayers(
  ranking: AtpRankingSourceFile,
): AtpPlayerImportData[] {
  const rankingDate = new Date(ranking.rankingDate);

  if (Number.isNaN(rankingDate.getTime())) {
    throw new Error(
      `Data classifica non valida: ${ranking.rankingDate}.`,
    );
  }

  const source = ranking.source.trim();

  return ranking.players
    .map((player) => ({
      rank: player.rank,
      previousRank: player.previousRank ?? null,

      name: player.name.trim(),
      firstName: player.firstName?.trim() || null,
      lastName: player.lastName?.trim() || null,
      slug: player.slug.trim().toLowerCase(),

      country: player.country.trim(),
      countryCode: player.countryCode.trim().toUpperCase(),

      points: player.points ?? null,
      age: player.age ?? null,
      imageUrl: player.imageUrl?.trim() || null,

      rankingDate,
      source,
    }))
    .sort(
      (firstPlayer, secondPlayer) =>
        firstPlayer.rank - secondPlayer.rank,
    );
}

export type AtpRankingImportResult = {
  importedPlayers: number;
  rankingDate: string;
  source: string;
  importMode: "local";
  isCompleteTop150: true;
};

export async function importAtpRanking(): Promise<AtpRankingImportResult> {
  const ranking = await readLocalRankingFile();
  const players = mapSourcePlayers(ranking);

  if (players.length !== MAX_ATP_PLAYERS) {
    throw new Error(
      `Importazione annullata: sono necessari esattamente ${MAX_ATP_PLAYERS} giocatori, ma ne sono stati trovati ${players.length}.`,
    );
  }

  const importedPlayers = await replaceAtpRanking(players);

  if (importedPlayers.length !== MAX_ATP_PLAYERS) {
    throw new Error(
      `Importazione incompleta: Prisma ha restituito ${importedPlayers.length}/${MAX_ATP_PLAYERS} giocatori attivi.`,
    );
  }

  return {
    importedPlayers: importedPlayers.length,
    rankingDate: ranking.rankingDate,
    source: ranking.source.trim(),
    importMode: "local",
    isCompleteTop150: true,
  };
}
