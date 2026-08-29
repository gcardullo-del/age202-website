import "dotenv/config";

import {
  randomUUID,
} from "node:crypto";

import {
  prisma,
} from "@/lib/prisma";

import {
  synchronizeInPostTrackingEvent,
  type InPostTrackingWebhookPayload,
} from "@/lib/server/inpost/inpost-tracking-webhook.service";


async function main() {
  const eventId =
    `age202-dedupe-test-${randomUUID()}`;

  const trackingNumber =
    `AGE202-DEDUPE-${randomUUID()}`;

  const payload:
    InPostTrackingWebhookPayload = {
      trackingNumber,
      eventId,
      eventCode:
        "CRE.1001",
      timestamp:
        new Date().toISOString(),
      source:
        "WEBHOOK",
    };

  console.log(
    "\n=== AGE202 InPost webhook deduplication test ===\n",
  );

  console.log(
    "Event ID:",
    eventId,
  );

  console.log(
    "Tracking:",
    trackingNumber,
  );

  try {
    /*
     * Usiamo volutamente un tracking inesistente.
     *
     * In questo modo il test:
     * - NON modifica alcun ordine;
     * - NON chiama InPost;
     * - NON crea spedizioni;
     * - verifica esclusivamente la registrazione
     *   e la deduplicazione dell'eventId.
     */
    const firstResult =
      await synchronizeInPostTrackingEvent(
        payload,
      );

    const afterFirst =
      await prisma.inPostTrackingEvent.findUnique({
        where: {
          eventId,
        },
      });

    if (!afterFirst) {
      throw new Error(
        "Il primo evento non è stato registrato in InPostTrackingEvent.",
      );
    }

    if (
      !afterFirst.processed ||
      !afterFirst.ignored
    ) {
      throw new Error(
        "Il primo evento sconosciuto doveva risultare processed=true e ignored=true.",
      );
    }

    if (
      afterFirst.source !==
      "WEBHOOK"
    ) {
      throw new Error(
        `Source inattesa dopo il primo evento: ${afterFirst.source}`,
      );
    }

    const secondResult =
      await synchronizeInPostTrackingEvent(
        payload,
      );

    const matchingEvents =
      await prisma.inPostTrackingEvent.findMany({
        where: {
          eventId,
        },
      });

    if (
      matchingEvents.length !==
      1
    ) {
      throw new Error(
        `Deduplicazione fallita: trovati ${matchingEvents.length} record per lo stesso eventId.`,
      );
    }

    if (
      !secondResult.ignored
    ) {
      throw new Error(
        "Il secondo invio dello stesso eventId doveva essere ignorato.",
      );
    }

    if (
      !secondResult.reason
        ?.toLowerCase()
        .includes(
          "duplicato",
        )
    ) {
      throw new Error(
        `Il secondo invio è stato ignorato, ma non come duplicato. Reason: ${secondResult.reason ?? "nessuna"}`,
      );
    }

    console.log(
      "\nPrimo invio:",
      firstResult,
    );

    console.log(
      "\nSecondo invio:",
      secondResult,
    );

    console.log(
      "\nRecord DB:",
      matchingEvents[0],
    );

    console.log(
      "\n✅ TEST DEDUPLICAZIONE SUPERATO",
    );

    console.log(
      "Lo stesso eventId è presente una sola volta e il secondo invio è stato ignorato.\n",
    );
  } finally {
    /*
     * Pulizia del solo record creato dal test.
     * Nessun Order viene modificato.
     */
    await prisma.inPostTrackingEvent.deleteMany({
      where: {
        eventId,
      },
    });

    await prisma.$disconnect();
  }
}


main().catch(
  (error) => {
    console.error(
      "\n❌ TEST DEDUPLICAZIONE FALLITO\n",
      error,
    );

    process.exitCode =
      1;
  },
);
