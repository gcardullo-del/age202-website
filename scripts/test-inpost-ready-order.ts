import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  prepareInPostShipment,
} from "@/lib/server/inpost/inpost-shipping.service";


async function main() {
  console.log("");
  console.log(
    "📦 AGE202 → InPost READY ORDER TEST",
  );
  console.log(
    "⚠️ DRY RUN — nessuna spedizione verrà creata.",
  );
  console.log("");

  /*
   * Cerchiamo un ordine realmente pronto
   * per essere trasformato in spedizione InPost.
   */
  const order =
    await prisma.order.findFirst({
      where: {
        paymentStatus:
          "PAID",

        shippingProvider:
          "INPOST",

        shippingStatus:
          "READY_TO_CREATE",

        inpostPointId: {
          not:
            null,
        },

        inpostShipmentId:
          null,

        inpostTrackingNumber:
          null,
      },

      orderBy: {
        createdAt:
          "desc",
      },

      select: {
        id:
          true,

        orderNumber:
          true,

        paymentStatus:
          true,

        shippingStatus:
          true,

        shippingProvider:
          true,

        shippingMethod:
          true,

        inpostPointId:
          true,

        inpostPointName:
          true,

        inpostPointAddress:
          true,

        customerEmail:
          true,

        customerPhone:
          true,

        shippingName:
          true,

        shippingCountry:
          true,

        createdAt:
          true,
      },
    });

  if (!order) {
    console.log(
      "ℹ️ Nessun ordine READY_TO_CREATE trovato.",
    );

    console.log("");
    console.log(
      "Questo NON è un errore.",
    );

    console.log(
      "Il test richiede un ordine PAID + INPOST + READY_TO_CREATE.",
    );

    console.log("");
    return;
  }

  console.log(
    "✅ Ordine trovato",
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
    "🔎 Validazione tramite InPost Shipping Service...",
  );
  console.log("");

  const prepared =
    await prepareInPostShipment({
      orderId:
        order.id,
    });

  console.log(
    "✅ ORDINE VALIDATO",
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
    "🔐 SICUREZZA",
  );

  console.log(
    "✅ Nessuna chiamata POST eseguita.",
  );

  console.log(
    "✅ Nessuna spedizione InPost creata.",
  );

  console.log(
    "✅ Nessuna modifica effettuata al database.",
  );

  console.log("");
  console.log(
    "🎉 DRY RUN COMPLETATO",
  );
}


main()
  .catch(
    (
      error,
    ) => {
      console.error("");
      console.error(
        "❌ TEST FALLITO",
      );

      console.error(
        error instanceof Error
          ? error.message
          : error,
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