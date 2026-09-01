import "dotenv/config";

import {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductLogoTone,
  OriginalProductStatus,
} from "../generated/prisma/client";

import { prisma } from "../lib/prisma";


const PRODUCT_SLUG =
  "age202-court-towel";


const product = {
  title:
    "AGE202 Court Towel",

  subtitle:
    "A premium tennis towel created for court sessions, training and match days.",

  slug:
    PRODUCT_SLUG,

  description:
    "The AGE202 Court Towel is a practical court essential created for training sessions, match days and everyday tennis routines. Made from soft absorbent cotton terry, it combines a clean monochrome design with the official AGE202 identity and a compact one-size format designed to travel easily from the tennis bag to the bench.",

  collection:
    "AGE202 Court Collection",

  edition:
    "First Edition",

  category:
    OriginalProductCategory.ACCESSORY,

  material:
    "100% cotton terry",

  tags: [
    "age202",
    "originals",
    "towel",
    "court towel",
    "tennis",
    "court collection",
    "accessories",
  ],

  price:
    24.9,

  currency:
    "EUR",

  availability:
    OriginalProductAvailability.COMING_SOON,

  status:
    OriginalProductStatus.PUBLISHED,

  featured:
    false,

  displayOrder:
    75,

  metaTitle:
    "AGE202 Court Towel | AGE202 Originals",

  metaDescription:
    "Discover the AGE202 Court Towel, an official tennis accessory from the AGE202 Court Collection.",

  variants: [
    {
      name:
        "Black",

      colour:
        "Black",

      colourHex:
        "#000000",

      logoTone:
        OriginalProductLogoTone.WHITE,

      sku:
        "AGE202-COURT-TOWEL-BLK",

      isDefault:
        true,

      sortOrder:
        0,
    },
    {
      name:
        "White",

      colour:
        "White",

      colourHex:
        "#FFFFFF",

      logoTone:
        OriginalProductLogoTone.BLACK,

      sku:
        "AGE202-COURT-TOWEL-WHT",

      isDefault:
        false,

      sortOrder:
        1,
    },
  ],
} as const;


async function upsertVariant(
  originalProductId: string,
  variant:
    (typeof product.variants)[number],
) {
  const savedVariant =
    await prisma.originalProductVariant.upsert({
      where: {
        sku:
          variant.sku,
      },

      create: {
        originalProductId,

        name:
          variant.name,

        colour:
          variant.colour,

        colourHex:
          variant.colourHex,

        logoTone:
          variant.logoTone,

        sku:
          variant.sku,

        active:
          true,

        isDefault:
          variant.isDefault,

        sortOrder:
          variant.sortOrder,
      },

      update: {
        originalProductId,

        name:
          variant.name,

        colour:
          variant.colour,

        colourHex:
          variant.colourHex,

        logoTone:
          variant.logoTone,

        active:
          true,

        isDefault:
          variant.isDefault,

        sortOrder:
          variant.sortOrder,
      },
    });


  await prisma.originalProductVariantStock.upsert({
    where: {
      variantId_size: {
        variantId:
          savedVariant.id,

        size:
          "ONE SIZE",
      },
    },

    create: {
      variantId:
        savedVariant.id,

      size:
        "ONE SIZE",

      stock:
        0,

      active:
        true,
    },

    update: {
      /*
       * Non sovrascriviamo una quantità reale
       * se lo script viene rilanciato in futuro.
       */
      active:
        true,
    },
  });
}


async function main() {
  console.log(
    "Adding AGE202 Court Towel...",
  );


  const savedProduct =
    await prisma.originalProduct.upsert({
      where: {
        slug:
          product.slug,
      },

      create: {
        title:
          product.title,

        subtitle:
          product.subtitle,

        slug:
          product.slug,

        description:
          product.description,

        collection:
          product.collection,

        edition:
          product.edition,

        category:
          product.category,

        material:
          product.material,

        /*
         * Legacy fields remain neutral because
         * colours and sizes live in variants.
         */
        colour:
          null,

        sizes:
          [],

        vintedUrl:
          null,

        tags: [
          ...product.tags,
        ],

        price:
          product.price,

        currency:
          product.currency,

        availability:
          product.availability,

        status:
          product.status,

        featured:
          product.featured,

        displayOrder:
          product.displayOrder,

        metaTitle:
          product.metaTitle,

        metaDescription:
          product.metaDescription,

        publishedAt:
          new Date(),

        stripeActive:
          false,
      },

      update: {
        title:
          product.title,

        subtitle:
          product.subtitle,

        description:
          product.description,

        collection:
          product.collection,

        edition:
          product.edition,

        category:
          product.category,

        material:
          product.material,

        tags: [
          ...product.tags,
        ],

        price:
          product.price,

        currency:
          product.currency,

        availability:
          product.availability,

        status:
          product.status,

        featured:
          product.featured,

        displayOrder:
          product.displayOrder,

        metaTitle:
          product.metaTitle,

        metaDescription:
          product.metaDescription,

        /*
         * Existing images, Stripe IDs,
         * stripeActive and publishedAt
         * are intentionally left untouched.
         */
      },
    });


  /*
   * Keep exactly one default variant.
   */
  await prisma.originalProductVariant.updateMany({
    where: {
      originalProductId:
        savedProduct.id,
    },

    data: {
      isDefault:
        false,
    },
  });


  for (
    const variant
    of product.variants
  ) {
    await upsertVariant(
      savedProduct.id,
      variant,
    );
  }


  console.log(
    `✓ ${savedProduct.title}`,
  );

  console.log(
    "✓ BLACK + WHITE variants",
  );

  console.log(
    "✓ ONE SIZE stock records created at 0",
  );

  console.log(
    "✓ Product published as COMING_SOON",
  );

  console.log(
    "Now add the BLACK and WHITE images from Admin → Originals → AGE202 Court Towel → Media.",
  );
}


main()
  .catch(
    (error) => {
      console.error(
        "Court Towel import failed.",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
