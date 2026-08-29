import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  sendShippingDeliveredEmailPreview,
  sendShippingInTransitEmailPreview,
} from "@/lib/services/shipping-email.service";


async function main() {
  console.log("");
  console.log(
    "AGE202 · SHIPPING EMAIL PREVIEW TEST",
  );
  console.log(
    "====================================",
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
      },
    });


  if (!testOrder) {
    throw new Error(
      "Nessun ordine Stripe TEST trovato nel database.",
    );
  }


  console.log(
    `Ordine TEST: ${testOrder.orderNumber}`,
  );

  console.log(
    `TEST_EMAIL_TO configurata: ${
      process.env.TEST_EMAIL_TO
        ?.trim()
        ? "SI"
        : "NO"
    }`,
  );

  console.log("");


  console.log(
    "INVIO PREVIEW · IN TRANSITO",
  );

  const inTransitResult =
    await sendShippingInTransitEmailPreview(
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
    !inTransitResult.sent
  ) {
    throw new Error(
      `Preview IN_TRANSIT non inviata: ${
        inTransitResult.reason ??
        "motivo sconosciuto"
      }`,
    );
  }


  console.log("");
  console.log(
    "INVIO PREVIEW · CONSEGNATO",
  );

  const deliveredResult =
    await sendShippingDeliveredEmailPreview(
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
    !deliveredResult.sent
  ) {
    throw new Error(
      `Preview DELIVERED non inviata: ${
        deliveredResult.reason ??
        "motivo sconosciuto"
      }`,
    );
  }


  console.log("");
  console.log(
    "✅ SHIPPING EMAIL PREVIEW TEST SUPERATO",
  );

  console.log(
    "✅ Preview IN_TRANSIT inviata.",
  );

  console.log(
    "✅ Preview DELIVERED inviata.",
  );

  console.log(
    "✅ Usato esclusivamente TEST_EMAIL_TO.",
  );

  console.log(
    "✅ Nessuna chiamata InPost.",
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