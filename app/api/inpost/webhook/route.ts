 import {
 createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  NextResponse,
} from "next/server";

import {
  synchronizeInPostTrackingEvent,
  type InPostTrackingWebhookPayload,
} from "@/lib/server/inpost/inpost-tracking-webhook.service";


export const runtime =
  "nodejs";


type InPostWebhookSigningMode =
  | "body"
  | "timestamp-body";


function getWebhookSecret(): string {
  const secret =
    process.env
      .INPOST_WEBHOOK_SECRET
      ?.trim();

  if (!secret) {
    throw new Error(
      "INPOST_WEBHOOK_SECRET non configurato.",
    );
  }

  return secret;
}


function getWebhookSigningMode(): InPostWebhookSigningMode {
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


function createSignedContent({
  rawBody,
  timestamp,
  mode,
}: {
  rawBody: string;
  timestamp: string | null;
  mode: InPostWebhookSigningMode;
}): string {
  if (
    mode ===
    "body"
  ) {
    return rawBody;
  }

  if (!timestamp) {
    throw new Error(
      "Header x-inpost-timestamp mancante.",
    );
  }

  return `${timestamp}.${rawBody}`;
}


function verifyInPostSignature({
  rawBody,
  timestamp,
  signature,
}: {
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
}): boolean {
  if (!signature) {
    return false;
  }

  const secret =
    getWebhookSecret();

  const mode =
    getWebhookSigningMode();

  const signedContent =
    createSignedContent({
      rawBody,
      timestamp,
      mode,
    });

  const computedSignature =
    createHmac(
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

  const receivedBuffer =
    Buffer.from(
      signature,
      "utf8",
    );

  const computedBuffer =
    Buffer.from(
      computedSignature,
      "utf8",
    );

  if (
    receivedBuffer.length !==
    computedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    computedBuffer,
  );
}


function isTrackingPayload(
  value: unknown,
): value is InPostTrackingWebhookPayload {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const payload =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof payload
      .trackingNumber ===
      "string" &&
    typeof payload
      .eventId ===
      "string" &&
    typeof payload
      .eventCode ===
      "string" &&
    typeof payload
      .timestamp ===
      "string"
  );
}


export async function POST(
  request: Request,
) {
  try {
    /*
     * IMPORTANTISSIMO:
     * leggiamo il body RAW una sola volta e verifichiamo
     * la firma PRIMA di fare JSON.parse().
     *
     * InPost richiede che la firma venga calcolata sui
     * byte/contenuto ricevuti senza ri-serializzare il JSON.
     */
    const rawBody =
      await request.text();

    const signature =
      request.headers.get(
        "x-inpost-signature",
      );

    const timestamp =
      request.headers.get(
        "x-inpost-timestamp",
      );

    const topic =
      request.headers.get(
        "x-inpost-topic",
      );

    const headerEventId =
      request.headers.get(
        "x-inpost-event-id",
      );

    if (
      topic !==
      "Shipment.Tracking"
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Topic webhook InPost non supportato.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !verifyInPostSignature({
        rawBody,
        timestamp,
        signature,
      })
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Firma webhook InPost non valida.",
        },
        {
          status:
            401,
        },
      );
    }

    let parsed:
      unknown;

    try {
      parsed =
        JSON.parse(
          rawBody,
        );
    } catch {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Payload JSON InPost non valido.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !isTrackingPayload(
        parsed,
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Payload Shipment.Tracking InPost non valido.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * InPost documenta che eventId nel body deve
     * corrispondere a x-inpost-event-id.
     */
    if (
      headerEventId &&
      headerEventId !==
        parsed.eventId
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Mismatch tra x-inpost-event-id e payload eventId.",
        },
        {
          status:
            400,
        },
      );
    }

    const result =
      await synchronizeInPostTrackingEvent(
        parsed,
      );

    /*
     * Anche se il tracking non appartiene ad AGE202
     * oppure l'evento viene ignorato, rispondiamo 200.
     *
     * InPost considera qualsiasi risposta diversa da
     * 200 come fallita e applica il meccanismo di retry.
     */
    return NextResponse.json(
      {
        success:
          true,

        received:
          true,

        result,
      },
      {
        status:
          200,
      },
    );
  } catch (error) {
    console.error(
      "Errore webhook InPost AGE202:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Errore sconosciuto nel webhook InPost.";

    return NextResponse.json(
      {
        success:
          false,

        error:
          message,
      },
      {
        status:
          500,
      },
    );
  }
}
