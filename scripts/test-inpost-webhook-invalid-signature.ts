import "dotenv/config";

import {
  randomUUID,
} from "node:crypto";


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


async function main() {
  const configuredSecret =
    getRequiredEnv(
      "INPOST_WEBHOOK_SECRET",
    );

  const eventId =
    randomUUID();

  const trackingNumber =
    `AGE202_INVALID_SIGNATURE_${Date.now()}`;

  const timestamp =
    new Date()
      .toISOString();

  const payload = {
    customerReference:
      "AGE202-INVALID-SIGNATURE-TEST",

    trackingNumber,

    eventId,

    eventCode:
      "FMD.1002",

    timestamp,

    shipment: {
      type:
        "OUTBOUND",
    },
  };

  const rawBody =
    JSON.stringify(
      payload,
    );

  /*
   * La firma deve essere VOLUTAMENTE errata.
   *
   * Non usiamo il secret corretto:
   * vogliamo dimostrare che la route rifiuta
   * la richiesta PRIMA di elaborare il payload.
   */
  const invalidSignature =
    Buffer.from(
      `AGE202_INVALID_SIGNATURE_${configuredSecret.length}_${Date.now()}`,
      "utf8",
    ).toString(
      "base64",
    );

  const baseUrl =
    process.env
      .AGE202_LOCAL_URL
      ?.trim() ||
    "http://localhost:3000";

  const url =
    `${baseUrl}/api/inpost/webhook`;

  console.log("");
  console.log(
    "AGE202 · TEST FIRMA WEBHOOK INPOST NON VALIDA",
  );
  console.log(
    "============================================",
  );
  console.log(
    `Endpoint: ${url}`,
  );
  console.log(
    `Tracking fittizio: ${trackingNumber}`,
  );
  console.log(
    "Firma inviata: volutamente NON valida",
  );
  console.log("");

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
            invalidSignature,
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

  /*
   * Comportamento corretto:
   *
   * - la firma non valida deve essere rifiutata;
   * - HTTP deve essere 401;
   * - success deve essere false;
   * - il service di tracking non deve essere eseguito.
   */
  if (
    response.status !==
    401
  ) {
    throw new Error(
      [
        "ERRORE DI SICUREZZA:",
        `atteso HTTP 401, ricevuto HTTP ${response.status}.`,
        "Una richiesta con firma HMAC errata non deve essere accettata.",
      ].join(
        " ",
      ),
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
      error?: string;
      result?: unknown;
    };

  if (
    data.success !==
    false
  ) {
    throw new Error(
      "ERRORE DI SICUREZZA: una firma non valida non deve produrre success=true.",
    );
  }

  if (
    data.received ===
    true
  ) {
    throw new Error(
      "ERRORE DI SICUREZZA: il webhook ha marcato come ricevuto un evento con firma non valida.",
    );
  }

  if (
    data.result !==
    undefined
  ) {
    throw new Error(
      "ERRORE DI SICUREZZA: il service di tracking sembra essere stato eseguito nonostante la firma errata.",
    );
  }

  const errorMessage =
    typeof data.error ===
      "string"
      ? data.error
      : "";

  if (
    !errorMessage
      .toLowerCase()
      .includes(
        "firma",
      )
  ) {
    throw new Error(
      "La route ha restituito 401 ma senza il messaggio atteso relativo alla firma.",
    );
  }

  console.log("");
  console.log(
    "TEST FIRMA WEBHOOK SUPERATO ✅",
  );
  console.log(
    "La route rifiuta correttamente le richieste con firma HMAC non valida.",
  );
  console.log(
    "Il payload non viene accettato e non raggiunge il flusso di sincronizzazione tracking.",
  );
}


main().catch(
  (error) => {
    console.error("");
    console.error(
      "TEST FIRMA WEBHOOK FALLITO ❌",
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
