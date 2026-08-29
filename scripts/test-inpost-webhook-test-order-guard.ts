import "dotenv/config";

import {
  createHmac,
  randomUUID,
} from "node:crypto";

import {
  prisma,
} from "@/lib/prisma";


type InPostWebhookSigningMode =
  | "body"
  | "timestamp-body";


function getRequiredEnv(
  name: string,
): string {
  const value =
    process.env[
      name
    ]?.trim();

  if (!value) {
    throw new Error(
      `Variabile ambiente mancante: ${name}`,
    );
  }

  return value;
}


function getSigningMode(): InPostWebhookSigningMode {
  const value =
    process.env
      .INPOST_WEBHOOK_SIGNING_MODE
      ?.trim()
      .toLowerCase();

  if (
    !value ||
    value ===
      "body"
  ) {
    return "body";
  }

  if (
    value ===
      "timestamp-body"
  ) {
    return "timestamp-body";
  }

  throw new Error(
    'INPOST_WEBHOOK_SIGNING_MODE deve essere "body" oppure "timestamp-body".',
  );
}


function buildSignature({
  rawBody,
  timestamp,
  secret,
  mode,
}: {
  rawBody: string;
  timestamp: string;
  secret: string;
  mode: InPostWebhookSigningMode;
}): string {
  const signedContent =
    mode ===
    "timestamp-body"
      ? `${timestamp}.${rawBody}`
      : rawBody;

  return createHmac(
    "sha256",
    Buffer.from(
      secret,
      "utf8",
    ),
  )
    .update(
      Buffer.from(
        signedContent,
        "utf8",
      ),
    )
    .digest(
      "base64",
    );
}


