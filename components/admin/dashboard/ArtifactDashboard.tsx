"use client";

import {
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  ExternalLink,
  FileBadge2,
  FolderKanban,
  ImageIcon,
  Medal,
  PackageCheck,
  Pencil,
  ScrollText,
  ShieldCheck,
  Shirt,
  Sparkles,
  Tag,
  Trophy,
  UserRound,
} from "lucide-react";

import EntityDashboardHero from "./EntityDashboardHero";
import EntityQuickActions from "./EntityQuickActions";
import EntityStatCard from "./EntityStatCard";
import ArtifactGallery from "./ArtifactGallery";

import type {
  ArtifactDashboardData,
} from "@/lib/types/artifact-dashboard";

type ArtifactDashboardProps = {
  artifact: ArtifactDashboardData;
};

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

function formatDate(
  value: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(value);
}

function formatPrice(
  value: string | null,
  currency: string,
): string {
  if (!value) {
    return "Not priced";
  }

  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue,
    )
  ) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    },
  ).format(numericValue);
}

export default function ArtifactDashboard({
  artifact,
}: ArtifactDashboardProps) {
  const coverImage =
    artifact.images.find(
      (image) =>
        image.isCover,
    ) ??
    artifact.images[0] ??
    null;

  const image =
    coverImage?.url ??
    artifact.player.heroImage ??
    artifact.player.portraitImage ??
    null;

  const subtitle =
    [
      artifact.player.name,
      artifact.brand.name,
      artifact.year
        ? String(
            artifact.year,
          )
        : null,
    ]
      .filter(Boolean)
      .join(" · ");

  const editHref =
    `/admin/artifacts/${artifact.id}`;

  const publicHref =
    `/artifacts/${artifact.slug}`;

  return (
    <div className="space-y-7">
      <EntityDashboardHero
        title={artifact.title}
        subtitle={
          artifact.subtitle ??
          subtitle
        }
        image={image}
        badge={
          <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em] text-lime-200">
            {formatLabel(
              artifact.rarity,
            )}
          </span>
        }
        status={
          <span
            className={[
              "rounded-full border px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em]",
              artifact.status ===
              "PUBLISHED"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : artifact.status ===
                    "ARCHIVED"
                  ? "border-white/10 bg-white/[0.05] text-white/45"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-200",
            ].join(" ")}
          >
            {formatLabel(
              artifact.status,
            )}
          </span>
        }
        meta={
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <HeroMetric
              icon={Trophy}
              label="Player"
              value={
                artifact.player.name
              }
            />

            <HeroMetric
              icon={Shirt}
              label="Category"
              value={formatLabel(
                artifact.category,
              )}
            />

            <HeroMetric
              icon={CalendarClock}
              label="Last update"
              value={formatDate(
                artifact.updatedAt,
              )}
            />
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <a
              href={editHref}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Pencil
                className="h-4 w-4"
                aria-hidden="true"
              />
              Edit Artifact
            </a>

            <a
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              <ExternalLink
                className="h-4 w-4"
                aria-hidden="true"
              />
              Public Page
            </a>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EntityStatCard
          icon={ImageIcon}
          value={
            artifact.stats
              .imageCount
          }
          label="Images"
          description="Media assets currently attached to this museum artifact."
          tone="info"
        />

        <EntityStatCard
          icon={ScrollText}
          value={
            `${artifact.stats.storyBlocks}/4`
          }
          label="Story Blocks"
          description="Editorial sections completed across the museum record."
          tone="museum"
        />

        <EntityStatCard
          icon={ShieldCheck}
          value={
            artifact.stats
              .hasCertificate
              ? "Yes"
              : "No"
          }
          label="Certificate"
          description="Digital authenticity certificate linked to the artifact."
          tone={
            artifact.stats
              .hasCertificate
              ? "success"
              : "warning"
          }
        />

        <EntityStatCard
          icon={PackageCheck}
          value={formatLabel(
            artifact.availability,
          )}
          label="Availability"
          description="Current archive and marketplace availability."
          tone={
            artifact.availability ===
            "AVAILABLE"
              ? "success"
              : artifact.availability ===
                  "SOLD"
                ? "danger"
                : "neutral"
          }
        />
      </div>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EntityQuickActions
          title="Artifact tools"
          description="Open the most important workflows connected to this museum object."
          columns={2}
          actions={[
            {
              label:
                "Edit Artifact",
              href: editHref,
              icon: Pencil,
              description:
                "Update museum data, media, pricing and publishing status.",
              tone: "museum",
            },
            {
              label:
                "Public Page",
              href: publicHref,
              icon:
                ExternalLink,
              description:
                "Open the public museum page in a new tab.",
              tone: "success",
              external: true,
            },
            {
              label:
                "Player Profile",
              href:
                `/admin/players/${artifact.player.id}/dashboard`,
              icon: UserRound,
              description:
                "Open the dashboard of the connected player.",
              tone: "info",
              badge: (
                <QuickBadge>
                  {
                    artifact.player
                      .name
                  }
                </QuickBadge>
              ),
            },
            {
              label:
                "Museum Collections",
              href:
                `/admin/collections?artifactId=${artifact.id}`,
              icon:
                FolderKanban,
              description:
                "Review exhibitions and collections containing this artifact.",
              tone:
                "warning",
            },
            {
              label:
                "Certificate",
              href:
                artifact.certificate
                  ? `/admin/certificates/${artifact.certificate.id}`
                  : `/admin/certificates/new?artifactId=${artifact.id}`,
              icon:
                FileBadge2,
              description:
                artifact.certificate
                  ? "Review the existing digital certificate."
                  : "Create an authenticity certificate for this artifact.",
              tone:
                artifact.certificate
                  ? "success"
                  : "neutral",
              badge: (
                <QuickBadge>
                  {artifact.certificate
                    ? artifact.certificate
                        .code
                    : "Not created"}
                </QuickBadge>
              ),
            },
            {
              label:
                "Vinted Listing",
              href:
                artifact.vintedUrl ??
                "#",
              icon:
                CircleDollarSign,
              description:
                artifact.vintedUrl
                  ? "Open the connected marketplace listing."
                  : "No marketplace URL is currently connected.",
              tone:
                artifact.vintedUrl
                  ? "museum"
                  : "neutral",
              external:
                Boolean(
                  artifact.vintedUrl,
                ),
            },
          ]}
        />

        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <Sparkles
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
                Museum record
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Artifact overview
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <ActivityRow
              icon={Tag}
              label="Archive number"
              value={
                artifact.archiveNumber
              }
            />

            <ActivityRow
              icon={Medal}
              label="Condition"
              value={formatLabel(
                artifact.condition,
              )}
            />

            <ActivityRow
              icon={BadgeCheck}
              label="Authenticity"
              value={
                artifact.authentic
                  ? artifact.authenticityCode ??
                    "Verified"
                  : "Not verified"
              }
            />

            <ActivityRow
              icon={CircleDollarSign}
              label="Price"
              value={formatPrice(
                artifact.price,
                artifact.currency,
              )}
            />

            <ActivityRow
              icon={CalendarClock}
              label="Created"
              value={formatDate(
                artifact.createdAt,
              )}
            />
          </div>

          {artifact.curatorNote ? (
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/25">
                Curator note
              </p>

              <p className="mt-2 text-sm leading-6 text-white/45">
                {
                  artifact.curatorNote
                }
              </p>
            </div>
          ) : null}
        </section>
      </div>
      <ArtifactGallery
  images={artifact.images}
/>
    </div>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon
        className="h-4 w-4 text-white/25"
        aria-hidden="true"
      />

      <p className="mt-3 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function QuickBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex max-w-full truncate rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
      {children}
    </span>
  );
}

function ActivityRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08111F] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className="h-4 w-4 shrink-0 text-white/25"
          aria-hidden="true"
        />

        <span className="truncate text-xs text-white/40">
          {label}
        </span>
      </div>

      <span className="max-w-[55%] truncate text-right text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}