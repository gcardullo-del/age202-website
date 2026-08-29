import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  sendShippingDeliveredEmail,
  sendShippingInTransitEmail,
} from "@/lib/services/shipping-email.service";


async function main() {
  console.log("");
  console.log(
    "AGE202 · SHIPPING EMAIL SAFETY TEST",
  );
  console.log(
    "===================================",
  );
  console.log("");


  const testOrder =
    await prisma.order.findFirst({
      where: {
        isTest:
          true,
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

        customerEmail:
          true,

        shippingStatus:
          true,

        inpostTrackingNumber:
          true,
      },
    });


  if (
    !testOrder
  ) {
    throw new Error(
      "Nessun ordine Stripe TEST trovato nel database.",
    );
  }


  console.log(
    `Ordine TEST: ${testOrder.orderNumber}`,
  );

  console.log(
    `Stripe TEST: ${testOrder.isTest ? "SI" : "NO"}`,
  );

  console.log(
    `Email cliente presente: ${
      testOrder.customerEmail
        ? "SI"
        : "NO"
    }`,
  );

  console.log(
    `Shipping status: ${testOrder.shippingStatus}`,
  );

  console.log(
    `Tracking InPost: ${
      testOrder.inpostTrackingNumber ??
      "NON PRESENTE"
    }`,
  );

  console.log(
    `RESEND_API_KEY configurata: ${
      process.env.RESEND_API_KEY
        ?.trim()
        ? "SI"
        : "NO"
    }`,
  );

  console.log("");


  console.log(
    "TEST 1 · EMAIL IN TRANSITO",
  );

  const inTransitResult =
    await sendShippingInTransitEmail(
      testOrder.id,
    );

  console.log(
    JSON.stringify(
      inTransitResult,
      null,
      2,
    ),
  );


  if (
    inTransitResult.sent
  ) {
    throw new Error(
      "ERRORE DI SICUREZZA: email IN_TRANSIT inviata per un ordine TEST.",
    );
  }


  if (
    !inTransitResult.skipped
  ) {
    throw new Error(
      "Il servizio IN_TRANSIT non ha segnalato correttamente lo skip.",
    );
  }


  console.log("");
  console.log(
    "TEST 2 · EMAIL CONSEGNATO",
  );

  const deliveredResult =
    await sendShippingDeliveredEmail(
      testOrder.id,
    );

  console.log(
    JSON.stringify(
      deliveredResult,
      null,
      2,
    ),
  );


  if (
    deliveredResult.sent
  ) {
    throw new Error(
      "ERRORE DI SICUREZZA: email DELIVERED inviata per un ordine TEST.",
    );
  }


  if (
    !deliveredResult.skipped
  ) {
    throw new Error(
      "Il servizio DELIVERED non ha segnalato correttamente lo skip.",
    );
  }


  console.log("");
  console.log(
    "✅ SHIPPING EMAIL SAFETY TEST SUPERATO",
  );

  console.log(
    "✅ Email IN_TRANSIT bloccata.",
  );

  console.log(
    "✅ Email DELIVERED bloccata.",
  );

  console.log(
    "✅ Nessuna email cliente inviata.",
  );

  console.log(
    "✅ Nessuna chiamata InPost eseguita.",
  );

  console.log(
    "✅ Nessuna modifica allo stato ordine.",
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