async function main() {
  const secret =
    getRequiredEnv(
      "INPOST_WEBHOOK_SECRET",
    );

  const signingMode =
    getSigningMode();

  const baseUrl =
    process.env
      .AGE202_LOCAL_URL
      ?.trim() ||
    "http://localhost:3000";

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

        status:
          true,

        shippingProvider:
          true,

        shippingStatus:
          true,

        inpostStatus:
          true,

        inpostTrackingNumber:
          true,

        shippedAt:
          true,

        deliveredAt:
          true,
      },
    });

  if (!testOrder) {
    throw new Error(
      "Nessun ordine Stripe TEST trovato nel database AGE202.",
    );
  }

  /*
   * Salviamo tutti i campi che toccheremo.
   * A fine test vengono SEMPRE ripristinati nel finally.
   */
  const original = {
    shippingProvider:
      testOrder.shippingProvider,

    inpostTrackingNumber:
      testOrder.inpostTrackingNumber,
  };

  const fakeTracking =
    `AGE202_TEST_GUARD_${Date.now()}`;

  const eventId =
    randomUUID();

  const timestamp =
    new Date()
      .toISOString();

  console.log("");
  console.log(
    "AGE202 · TEST GUARD WEBHOOK SU ORDINE STRIPE TEST",
  );
  console.log(
    "===============================================",
  );
  console.log(
    `Ordine: ${testOrder.orderNumber}`,
  );
  console.log(
    `ID: ${testOrder.id}`,
  );
  console.log(
    `Stato ordine iniziale: ${testOrder.status}`,
  );
  console.log(
    `Shipping iniziale: ${testOrder.shippingStatus}`,
  );
  console.log(
    `Tracking temporaneo: ${fakeTracking}`,
  );
  console.log("");

  try {
    /*
     * Prepariamo SOLO un riferimento locale temporaneo
     * affinché il webhook possa trovare questo ordine.
     *
     * Nessuna chiamata InPost viene effettuata.
     * Nessuna spedizione viene creata.
     */
    await prisma.order.update({
      where: {
        id:
          testOrder.id,
      },

      data: {
        shippingProvider:
          "INPOST",

        inpostTrackingNumber:
          fakeTracking,
      },
    });

    const payload = {
      customerReference:
        testOrder.orderNumber,

      trackingNumber:
        fakeTracking,

      eventId,

      /*
       * Evento operativo che, su un ordine LIVE,
       * porterebbe normalmente la spedizione
       * verso IN_TRANSIT.
       */
      eventCode:
        "MMD.1001",

      timestamp,

      shipment: {
        type:
          "TEST",
      },
    };

    const rawBody =
      JSON.stringify(
        payload,
      );

    const signature =
      buildSignature({
        rawBody,
        timestamp,
        secret,
        mode:
          signingMode,
      });

    const response =
      await fetch(
        `${baseUrl}/api/inpost/webhook`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-inpost-topic":
              "Shipment.Tracking",

            "x-inpost-event-id":
              eventId,

            "x-inpost-timestamp":
              timestamp,

            "x-inpost-signature":
              signature,
          },

          body:
            rawBody,
        },
      );

    const responseText =
      await response.text();

    let responseJson:
      unknown =
      responseText;

    try {
      responseJson =
        JSON.parse(
          responseText,
        );
    } catch {
      // Manteniamo il testo grezzo.
    }

    console.log(
      `HTTP ${response.status} ${response.statusText}`,
    );

    console.log(
      JSON.stringify(
        responseJson,
        null,
        2,
      ),
    );

    if (
      response.status !==
      200
    ) {
      throw new Error(
        "Il webhook locale non ha restituito HTTP 200.",
      );
    }

    if (
      !responseJson ||
      typeof responseJson !==
        "object"
    ) {
      throw new Error(
        "Risposta webhook non valida.",
      );
    }

    const data =
      responseJson as {
        success?: boolean;
        received?: boolean;
        result?: {
          matched?: boolean;
          ignored?: boolean;
          reason?: string;
          orderId?: string;
          shippingStatus?: string;
        };
      };

    if (
      data.success !==
        true ||
      data.received !==
        true
    ) {
      throw new Error(
        "Il webhook non ha confermato correttamente la ricezione.",
      );
    }

    if (
      data.result
        ?.matched !==
        true
    ) {
      throw new Error(
        "Il webhook non ha trovato l'ordine Stripe TEST preparato per il controllo.",
      );
    }

    if (
      data.result
        ?.ignored !==
        true
    ) {
      throw new Error(
        "ERRORE DI SICUREZZA: il webhook non ha ignorato l'ordine Stripe TEST.",
      );
    }

    const afterWebhook =
      await prisma.order.findUnique({
        where: {
          id:
            testOrder.id,
        },

        select: {
          status:
            true,

          shippingStatus:
            true,

          inpostStatus:
            true,

          shippedAt:
            true,

          deliveredAt:
            true,
        },
      });

    if (!afterWebhook) {
      throw new Error(
        "Ordine non più presente dopo il test.",
      );
    }

    const protectedFieldsUnchanged =
      afterWebhook.status ===
        testOrder.status &&
      afterWebhook.shippingStatus ===
        testOrder.shippingStatus &&
      afterWebhook.inpostStatus ===
        testOrder.inpostStatus &&
      String(
        afterWebhook.shippedAt,
      ) ===
        String(
          testOrder.shippedAt,
        ) &&
      String(
        afterWebhook.deliveredAt,
      ) ===
        String(
          testOrder.deliveredAt,
        );

    if (
      !protectedFieldsUnchanged
    ) {
      throw new Error(
        [
          "ERRORE DI SICUREZZA:",
          "il webhook ha modificato campi logistici dell'ordine Stripe TEST.",
        ].join(
          " ",
        ),
      );
    }

    console.log("");
    console.log(
      "TEST GUARD WEBHOOK SUPERATO ✅",
    );
    console.log(
      "L'evento firmato ha trovato l'ordine TEST ma il service lo ha ignorato correttamente.",
    );
    console.log(
      "Nessuno stato logistico reale è stato modificato.",
    );
  } finally {
    /*
     * Ripristino SEMPRE eseguito,
     * anche se il test fallisce a metà.
     */
    await prisma.order.update({
      where: {
        id:
          testOrder.id,
      },

      data: {
        shippingProvider:
          original.shippingProvider,

        inpostTrackingNumber:
          original.inpostTrackingNumber,
      },
    });

    console.log("");
    console.log(
      "Dati temporanei di test ripristinati.",
    );
  }
}


main()
  .catch(
    (error) => {
      console.error("");
      console.error(
        "TEST GUARD WEBHOOK FALLITO ❌",
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
