import "dotenv/config";

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

const featuredPlayers = [
  {
    name: "Roger Federer",
    slug: "roger-federer",
    firstName: "Roger",
    lastName: "Federer",
    country: "Svizzera",
    biography:
      "Una delle figure più iconiche della storia del tennis, celebrato per eleganza, tecnica e longevità.",
    heroImage: "/players/federer/hero.jpg",
    portraitImage: "/players/federer/portrait.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 1,
    active: true,
  },
  {
    name: "Rafael Nadal",
    slug: "rafael-nadal",
    firstName: "Rafael",
    lastName: "Nadal",
    country: "Spagna",
    biography:
      "Campione simbolo della terra battuta, famoso per intensità, resilienza e straordinario spirito competitivo.",
    heroImage: "/players/nadal/hero.jpg",
    portraitImage: "/players/nadal/portrait.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 2,
    active: true,
  },
  {
    name: "Novak Djokovic",
    slug: "novak-djokovic",
    firstName: "Novak",
    lastName: "Djokovic",
    country: "Serbia",
    biography:
      "Campione dalla completezza tecnica eccezionale, noto per elasticità, risposta e solidità mentale.",
    heroImage: "/players/djokovic/hero.jpg",
    portraitImage: "/players/djokovic/portrait.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 3,
    active: true,
  },
  {
    name: "Jannik Sinner",
    slug: "jannik-sinner",
    firstName: "Jannik",
    lastName: "Sinner",
    country: "Italia",
    biography:
      "Protagonista del tennis contemporaneo italiano, riconoscibile per potenza, precisione e compostezza.",
    heroImage: "/players/sinner/hero.jpg",
    portraitImage: "/players/sinner/portrait.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 4,
    active: true,
  },
  {
    name: "Carlos Alcaraz",
    slug: "carlos-alcaraz",
    firstName: "Carlos",
    lastName: "Alcaraz",
    country: "Spagna",
    biography:
      "Campione della nuova generazione, caratterizzato da atletismo, creatività e tennis spettacolare.",
    heroImage: "/players/alcaraz/hero.jpg",
    portraitImage: "/players/alcaraz/portrait.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 5,
    active: true,
  },
] as const;

const brands = [
  {
    name: "Nike",
    slug: "nike",
    logo: "/brands/nike.svg",
    history:
      "Marchio sportivo globale legato ad alcune delle più celebri collezioni della storia del tennis.",
  },
  {
    name: "Adidas",
    slug: "adidas",
    logo: "/brands/adidas.svg",
    history:
      "Marchio storico dello sport, protagonista nell'abbigliamento e nelle calzature da tennis.",
  },
  {
    name: "ASICS",
    slug: "asics",
    logo: "/brands/asics.svg",
    history:
      "Brand giapponese conosciuto soprattutto per lo sviluppo di calzature tecniche ad alte prestazioni.",
  },
  {
    name: "On",
    slug: "on",
    logo: "/brands/on.svg",
    history:
      "Marchio svizzero contemporaneo che unisce innovazione tecnica, design essenziale e prestazioni.",
  },
] as const;

function getArchiveCollectionType(age: number | null) {
  return age !== null && age <= 23
    ? ("RISING_STAR" as const)
    : ("ARCHIVE" as const);
}

async function seedFeaturedPlayers(): Promise<void> {
  for (const player of featuredPlayers) {
    await prisma.player.upsert({
      where: {
        slug: player.slug,
      },
      update: {
        name: player.name,
        firstName: player.firstName,
        lastName: player.lastName,
        country: player.country,
        biography: player.biography,
        heroImage: player.heroImage,
        portraitImage: player.portraitImage,
        collectionType: player.collectionType,
        displayOrder: player.displayOrder,
        active: player.active,
      },
      create: {
        name: player.name,
        slug: player.slug,
        firstName: player.firstName,
        lastName: player.lastName,
        country: player.country,
        biography: player.biography,
        heroImage: player.heroImage,
        portraitImage: player.portraitImage,
        collectionType: player.collectionType,
        displayOrder: player.displayOrder,
        active: player.active,
      },
    });

    console.log(`✅ Giocatore principale salvato: ${player.name}`);
  }
}

async function seedBrands(): Promise<void> {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: {
        slug: brand.slug,
      },
      update: {
        name: brand.name,
        logo: brand.logo,
        history: brand.history,
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        history: brand.history,
      },
    });

    console.log(`✅ Brand salvato: ${brand.name}`);
  }
}

async function syncAtpArchivePlayers(): Promise<void> {
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
  });

  if (atpPlayers.length === 0) {
    console.log(
      "ℹ️ Nessuna classifica ATP presente: importa prima la classifica e rilancia il seed.",
    );

    return;
  }

  console.log(
    `🎾 Sincronizzazione ATP Archive: ${atpPlayers.length} giocatori trovati.`,
  );

  for (const atpPlayer of atpPlayers) {
    const existingPlayer = await prisma.player.findUnique({
      where: {
        slug: atpPlayer.slug,
      },
    });

    const archivePlayer = existingPlayer
      ? await prisma.player.update({
          where: {
            id: existingPlayer.id,
          },
          data: {
            name: atpPlayer.name,
            firstName: atpPlayer.firstName,
            lastName: atpPlayer.lastName,
            country: atpPlayer.country,
            portraitImage:
              existingPlayer.portraitImage ?? atpPlayer.imageUrl,
            collectionType:
              existingPlayer.collectionType === "FEATURED"
                ? "FEATURED"
                : getArchiveCollectionType(atpPlayer.age),
            displayOrder:
              existingPlayer.collectionType === "FEATURED"
                ? existingPlayer.displayOrder
                : atpPlayer.rank,
            active: true,
          },
        })
      : await prisma.player.create({
          data: {
            name: atpPlayer.name,
            slug: atpPlayer.slug,
            firstName: atpPlayer.firstName,
            lastName: atpPlayer.lastName,
            country: atpPlayer.country,
            portraitImage: atpPlayer.imageUrl,
            collectionType: getArchiveCollectionType(atpPlayer.age),
            displayOrder: atpPlayer.rank,
            active: true,
          },
        });

    await prisma.atpPlayer.update({
      where: {
        id: atpPlayer.id,
      },
      data: {
        playerId: archivePlayer.id,
      },
    });

    console.log(
      `🔗 ATP #${atpPlayer.rank} collegato: ${atpPlayer.name}`,
    );
  }
}

async function main(): Promise<void> {
  console.log("🌱 Avvio del seed AGE202...");

  await seedFeaturedPlayers();
  await seedBrands();
  await syncAtpArchivePlayers();

  console.log("🏆 Seed AGE202 completato con successo.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Errore durante il seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
