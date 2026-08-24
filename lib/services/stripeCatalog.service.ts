import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type StripeSyncStatus =
  | "SYNCED"
  | "DISABLED"
  | "NOT_FOUND";

type StripeCatalogItemType =
  | "ARTIFACT"
  | "MEMORABILIA";

type StripeCatalogItem = {
  id: string;
  title: string;
  slug: string;
  availability: string;
  price: {
    toString(): string;
  } | null;
  currency: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
};

type BaseStripeSyncResult = {
  status: StripeSyncStatus;
  stripeActive: boolean;
  stripeProductId: string | null;
  stripePriceId: string | null;
};

export type StripeArtifactSyncResult =
  BaseStripeSyncResult & {
    artifactId: string;
  };

export type StripeMemorabiliaSyncResult =
  BaseStripeSyncResult & {
    memorabiliaId: string;
  };

function getUnitAmount(
  price: StripeCatalogItem["price"],
): number | null {
  if (!price) {
    return null;
  }

  const amount =
    Number(
      price.toString(),
    );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return Math.round(
    amount * 100,
  );
}

function normalizeCurrency(
  currency: string,
): string {
  const normalized =
    currency
      .trim()
      .toLowerCase();

  return normalized || "eur";
}

async function getOrCreateStripeProduct({
  item,
  itemType,
}: {
  item: StripeCatalogItem;
  itemType: StripeCatalogItemType;
}): Promise<string> {
  if (
    item.stripeProductId
  ) {
    try {
      const existingProduct =
        await stripe.products.retrieve(
          item.stripeProductId,
        );

      if (
        !existingProduct.deleted
      ) {
        await stripe.products.update(
          existingProduct.id,
          {
            name:
              item.title,

            active:
              true,

            metadata: {
              age202ItemId:
                item.id,

              age202ItemType:
                itemType,

              age202Slug:
                item.slug,
            },
          },
        );

        return existingProduct.id;
      }
    } catch (error) {
      console.warn(
        `Prodotto Stripe ${item.stripeProductId} non recuperabile. Verrà ricreato.`,
        error,
      );
    }
  }

  const product =
    await stripe.products.create({
      name:
        item.title,

      active:
        true,

      metadata: {
        age202ItemId:
          item.id,

        age202ItemType:
          itemType,

        age202Slug:
          item.slug,
      },
    });

  return product.id;
}

async function getOrCreateStripePrice({
  item,
  itemType,
  stripeProductId,
  unitAmount,
  currency,
}: {
  item: StripeCatalogItem;
  itemType: StripeCatalogItemType;
  stripeProductId: string;
  unitAmount: number;
  currency: string;
}): Promise<string> {
  if (
    item.stripePriceId
  ) {
    try {
      const existingPrice =
        await stripe.prices.retrieve(
          item.stripePriceId,
        );

      const sameProduct =
        typeof existingPrice.product ===
        "string"
          ? existingPrice.product ===
            stripeProductId
          : existingPrice.product.id ===
            stripeProductId;

      const sameAmount =
        existingPrice.unit_amount ===
        unitAmount;

      const sameCurrency =
        existingPrice.currency ===
        currency;

      if (
        existingPrice.active &&
        sameProduct &&
        sameAmount &&
        sameCurrency
      ) {
        return existingPrice.id;
      }

      if (
        existingPrice.active
      ) {
        await stripe.prices.update(
          existingPrice.id,
          {
            active:
              false,
          },
        );
      }
    } catch (error) {
      console.warn(
        `Prezzo Stripe ${item.stripePriceId} non recuperabile. Verrà ricreato.`,
        error,
      );
    }
  }

  const price =
    await stripe.prices.create({
      product:
        stripeProductId,

      unit_amount:
        unitAmount,

      currency,

      metadata: {
        age202ItemId:
          item.id,

        age202ItemType:
          itemType,

        age202Slug:
          item.slug,
      },
    });

  return price.id;
}

async function deactivateStripeProduct(
  stripeProductId: string | null,
): Promise<void> {
  if (
    !stripeProductId
  ) {
    return;
  }

  try {
    await stripe.products.update(
      stripeProductId,
      {
        active:
          false,
      },
    );
  } catch (error) {
    console.warn(
      `Impossibile disattivare il prodotto Stripe ${stripeProductId}.`,
      error,
    );
  }
}

