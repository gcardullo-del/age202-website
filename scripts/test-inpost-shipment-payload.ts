import "dotenv/config";

import {
  searchInPostPoints,
} from "@/lib/services/inpost.service";

import {
  buildInPostShipmentPayload,
} from "@/lib/services/inpost-shipment.mapper";


async function main() {
  try {
    console.log(
      "🧪 AGE202 → InPost shipment payload DRY RUN",
    );

    console.log(
      "⚠️ Nessuna spedizione verrà creata.",
    );

    console.log("");

    /*
     * Cerchiamo un vero punto InPost a Roma.
     * Questa chiamata è SOLO in lettura.
     */
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
          1,
      });

    const point =
      points.items[0];

    if (
      !point ||
      !point.id
    ) {
      throw new Error(
        "Nessun punto InPost disponibile per il test.",
      );
    }

    const shippingMethod =
      point.type === "APM"
        ? "INPOST_LOCKER"
        : "INPOST_POINT";

    /*
     * Ordine simulato.
     *
     * NON viene salvato nel database
     * e NON viene inviato a InPost.
     */
    const payload =
      buildInPostShipmentPayload({
        order: {
          orderNumber:
            "AGE202-DRY-RUN",

          customerEmail:
            "mario.rossi@example.com",

          customerName:
            "Mario Rossi",

          customerPhone:
            "+390000000000",

          shippingName:
            "Mario Rossi",

          shippingCountry:
            "IT",

          shippingMethod,

          inpostPointId:
            point.id,

          inpostPointName:
            point.name ??
            null,

          inpostPointAddress:
            [
              point.address?.street,
              point.address?.buildingNumber,
              point.address?.postalCode,
              point.address?.city,
            ]
              .filter(Boolean)
              .join(" ") ||
            null,
        },

        /*
         * Dimensioni SOLO di test.
         * Non rappresentano ancora
         * lo standard definitivo AGE202.
         */
        parcel: {
          lengthCm:
            30,

          widthCm:
            20,

          heightCm:
            5,

          weightKg:
            1,
        },

        /*
         * Per il DRY RUN simuliamo
         * consegna del pacco a un PUDO.
         *
         * Potremo cambiarlo in APM
         * quando definiamo il flusso operativo.
         */
        originMethod:
          "PUDO",
      });

    console.log(
      `📍 Punto test: ${point.id}`,
    );

    console.log(
      `Tipo: ${point.type ?? "n/d"}`,
    );

    console.log("");

    console.log(
      "📦 Payload generato:",
    );

    console.log(
      JSON.stringify(
        payload,
        null,
        2,
      ),
    );

    console.log("");

    console.log(
      "✅ DRY RUN completato",
    );

    console.log(
      "✅ Nessuna chiamata POST eseguita",
    );
  } catch (error) {
    console.error(
      "❌ InPost shipment payload test failed",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  }
}


void main();