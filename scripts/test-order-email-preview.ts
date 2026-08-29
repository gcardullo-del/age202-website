import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  sendOrderConfirmationEmailPreview,
} from "@/lib/services/order-email.service";


async function main() {
  console.log("");
  console.log(
    "AGE202 · ORDER EMAIL PREVIEW TEST",
  );
  console.log(
    "=================================",
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

        inpostPointId:
          true,

        inpostPointName:
          true,

        inpostPointAddress:
          true,
      },
    });


  if (
    !testOrder
  ) {
    throw new Error(
      "Nessun ordine Stripe TEST trovato.",
    );
  }


  console.log(
    `Ordine preview: ${testOrder.orderNumber}`,
  );

  console.log(
    `Stripe TEST: ${testOrder.isTest ? "SI" : "NO"}`,
  );

  console.log(
    `Punto InPost: ${testOrder.inpostPointName ?? testOrder.inpostPointId ?? "non presente"}`,
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


  const result =
    await sendOrderConfirmationEmailPreview(
      testOrder.id,
    );


  console.log(
    "Risultato:",
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2,
    ),
  );


  if (
    !result.sent
  ) {
    throw new Error(
      result.reason ??
        "La preview non è stata inviata.",
    );
  }


  console.log("");
  console.log(
    "✅ PREVIEW EMAIL ORDINE INVIATA",
  );

  console.log(
    "✅ Usato soltanto un ordine Stripe TEST.",
  );

  console.log(
    "✅ Nessuna email inviata al cliente dell'ordine.",
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