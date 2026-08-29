import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  createInPostShipmentForOrder,
} from "@/lib/server/inpost/inpost-shipping.service";


async function main() {
  console.log("");
  console.log(
    "==========================================",
  );

  console.log(
    " AGE202 - INPOST TEST ORDER GUARD",
  );

  console.log(
    "==========================================",
  );

  console.log("");


  const order =
    await prisma.order.findFirst({
      where: {
        isTest:
          true,

        paymentStatus:
          "PAID",

        shippingProvider:
          "INPOST",
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

        inpostShipmentId:
          true,

        inpostTrackingNumber:
          true,
      },
    });


  if (!order) {
    throw new Error(
      "Nessun ordine Stripe TEST + PAID + INPOST trovato.",
    );
  }


  console.log(
    "🧪 Ordine TEST trovato:",
  );

  console.log({
    id:
      order.id,

    orderNumber:
      order.orderNumber,

    isTest:
      order.isTest,

    paymentStatus:
      order.paymentStatus,

    shippingProvider:
      order.shippingProvider,

    shippingMethod:
      order.shippingMethod,

    shippingStatus:
      order.shippingStatus,

    inpostPointId:
      order.inpostPointId,

    inpostShipmentId:
      order.inpostShipmentId,

    inpostTrackingNumber:
      order.inpostTrackingNumber,
  });

  console.log("");


  console.log(
    "🔐 Stato sicurezza:",
  );

  console.log({
    INPOST_ENVIRONMENT:
      process.env
        .INPOST_ENVIRONMENT ??
      null,

    INPOST_SHIPPING_ENABLED:
      process.env
        .INPOST_SHIPPING_ENABLED ??
      null,
  });

  console.log("");


  if (
    process.env
      .INPOST_SHIPPING_ENABLED ===
    "true"
  ) {
    throw new Error(
      [
        "TEST INTERROTTO.",
        "INPOST_SHIPPING_ENABLED=true.",
        "Per questo test deve rimanere false.",
      ].join(
        " ",
      ),
    );
  }


  console.log(
    "🛡️ Tentativo controllato di creazione spedizione...",
  );

  console.log(
    "Nessuna spedizione deve essere creata.",
  );

  console.log("");


  try {
    await createInPostShipmentForOrder({
      orderId:
        order.id,
    });


    /*
     * Non dovremmo MAI arrivare qui.
     */
    throw new Error(
      "ERRORE CRITICO: la spedizione non è stata bloccata.",
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );


    console.log(
      "✅ Chiamata bloccata correttamente.",
    );

    console.log("");

    console.log(
      "Messaggio:",
    );

    console.log(
      message,
    );

    console.log("");


    const expectedBlock =
      message.includes(
        "Creazione spedizioni InPost disabilitata",
      ) ||
      message.includes(
        "TEST",
      );


    if (!expectedBlock) {
      throw new Error(
        [
          "La chiamata è stata bloccata,",
          "ma non da una guard di sicurezza attesa.",
          `Messaggio ricevuto: ${message}`,
        ].join(
          " ",
        ),
      );
    }
  }


  /*
   * Verifica finale:
   * il DB non deve contenere tracking
   * o shipment id dopo il test.
   */
  const verifiedOrder =
    await prisma.order.findUnique({
      where: {
        id:
          order.id,
      },

      select: {
        orderNumber:
          true,

        isTest:
          true,

        shippingStatus:
          true,

        inpostShipmentId:
          true,

        inpostTrackingNumber:
          true,

        shippingCreatedAt:
          true,
      },
    });


  if (!verifiedOrder) {
    throw new Error(
      "Ordine non più presente nel database dopo il test.",
    );
  }


  console.log(
    "🔎 Verifica database:",
  );

  console.log({
    orderNumber:
      verifiedOrder.orderNumber,

    isTest:
      verifiedOrder.isTest,

    shippingStatus:
      verifiedOrder.shippingStatus,

    inpostShipmentId:
      verifiedOrder.inpostShipmentId,

    inpostTrackingNumber:
      verifiedOrder.inpostTrackingNumber,

    shippingCreatedAt:
      verifiedOrder.shippingCreatedAt,
  });

  console.log("");


  if (
    verifiedOrder.inpostShipmentId ||
    verifiedOrder.inpostTrackingNumber ||
    verifiedOrder.shippingCreatedAt
  ) {
    throw new Error(
      "ERRORE: il test ha rilevato dati di una spedizione InPost nel database.",
    );
  }


  console.log(
    "==========================================",
  );

  console.log(
    " ✅ TEST DI SICUREZZA SUPERATO",
  );

  console.log(
    "==========================================",
  );

  console.log("");

  console.log(
    "Ordine Stripe TEST protetto.",
  );

  console.log(
    "Nessuna spedizione InPost creata.",
  );

  console.log(
    "Nessun tracking salvato.",
  );

  console.log(
    "Nessuna modifica logistica effettuata.",
  );
}


void main()
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