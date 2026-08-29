import "dotenv/config";

import {
  getInPostAccessToken,
  getInPostApiBaseUrl,
  getInPostOrganizationId,
  getInPostShipmentByTrackingNumber,
  searchInPostPoints,
} from "@/lib/services/inpost.service";


type CheckState =
  | "READY"
  | "WAITING"
  | "BLOCKED";


type CheckResult = {
  label: string;
  state: CheckState;
  detail: string;
};


const results: CheckResult[] =
  [];


function addResult(
  label: string,
  state: CheckState,
  detail: string,
) {
  results.push({
    label,
    state,
    detail,
  });
}


function isConfigured(
  value: string | undefined,
) {
  return Boolean(
    value?.trim(),
  );
}


function isPlaceholderSecret(
  value: string | undefined,
) {
  const normalized =
    value
      ?.trim()
      .toLowerCase() ||
    "";

  if (!normalized) {
    return true;
  }

  return (
    normalized.includes(
      "inseriremo",
    ) ||
    normalized.includes(
      "placeholder",
    ) ||
    normalized.includes(
      "secret_inpost",
    )
  );
}


function describeState(
  state: CheckState,
) {
  if (
    state ===
    "READY"
  ) {
    return "✅ READY";
  }

  if (
    state ===
    "WAITING"
  ) {
    return "⏳ ATTESA INPOST";
  }

  return "❌ BLOCCO";
}


