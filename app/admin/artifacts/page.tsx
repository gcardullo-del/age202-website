import {
  Archive,
  BadgeCheck,
  Box,
  ChevronRight,
  CircleDollarSign,
  Eye,
  ImageIcon,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
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

export default async function ArtifactsPage() {
  const artifacts = await prisma.artifact.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedCount = artifacts.filter(
    (artifact) => artifact.status === "PUBLISHED",
  ).length;
  const draftCount = artifacts.filter(
    (artifact) => artifact.status === "DRAFT",
  ).length;
  const certificateCount = artifacts.filter(
    (artifact) => artifact.certificate,
  ).length;

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
                  {artifacts.length}
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
              {artifacts.length} catalog entries
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
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverImage.url}
                            alt={coverImage.alt ?? artifact.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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
                        href={`/admin/artifacts/${artifact.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                      >
                        Edit
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState
              title="No artifacts yet"
              description="Create the first catalog entry and start building the AGE202 digital tennis museum."
              actionLabel="Create First Artifact"
              actionHref="/admin/artifacts/new"
            />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
