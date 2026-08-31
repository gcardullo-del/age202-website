import type {
 Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Heart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import {
  getPublishedOriginalProducts,
} from "@/lib/repositories/original-product.repository";


export const dynamic =
  "force-dynamic";


export const metadata: Metadata = {
  title:
    "AGE202 Originals | Official Collection",

  description:
    "Discover the official AGE202 Originals collection: apparel, accessories and objects created for The Digital Tennis Museum.",
};


function formatPrice(
  value:
    | {
        toString(): string;
      }
    | null,
  currency: string,
): string {
  if (!value) {
    return "Price on request";
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style:
        "currency",

      currency,

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    },
  ).format(
    Number(
      value.toString(),
    ),
  );
}


function getProductCategory(
  title: string,
  collection:
    | string
    | null,
): string {
  const value =
    `${title} ${collection ?? ""}`
      .toLowerCase();

  if (
    value.includes(
      "cap",
    ) ||
    value.includes(
      "hat",
    ) ||
    value.includes(
      "beanie",
    )
  ) {
    return "Headwear";
  }

  if (
    value.includes(
      "shirt",
    ) ||
    value.includes(
      "polo",
    ) ||
    value.includes(
      "hoodie",
    ) ||
    value.includes(
      "sweat",
    ) ||
    value.includes(
      "jacket",
    )
  ) {
    return "Apparel";
  }

  if (
    value.includes(
      "bottle",
    ) ||
    value.includes(
      "mug",
    ) ||
    value.includes(
      "poster",
    )
  ) {
    return "Objects";
  }

  return "Accessories";
}


function getProductPrimaryImage(
  product: Awaited<
    ReturnType<
      typeof getPublishedOriginalProducts
    >
  >[number],
) {
  const defaultVariant =
    product.variants.find(
      (variant) =>
        variant.isDefault,
    ) ??
    product.variants[0] ??
    null;

  return (
    defaultVariant?.images[0] ??
    product.images[0] ??
    null
  );
}


type PreviewOriginal = {
  slug: string;
  title: string;
  category:
    | "Apparel"
    | "Headwear"
    | "Accessories"
    | "Objects";
  price: number;
  currency: "EUR";
  sizes: string[];
  colours: {
    name: string;
    hex: string;
  }[];
  label: string;
};


const previewOriginals: PreviewOriginal[] = [
  {
    slug: "age202-essential-polo",
    title: "AGE202 Essential Polo",
    category: "Apparel",
    price: 39.9,
    currency: "EUR",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Core Collection",
  },
  {
    slug: "age202-club-hoodie",
    title: "AGE202 Club Hoodie",
    category: "Apparel",
    price: 59.9,
    currency: "EUR",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Core Collection",
  },
  {
    slug: "age202-court-sweatshirt",
    title: "AGE202 Court Sweatshirt",
    category: "Apparel",
    price: 49.9,
    currency: "EUR",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Court Collection",
  },
  {
    slug: "age202-court-cap",
    title: "AGE202 Court Cap",
    category: "Headwear",
    price: 24.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Court Collection",
  },
  {
    slug: "age202-court-beanie",
    title: "AGE202 Court Beanie",
    category: "Headwear",
    price: 22.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "Lime",
        hex: "#C8FF00",
      },
    ],
    label: "Court Collection",
  },
  {
    slug: "age202-match-bottle",
    title: "AGE202 Match Bottle",
    category: "Objects",
    price: 19.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Match Collection",
  },
  {
    slug: "age202-museum-tote",
    title: "AGE202 Museum Tote",
    category: "Accessories",
    price: 19.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "Natural",
        hex: "#D8C9AD",
      },
    ],
    label: "Museum Collection",
  },
  {
    slug: "age202-logo-keychain",
    title: "AGE202 Logo Keychain",
    category: "Accessories",
    price: 9.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "Lime",
        hex: "#C8FF00",
      },
    ],
    label: "Museum Collection",
  },
  {
    slug: "age202-museum-poster",
    title: "AGE202 Museum Poster",
    category: "Objects",
    price: 14.9,
    currency: "EUR",
    sizes: [],
    colours: [
      {
        name: "Black",
        hex: "#000000",
      },
      {
        name: "White",
        hex: "#FFFFFF",
      },
    ],
    label: "Museum Collection",
  },
];


