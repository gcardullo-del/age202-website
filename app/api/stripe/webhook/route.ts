import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendSalePushNotification } from "@/lib/push/sendPushNotification";

type StripeCatalogType =
  | "ARTIFACT"
  | "MEMORABILIA"
  | "ORIGINAL_PRODUCT";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET non configurata.");

    return NextResponse.json(
      {
        error: "Webhook Stripe non configurato.",
      },
      {
        status: 500,
      },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error: "Firma Stripe mancante.",
      },
      {
        status: 400,
      },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Firma webhook Stripe non valida:", error);

    return NextResponse.json(
      {
        error: "Firma webhook non valida.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await handleCompletedCheckout(session);

        break;
      }

      default: {
        console.log(`Evento Stripe ignorato: ${event.type}`);
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Errore gestione webhook Stripe ${event.type}:`,
      error,
    );

    return NextResponse.json(
      {
        error: "Errore durante la gestione del webhook.",
      },
      {
        status: 500,
      },
    );
  }
}

async function handleCompletedCheckout(
  session: Stripe.Checkout.Session,
) {
  /*
   * IDEMPOTENZA
   *
   * Stripe può inviare lo stesso webhook più di una volta.
   * Se l'ordine esiste già non dobbiamo duplicarlo.
   */
  const existingOrder = await prisma.order.findUnique({
    where: {
      stripeCheckoutSessionId: session.id,
    },
    select: {
      id: true,
    },
  });

  if (existingOrder) {
    console.log(
      `Ordine già processato per Checkout Session ${session.id}`,
    );

    return;
  }

  if (session.payment_status !== "paid") {
    console.log(
      `Checkout ${session.id} completato ma non ancora pagato. Stato: ${session.payment_status}`,
    );

    return;
  }

  const itemId = session.metadata?.age202ItemId;
  const itemType = session.metadata
    ?.age202ItemType as StripeCatalogType | undefined;

  const size = session.metadata?.size?.trim() || null;

  if (!itemId) {
    throw new Error(
      `Metadata age202ItemId mancante nella sessione ${session.id}`,
    );
  }

  if (
    itemType !== "ARTIFACT" &&
    itemType !== "MEMORABILIA" &&
    itemType !== "ORIGINAL_PRODUCT"
  ) {
    throw new Error(
      `Metadata age202ItemType non valida nella sessione ${session.id}`,
    );
  }

  const item = await getPurchasableItem(itemType, itemId);

  if (!item) {
    throw new Error(
      `Elemento AGE202 non trovato: ${itemType} ${itemId}`,
    );
  }

  const amountSubtotal = session.amount_subtotal;

  if (amountSubtotal === null) {
    throw new Error(
      `amount_subtotal mancante nella sessione ${session.id}`,
    );
  }

  const amountTotal = session.amount_total;

  if (amountTotal === null) {
    throw new Error(
      `amount_total mancante nella sessione ${session.id}`,
    );
  }

  const shippingAmount =
    session.total_details?.amount_shipping ?? 0;

  const currency = (
    session.currency ??
    item.currency ??
    "eur"
  ).toUpperCase();

  const subtotal = amountSubtotal / 100;
  const shipping = shippingAmount / 100;
  const total = amountTotal / 100;

  const customer = session.customer_details;

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
  session.collected_information?.shipping_details ?? null;

  const shippingAddress =
    shippingDetails?.address ??
    customer?.address ??
    null;

  const stripePaymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const orderNumber = createOrderNumber(session.id);

  const createdOrder = await prisma.$transaction(async (tx) => {
    /*
     * Secondo controllo di idempotenza dentro la transazione.
     */
    const duplicate = await tx.order.findUnique({
      where: {
        stripeCheckoutSessionId: session.id,
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      return null;
    }

    /*
     * Verifica disponibilità prima di creare l'ordine.
     */
    await ensureStillAvailable(tx, itemType, itemId);

    const order = await tx.order.create({
      data: {
        orderNumber,

        status: "PAID",
        paymentStatus: "PAID",
        isTest: !session.livemode,

        currency,
        subtotal,
        shipping,
        total,

        customerEmail,
        customerName:
          shippingDetails?.name ??
          customer?.name ??
          null,
        customerPhone: customer?.phone ?? null,

        shippingName:
          shippingDetails?.name ??
          customer?.name ??
          null,

        shippingLine1: shippingAddress?.line1 ?? null,
        shippingLine2: shippingAddress?.line2 ?? null,
        shippingCity: shippingAddress?.city ?? null,
        shippingPostalCode:
          shippingAddress?.postal_code ?? null,
        shippingState: shippingAddress?.state ?? null,
        shippingCountry:
          shippingAddress?.country ?? null,

        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId,
        stripeCustomerId,

        paidAt: new Date(),

        items: {
          create: {
            itemType,

            artifactId:
              itemType === "ARTIFACT"
                ? item.id
                : null,

            memorabiliaId:
              itemType === "MEMORABILIA"
                ? item.id
                : null,

            originalProductId:
              itemType === "ORIGINAL_PRODUCT"
                ? item.id
                : null,

            productName: item.title,
            productSlug: item.slug,

            quantity: 1,
            unitPrice: subtotal,
            totalPrice: subtotal,
            currency,

            size,

            stripePriceId:
              item.stripePriceId,

            stripeProductId:
              item.stripeProductId,
          },
        },
      },
    });

    /*
     * Dopo la creazione dell'ordine segniamo il pezzo come SOLD.
     */
    await markAsSold(
      tx,
      itemType,
      itemId,
    );

    console.log(
      `Ordine AGE202 creato: ${order.orderNumber}`,
    );

    return order;
  });

  if (createdOrder && !createdOrder.isTest) {
    await sendSalePushNotification({
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      productName: item.title,
      total,
      currency,
    }).catch((error) => {
      console.error(
        "Errore notifica vendita AGE202:",
        error,
      );
    });
  }
}

async function getPurchasableItem(
  itemType: StripeCatalogType,
  itemId: string,
) {
  const select = {
    id: true,
    title: true,
    slug: true,
    currency: true,
    stripeProductId: true,
    stripePriceId: true,
  } as const;

  if (itemType === "ARTIFACT") {
    return prisma.artifact.findUnique({
      where: {
        id: itemId,
      },
      select,
    });
  }

  if (itemType === "MEMORABILIA") {
    return prisma.memorabilia.findUnique({
      where: {
        id: itemId,
      },
      select,
    });
  }

  return prisma.originalProduct.findUnique({
    where: {
      id: itemId,
    },
    select,
  });
}

async function ensureStillAvailable(
  tx: Parameters<
    Parameters<typeof prisma.$transaction>[0]
  >[0],
  itemType: StripeCatalogType,
  itemId: string,
) {
  if (itemType === "ARTIFACT") {
    const item = await tx.artifact.findUnique({
      where: {
        id: itemId,
      },
      select: {
        availability: true,
      },
    });

    if (!item || item.availability !== "AVAILABLE") {
      throw new Error(
        `Artifact ${itemId} non più disponibile.`,
      );
    }

    return;
  }

  if (itemType === "MEMORABILIA") {
    const item = await tx.memorabilia.findUnique({
      where: {
        id: itemId,
      },
      select: {
        availability: true,
      },
    });

    if (!item || item.availability !== "AVAILABLE") {
      throw new Error(
        `Memorabilia ${itemId} non più disponibile.`,
      );
    }

    return;
  }

  const item =
    await tx.originalProduct.findUnique({
      where: {
        id: itemId,
      },
      select: {
        availability: true,
      },
    });

  if (!item || item.availability !== "AVAILABLE") {
    throw new Error(
      `OriginalProduct ${itemId} non più disponibile.`,
    );
  }
}

async function markAsSold(
  tx: Parameters<
    Parameters<typeof prisma.$transaction>[0]
  >[0],
  itemType: StripeCatalogType,
  itemId: string,
) {
  if (itemType === "ARTIFACT") {
    await tx.artifact.update({
      where: {
        id: itemId,
      },
      data: {
        availability: "SOLD",
      },
    });

    return;
  }

  if (itemType === "MEMORABILIA") {
    await tx.memorabilia.update({
      where: {
        id: itemId,
      },
      data: {
        availability: "SOLD",
      },
    });

    return;
  }

  await tx.originalProduct.update({
    where: {
      id: itemId,
    },
    data: {
      availability: "SOLD",
    },
  });
}

function createOrderNumber(
  checkoutSessionId: string,
) {
  const date = new Date();

  const year = date
    .getFullYear()
    .toString();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const suffix = checkoutSessionId
    .replace(/^cs_(test|live)_/, "")
    .slice(-8)
    .toUpperCase();

  return `AGE202-${year}${month}${day}-${suffix}`;
}