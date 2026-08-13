import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP Countries Inspector",
  );
  console.log(
    "────────────────────────────────────",
  );
  console.log(
    "🛡️ Modalità READ ONLY: il database NON verrà modificato.",
  );
  console.log("");

  const players =
    await prisma.atpPlayer.findMany({
      select: {
        country: true,
        countryCode: true,
      },

      orderBy: [
        {
          countryCode: "asc",
        },
        {
          country: "asc",
        },
      ],
    });

  console.log(
    `📦 Record ATP letti: ${players.length}`,
  );

  const countryMap =
    new Map<
      string,
      Set<string>
    >();

  for (
    const player
    of players
  ) {
    const countryCode =
      player.countryCode
        .trim()
        .toUpperCase();

    const country =
      player.country
        .trim();

    if (
      !countryCode ||
      !country
    ) {
      continue;
    }

    const existing =
      countryMap.get(
        countryCode,
      );

    if (existing) {
      existing.add(
        country,
      );

      continue;
    }

    countryMap.set(
      countryCode,
      new Set([
        country,
      ]),
    );
  }

  console.log("");
  console.log(
    "🌍 COUNTRY CODE → COUNTRY",
  );
  console.log(
    "────────────────────────────────────",
  );

  const sortedEntries =
    Array.from(
      countryMap.entries(),
    ).sort(
      (
        [firstCode],
        [secondCode],
      ) =>
        firstCode.localeCompare(
          secondCode,
        ),
    );

  for (
    const [
      countryCode,
      countries,
    ]
    of sortedEntries
  ) {
    const values =
      Array.from(
        countries,
      ).sort();

    const warning =
      values.length > 1
        ? "  ⚠️ CONFLITTO"
        : "";

    console.log(
      `${countryCode.padEnd(5, " ")} → ${values.join(" | ")}${warning}`,
    );
  }

  console.log("");
  console.log(
    "🇺🇸 VERIFICA USA",
  );
  console.log(
    "────────────────────────────────────",
  );

  const usaCountries =
    countryMap.get(
      "USA",
    );

  if (
    !usaCountries ||
    usaCountries.size === 0
  ) {
    console.log(
      "❌ USA non presente nel database AGE202.",
    );
  } else {
    console.log(
      `✅ USA → ${Array.from(usaCountries).join(" | ")}`,
    );
  }

  console.log("");
  console.log(
    "🔎 CONFLITTI",
  );
  console.log(
    "────────────────────────────────────",
  );

  const conflicts =
    sortedEntries.filter(
      (
        [
          ,
          countries,
        ],
      ) =>
        countries.size > 1,
    );

  if (
    conflicts.length === 0
  ) {
    console.log(
      "✅ Nessun countryCode associato a più nomi.",
    );
  } else {
    for (
      const [
        countryCode,
        countries,
      ]
      of conflicts
    ) {
      console.log(
        `⚠️ ${countryCode} → ${Array.from(countries).join(" | ")}`,
      );
    }
  }

  console.log("");
  console.log(
    "────────────────────────────────────",
  );
  console.log(
    `🏁 Codici nazione unici: ${countryMap.size}`,
  );
  console.log(
    "🛡️ Database invariato.",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP Countries Inspector fallito.",
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