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

const players = [
  {
    name: "Roger Federer",
    slug: "roger-federer",
    country: "Svizzera",
    biography:
      "Una delle figure più iconiche della storia del tennis, celebrato per eleganza, tecnica e longevità.",
    heroImage: "/players/federer-hero.jpg",
    portraitImage: "/players/federer.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 1,
    active: true,
  },
  {
    name: "Rafael Nadal",
    slug: "rafael-nadal",
    country: "Spagna",
    biography:
      "Campione simbolo della terra battuta, famoso per intensità, resilienza e straordinario spirito competitivo.",
    heroImage: "/players/nadal-hero.jpg",
    portraitImage: "/players/nadal.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 2,
    active: true,
  },
  {
    name: "Novak Djokovic",
    slug: "novak-djokovic",
    country: "Serbia",
    biography:
      "Campione dalla completezza tecnica eccezionale, noto per elasticità, risposta e solidità mentale.",
    heroImage: "/players/djokovic-hero.jpg",
    portraitImage: "/players/djokovic.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 3,
    active: true,
  },
  {
    name: "Jannik Sinner",
    slug: "jannik-sinner",
    country: "Italia",
    biography:
      "Protagonista del tennis contemporaneo italiano, riconoscibile per potenza, precisione e compostezza.",
    heroImage: "/players/sinner-hero.jpg",
    portraitImage: "/players/sinner.jpg",
    collectionType: "FEATURED" as const,
    displayOrder: 4,
    active: true,
  },
  {
    name: "Carlos Alcaraz",
    slug: "carlos-alcaraz",
    country: "Spagna",
    biography:
      "Campione della nuova generazione, caratterizzato da atletismo, creatività e tennis spettacolare.",
    heroImage: "/players/alcaraz-hero.jpg",
    portraitImage: "/players/alcaraz.jpg",
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

async function main(): Promise<void> {
  console.log("🌱 Avvio del seed AGE202...");

  for (const player of players) {
    await prisma.player.upsert({
      where: {
        slug: player.slug,
      },
      update: {
        name: player.name,
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
        country: player.country,
        biography: player.biography,
        heroImage: player.heroImage,
        portraitImage: player.portraitImage,
        collectionType: player.collectionType,
        displayOrder: player.displayOrder,
        active: player.active,
      },
    });

    console.log(`✅ Giocatore salvato: ${player.name}`);
  }

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