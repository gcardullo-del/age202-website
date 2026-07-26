import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  replaceAtpRanking,
  type AtpPlayerImportData,
} from "@/lib/repositories/atp-player.repository";

import {
  validateAtpRankingSource,
  type AtpRankingSourceFile,
} from "@/lib/atp/validator";

const ATP_RANKING_FILE_PATH = path.join(
  process.cwd(),
  "data",
  "atp-ranking.json",
);

function mapSourcePlayers(
  ranking: AtpRankingSourceFile,
): AtpPlayerImportData[] {
  const rankingDate = new Date(ranking.rankingDate);
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
      countryCode: player.countryCode
        .trim()
        .toUpperCase(),

      points: player.points,
      age: player.age ?? null,

      imageUrl: player.imageUrl?.trim() || null,

      rankingDate,
      source,
    }))
    .sort((firstPlayer, secondPlayer) => {
      return firstPlayer.rank - secondPlayer.rank;
    });
}

async function readAtpRankingFile(): Promise<AtpRankingSourceFile> {
  let fileContent: string;

  try {
    fileContent = await readFile(
      ATP_RANKING_FILE_PATH,
      "utf8",
    );
  } catch (error) {
    throw new Error(
      `Impossibile leggere il file ${ATP_RANKING_FILE_PATH}.`,
      {
        cause: error,
      },
    );
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      "Il file data/atp-ranking.json non contiene un JSON valido.",
      {
        cause: error,
      },
    );
  }

  validateAtpRankingSource(parsedData);

  return parsedData;
}

export type AtpRankingImportResult = {
  importedPlayers: number;
  rankingDate: string;
  source: string;
};

export async function importAtpRanking(): Promise<AtpRankingImportResult> {
  const ranking = await readAtpRankingFile();

  const players = mapSourcePlayers(ranking);

  if (players.length > 150) {
    throw new Error(
      "Il file contiene più di 150 giocatori ATP.",
    );
  }

  const importedPlayers = await replaceAtpRanking(players);

  return {
    importedPlayers: importedPlayers.length,
    rankingDate: ranking.rankingDate,
    source: ranking.source.trim(),
  };
}