async function main() {
  console.log("");
  console.log(
    "AGE202 · INPOST PRODUCTION READINESS",
  );
  console.log(
    "====================================",
  );
  console.log("");

  console.log(
    "READ-ONLY CHECK",
  );
  console.log(
    "Nessuna POST /shipments verrà eseguita.",
  );
  console.log(
    "Nessuna modifica al database verrà eseguita.",
  );
  console.log("");


  /*
   * 1. ENVIRONMENT
   */
  const environment =
    process.env.INPOST_ENVIRONMENT
      ?.trim()
      .toLowerCase();

  if (
    environment ===
    "production"
  ) {
    addResult(
      "InPost environment",
      "READY",
      "INPOST_ENVIRONMENT=production",
    );
  } else {
    addResult(
      "InPost environment",
      "BLOCKED",
      `Valore attuale: ${environment || "NON CONFIGURATO"}`,
    );
  }


  /*
   * 2. SAFETY SWITCH
   *
   * Prima del go-live deve restare FALSE.
   */
  const shippingEnabled =
    process.env
      .INPOST_SHIPPING_ENABLED
      ?.trim()
      .toLowerCase();

  if (
    shippingEnabled ===
    "false"
  ) {
    addResult(
      "Safety switch spedizioni",
      "READY",
      "INPOST_SHIPPING_ENABLED=false · creazione reale bloccata",
    );
  } else {
    addResult(
      "Safety switch spedizioni",
      "BLOCKED",
      `Deve restare false durante il readiness test. Valore attuale: ${shippingEnabled || "NON CONFIGURATO"}`,
    );
  }


  /*
   * 3. CREDENTIALS PRESENCE
   */
  const credentialsPresent =
    isConfigured(
      process.env
        .INPOST_CLIENT_ID,
    ) &&
    isConfigured(
      process.env
        .INPOST_CLIENT_SECRET,
    );

  addResult(
    "Credenziali OAuth",
    credentialsPresent
      ? "READY"
      : "BLOCKED",
    credentialsPresent
      ? "Client ID e Client Secret configurati"
      : "INPOST_CLIENT_ID o INPOST_CLIENT_SECRET mancanti",
  );


  /*
   * 4. ORGANIZATION
   */
  try {
    const organizationId =
      getInPostOrganizationId();

    addResult(
      "Organization ID",
      "READY",
      `Configurato · ${organizationId}`,
    );
  } catch (
    error
  ) {
    addResult(
      "Organization ID",
      "BLOCKED",
      error instanceof Error
        ? error.message
        : "Organization ID non valido",
    );
  }


  /*
   * 5. API BASE URL
   */
  try {
    const baseUrl =
      getInPostApiBaseUrl();

    if (
      baseUrl ===
      "https://api.inpost-group.com"
    ) {
      addResult(
        "Production API URL",
        "READY",
        baseUrl,
      );
    } else {
      addResult(
        "Production API URL",
        "BLOCKED",
        `URL attuale: ${baseUrl}`,
      );
    }
  } catch (
    error
  ) {
    addResult(
      "Production API URL",
      "BLOCKED",
      error instanceof Error
        ? error.message
        : "Impossibile determinare API URL",
    );
  }


  /*
   * 6. REAL PRODUCTION OAUTH
   *
   * Solo token OAuth. Nessuna spedizione.
   */
  try {
    const token =
      await getInPostAccessToken();

    addResult(
      "OAuth Production",
      "READY",
      `Token Bearer ottenuto (${token.length} caratteri)`,
    );
  } catch (
    error
  ) {
    addResult(
      "OAuth Production",
      "BLOCKED",
      error instanceof Error
        ? error.message
        : "Autenticazione OAuth fallita",
    );
  }


  /*
   * 7. LOCATION API
   *
   * Ricerca punti in sola lettura.
   * Coordinate centrali di Roma.
   */
  try {
    const points =
      await searchInPostPoints({
        latitude:
          41.9028,

        longitude:
          12.4964,

        country:
          "IT",

        maxDistance:
          10_000,

        limit:
          3,
      });

    if (
      points.items.length >
      0
    ) {
      addResult(
        "Location API",
        "READY",
        `${points.items.length} punto/i InPost restituito/i`,
      );
    } else {
      addResult(
        "Location API",
        "BLOCKED",
        "Richiesta riuscita ma nessun punto restituito",
      );
    }
  } catch (
    error
  ) {
    addResult(
      "Location API",
      "BLOCKED",
      error instanceof Error
        ? error.message
        : "Location API non accessibile",
    );
  }


  /*
   * 8. SHIPPING API READ ACCESS
   *
   * Usiamo volutamente un tracking inesistente.
   *
   * HTTP 404 significa:
   * - OAuth accettato;
   * - organization accessibile;
   * - endpoint Shipping raggiunto;
   * - nessuna spedizione creata o modificata.
   */
  try {
    await getInPostShipmentByTrackingNumber(
      "AGE202-READINESS-NOT-A-REAL-TRACKING",
    );

    addResult(
      "Shipping API read access",
      "READY",
      "Endpoint Shipping GET accessibile",
    );
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );

    if (
      message.includes(
        "HTTP 404",
      )
    ) {
      addResult(
        "Shipping API read access",
        "READY",
        "GET autorizzata · tracking fittizio correttamente non trovato (HTTP 404)",
      );
    } else {
      addResult(
        "Shipping API read access",
        "BLOCKED",
        message,
      );
    }
  }


  /*
   * 9. RESEND
   */
  const resendConfigured =
    isConfigured(
      process.env
        .RESEND_API_KEY,
    );

  addResult(
    "Resend API",
    resendConfigured
      ? "READY"
      : "BLOCKED",
    resendConfigured
      ? "RESEND_API_KEY configurata"
      : "RESEND_API_KEY mancante",
  );


  const emailFromConfigured =
    isConfigured(
      process.env
        .ORDER_EMAIL_FROM,
    );

  addResult(
    "Order email sender",
    emailFromConfigured
      ? "READY"
      : "BLOCKED",
    emailFromConfigured
      ? "ORDER_EMAIL_FROM configurato"
      : "ORDER_EMAIL_FROM mancante",
  );


  /*
   * 10. WEBHOOK HMAC
   */
  const webhookSecret =
    process.env
      .INPOST_WEBHOOK_SECRET;

  if (
    isPlaceholderSecret(
      webhookSecret,
    )
  ) {
    addResult(
      "Webhook HMAC secret",
      "WAITING",
      "Secret Production ancora da scambiare con InPost",
    );
  } else {
    addResult(
      "Webhook HMAC secret",
      "READY",
      "Secret Production configurato",
    );
  }


  const signingMode =
    process.env
      .INPOST_WEBHOOK_SIGNING_MODE
      ?.trim()
      .toLowerCase();

  if (
    signingMode ===
      "body" ||
    signingMode ===
      "timestamp.body"
  ) {
    addResult(
      "Webhook signing mode",
      "READY",
      `INPOST_WEBHOOK_SIGNING_MODE=${signingMode}`,
    );
  } else {
    addResult(
      "Webhook signing mode",
      "BLOCKED",
      `Valore non valido o mancante: ${signingMode || "NON CONFIGURATO"}`,
    );
  }


  /*
   * REPORT
   */
  console.log("");
  console.log(
    "RISULTATO",
  );
  console.log(
    "---------",
  );

  for (
    const result
    of results
  ) {
    console.log(
      `${describeState(
        result.state,
      )} · ${result.label}`,
    );

    console.log(
      `   ${result.detail}`,
    );
  }


  const blocked =
    results.filter(
      (
        result,
      ) =>
        result.state ===
        "BLOCKED",
    );

  const waiting =
    results.filter(
      (
        result,
      ) =>
        result.state ===
        "WAITING",
    );

  const ready =
    results.filter(
      (
        result,
      ) =>
        result.state ===
        "READY",
    );


  console.log("");
  console.log(
    "RIEPILOGO",
  );
  console.log(
    "---------",
  );

  console.log(
    `✅ READY: ${ready.length}`,
  );

  console.log(
    `⏳ ATTESA INPOST: ${waiting.length}`,
  );

  console.log(
    `❌ BLOCCO: ${blocked.length}`,
  );


  console.log("");
  console.log(
    "SAFETY",
  );
  console.log(
    "------",
  );

  console.log(
    "✅ Nessuna POST /shipments eseguita.",
  );

  console.log(
    "✅ Nessuna spedizione InPost creata.",
  );

  console.log(
    "✅ Nessuna modifica al database.",
  );


  if (
    blocked.length >
    0
  ) {
    console.log("");
    console.log(
      "❌ PRODUCTION READINESS NON SUPERATO",
    );

    process.exitCode =
      1;

    return;
  }


  if (
    waiting.length >
    0
  ) {
    console.log("");
    console.log(
      "✅ AGE202 TECHNICAL READINESS SUPERATO",
    );

    console.log(
      "⏳ GO-LIVE INPOST IN ATTESA DEL WEBHOOK PRODUCTION.",
    );

    return;
  }


  console.log("");
  console.log(
    "✅ PRODUCTION READINESS SUPERATO",
  );

  console.log(
    "⚠️ Non attivare automaticamente INPOST_SHIPPING_ENABLED.",
  );
}


main()
  .catch(
    (
      error,
    ) => {
      console.error("");
      console.error(
        "❌ READINESS TEST FALLITO",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );
