import "dotenv/config";

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { prisma } from "@/lib/prisma";

type PlayerProfileImportRecord = {
  slug: string;

  birthDate?: string | null;
  birthPlace?: string | null;
  residence?: string | null;

  height?: number | null;
  weight?: number | null;

  plays?: string | null;
  backhand?: string | null;
  coach?: string | null;

  turnedPro?: number | null;
  careerHigh?: number | null;

  atpTitles?: number;
  australianOpen?: number;
  rolandGarros?: number;
  wimbledon?: number;
  usOpen?: number;
  grandSlams?: number;
  masters1000?: number;
  atpFinals?: number;
  olympicGold?: number;
  davisCup?: number;

  prizeMoney?: string | number | null;

  playingStyle?: string | null;
  favouriteSurface?: string | null;

  biographyShort?: string | null;
  biographyLong?: string | null;
};

type ImportSummary = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

const DEFAULT_DATA_FILE = path.join(
  process.cwd(),
  "data",
  "player-profiles.json",
);

const isDryRun = process.argv.includes("--dry-run");

function getDataFilePath(): string {
  const fileArgument = process.argv.find((argument) =>
    argument.startsWith("--file="),
  );

  if (!fileArgument) {
    return DEFAULT_DATA_FILE;
  }

  const suppliedPath = fileArgument.slice("--file=".length).trim();

  if (!suppliedPath) {
    throw new Error(
      "The --file argument must contain a valid JSON file path.",
    );
  }

  return path.resolve(process.cwd(), suppliedPath);
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0
    ? normalizedValue
    : null;
}

function normalizeNonNegativeInteger(
  value: number | null | undefined,
  fieldName: string,
  slug: string,
): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (
    !Number.isInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `${slug}: "${fieldName}" must be a non-negative integer.`,
    );
  }

  return value;
}

function normalizeOptionalInteger(
  value: number | null | undefined,
  fieldName: string,
  slug: string,
  minimum = 0,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    !Number.isInteger(value) ||
    value < minimum
  ) {
    throw new Error(
      `${slug}: "${fieldName}" must be an integer greater than or equal to ${minimum}.`,
    );
  }

  return value;
}

function parseBirthDate(
  value: string | null | undefined,
  slug: string,
): Date | null {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    throw new Error(
      `${slug}: "birthDate" must use the YYYY-MM-DD format.`,
    );
  }

  const parsedDate = new Date(
    `${normalizedValue}T00:00:00.000Z`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(
      `${slug}: "birthDate" is not a valid date.`,
    );
  }

  return parsedDate;
}

function parsePrizeMoney(
  value: string | number | null | undefined,
  slug: string,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const normalizedValue =
    typeof value === "number"
      ? String(value)
      : value.trim();

  const numericValue = Number(normalizedValue);

  if (
    normalizedValue.length === 0 ||
    !Number.isFinite(numericValue) ||
    numericValue < 0
  ) {
    throw new Error(
      `${slug}: "prizeMoney" must be a valid non-negative number.`,
    );
  }

  return normalizedValue;
}

function validateSlug(
  value: unknown,
  index: number,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `Record ${index + 1}: "slug" is required.`,
    );
  }

  const slug = value.trim();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `${slug}: slug must contain only lowercase letters, numbers and hyphens.`,
    );
  }

  return slug;
}

type NormalizedPlayerProfileData = {
  playerId: string;
  birthDate: Date | null;
  birthPlace: string | null;
  residence: string | null;
  height: number | null;
  weight: number | null;
  plays: string | null;
  backhand: string | null;
  coach: string | null;
  turnedPro: number | null;
  careerHigh: number | null;
  atpTitles: number;
  australianOpen: number;
  rolandGarros: number;
  wimbledon: number;
  usOpen: number;
  grandSlams: number;
  masters1000: number;
  atpFinals: number;
  olympicGold: number;
  davisCup: number;
  prizeMoney: string | null;
  playingStyle: string | null;
  favouriteSurface: string | null;
  biographyShort: string | null;
  biographyLong: string | null;
};

