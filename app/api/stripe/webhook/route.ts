import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import {
  createInPostShipmentForOrder,
  isInPostShippingEnabled,
} from "@/lib/server/inpost/inpost-shipping.service";

import {
  sendSalePushNotification,
} from "@/lib/push/sendPushNotification";

import {
  sendOrderConfirmationEmail,
} from "@/lib/services/order-email.service";


type StripeCatalogType =
  | "ARTIFACT"
  | "MEMORABILIA"
  | "ORIGINAL_PRODUCT";


type InPostPointType =
  | "APM"
  | "PUDO";


export async function POST(
  request: Request,
) {
  const webhookSecret =
    process.env
      .STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET non configurata.",
    );

    return NextResponse.json(
      {
        error:
          "Webhook Stripe non configurato.",
      },
      {
        status:
          500,
      },
    );
  }


  const signature =
    request.headers.get(
      "stripe-signature",
    );

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Firma Stripe mancante.",
      },
      {
        status:
          400,
      },
    );
  }


  const rawBody =
    await request.text();

  let event:
    Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
  } catch (error) {
    console.error(
      "Firma webhook Stripe non valida:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Firma webhook non valida.",
      },
      {
        status:
          400,
      },
    );
  }


  try {
    switch (
      event.type
    ) {
      case "checkout.session.completed": {
        const session =
          event.data
            .object as Stripe.Checkout.Session;

        await handleCompletedCheckout(
          session,
        );

        break;
      }


      default: {
        console.log(
          `Evento Stripe ignorato: ${event.type}`,
        );
      }
    }


    return NextResponse.json({
      received:
        true,
    });
  } catch (error) {
    console.error(
      `Errore gestione webhook Stripe ${event.type}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Errore durante la gestione del webhook.",
      },
      {
        status:
          500,
      },
    );
  }
}


async function handleCompletedCheckout(
  session:
    Stripe.Checkout.Session,
) {
  /*
   * IDEMPOTENZA
   *
   * Stripe può inviare
   * lo stesso webhook
   * più di una volta.
   */
  const existingOrder =
    await prisma.order.findUnique({
      where: {
        stripeCheckoutSessionId:
          session.id,
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
      },
    });


  if (existingOrder) {
    console.log(
      `Ordine già processato per Checkout Session ${session.id}`,
    );

    /*
     * Non tentiamo automaticamente
     * una seconda spedizione.
     *
     * Eventuali retry InPost verranno
     * gestiti separatamente.
     */
    return;
  }


  if (
    session.payment_status !==
    "paid"
  ) {
    console.log(
      `Checkout ${session.id} completato ma non ancora pagato. Stato: ${session.payment_status}`,
    );

    return;
  }


  const itemId =
    session.metadata
      ?.age202ItemId;


  const itemType =
    session.metadata
      ?.age202ItemType as
      | StripeCatalogType
      | undefined;


  const size =
    session.metadata
      ?.size
      ?.trim() ||
    null;


  /*
   * INPOST METADATA
   */
  const inpostPointId =
    session.metadata
      ?.inpostPointId
      ?.trim() ||
    null;


  const inpostPointType =
    normalizeInPostPointType(
      session.metadata
        ?.inpostPointType,
    );


  const inpostPointName =
    session.metadata
      ?.inpostPointName
      ?.trim() ||
    null;


  const inpostPointAddress =
    session.metadata
      ?.inpostPointAddress
      ?.trim() ||
    null;


  if (!itemId) {
    throw new Error(
      `Metadata age202ItemId mancante nella sessione ${session.id}`,
    );
  }


  if (
    itemType !==
      "ARTIFACT" &&
    itemType !==
      "MEMORABILIA" &&
    itemType !==
      "ORIGINAL_PRODUCT"
  ) {
    throw new Error(
      `Metadata age202ItemType non valida nella sessione ${session.id}`,
    );
  }


  if (!inpostPointId) {
    throw new Error(
      `Metadata inpostPointId mancante nella sessione ${session.id}`,
    );
  }


  if (!inpostPointType) {
    throw new Error(
      `Metadata inpostPointType mancante o non valida nella sessione ${session.id}`,
    );
  }


  const shippingMethod =
    mapInPostPointTypeToShippingMethod(
      inpostPointType,
    );


  const item =
    await getPurchasableItem(
      itemType,
      itemId,
    );


  if (!item) {
    throw new Error(
      `Elemento AGE202 non trovato: ${itemType} ${itemId}`,
    );
  }


  const amountSubtotal =
    session
      .amount_subtotal;

  if (
    amountSubtotal ===
    null
  ) {
    throw new Error(
      `amount_subtotal mancante nella sessione ${session.id}`,
    );
  }


  const amountTotal =
    session
      .amount_total;

  if (
    amountTotal ===
    null
  ) {
    throw new Error(
      `amount_total mancante nella sessione ${session.id}`,
    );
  }


  const shippingAmount =
    session
      .total_details
      ?.amount_shipping ??
    0;


  const currency = (
    session.currency ??
    item.currency ??
    "eur"
  ).toUpperCase();


  const subtotal =
    amountSubtotal /
    100;


  const shipping =
    shippingAmount /
    100;


  const total =
    amountTotal /
    100;


  const customer =
    session
      .customer_details;


  const customerEmail =
    customer?.email ??
    session.customer_email ??
    null;


  if (!customerEmail) {
    throw new Error(
      `Email cliente mancante nella sessione ${session.id}`,
    );
  }


  const shippingDetails =
    session
      .collected_information
      ?.shipping_details ??
    null;


  const shippingAddress =
    shippingDetails
      ?.address ??
    customer?.address ??
    null;


  const stripePaymentIntentId =
    typeof session
      .payment_intent ===
    "string"
      ? session
          .payment_intent
      : session
          .payment_intent
          ?.id ??
        null;


  const stripeCustomerId =
    typeof session
      .customer ===
    "string"
      ? session.customer
      : session
          .customer
          ?.id ??
        null;


  const orderNumber =
    createOrderNumber(
      session.id,
    );


  const createdOrder =
    await prisma.$transaction(
      async (
        tx,
      ) => {
        /*
         * Secondo controllo
         * di idempotenza.
         */
        const duplicate =
          await tx.order.findUnique({
            where: {
              stripeCheckoutSessionId:
                session.id,
            },

            select: {
              id:
                true,
            },
          });


        if (duplicate) {
          return null;
        }


        /*
         * Verifica disponibilità
         * prima di creare l'ordine.
         */
        await ensureStillAvailable(
          tx,
          itemType,
          itemId,
        );


        const order =
          await tx.order.create({
            data: {
              orderNumber,

              status:
                "PAID",

              paymentStatus:
                "PAID",

              /*
               * Stripe TEST:
               * l'ordine viene marcato
               * automaticamente come test.
               */
              isTest:
                !session
                  .livemode,

              currency,
              subtotal,
              shipping,
              total,

              customerEmail,

              customerName:
                shippingDetails
                  ?.name ??
                customer?.name ??
                null,

              customerPhone:
                customer?.phone ??
                null,

              shippingName:
                shippingDetails
                  ?.name ??
                customer?.name ??
                null,

              shippingLine1:
                shippingAddress
                  ?.line1 ??
                null,

              shippingLine2:
                shippingAddress
                  ?.line2 ??
                null,

              shippingCity:
                shippingAddress
                  ?.city ??
                null,

              shippingPostalCode:
                shippingAddress
                  ?.postal_code ??
                null,

              shippingState:
                shippingAddress
                  ?.state ??
                null,

              shippingCountry:
                shippingAddress
                  ?.country ??
                null,


              /*
               * INPOST
               */
              shippingProvider:
                "INPOST",

              shippingMethod,

              shippingStatus:
                "READY_TO_CREATE",

              inpostPointId,

              inpostPointName,

              inpostPointAddress,


              stripeCheckoutSessionId:
                session.id,

              stripePaymentIntentId,

              stripeCustomerId,

              paidAt:
                new Date(),


              items: {
                create: {
                  itemType,

                  artifactId:
                    itemType ===
                    "ARTIFACT"
                      ? item.id
                      : null,

                  memorabiliaId:
                    itemType ===
                    "MEMORABILIA"
                      ? item.id
                      : null,

                  originalProductId:
                    itemType ===
                    "ORIGINAL_PRODUCT"
                      ? item.id
                      : null,

                  productName:
                    item.title,

                  productSlug:
                    item.slug,

                  quantity:
                    1,

                  unitPrice:
                    subtotal,

                  totalPrice:
                    subtotal,

                  currency,

                  size,

                  stripePriceId:
                    item
                      .stripePriceId,

                  stripeProductId:
                    item
                      .stripeProductId,
                },
              },
            },
          });


        /*
         * DISPONIBILITÀ CATALOGO
         *
         * Un pagamento Stripe TEST
         * NON deve modificare
         * la disponibilità reale
         * dei prodotti AGE202.
         *
         * Soltanto un pagamento LIVE
         * può impostare SOLD.
         */
        if (
          session.livemode
        ) {
          await markAsSold(
            tx,
            itemType,
            itemId,
          );

          console.log(
            `Prodotto ${itemId} segnato SOLD.`,
          );
        } else {
          console.log(
            `Stripe TEST: prodotto ${itemId} lasciato AVAILABLE.`,
          );
        }


        console.log(
          `Ordine AGE202 creato: ${order.orderNumber}`,
        );

        console.log(
          `InPost point: ${inpostPointId} (${inpostPointType})`,
        );

        console.log(
          "Shipping status: READY_TO_CREATE",
        );


        return order;
      },
    );


  if (!createdOrder) {
    return;
  }


  /*
   * NOTIFICA VENDITA
   *
   * Solo ordini LIVE.
   */
  if (
    !createdOrder
      .isTest
  ) {
    await sendSalePushNotification({
      orderId:
        createdOrder.id,

      orderNumber:
        createdOrder
          .orderNumber,

      productName:
        item.title,

      total,

      currency,
    }).catch(
      (
        error,
      ) => {
        console.error(
          "Errore notifica vendita AGE202:",
          error,
        );
      },
    );
  }


  /*
   * EMAIL CONFERMA ORDINE
   *
   * Il servizio gestisce autonomamente:
   * - ordini Stripe TEST;
   * - RESEND_API_KEY assente;
   * - email cliente mancante.
   *
   * Un errore email NON deve mai
   * invalidare un ordine già pagato.
   */
  try {
    const emailResult =
      await sendOrderConfirmationEmail(
        createdOrder.id,
      );

    if (
      emailResult.sent
    ) {
      console.log(
        `✅ Email conferma ordine inviata per ${createdOrder.orderNumber}.`,
      );
    } else {
      console.log(
        `Email conferma ordine non inviata per ${createdOrder.orderNumber}: ${emailResult.reason ?? "invio saltato"}`,
      );
    }
  } catch (error) {
    console.error(
      `⚠️ Errore email conferma ordine per ${createdOrder.orderNumber}:`,
      error,
    );

    /*
     * NON rilanciamo.
     *
     * Il pagamento Stripe è già valido
     * e l'ordine deve rimanere registrato.
     */
  }


  /*
   * ========================================
   * INPOST AUTOMATIC SHIPPING
   * ========================================
   *
   * REGOLA 1:
   * gli ordini Stripe TEST
   * NON possono creare spedizioni.
   *
   * REGOLA 2:
   * se INPOST_SHIPPING_ENABLED
   * non è "true", non chiamiamo
   * nemmeno createInPostShipmentForOrder().
   */
  if (
    createdOrder
      .isTest
  ) {
    console.log(
      `Ordine ${createdOrder.orderNumber}: spedizione InPost NON creata perché si tratta di un ordine Stripe TEST.`,
    );

    return;
  }


  if (
    !isInPostShippingEnabled()
  ) {
    console.log(
      `Ordine ${createdOrder.orderNumber}: InPost pronto ma creazione automatica disabilitata.`,
    );

    console.log(
      "INPOST_SHIPPING_ENABLED=false",
    );

    return;
  }


  /*
   * Da qui in poi siamo:
   *
   * - ordine LIVE
   * - pagamento PAID
   * - punto InPost presente
   * - ordine READY_TO_CREATE
   * - INPOST_SHIPPING_ENABLED=true
   *
   * Solo in queste condizioni
   * tentiamo la spedizione reale.
   *
   * IMPORTANTE:
   * eventuali errori InPost
   * NON devono invalidare
   * il webhook Stripe.
   *
   * L'ordine resterà
   * READY_TO_CREATE e potrà
   * essere ritentato manualmente.
   */
  try {
    const shipment =
      await createInPostShipmentForOrder({
        orderId:
          createdOrder.id,
      });


    console.log(
      `✅ Spedizione InPost creata per ordine ${createdOrder.orderNumber}`,
    );

    console.log(
      `Tracking: ${shipment.trackingNumber}`,
    );
  } catch (error) {
    console.error(
      `⚠️ Impossibile creare automaticamente la spedizione InPost per ordine ${createdOrder.orderNumber}:`,
      error,
    );

    /*
     * NON rilanciamo l'errore.
     *
     * Il pagamento Stripe
     * è già valido e l'ordine
     * deve rimanere registrato.
     */
  }
}


async function getPurchasableItem(
  itemType:
    StripeCatalogType,

  itemId:
    string,
) {
  const select = {
    id:
      true,

    title:
      true,

    slug:
      true,

    currency:
      true,

    stripeProductId:
      true,

    stripePriceId:
      true,
  } as const;


  if (
    itemType ===
    "ARTIFACT"
  ) {
    return prisma.artifact.findUnique({
      where: {
        id:
          itemId,
      },

      select,
    });
  }


  if (
    itemType ===
    "MEMORABILIA"
  ) {
    return prisma.memorabilia.findUnique({
      where: {
        id:
          itemId,
      },

      select,
    });
  }


  return prisma.originalProduct.findUnique({
    where: {
      id:
        itemId,
    },

    select,
  });
}


async function ensureStillAvailable(
  tx:
    Parameters<
      Parameters<
        typeof prisma.$transaction
      >[0]
    >[0],

  itemType:
    StripeCatalogType,

  itemId:
    string,
) {
  if (
    itemType ===
    "ARTIFACT"
  ) {
    const item =
      await tx.artifact.findUnique({
        where: {
          id:
            itemId,
        },

        select: {
          availability:
            true,
        },
      });


    if (
      !item ||
      item.availability !==
        "AVAILABLE"
    ) {
      throw new Error(
        `Artifact ${itemId} non più disponibile.`,
      );
    }


    return;
  }


  if (
    itemType ===
    "MEMORABILIA"
  ) {
    const item =
      await tx.memorabilia.findUnique({
        where: {
          id:
            itemId,
        },

        select: {
          availability:
            true,
        },
      });


    if (
      !item ||
      item.availability !==
        "AVAILABLE"
    ) {
      throw new Error(
        `Memorabilia ${itemId} non più disponibile.`,
      );
    }


    return;
  }


  const item =
    await tx.originalProduct.findUnique({
      where: {
        id:
          itemId,
      },

      select: {
        availability:
          true,
      },
    });


  if (
    !item ||
    item.availability !==
      "AVAILABLE"
  ) {
    throw new Error(
      `OriginalProduct ${itemId} non più disponibile.`,
    );
  }
}


async function markAsSold(
  tx:
    Parameters<
      Parameters<
        typeof prisma.$transaction
      >[0]
    >[0],

  itemType:
    StripeCatalogType,

  itemId:
    string,
) {
  if (
    itemType ===
    "ARTIFACT"
  ) {
    await tx.artifact.update({
      where: {
        id:
          itemId,
      },

      data: {
        availability:
          "SOLD",
      },
    });


    return;
  }


  if (
    itemType ===
    "MEMORABILIA"
  ) {
    await tx.memorabilia.update({
      where: {
        id:
          itemId,
      },

      data: {
        availability:
          "SOLD",
      },
    });


    return;
  }


  await tx.originalProduct.update({
    where: {
      id:
        itemId,
    },

    data: {
      availability:
        "SOLD",
    },
  });
}


function normalizeInPostPointType(
  value:
    | string
    | undefined,
):
  | InPostPointType
  | null {
  const normalized =
    value
      ?.trim()
      .toUpperCase();


  if (
    normalized ===
    "APM"
  ) {
    return "APM";
  }


  if (
    normalized ===
    "PUDO"
  ) {
    return "PUDO";
  }


  return null;
}


function mapInPostPointTypeToShippingMethod(
  pointType:
    InPostPointType,
):
  | "INPOST_LOCKER"
  | "INPOST_POINT" {
  if (
    pointType ===
    "APM"
  ) {
    return "INPOST_LOCKER";
  }


  return "INPOST_POINT";
}


function createOrderNumber(
  checkoutSessionId:
    string,
) {
  const date =
    new Date();


  const year =
    date
      .getFullYear()
      .toString();


  const month =
    String(
      date.getMonth() +
        1,
    ).padStart(
      2,
      "0",
    );


  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      "0",
    );


  const suffix =
    checkoutSessionId
      .replace(
        /^cs_(test|live)_/,
        "",
      )
      .slice(
        -8,
      )
      .toUpperCase();


  return `AGE202-${year}${month}${day}-${suffix}`;
}