import "dotenv/config";

import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL non trovata nel file .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});

const ATP_ARCHIVE_FIRST_RANK = 1;
const ATP_ARCHIVE_LAST_RANK = 50;

const PROJECT_ROOT = process.cwd();

const PLAYER_IMAGE_DIRECTORY = path.join(
  PROJECT_ROOT,
  "public",
  "players",
  "other-players",
  "top-50",
);

const OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, "reports");

const JSON_REPORT_PATH = path.join(
  OUTPUT_DIRECTORY,
  "atp-top-50-image-manifest.json",
);

const CSV_REPORT_PATH = path.join(
  OUTPUT_DIRECTORY,
  "atp-top-50-image-manifest.csv",
);

const MISSING_REPORT_PATH = path.join(
  OUTPUT_DIRECTORY,
  "atp-top-50-missing-images.txt",
);

type ImageAuditPlayer = {
  rank: number;
  name: string;
  slug: string;
  country: string | null;
  points: number | null;
  imageFileName: string;
  publicImagePath: string;
  absoluteImagePath: string;
  imageExists: boolean;
};

function escapeCsv(value: string | number | null): string {
  if (value === null) {
    return "";
  }

  const normalized = String(value).replaceAll('"', '""');

  return `"${normalized}"`;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getCurrentImageFiles(): Promise<Set<string>> {
  await mkdir(PLAYER_IMAGE_DIRECTORY, {
    recursive: true,
  });

  const entries = await readdir(PLAYER_IMAGE_DIRECTORY, {
    withFileTypes: true,
  });

  return new Set(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name.toLocaleLowerCase("it-IT")),
  );
}

async function createAuditPlayers(): Promise<ImageAuditPlayer[]> {
  const atpPlayers = await prisma.atpPlayer.findMany({
    where: {
      active: true,
      rank: {
        gte: ATP_ARCHIVE_FIRST_RANK,
        lte: ATP_ARCHIVE_LAST_RANK,
      },
    },
    orderBy: {
      rank: "asc",
    },
    select: {
      rank: true,
      name: true,
      slug: true,
      country: true,
      points: true,
    },
  });

  if (atpPlayers.length === 0) {
    throw new Error(
      "Nessun giocatore ATP Top 50 trovato. Importa prima la classifica ATP.",
    );
  }

  return Promise.all(
    atpPlayers.map(async (player) => {
      const imageFileName = `${player.slug}.webp`;
      const absoluteImagePath = path.join(
        PLAYER_IMAGE_DIRECTORY,
        imageFileName,
      );

      return {
        rank: player.rank,
        name: player.name,
        slug: player.slug,
        country: player.country,
        points: player.points,
        imageFileName,
        publicImagePath: `/players/other-players/top-50/${imageFileName}`,
        absoluteImagePath,
        imageExists: await fileExists(absoluteImagePath),
      };
    }),
  );
}

async function writeJsonReport(
  players: ImageAuditPlayer[],
): Promise<void> {
  const report = {
    generatedAt: new Date().toISOString(),
    archiveRange: {
      firstRank: ATP_ARCHIVE_FIRST_RANK,
      lastRank: ATP_ARCHIVE_LAST_RANK,
    },
    summary: {
      players: players.length,
      imagesPresent: players.filter((player) => player.imageExists).length,
      imagesMissing: players.filter((player) => !player.imageExists).length,
    },
    players: players.map((player) => ({
      rank: player.rank,
      name: player.name,
      slug: player.slug,
      country: player.country,
      points: player.points,
      imageFileName: player.imageFileName,
      publicImagePath: player.publicImagePath,
      imageExists: player.imageExists,
    })),
  };

  await writeFile(
    JSON_REPORT_PATH,
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
}

async function writeCsvReport(
  players: ImageAuditPlayer[],
): Promise<void> {
  const header = [
    "rank",
    "name",
    "slug",
    "country",
    "points",
    "imageFileName",
    "publicImagePath",
    "imageExists",
  ];

  const rows = players.map((player) =>
    [
      player.rank,
      player.name,
      player.slug,
      player.country,
      player.points,
      player.imageFileName,
      player.publicImagePath,
      player.imageExists ? "YES" : "NO",
    ]
      .map(escapeCsv)
      .join(","),
  );

  await writeFile(
    CSV_REPORT_PATH,
    `${[header.join(","), ...rows].join("\n")}\n`,
    "utf8",
  );
}

async function writeMissingReport(
  players: ImageAuditPlayer[],
): Promise<void> {
  const missingPlayers = players.filter(
    (player) => !player.imageExists,
  );

  const lines =
    missingPlayers.length === 0
      ? ["Tutte le immagini ATP Top 50 sono presenti."]
      : missingPlayers.map(
          (player) =>
            `ATP #${player.rank} | ${player.name} | ${player.imageFileName}`,
        );

  await writeFile(
    MISSING_REPORT_PATH,
    `${lines.join("\n")}\n`,
    "utf8",
  );
}

async function printUnexpectedFiles(
  players: ImageAuditPlayer[],
): Promise<void> {
  const currentFiles = await getCurrentImageFiles();

  const expectedFiles = new Set(
    players.map((player) =>
      player.imageFileName.toLocaleLowerCase("it-IT"),
    ),
  );

  const unexpectedFiles = Array.from(currentFiles)
    .filter(
      (fileName) =>
        fileName !== ".gitkeep" &&
        !expectedFiles.has(fileName),
    )
    .sort((first, second) => first.localeCompare(second));

  if (unexpectedFiles.length === 0) {
    return;
  }

  console.log("\n⚠️ File presenti nella cartella ma non associati alla Top 50:");

  for (const fileName of unexpectedFiles) {
    console.log(`   - ${fileName}`);
  }
}

async function main(): Promise<void> {
  console.log("🖼️ Avvio controllo immagini ATP Archive...");

  await mkdir(OUTPUT_DIRECTORY, {
    recursive: true,
  });

  const players = await createAuditPlayers();

  await Promise.all([
    writeJsonReport(players),
    writeCsvReport(players),
    writeMissingReport(players),
  ]);

  const imagesPresent = players.filter(
    (player) => player.imageExists,
  ).length;

  const imagesMissing = players.length - imagesPresent;

  console.log(`\n🎾 Giocatori analizzati: ${players.length}`);
  console.log(`✅ Immagini presenti: ${imagesPresent}`);
  console.log(`❌ Immagini mancanti: ${imagesMissing}`);

  if (imagesMissing > 0) {
    console.log("\nImmagini mancanti:");

    for (const player of players.filter(
      (item) => !item.imageExists,
    )) {
      console.log(
        `   ATP #${player.rank} | ${player.name} | ${player.imageFileName}`,
      );
    }
  }

  await printUnexpectedFiles(players);

  console.log("\n📄 Report generati:");
  console.log(
    "   reports/atp-top-50-image-manifest.json",
  );
  console.log(
    "   reports/atp-top-50-image-manifest.csv",
  );
  console.log(
    "   reports/atp-top-50-missing-images.txt",
  );

  console.log("\n🏁 Controllo completato.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Errore durante il controllo immagini:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
