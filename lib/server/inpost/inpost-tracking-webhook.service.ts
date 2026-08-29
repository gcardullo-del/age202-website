import {
     prisma,
} from "@/lib/prisma";

import {
  sendShippingDeliveredEmail,
  sendShippingInTransitEmail,
} from "@/lib/services/shipping-email.service";


export type InPostTrackingWebhookPayload = {
  customerReference?: string | null;

  source?: "WEBHOOK" | "TRACKING_API";

  trackingNumber: string;

  eventId: string;

  eventCode: string;

  timestamp: string;

  location?: Record<
    string,
    unknown
  > | null;

  delivery?: Record<
    string,
    unknown
  > | null;

  shipment?: {
    type?: string | null;
  } | null;

  returnToSender?: {
    trackingNumber?: string | null;
  } | null;

  newDestination?: Record<
    string,
    unknown
  > | null;
};


type Age202TrackingState =
  | "CREATED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "ERROR";


export type SynchronizeInPostTrackingResult = {
  matched: boolean;

  ignored: boolean;

  reason?: string;

  orderId?: string;

  orderNumber?: string;

  trackingNumber: string;

  eventCode: string;

  previousShippingStatus?: string;

  shippingStatus?: string;
};


const TERMINAL_DELIVERY_EVENT_CODES =
  new Set([
    "EOL.1001",
    "EOL.1002",
    "EOL.1003",
    "EOL.1004",
    "EOL.1005",
    "EOL.1006",
    "EOL.1007",
    "EOL.1008",
  ]);


const CANCELLED_EVENT_CODES =
  new Set([
    "EOL.9004",
    "EOL.9005",
  ]);


const ERROR_EVENT_CODES =
  new Set([
    "EOL.9001",
    "EOL.9002",
    "EOL.9003",
    "EOL.9006",

    "FMD.9001",
    "FMD.9002",

    "LMD.9003",
    "LMD.9005",
    "LMD.9006",
    "LMD.9007",
    "LMD.9008",
    "LMD.9009",
    "LMD.9010",
    "LMD.9011",
    "LMD.9018",
    "LMD.9027",
    "LMD.9028",
    "LMD.9030",

    "RTS.1002",
  ]);


const CREATED_EVENT_CODES =
  new Set([
    "CRE.1001",
    "FMD.1001",
  ]);


const IN_TRANSIT_EVENT_PREFIXES =
  [
    "CC.",
    "FMD.",
    "FUL.",
    "HAN.",
    "INF.",
    "LMD.",
    "MMD.",
    "RTS.",
  ] as const;


const NON_TERMINAL_EOF_EVENT_CODES =
  new Set([
    "EOL.1009",
  ]);


function normalizeRequiredString(
  value: unknown,
  fieldName: string,
): string {
  if (
    typeof value !==
    "string"
  ) {
    throw new Error(
      `Campo webhook InPost non valido: ${fieldName}.`,
    );
  }

  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      `Campo webhook InPost mancante: ${fieldName}.`,
    );
  }

  return normalized;
}


function parseEventDate(
  value: string,
): Date {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      "Timestamp webhook InPost non valido.",
    );
  }

  return date;
}


export function mapEventCodeToTrackingState(
  eventCode: string,
): Age202TrackingState | null {
  if (
    TERMINAL_DELIVERY_EVENT_CODES.has(
      eventCode,
    )
  ) {
    return "DELIVERED";
  }

  if (
    CANCELLED_EVENT_CODES.has(
      eventCode,
    )
  ) {
    return "CANCELLED";
  }

  if (
    ERROR_EVENT_CODES.has(
      eventCode,
    )
  ) {
    return "ERROR";
  }

  if (
    CREATED_EVENT_CODES.has(
      eventCode,
    )
  ) {
    return "CREATED";
  }

  if (
    NON_TERMINAL_EOF_EVENT_CODES.has(
      eventCode,
    )
  ) {
    return "IN_TRANSIT";
  }

  if (
    IN_TRANSIT_EVENT_PREFIXES.some(
      (prefix) =>
        eventCode.startsWith(
          prefix,
        ),
    )
  ) {
    return "IN_TRANSIT";
  }

  /*
   * Un codice futuro o non documentato non viene
   * classificato automaticamente come IN_TRANSIT.
   * È più sicuro ignorarlo e conservare lo stato
   * corrente finché la mappatura AGE202 non viene
   * aggiornata.
   */
  return null;
}


