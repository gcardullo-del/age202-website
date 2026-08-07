"use client";

import {
  CheckCircle2,
  CircleAlert,
  Eye,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
} from "react";

import PlayerStudioSection from "../PlayerStudioSection";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

type PublishingSectionProps = {
  publicBaseUrl?: string;
  previewHref?: string | null;
};

type PublishingCheck = {
  label: string;
  description: string;
  complete: boolean;
};

export default function PublishingSection({
  publicBaseUrl = "https://www.age202.com",
  previewHref = null,
}: PublishingSectionProps) {
  const {
    preview,
  } = usePlayerStudio();

  const checks =
    useMemo<PublishingCheck[]>(
      () => [
        {
          label: "Player identity",
          description:
            "A public display name and country are available.",
          complete:
            preview.name.trim().length >
              0 &&
            Boolean(
              preview.country?.trim(),
            ),
        },
        {
          label: "Archive media",
          description:
            "The profile includes a Hero or Portrait image.",
          complete: Boolean(
            preview.heroImage ||
              preview.portraitImage,
          ),
        },
        {
          label: "ATP connection",
          description:
            "A current or historic ATP ranking record is connected.",
          complete: Boolean(
            preview.ranking,
          ),
        },
        {
          label: "Career record",
          description:
            "Career titles or Grand Slam achievements are available.",
          complete:
            (preview.atpTitles ?? 0) >
              0 ||
            (preview.grandSlams ??
              0) > 0,
        },
        {
          label: "Museum relationships",
          description:
            "The player is connected to at least one Museum Collection.",
          complete:
            (preview.collectionCount ??
              0) > 0,
        },
        {
          label: "Public visibility",
          description:
            "The Player record is currently marked as active.",
          complete:
            preview.active !== false,
        },
      ],
      [preview],
    );

  const completedChecks =
    checks.filter(
      (check) =>
        check.complete,
    ).length;

  const readinessScore =
    Math.round(
      (completedChecks /
        checks.length) *
        100,
    );

  const readinessLabel =
    readinessScore === 100
      ? "Ready to publish"
      : readinessScore >= 70
        ? "Almost ready"
        : readinessScore >= 40
          ? "In progress"
          : "Needs attention";

  const resolvedPublicUrl =
    previewHref ??
    `${publicBaseUrl.replace(
      /\/$/,
      "",
    )}/players/${
      preview.name.trim()
        ? preview.name
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-",
            )
            .replace(
              /^-+|-+$/g,
              "",
            )
        : "new-player"
    }`;

  return (
    <PlayerStudioSection
      eyebrow="Publishing review"
      title="Publication readiness"
      description="Review the essential archive requirements before creating or publishing the public player profile."
      icon={Globe2}
      actions={
        <ReadinessBadge
          score={readinessScore}
          label={
            readinessLabel
          }
        />
      }
      summary={
        <PublishingSummary
          completed={
            completedChecks
          }
          total={checks.length}
          active={
            preview.active !== false
          }
        />
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {checks.map(
            (check) => (
              <PublishingCheckCard
                key={check.label}
                check={check}
              />
            ),
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <Eye
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
                Public destination
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Player profile URL
              </h3>

              <p className="mt-1 text-xs leading-5 text-white/35">
                This is the expected public destination after the Player record
                has been created.
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#08111F]">
                <p className="truncate px-4 py-3 font-mono text-xs text-white/45">
                  {resolvedPublicUrl}
                </p>
              </div>

              {previewHref ? (
                <a
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:border-lime-300/25 hover:bg-lime-300/[0.05] hover:text-lime-200"
                >
                  <Eye
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Open public preview
                </a>
              ) : (
                <p className="mt-4 text-xs leading-5 text-white/30">
                  Public preview becomes available after the Player has been
                  created and has a permanent slug.
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className={[
            "rounded-3xl border p-5 sm:p-6",
            readinessScore === 100
              ? "border-emerald-400/20 bg-emerald-400/[0.06]"
              : "border-amber-400/15 bg-amber-400/[0.05]",
          ].join(" ")}
        >
          <div className="flex items-start gap-4">
            <span
              className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border",
                readinessScore ===
                100
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-200",
              ].join(" ")}
            >
              {readinessScore ===
              100 ? (
                <ShieldCheck
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              ) : (
                <CircleAlert
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              )}
            </span>

            <div>
              <p className="text-sm font-semibold text-white">
                {readinessScore ===
                100
                  ? "Museum profile ready"
                  : "Complete the remaining archive checks"}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                {readinessScore ===
                100
                  ? "All essential publication requirements are currently satisfied."
                  : "You can still create the Player record, then return later to enrich missing content."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlayerStudioSection>
  );
}

type ReadinessBadgeProps = {
  score: number;
  label: string;
};

function ReadinessBadge({
  score,
  label,
}: ReadinessBadgeProps) {
  return (
    <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3">
      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/70">
        Readiness
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {score}%
      </p>

      <p className="mt-1 text-[10px] text-white/35">
        {label}
      </p>
    </div>
  );
}

type PublishingSummaryProps = {
  completed: number;
  total: number;
  active: boolean;
};

function PublishingSummary({
  completed,
  total,
  active,
}: PublishingSummaryProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Sparkles
          className="h-5 w-5 text-lime-200"
          aria-hidden="true"
        />

        <div>
          <p className="text-sm font-semibold text-white">
            {completed} of {total} checks complete
          </p>

          <p className="mt-1 text-xs text-white/35">
            Publication status updates automatically from the current Player
            Studio data.
          </p>
        </div>
      </div>

      <span
        className={[
          "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.14em]",
          active
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            : "border-amber-400/20 bg-amber-400/10 text-amber-200",
        ].join(" ")}
      >
        {active ? (
          <CheckCircle2
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        ) : (
          <CircleAlert
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        )}

        {active
          ? "Public profile active"
          : "Public profile inactive"}
      </span>
    </div>
  );
}

function PublishingCheckCard({
  check,
}: {
  check: PublishingCheck;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        check.complete
          ? "border-emerald-400/15 bg-emerald-400/[0.04]"
          : "border-white/10 bg-white/[0.015]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
            check.complete
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              : "border-white/10 bg-white/[0.04] text-white/25",
          ].join(" ")}
        >
          {check.complete ? (
            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />
          ) : (
            <CircleAlert
              className="h-4 w-4"
              aria-hidden="true"
            />
          )}
        </span>

        <div>
          <p className="text-sm font-semibold text-white">
            {check.label}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {check.description}
          </p>
        </div>
      </div>
    </div>
  );
}