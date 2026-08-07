"use client";

import {
  AlertTriangle,
  Check,
  Star,
} from "lucide-react";

export type ArchiveQualityLevel =
  | "draft"
  | "developing"
  | "established"
  | "excellent"
  | "museum-ready";

type PlayerArchiveQualityProps = {
  score: number;
  missingItems?: string[];
  compact?: boolean;
};

function clampScore(
  value: number,
): number {
  return Math.min(
    Math.max(
      Math.round(value),
      0,
    ),
    100,
  );
}

function getQualityLevel(
  score: number,
): {
  level: ArchiveQualityLevel;
  label: string;
  stars: number;
  description: string;
} {
  if (score >= 90) {
    return {
      level: "museum-ready",
      label: "Museum Ready",
      stars: 5,
      description:
        "The player profile meets the premium AGE202 museum standard.",
    };
  }

  if (score >= 75) {
    return {
      level: "excellent",
      label: "Excellent",
      stars: 4,
      description:
        "The profile is strong and needs only minor editorial improvements.",
    };
  }

  if (score >= 55) {
    return {
      level: "established",
      label: "Established",
      stars: 3,
      description:
        "The archive profile is useful but still has important gaps.",
    };
  }

  if (score >= 30) {
    return {
      level: "developing",
      label: "Developing",
      stars: 2,
      description:
        "Core player information exists, but the profile needs enrichment.",
    };
  }

  return {
    level: "draft",
    label: "Draft",
    stars: 1,
    description:
      "The player record requires more identity, media and archive content.",
  };
}

export default function PlayerArchiveQuality({
  score,
  missingItems = [],
  compact = false,
}: PlayerArchiveQualityProps) {
  const safeScore =
    clampScore(score);

  const quality =
    getQualityLevel(
      safeScore,
    );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-lime-200/70">
            Archive quality
          </p>

          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              {quality.label}
            </h3>

            <span className="font-mono text-[9px] font-black text-white/35">
              {safeScore}/100
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              className={[
                "h-3.5 w-3.5",
                index <
                quality.stars
                  ? "fill-lime-300 text-lime-300"
                  : "text-white/12",
              ].join(" ")}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-lime-300 transition-[width] duration-500 motion-reduce:transition-none"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>

      {!compact ? (
        <>
          <p className="mt-3 text-xs leading-5 text-white/35">
            {quality.description}
          </p>

          {missingItems.length > 0 ? (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className="h-3.5 w-3.5 text-amber-200"
                  aria-hidden="true"
                />

                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-200">
                  Improve next
                </p>
              </div>

              <ul className="mt-3 space-y-2">
                {missingItems
                  .slice(0, 4)
                  .map(
                    (
                      item,
                      index,
                    ) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-2 text-xs leading-5 text-white/40"
                      >
                        <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-white/10">
                          <Check className="h-2.5 w-2.5 text-white/25" />
                        </span>

                        {item}
                      </li>
                    ),
                  )}
              </ul>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-emerald-200">
              <Check
                className="h-4 w-4"
                aria-hidden="true"
              />
              No critical archive gaps detected.
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}