export async function syncArtifactWithStripe(
  artifactId: string,
): Promise<StripeArtifactSyncResult> {
  const artifact =
    await prisma.artifact.findUnique({
      where: {
        id:
          artifactId,
      },

      select: {
        id:
          true,

        title:
          true,

        slug:
          true,

        availability:
          true,

        price:
          true,

        currency:
          true,

        stripeProductId:
          true,

        stripePriceId:
          true,
      },
    });

  if (
    !artifact
  ) {
    return {
      status:
        "NOT_FOUND",

      artifactId,

      stripeActive:
        false,

      stripeProductId:
        null,

      stripePriceId:
        null,
    };
  }

  const unitAmount =
    getUnitAmount(
      artifact.price,
    );

  const isAvailable =
    artifact.availability ===
    "AVAILABLE";

  if (
    !isAvailable ||
    unitAmount === null
  ) {
    await deactivateStripeProduct(
      artifact.stripeProductId,
    );

    await prisma.artifact.update({
      where: {
        id:
          artifact.id,
      },

      data: {
        stripeActive:
          false,
      },
    });

    return {
      status:
        "DISABLED",

      artifactId:
        artifact.id,

      stripeActive:
        false,

      stripeProductId:
        artifact.stripeProductId,

      stripePriceId:
        artifact.stripePriceId,
    };
  }

  const currency =
    normalizeCurrency(
      artifact.currency,
    );

  const stripeProductId =
    await getOrCreateStripeProduct({
      item:
        artifact,

      itemType:
        "ARTIFACT",
    });

  const stripePriceId =
    await getOrCreateStripePrice({
      item:
        artifact,

      itemType:
        "ARTIFACT",

      stripeProductId,

      unitAmount,

      currency,
    });

  const updatedArtifact =
    await prisma.artifact.update({
      where: {
        id:
          artifact.id,
      },

      data: {
        stripeProductId,
        stripePriceId,
        stripeActive:
          true,
      },

      select: {
        id:
          true,

        stripeActive:
          true,

        stripeProductId:
          true,

        stripePriceId:
          true,
      },
    });

  return {
    status:
      "SYNCED",

    artifactId:
      updatedArtifact.id,

    stripeActive:
      updatedArtifact.stripeActive,

    stripeProductId:
      updatedArtifact.stripeProductId,

    stripePriceId:
      updatedArtifact.stripePriceId,
  };
}

export async function syncMemorabiliaWithStripe(
  memorabiliaId: string,
): Promise<StripeMemorabiliaSyncResult> {
  const memorabilia =
    await prisma.memorabilia.findUnique({
      where: {
        id:
          memorabiliaId,
      },

      select: {
        id:
          true,

        title:
          true,

        slug:
          true,

        availability:
          true,

        price:
          true,

        currency:
          true,

        stripeProductId:
          true,

        stripePriceId:
          true,
      },
    });

  if (
    !memorabilia
  ) {
    return {
      status:
        "NOT_FOUND",

      memorabiliaId,

      stripeActive:
        false,

      stripeProductId:
        null,

      stripePriceId:
        null,
    };
  }

  const unitAmount =
    getUnitAmount(
      memorabilia.price,
    );

  const isAvailable =
    memorabilia.availability ===
    "AVAILABLE";

  if (
    !isAvailable ||
    unitAmount === null
  ) {
    await deactivateStripeProduct(
      memorabilia.stripeProductId,
    );

    await prisma.memorabilia.update({
      where: {
        id:
          memorabilia.id,
      },

      data: {
        stripeActive:
          false,
      },
    });

    return {
      status:
        "DISABLED",

      memorabiliaId:
        memorabilia.id,

      stripeActive:
        false,

      stripeProductId:
        memorabilia.stripeProductId,

      stripePriceId:
        memorabilia.stripePriceId,
    };
  }

  const currency =
    normalizeCurrency(
      memorabilia.currency,
    );

  const stripeProductId =
    await getOrCreateStripeProduct({
      item:
        memorabilia,

      itemType:
        "MEMORABILIA",
    });

  const stripePriceId =
    await getOrCreateStripePrice({
      item:
        memorabilia,

      itemType:
        "MEMORABILIA",

      stripeProductId,

      unitAmount,

      currency,
    });

  const updatedMemorabilia =
    await prisma.memorabilia.update({
      where: {
        id:
          memorabilia.id,
      },

      data: {
        stripeProductId,
        stripePriceId,
        stripeActive:
          true,
      },

      select: {
        id:
          true,

        stripeActive:
          true,

        stripeProductId:
          true,

        stripePriceId:
          true,
      },
    });

  return {
    status:
      "SYNCED",

    memorabiliaId:
      updatedMemorabilia.id,

    stripeActive:
      updatedMemorabilia.stripeActive,

    stripeProductId:
      updatedMemorabilia.stripeProductId,

    stripePriceId:
      updatedMemorabilia.stripePriceId,
  };
}