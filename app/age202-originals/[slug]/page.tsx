import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getPublishedOriginalProductBySlug,
  getRelatedOriginalProducts,
} from "@/lib/repositories/original-product.repository";

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
      style: "currency",
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
  const { slug } = await params;

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
  const { slug } = await params;

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
        productId: product.id,
        category:
          product.category,
        limit: 3,
      },
    );

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
            <div className="grid gap-4 sm:grid-cols-2">
              {product.images.length >
              0 ? (
                product.images.map(
                  (image, index) => (
                    <div
                      key={image.id}
                      className={`relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425] ${
                        index === 0
                          ? "aspect-[4/5] sm:col-span-2"
                          : "aspect-square"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={
                          image.alt ??
                          product.title
                        }
                        fill
                        priority={
                          index === 0
                        }
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover"
                      />
                    </div>
                  ),
                )
              ) : (
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425] sm:col-span-2">
                  <div className="absolute inset-0 grid place-items-center">
                    <Sparkles className="h-12 w-12 text-[#D7FF00]/45" />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                {product.collection ??
                  "AGE202 Originals"}
              </p>

              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl">
                {product.title}
              </h1>

              {product.subtitle ? (
                <p className="mt-5 text-lg text-white/55">
                  {product.subtitle}
                </p>
              ) : null}

              <p className="mt-7 text-sm leading-7 text-white/45">
                {product.description ??
                  "Official AGE202 branded product."}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/10">
                {[
                  [
                    "Category",
                    product.category.replaceAll(
                      "_",
                      " ",
                    ),
                  ],
                  [
                    "Colour",
                    product.colour ??
                      "Not specified",
                  ],
                  [
                    "Material",
                    product.material ??
                      "Not specified",
                  ],
                  [
                    "Edition",
                    product.edition ??
                      "Standard",
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="bg-[#08111F] p-4"
                    >
                      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                        {label}
                      </p>

                      <p className="mt-2 text-xs font-semibold uppercase text-white/75">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {product.sizes.length >
              0 ? (
                <div className="mt-7">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    Available sizes
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map(
                      (size) => (
                        <span
                          key={size}
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/65"
                        >
                          {size}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-white/10 pt-7">
                <span className="text-xl font-black text-white">
                  {formatPrice(
                    product.price,
                    product.currency,
                  )}
                </span>

                {product.availability ===
                  "AVAILABLE" &&
                product.vintedUrl ? (
                  <a
                    href={
                      product.vintedUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-[#D7FF00] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18]"
                  >
                    Buy on Vinted
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="rounded-full border border-white/10 px-5 py-3 text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                    {product.availability.replaceAll(
                      "_",
                      " ",
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
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
                (item) => (
                  <Link
                    key={item.id}
                    href={`/age202-originals/${item.slug}`}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025]"
                  >
                    <div className="relative aspect-[4/5] bg-[#0A1425]">
                      {item.images[0] ? (
                        <Image
                          src={
                            item.images[0]
                              .url
                          }
                          alt={
                            item.images[0]
                              .alt ??
                            item.title
                          }
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-black uppercase">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
