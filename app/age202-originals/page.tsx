import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ExternalLink,
  Sparkles,
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
    "Discover official AGE202 branded T-shirts, bottles, caps, bags, posters and accessories.",
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
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(
    Number(
      value.toString(),
    ),
  );
}

export default async function OriginalsPage() {
  const products =
    await getPublishedOriginalProducts();

  const featured =
    products.find(
      (product) =>
        product.featured,
    ) ?? products[0];

  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(215,255,0,.16),transparent_32%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D7FF00]">
            Official branded collection
          </p>

          <h1 className="mt-6 text-[clamp(4rem,10vw,10rem)] font-black uppercase leading-[0.76] tracking-[-0.075em]">
            AGE202
            <span className="block text-[#D7FF00]">
              Originals.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Official AGE202 T-shirts,
            bottles, caps, bags,
            posters and accessories
            designed for tennis lovers.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F] lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative min-h-[430px] overflow-hidden lg:min-h-[620px]">
              {featured.images[0] ? (
                <Image
                  src={
                    featured.images[0]
                      .url
                  }
                  alt={
                    featured.images[0]
                      .alt ??
                    featured.title
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(215,255,0,.15),transparent_38%),#0A1425]">
                  <Sparkles className="h-12 w-12 text-[#D7FF00]/60" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/80 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                Featured Original
              </p>

              <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
                {featured.title}
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/48">
                {featured.description ??
                  featured.subtitle ??
                  "An official AGE202 branded product."}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {featured.sizes.map(
                  (size) => (
                    <span
                      key={size}
                      className="rounded-full border border-white/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.16em] text-white/50"
                    >
                      {size}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={`/age202-originals/${featured.slug}`}
                  className="inline-flex items-center gap-3 rounded-full bg-[#D7FF00] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18]"
                >
                  View product
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {featured.availability ===
                  "AVAILABLE" &&
                featured.vintedUrl ? (
                  <a
                    href={
                      featured.vintedUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-white/12 px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-white/65"
                  >
                    Buy on Vinted
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                <span className="text-sm font-black text-white/75">
                  {formatPrice(
                    featured.price,
                    featured.currency,
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
            Complete collection
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
            Shop Originals
          </h2>

          {products.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map(
                (product) => (
                  <Link
                    key={product.id}
                    href={`/age202-originals/${product.slug}`}
                    className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.025] transition hover:-translate-y-1 hover:border-[#D7FF00]/30"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#0A1425]">
                      {product.images[0] ? (
                        <Image
                          src={
                            product.images[0]
                              .url
                          }
                          alt={
                            product.images[0]
                              .alt ??
                            product.title
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <Sparkles className="h-9 w-9 text-[#D7FF00]/45" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/95 via-transparent to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D7FF00]">
                          {product.collection ??
                            "AGE202 Originals"}
                        </p>

                        <h3 className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                          {product.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5">
                      <span className="text-sm font-black text-white/75">
                        {formatPrice(
                          product.price,
                          product.currency,
                        )}
                      </span>

                      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-[#D7FF00]">
                        View product
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-white/12 px-8 py-20 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-white/20" />

              <h3 className="mt-5 text-2xl font-black uppercase">
                Originals coming soon
              </h3>

              <p className="mt-3 text-sm text-white/40">
                Published products from
                the Admin will appear
                here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
