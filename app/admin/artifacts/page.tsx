import {
  Archive,
  BadgeCheck,
  Box,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Filter,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type {
  ArtifactAvailability,
  ArtifactRarity,
  ArtifactStatus,
  Prisma,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import DeleteArtifactButton from "@/components/admin/artifacts/DeleteArtifactButton";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatLabel(value: string | null): string {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrice(
  value: { toString(): string } | null,
  currency: string | null,
): string {
  if (!value) {
    return "Not priced";
  }

  const amount = Number(value.toString());

  if (!Number.isFinite(amount)) {
    return `${value.toString()} ${currency ?? ""}`.trim();
  }

  try {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currency?.trim() || "EUR",
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? "EUR"}`;
  }
}

function getStatusTone(
  status: string,
): "success" | "warning" | "neutral" | "info" {
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
): "success" | "warning" | "danger" | "neutral" {
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

type ArtifactsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    availability?: string;
    player?: string;
    brand?: string;
    rarity?: string;
  }>;
};

function normalizedFilter(value: string | undefined): string {
  return value?.trim() ?? "";
}

const ARTIFACT_STATUSES = new Set<ArtifactStatus>([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const ARTIFACT_AVAILABILITIES = new Set<ArtifactAvailability>([
  "AVAILABLE",
  "SOLD",
  "COMING_SOON",
  "NOT_FOR_SALE",
]);

const ARTIFACT_RARITIES = new Set<ArtifactRarity>([
  "COMMON",
  "RARE",
  "VERY_RARE",
  "LEGENDARY",
]);

function parseEnumFilter<T extends string>(
  value: string | undefined,
  allowedValues: Set<T>,
): T | undefined {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !allowedValues.has(normalizedValue as T)) {
    return undefined;
  }

  return normalizedValue as T;
}

export default async function ArtifactsPage({
  searchParams,
}: ArtifactsPageProps) {
  const params = await searchParams;
  const query = normalizedFilter(params.q);
  const status = parseEnumFilter(params.status, ARTIFACT_STATUSES);
  const availability = parseEnumFilter(
    params.availability,
    ARTIFACT_AVAILABILITIES,
  );
  const playerId = normalizedFilter(params.player);
  const brandId = normalizedFilter(params.brand);
  const rarity = parseEnumFilter(params.rarity, ARTIFACT_RARITIES);

  const where = {
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { archiveNumber: { contains: query, mode: "insensitive" as const } },
            { tournament: { contains: query, mode: "insensitive" as const } },
            { collection: { contains: query, mode: "insensitive" as const } },
            { player: { name: { contains: query, mode: "insensitive" as const } } },
            { brand: { name: { contains: query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(availability ? { availability } : {}),
    ...(rarity ? { rarity } : {}),
    ...(playerId ? { playerId } : {}),
    ...(brandId ? { brandId } : {}),
  } satisfies Prisma.ArtifactWhereInput;

  const [artifacts, players, brands, totalCount, publishedCount, draftCount, certificateCount] =
    await Promise.all([
      prisma.artifact.findMany({
    include: {
      player: true,
      brand: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
      certificate: {
        select: {
          id: true,
          code: true,
          verified: true,
        },
      },
    },
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.player.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      prisma.artifact.count(),
      prisma.artifact.count({ where: { status: "PUBLISHED" } }),
      prisma.artifact.count({ where: { status: "DRAFT" } }),
      prisma.certificate.count(),
    ]);

  const hasActiveFilters = Boolean(
    query || status || availability || playerId || brandId || rarity,
  );

  return (
    <AdminShell
      title="Artifacts"
      description="Manage the complete AGE202 digital archive."
    >
      <div className="space-y-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-100/65">
              <Archive className="h-4 w-4" aria-hidden="true" />
              Museum catalog
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The AGE202 collection
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Catalog, publish and preserve every piece of tennis history from
              one central workspace.
            </p>
          </div>

          <Link
            href="/admin/artifacts/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-200/70 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Artifact
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Total archive
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {totalCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/50">
                <Box className="h-5 w-5" aria-hidden="true" />
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
                <Eye className="h-5 w-5" aria-hidden="true" />
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
                <Pencil className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Certificates
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {certificateCount}
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-200/15 bg-yellow-200/10 p-3 text-yellow-100">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </AdminPanel>
        </div>

        <AdminPanel className="p-5 sm:p-6">
          <form className="space-y-4" method="get">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Inventory filters
                </div>
                <p className="mt-2 text-sm text-white/45">
                  Search and narrow the catalog without changing the archive structure.
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href="/admin/artifacts"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Clear filters
                </Link>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <label className="relative md:col-span-2 xl:col-span-2">
                <span className="sr-only">Search artifacts</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Title, archive no., player, tournament..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/35 focus:bg-white/[0.05]"
                />
              </label>

              <select name="status" defaultValue={status ?? ""} className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35">
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select name="availability" defaultValue={availability ?? ""} className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35">
                <option value="">All availability</option>
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="COMING_SOON">Coming soon</option>
                <option value="NOT_FOR_SALE">Not for sale</option>
              </select>

              <select name="player" defaultValue={playerId} className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35">
                <option value="">All players</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>

              <select name="brand" defaultValue={brandId} className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35">
                <option value="">All brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <select name="rarity" defaultValue={rarity ?? ""} className="h-11 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35 sm:min-w-48">
                <option value="">All rarities</option>
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="VERY_RARE">Very rare</option>
                <option value="LEGENDARY">Legendary</option>
              </select>

              <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200">
                <Search className="h-4 w-4" aria-hidden="true" />
                Apply filters
              </button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Archive inventory
              </h3>
              <p className="mt-1 text-sm text-white/40">
                Most recently added artifacts appear first.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-white/35">
              <Sparkles className="h-4 w-4 text-yellow-100/60" aria-hidden="true" />
              {artifacts.length} of {totalCount} catalog entries
            </div>
          </div>

          {artifacts.length > 0 ? (
            <div className="divide-y divide-white/10">
              {artifacts.map((artifact) => {
                const coverImage = artifact.images[0];

                return (
                  <article
                    key={artifact.id}
                    className="group grid gap-5 px-5 py-5 transition hover:bg-white/[0.025] sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(170px,0.7fr)_minmax(180px,0.75fr)_auto] lg:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#08111F] sm:h-24 sm:w-24">
                        {coverImage ? (
                          <Image
                            src={coverImage.url}
                            alt={coverImage.alt ?? artifact.title}
                            fill
                            sizes="96px"
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(190,242,100,0.08),transparent_65%)] text-white/25">
                            <ImageIcon className="h-6 w-6" aria-hidden="true" />
                            <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em]">
                              No media
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <AdminBadge tone={getStatusTone(artifact.status)} dot>
                            {formatLabel(artifact.status)}
                          </AdminBadge>

                          {artifact.featured ? (
                            <AdminBadge tone="museum">Featured</AdminBadge>
                          ) : null}
                        </div>

                        <h4 className="mt-3 truncate text-base font-semibold text-white sm:text-lg">
                          {artifact.title}
                        </h4>

                        <p className="mt-1 truncate text-sm text-white/45">
                          {artifact.player.name} · {artifact.brand.name}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35">
                          <span className="font-mono text-yellow-100/60">
                            {artifact.archiveNumber}
                          </span>
                          {artifact.year ? <span>{artifact.year}</span> : null}
                          <span>{formatLabel(artifact.category)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                        Marketplace
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <AdminBadge
                          tone={getAvailabilityTone(artifact.availability)}
                          dot
                        >
                          {formatLabel(artifact.availability)}
                        </AdminBadge>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                        <CircleDollarSign
                          className="h-4 w-4 text-white/30"
                          aria-hidden="true"
                        />
                        {formatPrice(artifact.price, artifact.currency)}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                        Archive certificate
                      </p>

                      {artifact.certificate ? (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-white/75">
                            <ShieldCheck
                              className="h-4 w-4 text-yellow-100/70"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {artifact.certificate.code}
                            </span>
                          </div>

                          <p
                            className={[
                              "mt-2 text-xs",
                              artifact.certificate.verified
                                ? "text-emerald-300"
                                : "text-amber-300",
                            ].join(" ")}
                          >
                            {artifact.certificate.verified
                              ? "Verified certificate"
                              : "Verification pending"}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-white/35">Not issued</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      {artifact.slug ? (
                        <Link
                          href={`/archive/${artifact.slug}`}
                          aria-label={`View ${artifact.title}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : null}
<Link
  href={`/admin/artifacts/${artifact.id}/dashboard`}
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-lime-300/20 bg-lime-300/10 px-4 py-2.5 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/20"
>
  Dashboard
  <ChevronRight
    className="h-4 w-4"
    aria-hidden="true"
  />
</Link>
                      <Link
                        href={`/admin/artifacts/${artifact.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                      >
                        Edit
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      <DeleteArtifactButton
                        artifactId={artifact.id}
                        artifactTitle={artifact.title}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState
              title={hasActiveFilters ? "No matching artifacts" : "No artifacts yet"}
              description={
                hasActiveFilters
                  ? "Try adjusting or clearing the current inventory filters."
                  : "Create the first catalog entry and start building the AGE202 digital tennis museum."
              }
              actionLabel={hasActiveFilters ? "Clear Filters" : "Create First Artifact"}
              actionHref={hasActiveFilters ? "/admin/artifacts" : "/admin/artifacts/new"}
            />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
