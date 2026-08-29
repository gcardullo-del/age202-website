import "dotenv/config";

import {
  createHmac,
  randomUUID,
} from "node:crypto";


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

  if (
    secret ===
    "INSERIREMO_IL_SECRET_INPOST"
  ) {
    console.log(
      "ATTENZIONE: stai usando ancora il secret placeholder.",
    );

    console.log(
      "Per il test locale va bene, perché firma e verifica usano lo stesso valore.",
    );
  }

  const signingMode =
    getSigningMode();

  const eventId =
    randomUUID();

  /*
   * Tracking volutamente inesistente:
   * il service AGE202 deve ricevere e validare
   * l'evento, ma NON deve trovare alcun ordine
   * e quindi NON deve modificare il database.
   */
  const trackingNumber =
    `AGE202_LOCAL_TEST_${Date.now()}`;

  const timestamp =
    new Date()
      .toISOString();

  const payload = {
    customerReference:
      "AGE202-LOCAL-WEBHOOK-TEST",

    trackingNumber,

    eventId,

    eventCode:
      "MMD.1001",

    timestamp,

    shipment: {
      type:
        "TEST",
    },
  };

  /*
   * Non usare JSON.stringify una seconda volta dopo
   * aver calcolato la firma: il body inviato deve essere
   * ESATTAMENTE lo stesso body firmato.
   */
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

  const baseUrl =
    process.env
      .AGE202_LOCAL_URL
      ?.trim() ||
    "http://localhost:3000";

  const url =
    `${baseUrl}/api/inpost/webhook`;

  console.log("");
  console.log(
    "AGE202 · TEST LOCALE WEBHOOK INPOST",
  );
  console.log(
    "==================================",
  );
  console.log(
    `Endpoint: ${url}`,
  );
  console.log(
    `Signing mode: ${signingMode}`,
  );
  console.log(
    `Tracking fittizio: ${trackingNumber}`,
  );
  console.log(
    "",
  );

  const response =
    await fetch(
      url,
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
      "La risposta del webhook non è JSON valido.",
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
      false ||
    data.result
      ?.ignored !==
      true
  ) {
    throw new Error(
      [
        "Risultato inatteso.",
        "Il tracking fittizio non dovrebbe essere associato ad alcun ordine.",
        "Per sicurezza interrompo il test.",
      ].join(
        " ",
      ),
    );
  }

  console.log("");
  console.log(
    "TEST WEBHOOK INPOST SUPERATO ✅",
  );
  console.log(
    "Firma HMAC valida, route raggiunta, payload accettato e nessun ordine AGE202 modificato.",
  );
}


main().catch(
  (error) => {
    console.error("");
    console.error(
      "TEST WEBHOOK INPOST FALLITO ❌",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  },
);
