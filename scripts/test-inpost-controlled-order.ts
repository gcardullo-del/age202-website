import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  searchInPostPoints,
} from "@/lib/services/inpost.service";

import {
  prepareInPostShipment,
} from "@/lib/server/inpost/inpost-shipping.service";


async function main() {
  let testOrderId:
    | string
    | null =
    null;

  console.log("");
  console.log(
    "========================================",
  );

  console.log(
    " AGE202 CONTROLLED INPOST ORDER TEST",
  );

  console.log(
    "========================================",
  );

  console.log("");
  console.log(
    "⚠️ Verrà creato TEMPORANEAMENTE un ordine TEST nel DB.",
  );

  console.log(
    "⚠️ Nessun pagamento Stripe verrà effettuato.",
  );

  console.log(
    "⚠️ Nessuna spedizione InPost verrà creata.",
  );

  console.log(
    "⚠️ L'ordine TEST verrà eliminato alla fine.",
  );

  console.log("");

  try {
    /*
     * Recuperiamo un vero punto InPost.
     *
     * Questa chiamata usa solamente
     * la Location API in lettura.
     */
    console.log(
      "📍 Ricerca punto InPost reale...",
    );

    const points =
      await searchInPostPoints({
        latitude:
          41.9028,

        longitude:
          12.4964,

        country:
          "IT",

        maxDistance:
          10_000,

        limit:
          1,
      });

    const point =
      points.items[0];

    if (
      !point ||
      !point.id
    ) {
      throw new Error(
        "Nessun punto InPost disponibile per il test.",
      );
    }

    const pointType =
      point.type
        ?.trim()
        .toUpperCase();

    if (
      pointType !== "APM" &&
      pointType !== "PUDO"
    ) {
      throw new Error(
        `Tipo punto InPost non supportato: ${point.type ?? "n/d"}`,
      );
    }

    const shippingMethod =
      pointType === "APM"
        ? "INPOST_LOCKER"
        : "INPOST_POINT";

    const pointAddress =
      formatPointAddress(
        point,
      );

    console.log(
      `✅ Punto trovato: ${point.id}`,
    );

    console.log(
      `Tipo: ${pointType}`,
    );

    console.log(
      `Metodo AGE202: ${shippingMethod}`,
    );

    console.log(
      `Indirizzo: ${pointAddress}`,
    );

    console.log("");

    /*
     * Numero ordine chiaramente identificabile
     * come test interno AGE202.
     */
    const orderNumber =
      `AGE202-INPOST-TEST-${Date.now()}`;

    console.log(
      "🧪 Creazione ordine TEST temporaneo...",
    );

    const order =
      await prisma.order.create({
        data: {
          orderNumber,

          status:
            "PAID",

          paymentStatus:
            "PAID",

          isTest:
            true,

          currency:
            "EUR",

          subtotal:
            10,

          shipping:
            0,

          total:
            10,

          customerEmail:
            "inpost-test@age202.com",

          customerName:
            "Mario Rossi",

          customerPhone:
            "+393000000000",

          shippingName:
            "Mario Rossi",

          shippingCountry:
            "IT",

          shippingProvider:
            "INPOST",

          shippingMethod,

          shippingStatus:
            "READY_TO_CREATE",

          inpostPointId:
            point.id,

          inpostPointName:
            point.name ??
            null,

          inpostPointAddress:
            pointAddress,

          paidAt:
            new Date(),
        },

        select: {
          id:
            true,

          orderNumber:
            true,

          isTest:
            true,

          paymentStatus:
            true,

          shippingProvider:
            true,

          shippingMethod:
            true,

          shippingStatus:
            true,

          inpostPointId:
            true,
        },
      });

    testOrderId =
      order.id;

    console.log(
      "✅ Ordine TEST creato",
    );

    console.log(
      JSON.stringify(
        order,
        null,
        2,
      ),
    );

    console.log("");
    console.log(
      "🔎 Passaggio attraverso il vero InPost Shipping Service...",
    );

    console.log("");

    /*
     * QUESTA FUNZIONE È DRY RUN.
     *
     * Legge e valida l'ordine,
     * poi costruisce il payload.
     *
     * NON crea la spedizione.
     */
    const prepared =
      await prepareInPostShipment({
        orderId:
          order.id,

        parcel: {
          lengthCm:
            30,

          widthCm:
            20,

          heightCm:
            5,

          weightKg:
            1,
        },

        originMethod:
          "PUDO",
      });

    console.log(
      "✅ ORDINE VALIDATO DAL SERVIZIO",
    );

    console.log("");

    console.log(
      "📦 PAYLOAD INPOST FINALE",
    );

    console.log(
      JSON.stringify(
        prepared.payload,
        null,
        2,
      ),
    );

    console.log("");
    console.log(
      "✅ PIPELINE COMPLETATA:",
    );

    console.log(
      "DB Order → InPost Shipping Service → Payload",
    );

    console.log("");
    console.log(
      "🔐 Nessuna chiamata POST verso InPost eseguita.",
    );

    console.log(
      "🔐 Nessuna sessione Stripe creata.",
    );

    console.log(
      "🔐 Nessuna spedizione reale creata.",
    );
  } finally {
    /*
     * Cleanup automatico.
     *
     * Anche se il mapper dovesse fallire,
     * proviamo comunque a rimuovere
     * l'ordine di test dal database.
     */
    if (testOrderId) {
      console.log("");
      console.log(
        "🧹 Rimozione ordine TEST dal database...",
      );

      try {
        await prisma.order.delete({
          where: {
            id:
              testOrderId,
          },
        });

        console.log(
          "✅ Ordine TEST eliminato.",
        );
      } catch (cleanupError) {
        console.error(
          "⚠️ Impossibile eliminare automaticamente l'ordine TEST:",
        );

        console.error(
          cleanupError instanceof Error
            ? cleanupError.message
            : cleanupError,
        );
      }
    }

    await prisma.$disconnect();
  }
}


function formatPointAddress(
  point: {
    address?: {
      street?: string;
      buildingNumber?: string;
      postalCode?: string;
      city?: string;
    };
  },
): string {
  const streetLine =
    [
      point.address
        ?.street,

      point.address
        ?.buildingNumber,
    ]
      .filter(Boolean)
      .join(" ");

  const cityLine =
    [
      point.address
        ?.postalCode,

      point.address
        ?.city,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    [
      streetLine,
      cityLine,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Indirizzo InPost non disponibile"
  );
}


void main().catch(
  (
    error,
  ) => {
    console.error("");
    console.error(
      "❌ CONTROLLED TEST FALLITO",
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