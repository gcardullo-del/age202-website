import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  createInPostShipmentForOrder,
  isInPostShippingEnabled,
} from "@/lib/server/inpost/inpost-shipping.service";


async function main() {
  let testOrderId:
    | string
    | null =
    null;

  console.log("");
  console.log(
    "==========================================",
  );

  console.log(
    " AGE202 STRIPE TEST ORDER SHIPPING CHECK",
  );

  console.log(
    "==========================================",
  );

  console.log("");

  console.log(
    `INPOST_SHIPPING_ENABLED = ${
      process.env.INPOST_SHIPPING_ENABLED ??
      "(non impostato)"
    }`,
  );

  console.log(
    `Shipping enabled: ${
      isInPostShippingEnabled()
        ? "YES"
        : "NO"
    }`,
  );

  console.log("");

  try {
    /*
     * Creiamo un ordine TEST controllato.
     *
     * Nessun prodotto AGE202 viene collegato.
     * Nessun pagamento Stripe viene effettuato.
     */
    const order =
      await prisma.order.create({
        data: {
          orderNumber:
            `AGE202-STRIPE-TEST-${Date.now()}`,

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
            "stripe-test@age202.com",

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

          shippingMethod:
            "INPOST_POINT",

          shippingStatus:
            "READY_TO_CREATE",

          /*
           * Punto volutamente fittizio.
           *
           * Con INPOST_SHIPPING_ENABLED=false
           * il codice deve fermarsi PRIMA
           * di qualsiasi POST InPost.
           */
          inpostPointId:
            "IT_AGE202_TEST_POINT",

          inpostPointName:
            "AGE202 TEST POINT",

          inpostPointAddress:
            "TEST ONLY",

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
        },
      });

    testOrderId =
      order.id;

    console.log(
      "✅ Ordine Stripe TEST simulato creato.",
    );

    console.log(
      JSON.stringify(
        order,
        null,
        2,
      ),
    );

    console.log("");

    /*
     * Il webhook attuale contiene già
     * una protezione isTest PRIMA
     * di richiamare questa funzione.
     *
     * Qui testiamo anche la seconda barriera:
     * il service deve rifiutarsi perché
     * INPOST_SHIPPING_ENABLED=false.
     */
    console.log(
      "🔐 Test seconda barriera di sicurezza...",
    );

    try {
      await createInPostShipmentForOrder({
        orderId:
          order.id,
      });

      console.error(
        "❌ ERRORE: la funzione ha superato il guard InPost.",
      );

      process.exitCode =
        1;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      console.log(
        "✅ Creazione spedizione bloccata.",
      );

      console.log("");

      console.log(
        "Messaggio:",
      );

      console.log(
        message,
      );

      if (
        !message.includes(
          "Creazione spedizioni InPost disabilitata.",
        )
      ) {
        throw new Error(
          `Blocco avvenuto per motivo inatteso: ${message}`,
        );
      }
    }

    console.log("");
    console.log(
      "✅ COMPORTAMENTO CONFERMATO",
    );

    console.log(
      "Stripe TEST → Order PAID → READY_TO_CREATE",
    );

    console.log(
      "→ nessuna spedizione InPost",
    );

    console.log("");

    console.log(
      "🔐 Nessuna chiamata POST InPost eseguita.",
    );

    console.log(
      "🔐 Nessun pagamento Stripe effettuato.",
    );
  } finally {
    if (testOrderId) {
      console.log("");
      console.log(
        "🧹 Eliminazione ordine TEST...",
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
      } catch (error) {
        console.error(
          "⚠️ Cleanup ordine TEST fallito:",
          error,
        );
      }
    }

    await prisma.$disconnect();
  }
}


void main().catch(
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
);