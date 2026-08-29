import "dotenv/config";

import {
  createInPostAuthorizationHeaders,
  getInPostApiBaseUrl,
  getInPostOrganizationId,
} from "@/lib/services/inpost.service";


async function main() {
  try {
    const baseUrl =
      getInPostApiBaseUrl();

    const organizationId =
      getInPostOrganizationId();

    const headers =
      await createInPostAuthorizationHeaders();

    /*
     * Tracking volutamente inesistente.
     *
     * Questa richiesta è SOLO in lettura:
     * non crea spedizioni,
     * non genera etichette,
     * non modifica nulla su InPost.
     */
    const fakeTrackingNumber =
      `AGE202-ACCESS-TEST-${Date.now()}`;

    const url =
      new URL(
        `/shipping/v2/organizations/${encodeURIComponent(
          organizationId,
        )}/shipments/${encodeURIComponent(
          fakeTrackingNumber,
        )}`,
        baseUrl,
      );

    console.log(
      "📦 Test accesso InPost Shipping API",
    );

    console.log(
      "Nessuna spedizione verrà creata.",
    );

    console.log("");

    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          headers,

          cache:
            "no-store",
        },
      );

    const responseText =
      await response.text();

    /*
     * 404 / 400 con tracking inesistente è un buon risultato:
     * significa che siamo arrivati alla Shipping API
     * e la richiesta è stata autenticata.
     */
    if (
      response.status === 404 ||
      response.status === 400
    ) {
      console.log(
        "✅ InPost Shipping API raggiungibile",
      );

      console.log(
        `HTTP ${response.status} ${response.statusText}`,
      );

      console.log(
        "Il tracking di test non esiste, come previsto.",
      );

      if (responseText) {
        console.log("");
        console.log(
          "Risposta InPost:",
        );
        console.log(
          responseText,
        );
      }

      return;
    }

    if (
      response.status === 401
    ) {
      console.error(
        "❌ InPost Shipping API: autenticazione non autorizzata.",
      );

      console.error(
        responseText,
      );

      process.exitCode =
        1;

      return;
    }

    if (
      response.status === 403
    ) {
      console.error(
        "❌ InPost Shipping API: permessi insufficienti.",
      );

      console.error(
        responseText,
      );

      process.exitCode =
        1;

      return;
    }

    if (response.ok) {
      /*
       * Teoricamente impossibile con il tracking casuale,
       * ma gestiamolo comunque.
       */
      console.log(
        "✅ InPost Shipping API successful",
      );

      console.log(
        responseText,
      );

      return;
    }

    console.error(
      "❌ Risposta InPost Shipping API inattesa",
    );

    console.error(
      `HTTP ${response.status} ${response.statusText}`,
    );

    console.error(
      responseText,
    );

    process.exitCode =
      1;
  } catch (error) {
    console.error(
      "❌ InPost Shipping API test failed",
    );

    if (
      error instanceof Error
    ) {
      console.error(
        error.message,
      );
    } else {
      console.error(
        error,
      );
    }

    process.exitCode =
      1;
  }
}


void main();