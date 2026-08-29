import "dotenv/config";

import {
  prisma,
} from "@/lib/prisma";

import {
  buildInPostShipmentPayload,
  type Age202ShippingMethod,
} from "@/lib/services/inpost-shipment.mapper";


async function main() {
  try {
    console.log(
      "🧪 AGE202 Order → InPost payload DRY RUN",
    );

    console.log(
      "⚠️ Nessuna spedizione verrà creata.",
    );

    console.log("");

    /*
     * Prendiamo l'ordine PAID più recente.
     *
     * È una lettura DB soltanto.
     * Non modifichiamo l'ordine.
     */
    const order =
      await prisma.order.findFirst({
        where: {
          paymentStatus:
            "PAID",
        },

        orderBy: {
          createdAt:
            "desc",
        },

        select: {
          id:
            true,

          orderNumber:
            true,

          isTest:
            true,

          paymentStatus:
            true,

          customerEmail:
            true,

          customerName:
            true,

          customerPhone:
            true,

          shippingName:
            true,

          shippingCountry:
            true,

          shippingMethod:
            true,

          shippingStatus:
            true,

          inpostPointId:
            true,

          inpostPointName:
            true,

          inpostPointAddress:
            true,

          createdAt:
            true,
        },
      });

    if (!order) {
      console.log(
        "⚠️ Nessun ordine PAID trovato nel database.",
      );

      console.log(
        "Il test termina senza modificare nulla.",
      );

      return;
    }

    console.log(
      `📦 Ordine trovato: ${order.orderNumber}`,
    );

    console.log(
      `ID: ${order.id}`,
    );

    console.log(
      `Test order: ${order.isTest ? "SÌ" : "NO"}`,
    );

    console.log(
      `Payment status: ${order.paymentStatus}`,
    );

    console.log(
      `Shipping status: ${order.shippingStatus}`,
    );

    console.log("");

    const missingFields: string[] =
      [];

    if (
      !order.customerEmail
        ?.trim()
    ) {
      missingFields.push(
        "customerEmail",
      );
    }

    if (
      !order.customerPhone
        ?.trim()
    ) {
      missingFields.push(
        "customerPhone",
      );
    }

    if (
      !(
        order.shippingName?.trim() ||
        order.customerName?.trim()
      )
    ) {
      missingFields.push(
        "shippingName/customerName",
      );
    }

    if (
      !order.shippingCountry
        ?.trim()
    ) {
      missingFields.push(
        "shippingCountry",
      );
    }

    if (
      !order.shippingMethod
    ) {
      missingFields.push(
        "shippingMethod",
      );
    }

    if (
      !order.inpostPointId
        ?.trim()
    ) {
      missingFields.push(
        "inpostPointId",
      );
    }

    if (
      missingFields.length >
      0
    ) {
      console.log(
        "⚠️ L'ordine non è ancora pronto per InPost.",
      );

      console.log("");

      console.log(
        "Campi mancanti:",
      );

      for (
        const field of missingFields
      ) {
        console.log(
          ` - ${field}`,
        );
      }

      console.log("");

      console.log(
        "✅ Nessuna modifica effettuata al database.",
      );

      console.log(
        "✅ Nessuna chiamata POST eseguita.",
      );

      return;
    }
const shippingMethod =
  normalizeShippingMethod(
    order.shippingMethod!,
  );

    const payload =
      buildInPostShipmentPayload({
        order: {
          orderNumber:
            order.orderNumber,

          customerEmail:
            order.customerEmail,

          customerName:
            order.customerName,

          customerPhone:
            order.customerPhone,

          shippingName:
            order.shippingName,

          shippingCountry:
            order.shippingCountry,

          shippingMethod,

          inpostPointId:
            order.inpostPointId,

          inpostPointName:
            order.inpostPointName,

          inpostPointAddress:
            order.inpostPointAddress,
        },

        /*
         * Valori temporanei soltanto per
         * controllare il mapping.
         *
         * Prima della produzione definiremo
         * misure/pesi reali AGE202.
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

        originMethod:
          "PUDO",
      });

    console.log(
      "✅ Ordine pronto per il mapping InPost",
    );

    console.log("");

    console.log(
      "📍 Punto InPost:",
    );

    console.log(
      `ID: ${order.inpostPointId}`,
    );

    console.log(
      `Nome: ${order.inpostPointName ?? "n/d"}`,
    );

    console.log(
      `Indirizzo: ${order.inpostPointAddress ?? "n/d"}`,
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
      "✅ Nessuna modifica effettuata al database",
    );

    console.log(
      "✅ Nessuna chiamata POST verso InPost",
    );
  } catch (error) {
    console.error(
      "❌ AGE202 Order → InPost dry run failed",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  } finally {
    await prisma.$disconnect();
  }
}


function normalizeShippingMethod(
  value: string,
): Age202ShippingMethod {
  if (
    value ===
    "INPOST_LOCKER"
  ) {
    return "INPOST_LOCKER";
  }

  if (
    value ===
    "INPOST_POINT"
  ) {
    return "INPOST_POINT";
  }

  if (
    value ===
    "HOME_DELIVERY"
  ) {
    return "HOME_DELIVERY";
  }

  throw new Error(
    `Metodo di spedizione AGE202 non supportato: ${value}`,
  );
}


void main();