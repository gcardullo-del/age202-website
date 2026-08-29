import "dotenv/config";

import {
  createInPostShipmentForOrder,
  isInPostShippingEnabled,
} from "@/lib/server/inpost/inpost-shipping.service";


async function main() {
  console.log("");
  console.log(
    "======================================",
  );

  console.log(
    " AGE202 INPOST SHIPPING GUARD TEST",
  );

  console.log(
    "======================================",
  );

  console.log("");

  console.log(
    `INPOST_SHIPPING_ENABLED = ${
      process.env.INPOST_SHIPPING_ENABLED ??
      "(non impostato)"
    }`,
  );

  console.log(
    `Shipping enabled: ${
      isInPostShippingEnabled()
        ? "YES"
        : "NO"
    }`,
  );

  console.log("");

  /*
   * Usiamo volutamente un ID fittizio.
   *
   * Se il guard funziona correttamente,
   * il codice deve fermarsi PRIMA
   * ancora di leggere il database.
   */
  try {
    await createInPostShipmentForOrder({
      orderId:
        "AGE202-GUARD-TEST",
    });

    console.error(
      "❌ ERRORE: la funzione non è stata bloccata.",
    );

    process.exitCode =
      1;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.log(
      "✅ Chiamata bloccata correttamente.",
    );

    console.log("");

    console.log(
      "Messaggio:",
    );

    console.log(
      message,
    );

    if (
      !message.includes(
        "Creazione spedizioni InPost disabilitata.",
      )
    ) {
      console.error("");
      console.error(
        "❌ Il blocco è avvenuto per un motivo diverso da quello atteso.",
      );

      process.exitCode =
        1;

      return;
    }

    console.log("");
    console.log(
      "🔐 GUARD DI SICUREZZA CONFERMATO",
    );

    console.log(
      "✅ Nessuna lettura ordine necessaria.",
    );

    console.log(
      "✅ Nessuna chiamata POST verso InPost.",
    );

    console.log(
      "✅ Nessuna spedizione reale creata.",
    );
  }
}


void main();