function formatPreviewPrice(
  value: number,
  currency: string,
): string {
  return new Intl.NumberFormat(
    "it-IT",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(value);
}


function getProductDisplaySizes(
  product: Awaited<
    ReturnType<
      typeof getPublishedOriginalProducts
    >
  >[number],
): string[] {
  const defaultVariant =
    product.variants.find(
      (variant) =>
        variant.isDefault,
    ) ??
    product.variants[0] ??
    null;

  if (defaultVariant) {
    const sizes =
      defaultVariant.stock
        .filter(
          (item) =>
            item.active,
        )
        .map(
          (item) =>
            item.size,
        );

    if (sizes.length > 0) {
      return sizes;
    }
  }

  return product.sizes;
}


export default async function OriginalsPage() {
  const products =
    await getPublishedOriginalProducts();

  const featured =
    products.find(
      (product) =>
        product.featured,
    ) ??
    products[0];

  const featuredImage =
    featured
      ? getProductPrimaryImage(
          featured,
        )
      : null;

  const heroSecondary =
    products.find(
      (product) =>
        product.id !==
          featured?.id &&
        Boolean(
          getProductPrimaryImage(
            product,
          ),
        ),
    );

  const heroSecondaryImage =
    heroSecondary
      ? getProductPrimaryImage(
          heroSecondary,
        )
      : null;


  const publishedSlugs =
    new Set(
      products.map(
        (product) =>
          product.slug,
      ),
    );

  const previewProducts =
    previewOriginals.filter(
      (product) =>
        !publishedSlugs.has(
          product.slug,
        ),
    );

  const catalogCount =
    products.length +
    previewProducts.length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(200,255,0,0.16),transparent_31%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(115deg,#050B18_0%,#050B18_48%,rgba(5,11,24,0.72)_72%,rgba(200,255,0,0.04)_100%)]" />

        <div className="relative mx-auto grid min-h-[620px] max-w-[1600px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-20 flex flex-col justify-center px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pb-20 lg:pt-40">
            <div className="inline-flex w-fit items-center gap-2 text-[9px] font-black uppercase tracking-[0.26em] text-[#C8FF00] sm:text-[10px]">
              <BadgeCheck className="h-4 w-4" />

              Official AGE202 Collection
            </div>

            <h1 className="mt-6 text-[clamp(4rem,9vw,9.3rem)] font-black uppercase leading-[0.76] tracking-[-0.075em]">
              AGE202

              <span className="block text-[#C8FF00]">
                Originals.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
              Official pieces from
              The Digital Tennis Museum.
              Apparel, accessories and
              objects created for AGE202.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#shop-originals"
                className="inline-flex items-center gap-3 rounded-md bg-[#C8FF00] px-6 py-4 text-[9px] font-black uppercase tracking-[0.16em] text-[#050B18] transition hover:bg-white"
              >
                Shop all Originals

                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#the-original"
                className="inline-flex items-center gap-3 rounded-md border border-[#C8FF00]/60 px-6 py-4 text-[9px] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#C8FF00] hover:text-[#C8FF00]"
              >
                Discover the collection
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/50">
              <ShieldCheck className="h-4 w-4 text-[#C8FF00]" />

              Official AGE202 Products
            </div>
          </div>


          {/* HERO PRODUCTS */}

          <div className="relative hidden min-h-[620px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.08),transparent_38%)]" />

            <div className="absolute bottom-0 left-[4%] right-[3%] top-[14%] overflow-hidden rounded-tl-[2.5rem] border-l border-t border-white/10 bg-[#090E16] shadow-[-30px_20px_90px_rgba(0,0,0,0.45)]">
              {featured &&
              featuredImage ? (
                <Image
                  src={
                    featuredImage.url
                  }
                  alt={
                    featuredImage.alt ??
                    featured.title
                  }
                  fill
                  priority
                  sizes="58vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(200,255,0,.13),transparent_34%),#090E16]">
                  <div className="text-center">
                    <Sparkles className="mx-auto h-14 w-14 text-[#C8FF00]/60" />

                    <p className="mt-5 text-[9px] font-black uppercase tracking-[0.24em] text-white/30">
                      AGE202 Originals
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/50 via-transparent to-black/15" />
            </div>

            {heroSecondary &&
            heroSecondaryImage ? (
              <div className="absolute bottom-8 left-0 z-10 h-[190px] w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-[#101620] shadow-2xl">
                <Image
                  src={
                    heroSecondaryImage.url
                  }
                  alt={
                    heroSecondaryImage.alt ??
                    heroSecondary.title
                  }
                  fill
                  sizes="190px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORY STRIP
      ====================================================== */}

      <section className="border-b border-white/10 bg-[#040913]">
        <div className="mx-auto flex max-w-[1600px] gap-2 overflow-x-auto px-5 py-4 sm:px-8 lg:px-12">
          {[
            "All",
            "Apparel",
            "Headwear",
            "Accessories",
            "Objects",
          ].map(
            (
              category,
              index,
            ) => (
              <span
                key={
                  category
                }
                className={`shrink-0 rounded-md border px-5 py-3 text-[8px] font-black uppercase tracking-[0.16em] ${
                  index ===
                  0
                    ? "border-[#C8FF00] bg-[#C8FF00]/5 text-[#C8FF00]"
                    : "border-white/12 text-white/65"
                }`}
              >
                {category}
              </span>
            ),
          )}
        </div>
      </section>


      {/* =====================================================
          CATALOG
      ====================================================== */}

      <section
        id="shop-originals"
        className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#C8FF00]">
                Official Collection
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.055em] sm:text-5xl">
                Shop Originals
              </h2>
            </div>

            {catalogCount >
            0 ? (
              <div className="rounded-md border border-white/12 px-5 py-3 text-[8px] font-black uppercase tracking-[0.16em] text-white/55">
                {catalogCount} Originals
              </div>
            ) : null}
          </div>


          {catalogCount >
          0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map(
                (
                  product,
                ) => {
                  const image =
                    getProductPrimaryImage(
                      product,
                    );

                  const category =
                    getProductCategory(
                      product.title,
                      product.collection,
                    );

                  const sizes =
                    getProductDisplaySizes(
                      product,
                    );

                  return (
                    <Link
                      key={
                        product.id
                      }
                      href={`/age202-originals/${product.slug}`}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A101B] transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/40"
                    >
                      <div className="relative aspect-[4/4.55] overflow-hidden bg-[#121820]">
                        {image ? (
                          <Image
                            src={
                              image.url
                            }
                            alt={
                              image.alt ??
                              product.title
                            }
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(200,255,0,0.10),transparent_40%),#101720]">
                            <Sparkles className="h-9 w-9 text-[#C8FF00]/40" />
                          </div>
                        )}

                        <div className="absolute left-3 top-3 rounded-sm bg-[#C8FF00] px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#050B18]">
                          New
                        </div>

                        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-black/25 backdrop-blur">
                          <Heart className="h-4 w-4 text-white" />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A101B] to-transparent" />
                      </div>


                      <div className="p-4 sm:p-5">
                        <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
                          {category}
                        </p>

                        <h3 className="mt-2 min-h-[2.5rem] text-sm font-black leading-tight text-white sm:text-base">
                          {product.title}
                        </h3>

                        <p className="mt-1 text-[10px] text-white/40">
                          Official Original
                        </p>


                        {sizes.length >
                        0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {sizes
                              .slice(
                                0,
                                5,
                              )
                              .map(
                                (
                                  size,
                                ) => (
                                  <span
                                    key={
                                      size
                                    }
                                    className="rounded-full border border-white/12 px-2 py-1 text-[7px] font-bold uppercase text-white/50"
                                  >
                                    {
                                      size
                                    }
                                  </span>
                                ),
                              )}
                          </div>
                        ) : (
                          <div className="mt-3 flex gap-1.5">
                            {product.variants
                              .slice(
                                0,
                                4,
                              )
                              .map(
                                (
                                  variant,
                                ) => (
                                  <span
                                    key={
                                      variant.id
                                    }
                                    title={
                                      variant.colour
                                    }
                                    className="h-3 w-3 rounded-full border border-white/20"
                                    style={{
                                      backgroundColor:
                                        variant.colourHex ??
                                        variant.colour,
                                    }}
                                  />
                                ),
                              )}
                          </div>
                        )}


                        <div className="mt-5 flex items-end justify-between gap-2">
                          <span className="text-base font-black text-white sm:text-lg">
                            {formatPrice(
                              product.price,
                              product.currency,
                            )}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.14em] text-[#C8FF00] sm:text-[8px]">
                            Collect

                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}


              {previewProducts.map(
                (
                  product,
                ) => (
                  <article
                    key={
                      product.slug
                    }
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A101B]"
                  >
                    <div className="relative aspect-[4/4.55] overflow-hidden bg-[#121820]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(200,255,0,0.12),transparent_30%),linear-gradient(145deg,#111925,#080D15)]" />

                      <div className="absolute inset-0 grid place-items-center px-6 text-center">
                        <div>
                          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/5">
                            <Sparkles className="h-7 w-7 text-[#C8FF00]/55" />
                          </div>

                          <p className="mt-5 text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
                            Image coming soon
                          </p>
                        </div>
                      </div>

                      <div className="absolute left-3 top-3 rounded-sm border border-[#C8FF00]/45 bg-[#08110D]/80 px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#C8FF00] backdrop-blur">
                        Preview
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A101B] to-transparent" />
                    </div>


                    <div className="p-4 sm:p-5">
                      <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
                        {product.category}
                      </p>

                      <h3 className="mt-2 min-h-[2.5rem] text-sm font-black leading-tight text-white sm:text-base">
                        {product.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-white/40">
                        {product.label}
                      </p>


                      {product.sizes.length >
                      0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.sizes.map(
                            (
                              size,
                            ) => (
                              <span
                                key={
                                  size
                                }
                                className="rounded-full border border-white/12 px-2 py-1 text-[7px] font-bold uppercase text-white/50"
                              >
                                {
                                  size
                                }
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-1.5">
                          {product.colours.map(
                            (
                              colour,
                            ) => (
                              <span
                                key={
                                  colour.name
                                }
                                title={
                                  colour.name
                                }
                                className="h-3 w-3 rounded-full border border-white/20"
                                style={{
                                  backgroundColor:
                                    colour.hex,
                                }}
                              />
                            ),
                          )}
                        </div>
                      )}


                      <div className="mt-5 flex items-end justify-between gap-2">
                        <span className="text-base font-black text-white sm:text-lg">
                          {formatPreviewPrice(
                            product.price,
                            product.currency,
                          )}
                        </span>

                        <span className="text-[7px] font-black uppercase tracking-[0.14em] text-white/30 sm:text-[8px]">
                          Coming soon
                        </span>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-dashed border-white/12 bg-white/[0.015]">
              <div className="grid min-h-[280px] place-items-center px-8 py-16 text-center">
                <div>
                  <Sparkles className="mx-auto h-11 w-11 text-[#C8FF00]/45" />

                  <h3 className="mt-5 text-2xl font-black uppercase tracking-[-0.03em]">
                    Originals
                    coming soon
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                    Published products
                    from the AGE202 Admin
                    will appear here
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* =====================================================
          TRUST STRIP
      ====================================================== */}

      <section className="px-5 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] overflow-hidden rounded-xl border border-white/10 bg-[#070D17] sm:grid-cols-2 xl:grid-cols-5">
          <div className="border-b border-white/10 p-6 sm:border-r xl:border-b-0">
            <ShieldCheck className="h-6 w-6 text-[#C8FF00]" />

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em]">
              Official AGE202
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Original products
              created for AGE202.
            </p>
          </div>


          <div className="border-b border-white/10 p-6 xl:border-b-0 xl:border-r">
            <Star className="h-6 w-6 text-[#C8FF00]" />

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em]">
              Premium Selection
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Carefully selected
              materials and details.
            </p>
          </div>


          <div className="border-b border-white/10 p-6 sm:border-r xl:border-b-0">
            <Truck className="h-6 w-6 text-[#C8FF00]" />

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em]">
              Tracked Shipping
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Delivery available
              in supported countries.
            </p>
          </div>


          <div className="border-b border-white/10 p-6 xl:border-b-0 xl:border-r">
            <LockKeyhole className="h-6 w-6 text-[#C8FF00]" />

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em]">
              Secure Payments
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Protected checkout
              for every order.
            </p>
          </div>


          <div className="p-6">
            <BadgeCheck className="h-6 w-6 text-[#C8FF00]" />

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em]">
              AGE202 Identity
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Designed as part of
              The Digital Tennis Museum.
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          THE ORIGINAL
      ====================================================== */}

      <section
        id="the-original"
        className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"
      >
        <div className="relative mx-auto min-h-[360px] max-w-[1600px] overflow-hidden rounded-2xl border border-white/10 bg-[#080E18]">
          {featured &&
          featuredImage ? (
            <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
              <Image
                src={
                  featuredImage.url
                }
                alt={
                  featuredImage.alt ??
                  featured.title
                }
                fill
                sizes="58vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#080E18] via-[#080E18]/55 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 hidden w-[58%] bg-[radial-gradient(circle_at_center,rgba(200,255,0,.10),transparent_42%)] lg:block" />
          )}

          <div className="relative z-10 flex min-h-[360px] max-w-2xl flex-col justify-center p-8 sm:p-12 lg:p-14">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#C8FF00]">
              The AGE202 Original
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl">
              The Original.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              AGE202 Originals are
              created to extend the
              identity of the museum
              beyond the screen:
              essential pieces,
              accessories and objects
              connected by one visual
              language and one passion
              for tennis.
            </p>

            <div className="mt-8">
              <a
                href="#shop-originals"
                className="inline-flex items-center gap-3 rounded-md border border-[#C8FF00]/70 px-6 py-4 text-[9px] font-black uppercase tracking-[0.16em] transition hover:bg-[#C8FF00] hover:text-[#050B18]"
              >
                Discover Originals

                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}