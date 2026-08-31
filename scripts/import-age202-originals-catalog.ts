import "dotenv/config";

import {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductLogoTone,
  OriginalProductStatus,
} from "../generated/prisma/client";

import { prisma } from "../lib/prisma";


type StockSeed = {
  size: string;
  stock: number;
};


type VariantSeed = {
  name: string;
  colour: string;
  colourHex: string;
  logoTone: OriginalProductLogoTone;
  sku: string;
  isDefault: boolean;
  sortOrder: number;
  stock: StockSeed[];
};


type ProductSeed = {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  collection: string;
  edition: string;
  category: OriginalProductCategory;
  material: string;
  tags: string[];
  price: number;
  currency: string;
  availability: OriginalProductAvailability;
  status: OriginalProductStatus;
  featured: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  variants: VariantSeed[];
};


const APPAREL_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;


function zeroStock(
  sizes: readonly string[],
): StockSeed[] {
  return sizes.map(
    (size) => ({
      size,
      stock: 0,
    }),
  );
}


function oneSizeStock(): StockSeed[] {
  return [
    {
      size: "ONE SIZE",
      stock: 0,
    },
  ];
}


const products: ProductSeed[] = [
  {
    title:
      "AGE202 Essential Polo",
    subtitle:
      "A clean tennis-inspired polo created for the AGE202 Core Collection.",
    slug:
      "age202-essential-polo",
    description:
      "The AGE202 Essential Polo brings classic tennis style into the identity of The Digital Tennis Museum. Designed as an everyday essential, it combines a clean silhouette, understated branding and a versatile look that moves naturally from the court environment to daily wear.",
    collection:
      "AGE202 Core Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.POLO,
    material:
      "100% cotton piqué",
    tags: [
      "age202",
      "originals",
      "polo",
      "tennis",
      "core collection",
      "lifestyle",
    ],
    price:
      39.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      20,
    metaTitle:
      "AGE202 Essential Polo | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Essential Polo, an official piece from the AGE202 Core Collection and The Digital Tennis Museum.",
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
          "AGE202-ESS-POLO-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
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
          "AGE202-ESS-POLO-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
      },
    ],
  },

  {
    title:
      "AGE202 Club Hoodie",
    subtitle:
      "A heavyweight everyday hoodie shaped by AGE202 tennis culture.",
    slug:
      "age202-club-hoodie",
    description:
      "The AGE202 Club Hoodie is designed as a relaxed layer for tennis days, travel and everyday life. Its simple construction and restrained AGE202 identity make it a versatile piece within the Core Collection, created to carry the museum's visual language beyond the screen.",
    collection:
      "AGE202 Core Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.HOODIE,
    material:
      "Cotton-rich brushed fleece",
    tags: [
      "age202",
      "originals",
      "hoodie",
      "tennis",
      "core collection",
      "lifestyle",
    ],
    price:
      59.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      30,
    metaTitle:
      "AGE202 Club Hoodie | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Club Hoodie, an official tennis-inspired layer from The Digital Tennis Museum.",
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
          "AGE202-CLUB-HOOD-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
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
          "AGE202-CLUB-HOOD-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
      },
    ],
  },

  {
    title:
      "AGE202 Court Sweatshirt",
    subtitle:
      "A minimal crewneck inspired by the visual language of the tennis court.",
    slug:
      "age202-court-sweatshirt",
    description:
      "The AGE202 Court Sweatshirt is a clean crewneck designed around comfort, simplicity and tennis culture. Part of the Court Collection, it translates the visual identity of AGE202 into an easy everyday layer with a museum-minded approach to detail.",
    collection:
      "AGE202 Court Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.SWEATSHIRT,
    material:
      "Cotton-rich brushed fleece",
    tags: [
      "age202",
      "originals",
      "sweatshirt",
      "crewneck",
      "tennis",
      "court collection",
    ],
    price:
      49.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      40,
    metaTitle:
      "AGE202 Court Sweatshirt | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Court Sweatshirt, an official crewneck from the AGE202 Court Collection.",
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
          "AGE202-COURT-SWT-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
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
          "AGE202-COURT-SWT-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          zeroStock(
            APPAREL_SIZES,
          ),
      },
    ],
  },

  {
    title:
      "AGE202 Court Cap",
    subtitle:
      "A classic everyday tennis cap carrying the AGE202 identity.",
    slug:
      "age202-court-cap",
    description:
      "The AGE202 Court Cap is a simple, functional headwear piece inspired by the everyday culture surrounding tennis. Designed for the Court Collection, it combines an essential silhouette with the official AGE202 identity.",
    collection:
      "AGE202 Court Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.CAP,
    material:
      "Cotton twill",
    tags: [
      "age202",
      "originals",
      "cap",
      "headwear",
      "tennis",
      "court collection",
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
      50,
    metaTitle:
      "AGE202 Court Cap | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Court Cap, official tennis-inspired headwear from The Digital Tennis Museum.",
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
          "AGE202-COURT-CAP-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
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
          "AGE202-COURT-CAP-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },

  {
    title:
      "AGE202 Court Beanie",
    subtitle:
      "A cold-weather essential with a compact AGE202 tennis identity.",
    slug:
      "age202-court-beanie",
    description:
      "The AGE202 Court Beanie extends the Court Collection into colder days with a simple knit silhouette and unmistakable AGE202 identity. Designed as an easy one-size accessory for tennis travel, match days and everyday wear.",
    collection:
      "AGE202 Court Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.ACCESSORY,
    material:
      "Soft acrylic knit",
    tags: [
      "age202",
      "originals",
      "beanie",
      "headwear",
      "tennis",
      "court collection",
    ],
    price:
      22.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      60,
    metaTitle:
      "AGE202 Court Beanie | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Court Beanie, an official cold-weather accessory from the AGE202 Court Collection.",
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
          "AGE202-COURT-BEANIE-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
      },
      {
        name:
          "Lime",
        colour:
          "Lime",
        colourHex:
          "#C8FF00",
        logoTone:
          OriginalProductLogoTone.BLACK,
        sku:
          "AGE202-COURT-BEANIE-LIM",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },

  {
    title:
      "AGE202 Match Bottle",
    subtitle:
      "A reusable bottle designed for court days and everyday movement.",
    slug:
      "age202-match-bottle",
    description:
      "The AGE202 Match Bottle is a practical reusable object created for training sessions, match days and everyday use. Its minimal design brings the AGE202 museum identity into one of the most familiar objects around the tennis court.",
    collection:
      "AGE202 Match Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.BOTTLE,
    material:
      "Stainless steel",
    tags: [
      "age202",
      "originals",
      "bottle",
      "tennis",
      "match collection",
      "reusable",
    ],
    price:
      19.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      70,
    metaTitle:
      "AGE202 Match Bottle | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Match Bottle, an official reusable object from The Digital Tennis Museum.",
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
          "AGE202-MATCH-BTL-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
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
          "AGE202-MATCH-BTL-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },

  {
    title:
      "AGE202 Museum Tote",
    subtitle:
      "A simple carry-all created for the AGE202 museum community.",
    slug:
      "age202-museum-tote",
    description:
      "The AGE202 Museum Tote is a lightweight everyday bag designed as a functional extension of The Digital Tennis Museum. Simple, reusable and easy to carry, it connects museum culture, tennis identity and daily life.",
    collection:
      "AGE202 Museum Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.BAG,
    material:
      "Cotton canvas",
    tags: [
      "age202",
      "originals",
      "tote",
      "bag",
      "museum collection",
      "tennis",
    ],
    price:
      19.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      80,
    metaTitle:
      "AGE202 Museum Tote | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Museum Tote, an official everyday bag from The Digital Tennis Museum.",
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
          "AGE202-MUSEUM-TOTE-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
      },
      {
        name:
          "Natural",
        colour:
          "Natural",
        colourHex:
          "#D8C9AD",
        logoTone:
          OriginalProductLogoTone.BLACK,
        sku:
          "AGE202-MUSEUM-TOTE-NAT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },

  {
    title:
      "AGE202 Logo Keychain",
    subtitle:
      "A small collectible object built around the AGE202 identity.",
    slug:
      "age202-logo-keychain",
    description:
      "The AGE202 Logo Keychain turns the museum identity into a compact everyday collectible. Designed as a simple accessory for keys, tennis bags and backpacks, it is one of the smallest ways to carry AGE202 beyond the digital museum.",
    collection:
      "AGE202 Museum Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.ACCESSORY,
    material:
      "Metal and enamel",
    tags: [
      "age202",
      "originals",
      "keychain",
      "accessory",
      "museum collection",
      "collectible",
    ],
    price:
      9.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      90,
    metaTitle:
      "AGE202 Logo Keychain | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Logo Keychain, a compact official collectible from The Digital Tennis Museum.",
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
          "AGE202-LOGO-KEY-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
      },
      {
        name:
          "Lime",
        colour:
          "Lime",
        colourHex:
          "#C8FF00",
        logoTone:
          OriginalProductLogoTone.BLACK,
        sku:
          "AGE202-LOGO-KEY-LIM",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },

  {
    title:
      "AGE202 Museum Poster",
    subtitle:
      "A graphic museum piece created to bring AGE202 onto the wall.",
    slug:
      "age202-museum-poster",
    description:
      "The AGE202 Museum Poster is conceived as a simple graphic object for tennis rooms, studios and personal collections. It translates the visual language of The Digital Tennis Museum into a physical display piece designed to live beyond the screen.",
    collection:
      "AGE202 Museum Collection",
    edition:
      "First Edition",
    category:
      OriginalProductCategory.POSTER,
    material:
      "Premium matte paper",
    tags: [
      "age202",
      "originals",
      "poster",
      "museum collection",
      "tennis",
      "wall art",
    ],
    price:
      14.9,
    currency:
      "EUR",
    availability:
      OriginalProductAvailability.COMING_SOON,
    status:
      OriginalProductStatus.PUBLISHED,
    featured:
      false,
    displayOrder:
      100,
    metaTitle:
      "AGE202 Museum Poster | AGE202 Originals",
    metaDescription:
      "Discover the AGE202 Museum Poster, an official graphic object from The Digital Tennis Museum.",
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
          "AGE202-MUSEUM-PSTR-BLK",
        isDefault:
          true,
        sortOrder:
          0,
        stock:
          oneSizeStock(),
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
          "AGE202-MUSEUM-PSTR-WHT",
        isDefault:
          false,
        sortOrder:
          1,
        stock:
          oneSizeStock(),
      },
    ],
  },
];


async function upsertVariant(
  originalProductId: string,
  variant: VariantSeed,
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

  for (
    const stockItem
    of variant.stock
  ) {
    await prisma.originalProductVariantStock.upsert({
      where: {
        variantId_size: {
          variantId:
            savedVariant.id,
          size:
            stockItem.size,
        },
      },
      create: {
        variantId:
          savedVariant.id,
        size:
          stockItem.size,
        stock:
          stockItem.stock,
        active:
          true,
      },
      update: {
        /*
         * Non sovrascriviamo una futura quantità reale
         * con lo zero del seed se lo script viene rilanciato.
         */
        active:
          true,
      },
    });
  }
}


async function importProduct(
  product: ProductSeed,
) {
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
         * Legacy fields:
         * lasciati neutri perché colori e taglie
         * ora vivono nelle varianti.
         */
        colour:
          null,
        sizes: [],
        vintedUrl:
          null,

        tags:
          product.tags,
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
        tags:
          product.tags,
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
         * Se il prodotto esiste già, non tocchiamo:
         * - immagini
         * - Stripe IDs
         * - stripeActive
         * - publishedAt esistente
         */
      },
    });

  /*
   * Garantisce una sola variante default
   * per il prodotto senza cancellare immagini.
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
}


async function main() {
  console.log(
    "Import AGE202 Originals...",
  );

  for (
    const product
    of products
  ) {
    await importProduct(
      product,
    );
  }

  console.log("");
  console.log(
    `Import completed: ${products.length} products.`,
  );
  console.log(
    "Existing AGE202 Essential T-Shirt was left untouched.",
  );
  console.log(
    "All new stock starts at 0 and availability is COMING_SOON.",
  );
  console.log(
    "You can now add only the product images from the Admin.",
  );
}


main()
  .catch(
    (error) => {
      console.error(
        "Originals import failed.",
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