function getShippingStatusRank(
  status: string,
): number {
  switch (status) {
    case "NOT_CREATED":
      return 0;

    case "READY_TO_CREATE":
      return 1;

    case "CREATED":
      return 2;

    case "LABEL_READY":
      return 3;

    case "ERROR":
      return 3;

    case "IN_TRANSIT":
      return 4;

    case "DELIVERED":
      return 5;

    case "CANCELLED":
      return 6;

    default:
      return -1;
  }
}


function shouldIgnoreTransition(
  currentShippingStatus: string,
  nextState: Age202TrackingState,
): boolean {
  /*
   * Stati terminali: non permettiamo a un evento
   * arrivato in ritardo di riaprire la spedizione.
   */
  if (
    currentShippingStatus ===
      "DELIVERED" ||
    currentShippingStatus ===
      "CANCELLED"
  ) {
    return true;
  }

  if (
    nextState ===
      "CANCELLED" ||
    nextState ===
      "ERROR"
  ) {
    return false;
  }

  const nextRank =
    getShippingStatusRank(
      nextState,
    );

  const currentRank =
    getShippingStatusRank(
      currentShippingStatus,
    );

  return (
    currentRank >
    nextRank
  );
}



function isUniqueConstraintError(
  error: unknown,
): boolean {
  if (
    !error ||
    typeof error !==
      "object"
  ) {
    return false;
  }

  return (
    "code" in error &&
    (error as {
      code?: unknown;
    }).code ===
      "P2002"
  );
}


async function markTrackingEventProcessed(
  eventId: string,
  ignored: boolean,
) {
  await prisma.inPostTrackingEvent.update({
    where: {
      eventId,
    },

    data: {
      processed:
        true,

      ignored,

      processedAt:
        new Date(),
    },
  });
}


async function registerTrackingEvent(
  input: {
    eventId: string;
    trackingNumber: string;
    eventCode: string;
    eventDate: Date;
    source:
      | "WEBHOOK"
      | "TRACKING_API";
  },
): Promise<
  | {
      duplicate:
        false;
    }
  | {
      duplicate:
        true;

      processed:
        boolean;

      ignored:
        boolean;
    }
> {
  const existing =
    await prisma.inPostTrackingEvent.findUnique({
      where: {
        eventId:
          input.eventId,
      },

      select: {
        processed:
          true,

        ignored:
          true,
      },
    });

  if (existing) {
    return {
      duplicate:
        true,

      processed:
        existing.processed,

      ignored:
        existing.ignored,
    };
  }

  try {
    await prisma.inPostTrackingEvent.create({
      data: {
        eventId:
          input.eventId,

        trackingNumber:
          input.trackingNumber,

        eventCode:
          input.eventCode,

        eventTimestamp:
          input.eventDate,

        source:
          input.source,
      },
    });

    return {
      duplicate:
        false,
    };
  } catch (
    error
  ) {
    if (
      !isUniqueConstraintError(
        error,
      )
    ) {
      throw error;
    }

    const concurrent =
      await prisma.inPostTrackingEvent.findUnique({
        where: {
          eventId:
            input.eventId,
        },

        select: {
          processed:
            true,

          ignored:
            true,
        },
      });

    if (!concurrent) {
      throw error;
    }

    return {
      duplicate:
        true,

      processed:
        concurrent.processed,

      ignored:
        concurrent.ignored,
    };
  }
}


