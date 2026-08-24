import Link from "next/link";

import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Gem,
  ImageIcon,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatLabel(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatPrice(
  value: {
    toString(): string;
  } | null,
  currency: string,
): string {
  if (!value) {
    return "—";
  }

  const amount = Number(
    value.toString(),
  );

  if (!Number.isFinite(amount)) {
    return `${value.toString()} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(
      "it-IT",
      {
        style: "currency",
        currency,
      },
    ).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function getStatusClasses(
  status: string,
): string {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";

    case "DRAFT":
      return "border-amber-300/20 bg-amber-300/10 text-amber-200";

    case "ARCHIVED":
      return "border-white/10 bg-white/[0.05] text-white/45";

    default:
      return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  }
}

function getAvailabilityClasses(
  availability: string,
): string {
  switch (availability) {
    case "AVAILABLE":
      return "text-emerald-300";

    case "RESERVED":
      return "text-sky-300";

    case "SOLD":
      return "text-rose-300";

    case "COMING_SOON":
      return "text-amber-300";

    case "NOT_FOR_SALE":
      return "text-white/35";

    default:
      return "text-white/50";
  }
}

export default async function AdminMemorabiliaPage() {
  const memorabilia =
    await prisma.memorabilia.findMany({
      include: {
        player: {
          select: {
            id: true,
            name: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  const availableCount =
    memorabilia.filter(
      (item) =>
        item.availability ===
        "AVAILABLE",
    ).length;

  const publishedCount =
    memorabilia.filter(
      (item) =>
        item.status ===
        "PUBLISHED",
    ).length;

  const stripeReadyCount =
    memorabilia.filter(
      (item) =>
        item.stripeActive &&
        Boolean(
          item.stripePriceId,
        ),
    ).length;

  return (
    <AdminShell
      title="Memorabilia"
      description="Manage collectible tennis cards, signed pieces, racquets, photos and historic objects."
    >
      <div className="space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 size-80 rounded-full bg-lime-300/[0.08] blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime-300/70">
                <Gem className="size-4" />
                AGE202 Collectibles
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Memorabilia archive.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Trading cards, signed items, racquets, tickets,
                programmes and other collectible pieces live here,
                separately from the apparel Artifact archive.
              </p>
            </div>

            <Link
              href="/admin/memorabilia/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Plus className="size-4" />
              New Memorabilia
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Total items
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {memorabilia.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Available
            </p>

            <p className="mt-3 text-3xl font-semibold text-emerald-300">
              {availableCount}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Published
            </p>

            <p className="mt-3 text-3xl font-semibold text-sky-300">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Stripe ready
            </p>

            <p className="mt-3 text-3xl font-semibold text-lime-300">
              {stripeReadyCount}
            </p>
          </div>
        </section>

        {memorabilia.length > 0 ? (
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-lime-300" />

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Collection inventory
                  </h2>

                  <p className="mt-1 text-sm text-white/35">
                    {memorabilia.length} memorabilia records in AGE202
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {memorabilia.map(
                (item) => {
                  const cover =
                    item.images[0];

                  return (
                    <article
                      key={item.id}
                      className="grid gap-5 p-5 transition hover:bg-white/[0.025] sm:p-6 lg:grid-cols-[88px_minmax(0,1.5fr)_minmax(150px,0.6fr)_minmax(160px,0.7fr)_auto] lg:items-center"
                    >
                      <div className="flex size-[88px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover.url}
                            alt={
                              cover.alt ??
                              item.title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="size-6 text-white/20" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={[
                              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                              getStatusClasses(
                                item.status,
                              ),
                            ].join(" ")}
                          >
                            {formatLabel(
                              item.status,
                            )}
                          </span>

                          {item.featured ? (
                            <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime-300">
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 truncate text-lg font-semibold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                          {item.inventoryNumber}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/40">
                          <span>
                            {formatLabel(
                              item.type,
                            )}
                          </span>

                          <span>
                            {formatLabel(
                              item.rarity,
                            )}
                          </span>

                          {item.year ? (
                            <span>
                              {item.year}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-white/30">
                          <UserRound className="size-4" />

                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                            Player
                          </p>
                        </div>

                        <p className="mt-2 text-sm font-medium text-white/70">
                          {item.player?.name ??
                            "Not assigned"}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {item.brand ??
                            "No brand"}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-white/30">
                          <CircleDollarSign className="size-4" />

                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                            Commerce
                          </p>
                        </div>

                        <p
                          className={[
                            "mt-2 text-sm font-semibold",
                            getAvailabilityClasses(
                              item.availability,
                            ),
                          ].join(" ")}
                        >
                          {formatLabel(
                            item.availability,
                          )}
                        </p>

                        <p className="mt-1 text-sm text-white/60">
                          {formatPrice(
                            item.price,
                            item.currency,
                          )}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <BadgeCheck
                            className={[
                              "size-3.5",
                              item.stripeActive
                                ? "text-lime-300"
                                : "text-white/20",
                            ].join(" ")}
                          />

                          <span
                            className={
                              item.stripeActive
                                ? "text-lime-300/80"
                                : "text-white/25"
                            }
                          >
                            {item.stripeActive
                              ? "Stripe active"
                              : "Stripe inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:justify-end">
                        {item.status ===
                        "PUBLISHED" ? (
                          <Link
                            href={`/memorabilia/${item.slug}`}
                            aria-label={`View ${item.title}`}
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                          >
                            <Eye className="size-4" />
                          </Link>
                        ) : null}

                        <Link
                          href={`/admin/memorabilia/${item.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                        >
                          Edit
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
            <Gem className="mx-auto size-9 text-white/20" />

            <h2 className="mt-5 text-xl font-semibold text-white">
              No memorabilia yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/40">
              Create the first collectible record and start building
              the AGE202 memorabilia archive.
            </p>

            <Link
              href="/admin/memorabilia/new"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Plus className="size-4" />
              Create First Memorabilia
            </Link>
          </section>
        )}
      </div>
    </AdminShell>
  );
}