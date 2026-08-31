import type {
   Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getPublishedOriginalProductBySlug,
  getRelatedOriginalProducts,
} from "@/lib/repositories/original-product.repository";

import OriginalProductExperience from "./OriginalProductExperience";
import DynamicProductColour from "./DynamicProductColour";


export const dynamic =
  "force-dynamic";


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
    },
  ).format(
    Number(
      value.toString(),
    ),
  );
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const product =
    await getPublishedOriginalProductBySlug(
      slug,
    );

  if (!product) {
    return {
      title:
        "Original not found | AGE202",
    };
  }

  return {
    title:
      product.metaTitle ??
      `${product.title} | AGE202 Originals`,

    description:
      product.metaDescription ??
      product.description ??
      product.subtitle ??
      "Official AGE202 Original product.",
  };
}


export default async function OriginalProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const {
    slug,
  } = await params;

  const product =
    await getPublishedOriginalProductBySlug(
      slug,
    );

  if (!product) {
    notFound();
  }


  const related =
    await getRelatedOriginalProducts(
      {
        productId:
          product.id,

        category:
          product.category,

        limit:
          3,
      },
    );


  const defaultVariant =
    product.variants.find(
      (variant) =>
        variant.isDefault,
    ) ??
    product.variants[0] ??
    null;


  const displayColour =
    defaultVariant?.colour ??
    product.colour ??
    "Not specified";


  const priceLabel =
    formatPrice(
      product.price,
      product.currency,
    );


  const checkoutEnabled =
    process.env.CHECKOUT_ENABLED ===
      "true" &&
    process.env.INPOST_SHIPPING_ENABLED ===
      "true";


  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <section className="px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-[1500px]">
          <Link
            href="/age202-originals"
            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-[#D7FF00]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Originals
          </Link>


          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <OriginalProductExperience
                productId={
                  product.id
                }
                title={
                  product.title
                }
                priceLabel={
                  priceLabel
                }
                availability={
                  product.availability
                }
                checkoutEnabled={
                  checkoutEnabled
                }
                globalImages={
                  product.images
                }
                variants={
                  product.variants
                }
              />
            </div>


            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                {product.collection ??
                  "AGE202 Originals"}
              </p>


              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl">
                {
                  product.title
                }
              </h1>


              {product.subtitle ? (
                <p className="mt-5 text-lg text-white/55">
                  {
                    product.subtitle
                  }
                </p>
              ) : null}


              <p className="mt-7 text-sm leading-7 text-white/45">
                {product.description ??
                  "Official AGE202 branded product."}
              </p>


              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/10">
                <div className="bg-[#08111F] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    Category
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase text-white/75">
                    {product.category.replaceAll(
                      "_",
                      " ",
                    )}
                  </p>
                </div>

                <div className="bg-[#08111F] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    Colour
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase text-white/75">
                    <DynamicProductColour
                      initialColour={
                        displayColour
                      }
                    />
                  </p>
                </div>

                <div className="bg-[#08111F] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    Material
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase text-white/75">
                    {product.material ??
                      "Not specified"}
                  </p>
                </div>

                <div className="bg-[#08111F] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    Edition
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase text-white/75">
                    {product.edition ??
                      "Standard"}
                  </p>
                </div>
              </div>


              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
                  AGE202 Original
                </p>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  Designed as part of the
                  AGE202 Originals collection,
                  created for tennis culture
                  and the identity of the
                  digital museum.
                </p>


                {defaultVariant ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                      {
                        product.variants.length
                      }{" "}
                      colour
                      {product.variants.length ===
                      1
                        ? ""
                        : "s"}
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                      Default:{" "}
                      {
                        defaultVariant.colour
                      }
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>


      {related.length >
      0 ? (
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
              More Originals
            </p>


            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em]">
              Related products
            </h2>


            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map(
                (
                  item,
                ) => {
                  const relatedDefaultVariant =
                    item.variants.find(
                      (
                        variant,
                      ) =>
                        variant.isDefault,
                    ) ??
                    item.variants[0] ??
                    null;


                  const relatedImage =
                    relatedDefaultVariant
                      ?.images[0] ??
                    item.images[0] ??
                    null;


                  return (
                    <Link
                      key={
                        item.id
                      }
                      href={`/age202-originals/${item.slug}`}
                      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] transition hover:border-white/20"
                    >
                      <div className="relative aspect-[4/5] bg-[#0A1425]">
                        {relatedImage ? (
                          <img
                            src={
                              relatedImage.url
                            }
                            alt={
                              relatedImage.alt ??
                              item.title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>


                      <div className="p-5">
                        <h3 className="text-lg font-black uppercase">
                          {
                            item.title
                          }
                        </h3>

                        <p className="mt-3 text-sm font-black text-white/70">
                          {formatPrice(
                            item.price,
                            item.currency,
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}