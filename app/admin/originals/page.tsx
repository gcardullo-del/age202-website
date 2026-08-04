import {
  Box,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Filter,
  ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import type {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductStatus,
  Prisma,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OriginalsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    availability?: string;
    category?: string;
    collection?: string;
  }>;
};

const ORIGINAL_PRODUCT_STATUSES =
  new Set<OriginalProductStatus>([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]);

const ORIGINAL_PRODUCT_AVAILABILITIES =
  new Set<OriginalProductAvailability>([
    "AVAILABLE",
    "SOLD",
    "COMING_SOON",
    "NOT_FOR_SALE",
  ]);

const ORIGINAL_PRODUCT_CATEGORIES =
  new Set<OriginalProductCategory>([
    "TSHIRT",
    "POLO",
    "HOODIE",
    "SWEATSHIRT",
    "CAP",
    "BOTTLE",
    "BAG",
    "POSTER",
    "ACCESSORY",
    "OTHER",
  ]);

function normalizedFilter(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function parseEnumFilter<
  T extends string,
>(
  value: string | undefined,
  allowedValues: Set<T>,
): T | undefined {
  const normalizedValue =
    value?.trim();

  if (
    !normalizedValue ||
    !allowedValues.has(
      normalizedValue as T,
    )
  ) {
    return undefined;
  }

  return normalizedValue as T;
}

function formatLabel(
  value: string | null,
): string {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatPrice(
  value:
    | {
        toString(): string;
      }
    | null,
  currency: string | null,
): string {
  if (!value) {
    return "Not priced";
  }

  const amount = Number(
    value.toString(),
  );

  if (!Number.isFinite(amount)) {
    return `${value.toString()} ${
      currency ?? ""
    }`.trim();
  }

  try {
    return new Intl.NumberFormat(
      "it-IT",
      {
        style: "currency",
        currency:
          currency?.trim() ||
          "EUR",
      },
    ).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${
      currency ?? "EUR"
    }`;
  }
}

function getStatusTone(
  status: string,
):
  | "success"
  | "warning"
  | "neutral"
  | "info" {
  switch (status) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "warning";
    case "ARCHIVED":
      return "neutral";
    default:
      return "info";
  }
}

function getAvailabilityTone(
  availability: string,
):
  | "success"
  | "warning"
  | "danger"
  | "neutral" {
  switch (availability) {
    case "AVAILABLE":
      return "success";
    case "SOLD":
      return "danger";
    case "COMING_SOON":
      return "warning";
    default:
      return "neutral";
  }
}

export default async function OriginalsPage({
  searchParams,
}: OriginalsPageProps) {
  const params =
    await searchParams;

  const query =
    normalizedFilter(params.q);

  const status =
    parseEnumFilter(
      params.status,
      ORIGINAL_PRODUCT_STATUSES,
    );

  const availability =
    parseEnumFilter(
      params.availability,
      ORIGINAL_PRODUCT_AVAILABILITIES,
    );

  const category =
    parseEnumFilter(
      params.category,
      ORIGINAL_PRODUCT_CATEGORIES,
    );

  const collection =
    normalizedFilter(
      params.collection,
    );

  const where = {
    ...(query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              subtitle: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              collection: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              edition: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              colour: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),

    ...(availability
      ? {
          availability,
        }
      : {}),

    ...(category
      ? {
          category,
        }
      : {}),

    ...(collection
      ? {
          collection: {
            equals: collection,
            mode:
              "insensitive" as const,
          },
        }
      : {}),
  } satisfies Prisma.OriginalProductWhereInput;

  const [
    products,
    collections,
    totalCount,
    publishedCount,
    draftCount,
    featuredCount,
  ] = await Promise.all([
    prisma.originalProduct.findMany({
      where,

      include: {
        images: {
          orderBy: [
            {
              isCover: "desc",
            },
            {
              sortOrder: "asc",
            },
          ],
          take: 1,
        },
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),

    prisma.originalProduct.findMany({
      where: {
        collection: {
          not: null,
        },
      },

      distinct: [
        "collection",
      ],

      select: {
        collection: true,
      },

      orderBy: {
        collection: "asc",
      },
    }),

    prisma.originalProduct.count(),

    prisma.originalProduct.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.originalProduct.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.originalProduct.count({
      where: {
        featured: true,
      },
    }),
  ]);

  const collectionOptions =
    collections
      .map(
        (entry) =>
          entry.collection?.trim() ??
          "",
      )
      .filter(Boolean);

  const hasActiveFilters =
    Boolean(
      query ||
        status ||
        availability ||
        category ||
        collection,
    );

  return (
    <AdminShell
      title="Originals"
      description="Manage the official AGE202 branded collection."
    >
      <div className="space-y-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-200/70">
              <Sparkles
                className="h-4 w-4"
                aria-hidden="true"
              />
              Official AGE202 collection
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              AGE202 Originals
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Create, publish and manage
              branded T-shirts, bottles,
              caps, bags, posters and
              accessories from one central
              workspace.
            </p>
          </div>

          <Link
            href="/admin/originals/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-200/70 sm:w-auto"
          >
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />
            New Original
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Total products
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {totalCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/50">
                <Box
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Published
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {publishedCount}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-emerald-300">
                <Eye
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Drafts
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {draftCount}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/15 bg-amber-400/10 p-3 text-amber-300">
                <Pencil
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Featured
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {featuredCount}
                </p>
              </div>

              <div className="rounded-2xl border border-lime-300/15 bg-lime-300/10 p-3 text-lime-200">
                <Star
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </AdminPanel>
        </div>

        <AdminPanel className="p-5 sm:p-6">
          <form
            className="space-y-4"
            method="get"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  <Filter
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Catalog filters
                </div>

                <p className="mt-2 text-sm text-white/45">
                  Search and filter the
                  official AGE202 product
                  catalog.
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href="/admin/originals"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  <X
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Clear filters
                </Link>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <label className="relative md:col-span-2 xl:col-span-2">
                <span className="sr-only">
                  Search Originals
                </span>

                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Title, collection, edition or colour..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/35 focus:bg-white/[0.05]"
                />
              </label>

              <select
                name="status"
                defaultValue={status ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All statuses
                </option>
                <option value="DRAFT">
                  Draft
                </option>
                <option value="PUBLISHED">
                  Published
                </option>
                <option value="ARCHIVED">
                  Archived
                </option>
              </select>

              <select
                name="availability"
                defaultValue={
                  availability ?? ""
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All availability
                </option>
                <option value="AVAILABLE">
                  Available
                </option>
                <option value="SOLD">
                  Sold
                </option>
                <option value="COMING_SOON">
                  Coming soon
                </option>
                <option value="NOT_FOR_SALE">
                  Not for sale
                </option>
              </select>

              <select
                name="category"
                defaultValue={
                  category ?? ""
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All categories
                </option>
                {[
                  "TSHIRT",
                  "POLO",
                  "HOODIE",
                  "SWEATSHIRT",
                  "CAP",
                  "BOTTLE",
                  "BAG",
                  "POSTER",
                  "ACCESSORY",
                  "OTHER",
                ].map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {formatLabel(value)}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <select
                name="collection"
                defaultValue={collection}
                className="h-11 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35 sm:min-w-56"
              >
                <option value="">
                  All collections
                </option>

                {collectionOptions.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <Search
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Apply filters
              </button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Originals inventory
              </h3>

              <p className="mt-1 text-sm text-white/40">
                Featured and manually
                ordered products appear
                first.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-white/35">
              <Layers3
                className="h-4 w-4 text-lime-200/70"
                aria-hidden="true"
              />
              {products.length} of{" "}
              {totalCount} catalog entries
            </div>
          </div>

          {products.length > 0 ? (
            <div className="divide-y divide-white/10">
              {products.map(
                (product) => {
                  const coverImage =
                    product.images[0];

                  return (
                    <article
                      key={product.id}
                      className="group grid gap-5 px-5 py-5 transition hover:bg-white/[0.025] sm:px-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(170px,0.72fr)_minmax(170px,0.7fr)_auto] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#08111F] sm:h-24 sm:w-24">
                          {coverImage ? (
                            <Image
                              src={
                                coverImage.url
                              }
                              alt={
                                coverImage.alt ??
                                product.title
                              }
                              fill
                              sizes="96px"
                              className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(190,242,100,0.08),transparent_65%)] text-white/25">
                              <ImageIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                              <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em]">
                                No media
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <AdminBadge
                              tone={getStatusTone(
                                product.status,
                              )}
                              dot
                            >
                              {formatLabel(
                                product.status,
                              )}
                            </AdminBadge>

                            {product.featured ? (
                              <AdminBadge tone="museum">
                                Featured
                              </AdminBadge>
                            ) : null}
                          </div>

                          <h4 className="mt-3 truncate text-base font-semibold text-white sm:text-lg">
                            {product.title}
                          </h4>

                          <p className="mt-1 truncate text-sm text-white/45">
                            {product.collection ||
                              "AGE202 Originals"}{" "}
                            ·{" "}
                            {formatLabel(
                              product.category,
                            )}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35">
                            {product.edition ? (
                              <span>
                                {product.edition}
                              </span>
                            ) : null}

                            {product.colour ? (
                              <span>
                                {product.colour}
                              </span>
                            ) : null}

                            {product.sizes.length >
                            0 ? (
                              <span>
                                Sizes{" "}
                                {product.sizes.join(
                                  ", ",
                                )}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Marketplace
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <AdminBadge
                            tone={getAvailabilityTone(
                              product.availability,
                            )}
                            dot
                          >
                            {formatLabel(
                              product.availability,
                            )}
                          </AdminBadge>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                          <CircleDollarSign
                            className="h-4 w-4 text-white/30"
                            aria-hidden="true"
                          />
                          {formatPrice(
                            product.price,
                            product.currency,
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Publication
                        </p>

                        <p className="mt-2 text-sm font-medium text-white/70">
                          {product.publishedAt
                            ? new Intl.DateTimeFormat(
                                "it-IT",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              ).format(
                                product.publishedAt,
                              )
                            : "Not published"}
                        </p>

                        <p className="mt-2 text-xs text-white/35">
                          Display order:{" "}
                          {product.displayOrder ??
                            "automatic"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 lg:justify-end">
                        {product.status ===
                        "PUBLISHED" ? (
                          <Link
                            href={`/age202-originals/${product.slug}`}
                            aria-label={`View ${product.title}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                          >
                            <Eye
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : null}

                        <Link
                          href={`/admin/originals/${product.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                        >
                          Edit
                          <ChevronRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            <AdminEmptyState
              title={
                hasActiveFilters
                  ? "No matching Originals"
                  : "No Originals yet"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting or clearing the current catalog filters."
                  : "Create the first official AGE202 product and start building the Originals collection."
              }
              actionLabel={
                hasActiveFilters
                  ? "Clear Filters"
                  : "Create First Original"
              }
              actionHref={
                hasActiveFilters
                  ? "/admin/originals"
                  : "/admin/originals/new"
              }
            />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}