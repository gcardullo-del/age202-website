import {
   NextResponse,
} from "next/server";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  getInPostTrackingHistory,
  type InPostTrackingEvent,
} from "@/lib/services/inpost.service";

import {
  synchronizeInPostTrackingEvent,
  type InPostTrackingWebhookPayload,
} from "@/lib/server/inpost/inpost-tracking-webhook.service";

import {
  prisma,
} from "@/lib/prisma";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};


function parseEventDate(
  event:
    InPostTrackingEvent,
): number {
  const value =
    event.eventTimestamp;

  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    return 0;
  }

  const timestamp =
    Date.parse(
      value,
    );

  return Number.isNaN(
    timestamp,
  )
    ? 0
    : timestamp;
}


function getLatestTrackingEvent(
  events:
    InPostTrackingEvent[],
): InPostTrackingEvent | null {
  if (
    events.length ===
    0
  ) {
    return null;
  }

  return [
    ...events,
  ].sort(
    (
      left,
      right,
    ) =>
      parseEventDate(
        right,
      ) -
      parseEventDate(
        left,
      ),
  )[0] ?? null;
}


function asRecord(
  value: unknown,
): Record<
  string,
  unknown
> | null {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value,
    )
  ) {
    return null;
  }

  return value as Record<
    string,
    unknown
  >;
}


function buildWebhookCompatiblePayload(
  trackingNumber: string,
  event:
    InPostTrackingEvent,
): InPostTrackingWebhookPayload {
  const eventCode =
    typeof event.eventCode ===
      "string"
      ? event.eventCode.trim()
      : "";

  const eventId =
    typeof event.eventId ===
      "string"
      ? event.eventId.trim()
      : "";

  const timestamp =
    typeof event.eventTimestamp ===
      "string"
      ? event.eventTimestamp.trim()
      : "";

  if (!eventCode) {
    throw new Error(
      "L'ultimo evento InPost non contiene eventCode.",
    );
  }

  if (!eventId) {
    throw new Error(
      "L'ultimo evento InPost non contiene eventId.",
    );
  }

  if (!timestamp) {
    throw new Error(
      "L'ultimo evento InPost non contiene eventTimestamp.",
    );
  }

  return {
    trackingNumber,

    eventId,

    eventCode,

    timestamp,

    location:
      asRecord(
        event.location,
      ),

    delivery:
      asRecord(
        event.delivery,
      ),

    shipment:
      event.shipment &&
      typeof event.shipment ===
        "object"
        ? {
            type:
              typeof event
                .shipment
                .type ===
                "string"
                ? event
                    .shipment
                    .type
                : null,
          }
        : null,

    returnToSender:
      event.returnToSender &&
      typeof event
        .returnToSender ===
        "object"
        ? {
            trackingNumber:
              typeof event
                .returnToSender
                .trackingNumber ===
                "string"
                ? event
                    .returnToSender
                    .trackingNumber
                : null,
          }
        : null,

    newDestination:
      asRecord(
        event.newDestination,
      ),
  };
}


export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      trackingNumber:
        rawTrackingNumber,
    } =
      await context.params;

    const trackingNumber =
      decodeURIComponent(
        rawTrackingNumber,
      ).trim();

    if (!trackingNumber) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Tracking number InPost mancante.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * Prima di interrogare InPost verifichiamo
     * che il tracking appartenga davvero a un
     * ordine AGE202.
     *
     * Soprattutto: un ordine Stripe TEST viene
     * bloccato qui e non arriva nemmeno alla
     * Tracking API Production.
     */
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

          isTest:
            true,

          shippingStatus:
            true,

          inpostStatus:
            true,
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Nessun ordine AGE202 associato a questo tracking InPost.",
        },
        {
          status:
            404,
        },
      );
    }

    if (order.isTest) {
      return NextResponse.json(
        {
          success:
            false,

          ignored:
            true,

          error:
            "Ordine Stripe TEST: sincronizzazione Tracking API InPost bloccata per sicurezza.",

          orderNumber:
            order.orderNumber,
        },
        {
          status:
            409,
        },
      );
    }

    const trackingResponse =
      await getInPostTrackingHistory(
        [
          trackingNumber,
        ],
      );

    const parcels =
      Array.isArray(
        trackingResponse.parcels,
      )
        ? trackingResponse.parcels
        : [];

    const parcel =
      parcels.find(
        (candidate) =>
          candidate
            .trackingNumber
            ?.trim() ===
          trackingNumber,
      ) ??
      parcels[0];

    if (!parcel) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "InPost non ha restituito dati tracking per questa spedizione.",
        },
        {
          status:
            404,
        },
      );
    }

    const events =
      Array.isArray(
        parcel.events,
      )
        ? parcel.events
        : [];

    const latestEvent =
      getLatestTrackingEvent(
        events,
      );

    if (!latestEvent) {
      return NextResponse.json(
        {
          success:
            true,

          updated:
            false,

          ignored:
            true,

          orderNumber:
            order.orderNumber,

          trackingNumber,

          message:
            "La spedizione esiste, ma InPost non ha ancora restituito eventi tracking.",

          shippingStatus:
            order.shippingStatus,

          inpostStatus:
            order.inpostStatus,
        },
        {
          status:
            200,
        },
      );
    }

    const payload = {
      ...buildWebhookCompatiblePayload(
        trackingNumber,
        latestEvent,
      ),

      source:
        "TRACKING_API" as const,
    };

    /*
     * Riutilizziamo ESATTAMENTE lo stesso service
     * usato dal webhook Shipment.Tracking.
     *
     * In questo modo:
     * - webhook automatico;
     * - sync manuale Admin;
     *
     * applicano la stessa mappatura e le stesse
     * protezioni contro regressioni di stato.
     */
    const result =
      await synchronizeInPostTrackingEvent(
        payload,
      );

    return NextResponse.json(
      {
        success:
          true,

        updated:
          !result.ignored,

        ignored:
          result.ignored,

        source:
          "inpost-tracking-api",

        orderNumber:
          order.orderNumber,

        trackingNumber,

        event: {
          eventId:
            payload.eventId,

          eventCode:
            payload.eventCode,

          timestamp:
            payload.timestamp,
        },

        result,
      },
      {
        status:
          200,
      },
    );
  } catch (error) {
    if (
      error instanceof
      AdminAuthError
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            error.message,
        },
        {
          status:
            error.status,
        },
      );
    }

    console.error(
      "[AGE202][InPost tracking sync]",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Errore imprevisto durante la sincronizzazione tracking InPost.",
      },
      {
        status:
          500,
      },
    );
  }
}
