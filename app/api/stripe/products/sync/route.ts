import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type StripeCatalogType =
  | "ARTIFACT"
  | "MEMORABILIA"
  | "ORIGINAL_PRODUCT";

type SyncStripeProductBody = {
  itemId?: string;
  itemType?: StripeCatalogType;
};

type StripeSyncItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subtitle: string | null;
  price: {
    lte(value: number): boolean;
    mul(value: number): {
      toDecimalPlaces(value: number): {
        toNumber(): number;
      };
    };
  } | null;
  currency: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  stripeActive: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncStripeProductBody;

    const itemId = body.itemId?.trim();
    const itemType = body.itemType;

    if (!itemId) {
      return NextResponse.json(
        {
          error: "itemId mancante.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      itemType !== "ARTIFACT" &&
      itemType !== "MEMORABILIA" &&
      itemType !== "ORIGINAL_PRODUCT"
    ) {
      return NextResponse.json(
        {
          error:
            "itemType non valido. Usa ARTIFACT, MEMORABILIA oppure ORIGINAL_PRODUCT.",
        },
        {
          status: 400,
        },
      );
    }

    let item: StripeSyncItem | null = null;

    if (itemType === "ARTIFACT") {
      item = await prisma.artifact.findUnique({
        where: {
          id: itemId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          subtitle: true,
          price: true,
          currency: true,
          stripeProductId: true,
          stripePriceId: true,
          stripeActive: true,
        },
      });
    }

    if (itemType === "MEMORABILIA") {
      item = await prisma.memorabilia.findUnique({
        where: {
          id: itemId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          subtitle: true,
          price: true,
          currency: true,
          stripeProductId: true,
          stripePriceId: true,
          stripeActive: true,
        },
      });
    }

    if (itemType === "ORIGINAL_PRODUCT") {
      item = await prisma.originalProduct.findUnique({
        where: {
          id: itemId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          subtitle: true,
          price: true,
          currency: true,
          stripeProductId: true,
          stripePriceId: true,
          stripeActive: true,
        },
      });
    }

    if (!item) {
      return NextResponse.json(
        {
          error: "Elemento AGE202 non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    if (!item.price) {
      return NextResponse.json(
        {
          error: "L'elemento non ha un prezzo.",
        },
        {
          status: 400,
        },
      );
    }

    if (item.price.lte(0)) {
      return NextResponse.json(
        {
          error: "Il prezzo deve essere maggiore di zero.",
        },
        {
          status: 400,
        },
      );
    }

    const currency = item.currency.trim().toLowerCase();

    const unitAmount = item.price
      .mul(100)
      .toDecimalPlaces(0)
      .toNumber();

    /*
     * GIÀ COMPLETAMENTE SINCRONIZZATO
     */
    if (
      item.stripeProductId &&
      item.stripePriceId &&
      item.stripeActive
    ) {
      return NextResponse.json({
        success: true,
        alreadySynced: true,
        itemType,
        item: {
          id: item.id,
          title: item.title,
          stripeProductId: item.stripeProductId,
          stripePriceId: item.stripePriceId,
          stripeActive: item.stripeActive,
        },
      });
    }

    /*
     * ESISTE GIÀ IL PRODUCT STRIPE
     * MA MANCA IL PRICE
     */
    if (item.stripeProductId && !item.stripePriceId) {
      const stripePrice = await stripe.prices.create({
        product: item.stripeProductId,
        currency,
        unit_amount: unitAmount,
        metadata: {
          age202ItemId: item.id,
          age202ItemType: itemType,
          age202Slug: item.slug,
        },
      });

      const updatedItem = await updateStripeFields({
        itemType,
        itemId: item.id,
        stripeProductId: item.stripeProductId,
        stripePriceId: stripePrice.id,
      });

      return NextResponse.json({
        success: true,
        alreadySynced: false,
        itemType,
        item: updatedItem,
      });
    }

    /*
     * NUOVO PRODUCT STRIPE
     */
    const stripeProduct = await stripe.products.create({
      name: item.title,

      description:
        item.description?.trim() ||
        item.subtitle?.trim() ||
        undefined,

      metadata: {
        age202ItemId: item.id,
        age202ItemType: itemType,
        age202Slug: item.slug,
      },
    });

    try {
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        currency,
        unit_amount: unitAmount,

        metadata: {
          age202ItemId: item.id,
          age202ItemType: itemType,
          age202Slug: item.slug,
        },
      });

      const updatedItem = await updateStripeFields({
        itemType,
        itemId: item.id,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      });

      return NextResponse.json({
        success: true,
        alreadySynced: false,
        itemType,
        item: updatedItem,
      });
    } catch (error) {
      /*
       * Se viene creato il Product Stripe ma qualcosa
       * fallisce subito dopo, lo archiviamo.
       */
      await stripe.products.update(stripeProduct.id, {
        active: false,
      });

      throw error;
    }
  } catch (error) {
    console.error(
      "Errore sincronizzazione catalogo AGE202 con Stripe:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile sincronizzare l'elemento AGE202 con Stripe.",
      },
      {
        status: 500,
      },
    );
  }
}

async function updateStripeFields({
  itemType,
  itemId,
  stripeProductId,
  stripePriceId,
}: {
  itemType: StripeCatalogType;
  itemId: string;
  stripeProductId: string;
  stripePriceId: string;
}) {
  const data = {
    stripeProductId,
    stripePriceId,
    stripeActive: true,
  };

  const select = {
    id: true,
    title: true,
    stripeProductId: true,
    stripePriceId: true,
    stripeActive: true,
  } as const;

  if (itemType === "ARTIFACT") {
    return prisma.artifact.update({
      where: {
        id: itemId,
      },
      data,
      select,
    });
  }

  if (itemType === "MEMORABILIA") {
    return prisma.memorabilia.update({
      where: {
        id: itemId,
      },
      data,
      select,
    });
  }

  return prisma.originalProduct.update({
    where: {
      id: itemId,
    },
    data,
    select,
  });
}