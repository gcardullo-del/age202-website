import "dotenv/config";

import {
  CourtSurface,
  TournamentCategory,
} from "../generated/prisma/client";

import {
  atp250Tournaments,
} from "../lib/data/atp-250";

import {
  prisma,
} from "../lib/prisma";

function mapSurface(
  surface:
    | "HARD"
    | "CLAY"
    | "GRASS",
): CourtSurface {
  switch (surface) {
    case "HARD":
      return CourtSurface.HARD;

    case "CLAY":
      return CourtSurface.CLAY;

    case "GRASS":
      return CourtSurface.GRASS;
  }
}

async function main() {
  console.log(
    "🎾 AGE202 · ATP 250 Tournament Studio importer",
  );

  console.log(
    `📚 Dataset: ${atp250Tournaments.length} tornei`,
  );

  let created = 0;
  let updated = 0;

  for (
    const [
      index,
      tournament,
    ] of atp250Tournaments.entries()
  ) {
    const existing =
      await prisma.tournament.findUnique({
        where: {
          slug:
            tournament.slug,
        },

        select: {
          id:
            true,
        },
      });

    const data = {
      name:
        tournament.name,

      shortName:
        tournament.name,

      category:
        TournamentCategory.ATP_250,

      surface:
        mapSurface(
          tournament.surface,
        ),

      city:
        tournament.city,

      country:
        tournament.country,

      countryCode:
        tournament.countryCode,

      foundedYear:
        tournament.foundedYear,

      description:
        tournament.shortHistory,

      active:
        true,

      featured:
        false,

      displayOrder:
        index + 1,

      metaTitle:
        `${tournament.name} | ATP 250 Archive | AGE202`,

      metaDescription:
        `${tournament.shortHistory} Explore the tournament within the AGE202 ATP 250 archive.`,
    };

    if (existing) {
      await prisma.tournament.update({
        where: {
          slug:
            tournament.slug,
        },

        data,
      });

      updated += 1;

      console.log(
        `🟡 ${String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}/${atp250Tournaments.length} aggiornato · ${tournament.name}`,
      );

      continue;
    }

    await prisma.tournament.create({
      data: {
        slug:
          tournament.slug,

        ...data,
      },
    });

    created += 1;

    console.log(
      `🟢 ${String(
        index + 1,
      ).padStart(
        2,
        "0",
      )}/${atp250Tournaments.length} creato · ${tournament.name}`,
    );
  }

  console.log("");
  console.log(
    "✅ ATP 250 Tournament Studio sync completata.",
  );

  console.log(
    `   Creati: ${created}`,
  );

  console.log(
    `   Aggiornati: ${updated}`,
  );

  console.log(
    `   Totale processato: ${created + updated}`,
  );

  console.log("");
  console.log(
    "ℹ️ Le finali e i leader pubblici continuano a usare il fallback statico finché non vengono aggiunti/modificati nel Tournament Studio.",
  );

  console.log(
    "ℹ️ Da questo momento ogni torneo ATP 250 è disponibile nel CMS per i futuri aggiornamenti.",
  );
}

main()
  .catch(
    (
      error,
    ) => {
      console.error("");
      console.error(
        "❌ Import ATP 250 fallito.",
      );
      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );