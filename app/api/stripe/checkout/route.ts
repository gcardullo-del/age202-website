import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type StripeCatalogType =
  | "ARTIFACT"
  | "MEMORABILIA"
  | "ORIGINAL_PRODUCT";

type CheckoutRequestBody = {
  itemId?: string;
  itemType?: StripeCatalogType;
  size?: string;
};

type CheckoutItem = {
  id: string;
  title: string;
  slug: string;
  price: {
    lte(value: number): boolean;
    mul(value: number): {
      toDecimalPlaces(value: number): {
        toNumber(): number;
      };
    };
  } | null;
  currency: string;
  stripeActive: boolean;
  stripePriceId: string | null;
  stripeProductId: string | null;
};

const SHIPPING_COUNTRIES_SETTING_KEY =
  "commerce.shipping.allowedCountries";

const SUPPORTED_CHECKOUT_COUNTRIES = [
  "IT",
  "FR",
  "ES",
  "PT",
  "BE",
  "NL",
  "LU",
  "PL",
  "DE",
  "AT",
  "CZ",
  "SK",
  "SI",
  "HR",
  "HU",
  "RO",
  "BG",
  "DK",
  "SE",
  "FI",
  "IE",
  "GR",
  "EE",
  "LV",
  "LT",
  "GB",
] as const;

type SupportedCheckoutCountry =
  (typeof SUPPORTED_CHECKOUT_COUNTRIES)[number];

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as CheckoutRequestBody;

    const itemId =
      body.itemId?.trim();

    const itemType =
      body.itemType;

    const size =
      body.size?.trim() || null;

    if (!itemId) {
      return NextResponse.json(
        {
          error:
            "itemId mancante.",
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

    const item =
      await getCheckoutItem(
        itemType,
        itemId,
      );

    if (!item) {
      return NextResponse.json(
        {
          error:
            "Elemento AGE202 non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    if (!item.price) {
      return NextResponse.json(
        {
          error:
            "Prezzo mancante.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      item.price.lte(0)
    ) {
      return NextResponse.json(
        {
          error:
            "Prezzo non valido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !item.stripeActive
    ) {
      return NextResponse.json(
        {
          error:
            "Stripe non è attivo per questo elemento.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !item.stripePriceId
    ) {
      return NextResponse.json(
        {
          error:
            "stripePriceId mancante.",
        },
        {
          status: 400,
        },
      );
    }

    const allowedCountries =
      await getAllowedShippingCountries();

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price:
              item.stripePriceId,

            quantity: 1,
          },
        ],

        customer_creation:
          "always",

        billing_address_collection:
          "required",

        shipping_address_collection: {
          allowed_countries:
            allowedCountries,
        },

        phone_number_collection: {
          enabled: true,
        },

        success_url:
          `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          getCancelUrl({
            baseUrl,
            itemType,
            slug: item.slug,
          }),

        metadata: {
          age202ItemId:
            item.id,

          age202ItemType:
            itemType,

          age202Slug:
            item.slug,

          age202Title:
            item.title,

          size:
            size ?? "",
        },

        payment_intent_data: {
          metadata: {
            age202ItemId:
              item.id,

            age202ItemType:
              itemType,

            age202Slug:
              item.slug,

            size:
              size ?? "",
          },
        },
      });

    if (
      !session.url
    ) {
      return NextResponse.json(
        {
          error:
            "Stripe non ha restituito una URL di Checkout.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl:
        session.url,
      sessionId:
        session.id,
      itemType,
      itemId:
        item.id,
      allowedCountries,
    });
  } catch (error) {
    console.error(
      "Errore Stripe Checkout AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile creare la sessione Stripe Checkout.",
      },
      {
        status: 500,
      },
    );
  }
}

async function getAllowedShippingCountries(): Promise<
  SupportedCheckoutCountry[]
> {
  const setting =
    await prisma.museumSetting.findUnique({
      where: {
        key:
          SHIPPING_COUNTRIES_SETTING_KEY,
      },

      select: {
        value: true,
      },
    });

  if (
    !setting ||
    !Array.isArray(
      setting.value,
    )
  ) {
    return ["IT"];
  }

  const supportedCountries =
    new Set<string>(
      SUPPORTED_CHECKOUT_COUNTRIES,
    );

  const countries =
    setting.value.filter(
      (
        value,
      ): value is SupportedCheckoutCountry =>
        typeof value ===
          "string" &&
        supportedCountries.has(
          value,
        ),
    );

  const uniqueCountries =
    [
      ...new Set(
        countries,
      ),
    ];

  if (
    uniqueCountries.length ===
    0
  ) {
    return ["IT"];
  }

  return uniqueCountries;
}

async function getCheckoutItem(
  itemType: StripeCatalogType,
  itemId: string,
): Promise<CheckoutItem | null> {
  if (
    itemType === "ARTIFACT"
  ) {
    return prisma.artifact.findUnique({
      where: {
        id: itemId,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        currency: true,
        stripeActive: true,
        stripePriceId: true,
        stripeProductId: true,
      },
    });
  }

  if (
    itemType === "MEMORABILIA"
  ) {
    return prisma.memorabilia.findUnique({
      where: {
        id: itemId,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        currency: true,
        stripeActive: true,
        stripePriceId: true,
        stripeProductId: true,
      },
    });
  }

  return prisma.originalProduct.findUnique({
    where: {
      id: itemId,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      currency: true,
      stripeActive: true,
      stripePriceId: true,
      stripeProductId: true,
    },
  });
}

function getCancelUrl({
  baseUrl,
  itemType,
  slug,
}: {
  baseUrl: string;
  itemType: StripeCatalogType;
  slug: string;
}) {
  if (
    itemType === "ARTIFACT"
  ) {
    return `${baseUrl}/artifacts/${slug}`;
  }

  if (
    itemType === "MEMORABILIA"
  ) {
    return `${baseUrl}/memorabilia/${slug}`;
  }

  return `${baseUrl}/product/${slug}`;
}