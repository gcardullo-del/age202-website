"use client";


import AgeImage from "@/components/media/AgeImage";

import {
  BadgeCheck,
  Gem,
  ImageIcon,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react";

export type ArtifactCardData = {
  title: string;

  subtitle?: string | null;

  archiveNumber?: string | null;

  year?: number | string | null;

  tournament?: string | null;

  collection?: string | null;

  playerName?: string | null;

  brandName?: string | null;

  category?: string | null;

  rarity?: string | null;

  condition?: string | null;

  availability?: string | null;

  price?: string | number | null;

  currency?: string | null;

  authentic?: boolean;

  vintage?: boolean;

  featured?: boolean;

  status?: string | null;

  coverImage?: string | null;

  cardImage?: string | null;
};

type ArtifactCardProps = {
  artifact: ArtifactCardData;
};

function formatEnum(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
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
    | string
    | number
    | null
    | undefined,
  currency:
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not priced";
  }

  const numericValue =
    typeof value === "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(
      numericValue,
    )
  ) {
    return String(value);
  }

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          currency || "EUR",
        maximumFractionDigits: 2,
      },
    ).format(
      numericValue,
    );
  } catch {
    return `${numericValue.toLocaleString(
      "en-US",
    )} ${currency || "EUR"}`;
  }
}

function getStatusClasses(
  status:
    | string
    | null
    | undefined,
): string {
  switch (status) {
    case "PUBLISHED":
      return "border-lime-300/25 bg-lime-300/10 text-lime-200";

    case "ARCHIVED":
      return "border-amber-300/25 bg-amber-300/10 text-amber-200";

    case "DRAFT":
    default:
      return "border-white/15 bg-black/35 text-white/55";
  }
}

function getAvailabilityClasses(
  availability:
    | string
    | null
    | undefined,
): string {
  switch (availability) {
    case "AVAILABLE":
      return "text-lime-200";

    case "SOLD":
      return "text-amber-200";

    case "NOT_FOR_SALE":
      return "text-white/50";

    case "COMING_SOON":
    default:
      return "text-sky-200";
  }
}

export default function ArtifactCard({
  artifact,
}: ArtifactCardProps) {
  const title =
    artifact.title.trim() ||
    "Untitled Artifact";

  const displayImage =
    artifact.cardImage ??
    artifact.coverImage ??
    null;

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101F] shadow-[0_30px_90px_rgba(0,0,0,.35)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#050B18]">
        {displayImage ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-2xl"
              style={{
                backgroundImage: `url("${displayImage}")`,
              }}
            />

            <AgeImage
              src={displayImage}
              alt={title}
              fill
              preset="card"
              className="object-cover"
            />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.035]">
                <ImageIcon className="h-7 w-7 text-white/20" />
              </span>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/25">
                No cover image
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-black/25" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {artifact.featured ? (
            <PreviewBadge
              label="Featured"
              icon={Sparkles}
              tone="lime"
            />
          ) : null}

          {artifact.authentic ? (
            <PreviewBadge
              label="Authentic"
              icon={BadgeCheck}
              tone="emerald"
            />
          ) : null}

          {artifact.vintage ? (
            <PreviewBadge
              label="Vintage"
              icon={Gem}
              tone="amber"
            />
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-lime-200">
              {artifact.archiveNumber ||
                "AGE202 ARCHIVE"}
            </p>

            <span
              className={[
                "mt-2 inline-flex rounded-full border px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] backdrop-blur",
                getStatusClasses(
                  artifact.status,
                ),
              ].join(" ")}
            >
              {formatEnum(
                artifact.status ||
                  "DRAFT",
              )}
            </span>
          </div>

          {artifact.year ? (
            <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/70 backdrop-blur">
              {artifact.year}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
              AGE202 Digital Artifact
            </p>

            <h3 className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em] text-white">
              {title}
            </h3>

            {artifact.subtitle ? (
              <p className="mt-3 text-sm leading-6 text-white/40">
                {
                  artifact.subtitle
                }
              </p>
            ) : null}
          </div>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06] text-lime-200">
            <Trophy className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Metric
            label="Player"
            value={
              artifact.playerName ||
              "Unassigned"
            }
          />

          <Metric
            label="Brand"
            value={
              artifact.brandName ||
              "Unassigned"
            }
          />

          <Metric
            label="Tournament"
            value={
              artifact.tournament ||
              "—"
            }
          />

          <Metric
            label="Collection"
            value={
              artifact.collection ||
              "—"
            }
          />
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <div className="grid grid-cols-3 gap-3">
            <SmallMetric
              label="Category"
              value={formatEnum(
                artifact.category,
              )}
            />

            <SmallMetric
              label="Rarity"
              value={formatEnum(
                artifact.rarity,
              )}
            />

            <SmallMetric
              label="Condition"
              value={formatEnum(
                artifact.condition,
              )}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
                Marketplace
              </p>

              <p
                className={[
                  "mt-1 text-sm font-semibold",
                  getAvailabilityClasses(
                    artifact.availability,
                  ),
                ].join(" ")}
              >
                {formatEnum(
                  artifact.availability,
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
                Museum price
              </p>

              <p className="mt-1 text-sm font-semibold text-lime-200">
                {formatPrice(
                  artifact.price,
                  artifact.currency,
                )}
              </p>
            </div>

            <ShoppingBag className="h-4 w-4 shrink-0 text-white/20" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="font-mono text-[7px] font-black uppercase tracking-[0.15em] text-white/25">
              AGE202 Digital Museum
            </p>

            <p className="mt-1 text-[10px] font-semibold text-white/45">
              Permanent museum record
            </p>
          </div>

          {artifact.authentic ? (
            <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-emerald-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          ) : (
            <span className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
              Unverified
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-2 truncate text-xs font-semibold text-white/70">
        {value}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-semibold text-white/60">
        {value}
      </p>
    </div>
  );
}

type PreviewBadgeProps = {
  label: string;

  icon: typeof Sparkles;

  tone:
    | "lime"
    | "emerald"
    | "amber";
};

const badgeStyles = {
  lime:
    "border-lime-300/30 bg-lime-300/15 text-lime-100",

  emerald:
    "border-emerald-300/30 bg-emerald-300/15 text-emerald-100",

  amber:
    "border-amber-300/30 bg-amber-300/15 text-amber-100",
};

function PreviewBadge({
  label,
  icon: Icon,
  tone,
}: PreviewBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[7px] font-black uppercase tracking-[0.14em] backdrop-blur",
        badgeStyles[tone],
      ].join(" ")}
    >
      <Icon className="h-3 w-3" />

      {label}
    </span>
  );
}