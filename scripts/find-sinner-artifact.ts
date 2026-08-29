import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 - RICERCA ARTIFACT SINNER",
  );
  console.log("");

  const artifacts =
    await prisma.artifact.findMany({
      where: {
        title: {
          contains:
            "Nike Jannik Sinner Collection",
          mode:
            "insensitive",
        },
      },

      select: {
        id:
          true,

        title:
          true,

        slug:
          true,

        price:
          true,

        availability:
          true,

        stripeActive:
          true,

        stripeProductId:
          true,

        stripePriceId:
          true,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });


  if (
    artifacts.length ===
    0
  ) {
    console.error(
      "❌ Nessun Artifact Sinner trovato.",
    );

    process.exitCode =
      1;

    return;
  }


  console.log(
    `✅ Artifact trovati: ${artifacts.length}`,
  );

  console.log("");


  for (
    const artifact
    of artifacts
  ) {
    console.log(
      "----------------------------------------",
    );

    console.log({
      id:
        artifact.id,

      title:
        artifact.title,

      slug:
        artifact.slug,

      price:
        artifact.price?.toString() ??
        null,

      availability:
        artifact.availability,

      stripeActive:
        artifact.stripeActive,

      stripeProductId:
        artifact.stripeProductId,

      stripePriceId:
        artifact.stripePriceId,
    });

    console.log("");
  }


  const target =
    artifacts.find(
      (
        artifact,
      ) =>
        artifact.price !==
          null &&
        Number(
          artifact.price,
        ) ===
          80,
    );


  if (!target) {
    console.error(
      "❌ Trovati Artifact Sinner, ma nessuno con prezzo 80 €.",
    );

    process.exitCode =
      1;

    return;
  }


  console.log(
    "========================================",
  );

  console.log(
    "🎯 ARTIFACT DA 80 € INDIVIDUATO",
  );

  console.log(
    "========================================",
  );

  console.log("");

  console.log(
    `ID: ${target.id}`,
  );

  console.log(
    `Titolo: ${target.title}`,
  );

  console.log(
    `Slug: ${target.slug}`,
  );

  console.log(
    `Prezzo: ${target.price?.toString()} €`,
  );

  console.log("");

  console.log(
    "💳 Stato Stripe:",
  );

  console.log({
    stripeActive:
      target.stripeActive,

    stripeProductId:
      target.stripeProductId,

    stripePriceId:
      target.stripePriceId,
  });

  console.log("");
}


void main()
  .catch(
    (
      error,
    ) => {
      console.error("");
      console.error(
        "❌ ERRORE:",
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