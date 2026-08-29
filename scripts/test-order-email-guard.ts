import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  sendOrderConfirmationEmail,
} from "@/lib/services/order-email.service";

async function main() {
  console.log("");
  console.log(
    "AGE202 · ORDER EMAIL SAFETY TEST",
  );
  console.log(
    "==============================",
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
    `Email cliente presente: ${
      testOrder.customerEmail
        ? "SI"
        : "NO"
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

  const result =
    await sendOrderConfirmationEmail(
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

  if (result.sent) {
    throw new Error(
      "ERRORE DI SICUREZZA: una email è stata inviata durante il test.",
    );
  }

  if (!result.skipped) {
    throw new Error(
      "Il servizio non ha segnalato correttamente lo skip.",
    );
  }

  console.log("");
  console.log(
    "✅ TEST EMAIL SAFETY SUPERATO",
  );
  console.log(
    "✅ Nessuna email reale inviata.",
  );
  console.log(
    "✅ Ordine TEST protetto.",
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