/**
 * Applica al database AGE202 un evento Shipment.Tracking
 * ricevuto da InPost.
 *
 * IMPORTANTE:
 * questa funzione NON crea spedizioni.
 * Aggiorna esclusivamente ordini che possiedono già
 * un tracking number InPost.
 *
 * La verifica crittografica della firma webhook
 * deve essere eseguita dalla route PRIMA di chiamare
 * questa funzione.
 */
export async function synchronizeInPostTrackingEvent(
  payload: InPostTrackingWebhookPayload,
): Promise<SynchronizeInPostTrackingResult> {
  const trackingNumber =
    normalizeRequiredString(
      payload.trackingNumber,
      "trackingNumber",
    );

  const eventId =
    normalizeRequiredString(
      payload.eventId,
      "eventId",
    );

  const eventCode =
    normalizeRequiredString(
      payload.eventCode,
      "eventCode",
    ).toUpperCase();

  const timestamp =
    normalizeRequiredString(
      payload.timestamp,
      "timestamp",
    );

  const eventDate =
    parseEventDate(
      timestamp,
    );

  const source =
    payload.source ===
    "TRACKING_API"
      ? "TRACKING_API"
      : "WEBHOOK";

  const registration =
    await registerTrackingEvent({
      eventId,
      trackingNumber,
      eventCode,
      eventDate,
      source,
    });

  /*
   * Se l'evento è già stato completato, lo ignoriamo
   * immediatamente. La unique constraint su eventId
   * impedisce inoltre che due richieste concorrenti
   * possano creare due record distinti.
   *
   * Se invece esiste ma processed=false, significa
   * che un tentativo precedente si è interrotto
   * prima di completare l'aggiornamento. In quel caso
   * permettiamo il retry.
   */
  if (
    registration.duplicate &&
    registration.processed
  ) {
    return {
      matched:
        true,

      ignored:
        true,

      reason:
        "Evento InPost già processato: duplicato ignorato.",

      trackingNumber,

      eventCode,
    };
  }

  const order =
    await prisma.order.findFirst({
      where: {
        shippingProvider:
          "INPOST",

        inpostTrackingNumber:
          trackingNumber,
      },

      select: {
        id:
          true,

        orderNumber:
          true,

        status:
          true,

        isTest:
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

  /*
   * Un tracking sconosciuto non deve causare
   * modifiche accidentali nel database.
   *
   * La route potrà comunque rispondere 200 a InPost
   * per evitare retry infiniti su eventi che non
   * appartengono ad AGE202.
   */
  if (!order) {
    await markTrackingEventProcessed(
      eventId,
      true,
    );

    return {
      matched:
        false,

      ignored:
        true,

      reason:
        "Tracking InPost non associato ad alcun ordine AGE202.",

      trackingNumber,

      eventCode,
    };
  }

  /*
   * Ulteriore protezione:
   * gli ordini Stripe TEST non devono mai entrare
   * nel flusso logistico reale.
   */
  if (order.isTest) {
    await markTrackingEventProcessed(
      eventId,
      true,
    );

    return {
      matched:
        true,

      ignored:
        true,

      reason:
        "Ordine Stripe TEST: aggiornamento logistico reale ignorato.",

      orderId:
        order.id,

      orderNumber:
        order.orderNumber,

      trackingNumber,

      eventCode,

      previousShippingStatus:
        order.shippingStatus,

      shippingStatus:
        order.shippingStatus,
    };
  }

  const nextState =
    mapEventCodeToTrackingState(
      eventCode,
    );

  if (!nextState) {
    await markTrackingEventProcessed(
      eventId,
      true,
    );

    return {
      matched:
        true,

      ignored:
        true,

      reason:
        "Evento InPost non ancora mappato da AGE202: stato logistico lasciato invariato.",

      orderId:
        order.id,

      orderNumber:
        order.orderNumber,

      trackingNumber,

      eventCode,

      previousShippingStatus:
        order.shippingStatus,

      shippingStatus:
        order.shippingStatus,
    };
  }

  if (
    shouldIgnoreTransition(
      order.shippingStatus,
      nextState,
    )
  ) {
    await markTrackingEventProcessed(
      eventId,
      true,
    );

    return {
      matched:
        true,

      ignored:
        true,

      reason:
        "Evento InPost ignorato per evitare una regressione dello stato logistico.",

      orderId:
        order.id,

      orderNumber:
        order.orderNumber,

      trackingNumber,

      eventCode,

      previousShippingStatus:
        order.shippingStatus,

      shippingStatus:
        order.shippingStatus,
    };
  }

  if (
    nextState ===
    "DELIVERED"
  ) {
    await prisma.order.update({
      where: {
        id:
          order.id,
      },

      data: {
        inpostStatus:
          eventCode,

        shippingStatus:
          "DELIVERED",

        status:
          "COMPLETED",

        deliveredAt:
          order.deliveredAt ??
          eventDate,

        shippedAt:
          order.shippedAt ??
          eventDate,
      },
    });
  } else if (
    nextState ===
    "IN_TRANSIT"
  ) {
    await prisma.order.update({
      where: {
        id:
          order.id,
      },

      data: {
        inpostStatus:
          eventCode,

        shippingStatus:
          "IN_TRANSIT",

        status:
          "SHIPPED",

        shippedAt:
          order.shippedAt ??
          eventDate,
      },
    });
  } else if (
    nextState ===
    "CANCELLED"
  ) {
    await prisma.order.update({
      where: {
        id:
          order.id,
      },

      data: {
        inpostStatus:
          eventCode,

        shippingStatus:
          "CANCELLED",

        status:
          "CANCELLED",
      },
    });
  } else if (
    nextState ===
    "ERROR"
  ) {
    await prisma.order.update({
      where: {
        id:
          order.id,
      },

      data: {
        inpostStatus:
          eventCode,

        shippingStatus:
          "ERROR",
      },
    });
  } else {
    await prisma.order.update({
      where: {
        id:
          order.id,
      },

      data: {
        inpostStatus:
          eventCode,

        shippingStatus:
          "CREATED",
      },
    });
  }

  await markTrackingEventProcessed(
    eventId,
    false,
  );

  /*
   * EMAIL SPEDIZIONE AGE202
   *
   * - solo transizioni effettivamente applicate;
   * - gli ordini TEST sono già esclusi più in alto;
   * - gli eventi duplicati vengono già ignorati;
   * - un errore Resend NON deve invalidare
   *   l'aggiornamento logistico InPost.
   */
  if (
    nextState ===
    "IN_TRANSIT"
  ) {
    try {
      const emailResult =
        await sendShippingInTransitEmail(
          order.id,
        );

      if (
        emailResult.sent
      ) {
        console.log(
          `✅ Email spedizione in transito inviata per ${order.orderNumber}.`,
        );
      } else {
        console.log(
          `Email spedizione in transito non inviata per ${order.orderNumber}: ${emailResult.reason ?? "invio saltato"}`,
        );
      }
    } catch (error) {
      console.error(
        `⚠️ Errore email spedizione in transito per ${order.orderNumber}:`,
        error,
      );
    }
  } else if (
    nextState ===
    "DELIVERED"
  ) {
    try {
      const emailResult =
        await sendShippingDeliveredEmail(
          order.id,
        );

      if (
        emailResult.sent
      ) {
        console.log(
          `✅ Email consegna inviata per ${order.orderNumber}.`,
        );
      } else {
        console.log(
          `Email consegna non inviata per ${order.orderNumber}: ${emailResult.reason ?? "invio saltato"}`,
        );
      }
    } catch (error) {
      console.error(
        `⚠️ Errore email consegna per ${order.orderNumber}:`,
        error,
      );
    }
  }

  return {
    matched:
      true,

    ignored:
      false,

    orderId:
      order.id,

    orderNumber:
      order.orderNumber,

    trackingNumber,

    eventCode,

    previousShippingStatus:
      order.shippingStatus,

    shippingStatus:
      nextState,
  };
}
