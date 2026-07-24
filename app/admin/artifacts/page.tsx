import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatLabel(
  value: string | null,
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
  currency: string | null,
): string {
  if (!value) {
    return "—";
  }

  const amount = Number(
    value.toString(),
  );

  if (!Number.isFinite(amount)) {
    return `${value.toString()} ${currency ?? ""}`.trim();
  }

  try {
    return new Intl.NumberFormat(
      "it-IT",
      {
        style: "currency",
        currency:
          currency?.trim() || "EUR",
      },
    ).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? "EUR"}`;
  }
}

function getStatusClasses(
  status: string,
): string {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "DRAFT":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "ARCHIVED":
      return "border-white/10 bg-white/[0.06] text-white/55";

    default:
      return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  }
}

function getAvailabilityClasses(
  availability: string,
): string {
  switch (availability) {
    case "AVAILABLE":
      return "text-emerald-300";

    case "SOLD":
      return "text-rose-300";

    case "COMING_SOON":
      return "text-amber-300";

    default:
      return "text-white/55";
  }
}

export default async function ArtifactsPage() {
  const artifacts =
    await prisma.artifact.findMany({
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

  return (
    <AdminShell
      title="Artifacts"
      description="Manage the complete AGE202 digital archive."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/45">
              Total artifacts
            </p>

            <p className="mt-1 text-3xl font-semibold text-white">
              {artifacts.length}
            </p>
          </div>

          <Link
            href="/admin/artifacts/new"
            className="inline-flex items-center justify-center rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            New Artifact
          </Link>
        </div>

        {artifacts.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Artifact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Player / Brand
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Marketplace
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Certificate
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {artifacts.map(
                    (artifact) => {
                      const coverImage =
                        artifact.images[0];

                      return (
                        <tr
                          key={artifact.id}
                          className="transition hover:bg-white/[0.03]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex min-w-[240px] items-center gap-4">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                                {coverImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={
                                      coverImage.url
                                    }
                                    alt={
                                      coverImage.alt ??
                                      artifact.title
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-white/25">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-white">
                                  {
                                    artifact.title
                                  }
                                </p>

                                <p className="mt-1 truncate text-sm text-white/40">
                                  {
                                    artifact.archiveNumber
                                  }
                                </p>

                                {artifact.year ? (
                                  <p className="mt-1 text-xs text-white/30">
                                    {
                                      artifact.year
                                    }
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="min-w-[150px]">
                              <p className="text-sm font-medium text-white/75">
                                {
                                  artifact.player
                                    .name
                                }
                              </p>

                              <p className="mt-1 text-xs text-white/40">
                                {
                                  artifact.brand
                                    .name
                                }
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="min-w-[130px]">
                              <p className="text-sm text-white/70">
                                {formatLabel(
                                  artifact.category,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {formatLabel(
                                  artifact.rarity,
                                )}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="min-w-[140px]">
                              <p
                                className={[
                                  "text-sm font-medium",
                                  getAvailabilityClasses(
                                    artifact.availability,
                                  ),
                                ].join(" ")}
                              >
                                {formatLabel(
                                  artifact.availability,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-white/40">
                                {formatPrice(
                                  artifact.price,
                                  artifact.currency,
                                )}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="min-w-[150px]">
                              {artifact.certificate ? (
                                <>
                                  <p className="text-sm font-medium text-white/75">
                                    {
                                      artifact
                                        .certificate
                                        .code
                                    }
                                  </p>

                                  <p
                                    className={[
                                      "mt-1 text-xs",
                                      artifact
                                        .certificate
                                        .verified
                                        ? "text-emerald-300"
                                        : "text-amber-300",
                                    ].join(" ")}
                                  >
                                    {artifact
                                      .certificate
                                      .verified
                                      ? "Verified"
                                      : "Pending verification"}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-white/35">
                                  Not issued
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                                getStatusClasses(
                                  artifact.status,
                                ),
                              ].join(" ")}
                            >
                              {formatLabel(
                                artifact.status,
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex min-w-[150px] items-center justify-end gap-2">
                              <Link
                                href={`/admin/artifacts/${artifact.id}`}
                                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                              >
                                Edit
                              </Link>

                              {artifact.slug ? (
                                <Link
                                  href={`/archive/${artifact.slug}`}
                                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                                >
                                  View
                                </Link>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-white">
              No artifacts yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              Create the first artifact and start
              building the AGE202 digital museum.
            </p>

            <Link
              href="/admin/artifacts/new"
              className="mt-6 inline-flex rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              Create First Artifact
            </Link>
          </div>
        )}
      </div>
    </AdminShell>
  );
}