function buildProfileData(
  record: PlayerProfileImportRecord,
  slug: string,
): NormalizedPlayerProfileData {
  const australianOpen =
    normalizeNonNegativeInteger(
      record.australianOpen,
      "australianOpen",
      slug,
    );

  const rolandGarros =
    normalizeNonNegativeInteger(
      record.rolandGarros,
      "rolandGarros",
      slug,
    );

  const wimbledon =
    normalizeNonNegativeInteger(
      record.wimbledon,
      "wimbledon",
      slug,
    );

  const usOpen =
    normalizeNonNegativeInteger(
      record.usOpen,
      "usOpen",
      slug,
    );

  const calculatedGrandSlams =
    australianOpen +
    rolandGarros +
    wimbledon +
    usOpen;

  const grandSlams =
    record.grandSlams === undefined
      ? calculatedGrandSlams
      : normalizeNonNegativeInteger(
          record.grandSlams,
          "grandSlams",
          slug,
        );

  if (
    record.grandSlams !== undefined &&
    grandSlams !== calculatedGrandSlams
  ) {
    throw new Error(
      `${slug}: "grandSlams" (${grandSlams}) does not match the sum of the four Grand Slam titles (${calculatedGrandSlams}).`,
    );
  }

  return {
    playerId: "",

    birthDate: parseBirthDate(
      record.birthDate,
      slug,
    ),

    birthPlace: normalizeOptionalText(
      record.birthPlace,
    ),

    residence: normalizeOptionalText(
      record.residence,
    ),

    height: normalizeOptionalInteger(
      record.height,
      "height",
      slug,
      1,
    ),

    weight: normalizeOptionalInteger(
      record.weight,
      "weight",
      slug,
      1,
    ),

    plays: normalizeOptionalText(
      record.plays,
    ),

    backhand: normalizeOptionalText(
      record.backhand,
    ),

    coach: normalizeOptionalText(
      record.coach,
    ),

    turnedPro: normalizeOptionalInteger(
      record.turnedPro,
      "turnedPro",
      slug,
      1900,
    ),

    careerHigh: normalizeOptionalInteger(
      record.careerHigh,
      "careerHigh",
      slug,
      1,
    ),

    atpTitles: normalizeNonNegativeInteger(
      record.atpTitles,
      "atpTitles",
      slug,
    ),

    australianOpen,
    rolandGarros,
    wimbledon,
    usOpen,
    grandSlams,

    masters1000:
      normalizeNonNegativeInteger(
        record.masters1000,
        "masters1000",
        slug,
      ),

    atpFinals:
      normalizeNonNegativeInteger(
        record.atpFinals,
        "atpFinals",
        slug,
      ),

    olympicGold:
      normalizeNonNegativeInteger(
        record.olympicGold,
        "olympicGold",
        slug,
      ),

    davisCup:
      normalizeNonNegativeInteger(
        record.davisCup,
        "davisCup",
        slug,
      ),

    prizeMoney: parsePrizeMoney(
      record.prizeMoney,
      slug,
    ),

    playingStyle: normalizeOptionalText(
      record.playingStyle,
    ),

    favouriteSurface:
      normalizeOptionalText(
        record.favouriteSurface,
      ),

    biographyShort:
      normalizeOptionalText(
        record.biographyShort,
      ),

    biographyLong:
      normalizeOptionalText(
        record.biographyLong,
      ),
  };
}

async function readImportFile(
  filePath: string,
): Promise<PlayerProfileImportRecord[]> {
  const rawFile = await readFile(
    filePath,
    "utf8",
  );

  const parsedData: unknown = JSON.parse(
    rawFile,
  );

  if (!Array.isArray(parsedData)) {
    throw new Error(
      "The player-profile import file must contain a JSON array.",
    );
  }

  return parsedData as PlayerProfileImportRecord[];
}

async function importPlayerProfiles(): Promise<void> {
  const filePath = getDataFilePath();
  const records = await readImportFile(
    filePath,
  );

  if (records.length === 0) {
    throw new Error(
      "The player-profile import file is empty.",
    );
  }

  const seenSlugs = new Set<string>();

  const normalizedRecords = records.map(
    (record, index) => {
      const slug = validateSlug(
        record.slug,
        index,
      );

      if (seenSlugs.has(slug)) {
        throw new Error(
          `Duplicate player slug in import file: ${slug}.`,
        );
      }

      seenSlugs.add(slug);

      return {
        slug,
        data: buildProfileData(
          record,
          slug,
        ),
      };
    },
  );

  const players = await prisma.player.findMany({
    where: {
      slug: {
        in: normalizedRecords.map(
          (record) => record.slug,
        ),
      },
    },

    select: {
      id: true,
      name: true,
      slug: true,
      playerProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  const playerBySlug = new Map(
    players.map((player) => [
      player.slug,
      player,
    ]),
  );

  const summary: ImportSummary = {
    total: normalizedRecords.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  console.log("");
  console.log("AGE202 PlayerProfile Import");
  console.log("---------------------------");
  console.log(`File: ${filePath}`);
  console.log(
    `Mode: ${isDryRun ? "dry run" : "database write"}`,
  );
  console.log("");

  for (const record of normalizedRecords) {
    const player = playerBySlug.get(
      record.slug,
    );

    if (!player) {
      summary.skipped += 1;

      console.warn(
        `SKIP  ${record.slug}: Player record not found.`,
      );

      continue;
    }

    const {
      playerId: _unusedPlayerId,
      ...profileData
    } = record.data;

    try {
      if (isDryRun) {
        console.log(
          `CHECK ${record.slug}: ${
            player.playerProfile
              ? "update"
              : "create"
          }`,
        );

        if (player.playerProfile) {
          summary.updated += 1;
        } else {
          summary.created += 1;
        }

        continue;
      }

      await prisma.playerProfile.upsert({
        where: {
          playerId: player.id,
        },

        create: {
          ...profileData,
          playerId: player.id,
        },

        update: profileData,
      });

      if (player.playerProfile) {
        summary.updated += 1;
        console.log(
          `UPDATE ${record.slug} (${player.name})`,
        );
      } else {
        summary.created += 1;
        console.log(
          `CREATE ${record.slug} (${player.name})`,
        );
      }
    } catch (error) {
      summary.failed += 1;

      console.error(
        `FAIL  ${record.slug}:`,
        error,
      );
    }
  }

  console.log("");
  console.log("Import summary");
  console.log("--------------");
  console.log(`Total:   ${summary.total}`);
  console.log(`Created: ${summary.created}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Failed:  ${summary.failed}`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

importPlayerProfiles()
  .catch((error: unknown) => {
    console.error("");
    console.error(
      "PlayerProfile import aborted.",
    );
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });