import {
  config,
} from "dotenv";


config();


async function main() {
  console.log("");
  console.log(
    "==========================================",
  );

  console.log(
    " AGE202 - SYNC SINNER ARTIFACT → STRIPE",
  );

  console.log(
    "==========================================",
  );

  console.log("");


  /*
   * Import dinamici:
   * vengono eseguiti dopo config(),
   * così DATABASE_URL e Stripe key
   * sono già disponibili.
   */
  const {
    prisma,
  } = await import(
    "@/lib/prisma"
  );

  const {
    stripe,
  } = await import(
    "@/lib/stripe"
  );


  try {
    /*
     * 1. SICUREZZA:
     * verifichiamo che Stripe sia TEST.
     */
    console.log(
      "🔎 Controllo modalità Stripe...",
    );


    const balance =
      await stripe.balance.retrieve();


    if (
      balance.livemode
    ) {
      throw new Error(
        [
          "STOP DI SICUREZZA.",
          "Stripe risulta in modalità LIVE.",
          "Nessun prodotto verrà creato.",
        ].join(
          " ",
        ),
      );
    }


    console.log(
      "✅ Stripe TEST mode confermato.",
    );

    console.log("");


    /*
     * 2. Troviamo automaticamente
     * l'Artifact Sinner da 80 €.
     */
    console.log(
      "🎾 Ricerca Artifact...",
    );


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

          description:
            true,

          subtitle:
            true,

          price:
            true,

          currency:
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
      });


    const artifact =
      artifacts.find(
        (
          item,
        ) =>
          item.price !==
            null &&
          Number(
            item.price,
          ) ===
            80,
      );


    if (!artifact) {
      throw new Error(
        "Artifact Nike Jannik Sinner Collection da 80 € non trovato.",
      );
    }


    console.log(
      "✅ Artifact trovato:",
    );

    console.log({
      id:
        artifact.id,

      title:
        artifact.title,

      slug:
        artifact.slug,

      price:
        artifact.price
          ?.toString(),

      currency:
        artifact.currency,

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


    /*
     * 3. Se è già completamente
     * sincronizzato non facciamo nulla.
     */
    if (
      artifact.stripeActive &&
      artifact.stripeProductId &&
      artifact.stripePriceId
    ) {
      console.log(
        "✅ Artifact già sincronizzato con Stripe.",
      );

      console.log("");
      console.log(
        `Product: ${artifact.stripeProductId}`,
      );

      console.log(
        `Price: ${artifact.stripePriceId}`,
      );

      console.log("");

      console.log(
        "🎉 Nessuna modifica necessaria.",
      );

      return;
    }


    if (!artifact.price) {
      throw new Error(
        "Prezzo Artifact mancante.",
      );
    }


    if (
      artifact.price.lte(
        0,
      )
    ) {
      throw new Error(
        "Prezzo Artifact non valido.",
      );
    }


    const currency =
      artifact.currency
        .trim()
        .toLowerCase();


    const unitAmount =
      artifact.price
        .mul(
          100,
        )
        .toDecimalPlaces(
          0,
        )
        .toNumber();


    let stripeProductId =
      artifact.stripeProductId;

    let stripePriceId =
      artifact.stripePriceId;


    /*
     * 4. Se manca il Product,
     * lo creiamo in Stripe TEST.
     */
    if (
      !stripeProductId
    ) {
      console.log(
        "💳 Creazione Stripe Product TEST...",
      );


      const stripeProduct =
        await stripe.products.create({
          name:
            artifact.title,

          description:
            artifact.description
              ?.trim() ||
            artifact.subtitle
              ?.trim() ||
            undefined,

          metadata: {
            age202ItemId:
              artifact.id,

            age202ItemType:
              "ARTIFACT",

            age202Slug:
              artifact.slug,
          },
        });


      stripeProductId =
        stripeProduct.id;


      console.log(
        `✅ Stripe Product creato: ${stripeProductId}`,
      );
    } else {
      console.log(
        `✅ Stripe Product già presente: ${stripeProductId}`,
      );
    }


    /*
     * 5. Se manca il Price,
     * lo creiamo.
     */
    if (
      !stripePriceId
    ) {
      console.log(
        "💶 Creazione Stripe Price TEST...",
      );


      const stripePrice =
        await stripe.prices.create({
          product:
            stripeProductId,

          currency,

          unit_amount:
            unitAmount,

          metadata: {
            age202ItemId:
              artifact.id,

            age202ItemType:
              "ARTIFACT",

            age202Slug:
              artifact.slug,
          },
        });


      stripePriceId =
        stripePrice.id;


      console.log(
        `✅ Stripe Price creato: ${stripePriceId}`,
      );
    } else {
      console.log(
        `✅ Stripe Price già presente: ${stripePriceId}`,
      );
    }


    /*
     * 6. Aggiorniamo AGE202.
     */
    console.log("");
    console.log(
      "🗄️ Aggiornamento database AGE202...",
    );


    const updatedArtifact =
      await prisma.artifact.update({
        where: {
          id:
            artifact.id,
        },

        data: {
          stripeActive:
            true,

          stripeProductId,

          stripePriceId,
        },

        select: {
          id:
            true,

          title:
            true,

          price:
            true,

          stripeActive:
            true,

          stripeProductId:
            true,

          stripePriceId:
            true,
        },
      });


    console.log(
      "✅ Database aggiornato.",
    );

    console.log("");

    console.log(
      "==========================================",
    );

    console.log(
      " 🎉 SINCRONIZZAZIONE COMPLETATA",
    );

    console.log(
      "==========================================",
    );

    console.log("");

    console.log({
      title:
        updatedArtifact.title,

      price:
        updatedArtifact.price
          ?.toString(),

      stripeActive:
        updatedArtifact.stripeActive,

      stripeProductId:
        updatedArtifact.stripeProductId,

      stripePriceId:
        updatedArtifact.stripePriceId,
    });

    console.log("");

    console.log(
      "✅ Artifact pronto per Stripe Checkout TEST.",
    );

    console.log(
      "🔐 Nessun pagamento effettuato.",
    );

    console.log(
      "🔐 Nessuna spedizione InPost creata.",
    );
  } finally {
    await prisma.$disconnect();
  }
}


void main().catch(
  (
    error,
  ) => {
    console.error("");
    console.error(
      "❌ SINCRONIZZAZIONE FALLITA",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  },
);