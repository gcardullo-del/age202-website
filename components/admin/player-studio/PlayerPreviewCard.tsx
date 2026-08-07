"use client";

import Image from "next/image";

import {
  Crown,
  FolderKanban,
  ImageIcon,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import PlayerArchiveQuality from "./preview/PlayerArchiveQuality";

export type PlayerPreviewData = {
  name: string;
  nickname?: string | null;
  country?: string | null;
  heroImage?: string | null;
  portraitImage?: string | null;
  accent?: string | null;
  collectionType?: string | null;
  ranking?: number | null;
  points?: number | null;
  artifactCount?: number;
  collectionCount?: number;
  atpTitles?: number;
  grandSlams?: number;
  active?: boolean;
};

type PlayerPreviewCardProps = {
  player: PlayerPreviewData;
};

function getInitials(
  name: string,
): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "AP";
  }

  return parts
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function getReadableTextColor(
  hexColor: string,
): string {
  const normalized = hexColor
    .replace("#", "")
    .trim();

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      normalized,
    )
  ) {
    return "#050B18";
  }

  const red = Number.parseInt(
    normalized.slice(0, 2),
    16,
  );

  const green = Number.parseInt(
    normalized.slice(2, 4),
    16,
  );

  const blue = Number.parseInt(
    normalized.slice(4, 6),
    16,
  );

  const luminance =
    (0.299 * red +
      0.587 * green +
      0.114 * blue) /
    255;

  return luminance > 0.58
    ? "#050B18"
    : "#FFFFFF";
}

function calculateArchiveQuality(
  player: PlayerPreviewData,
): {
  score: number;
  missingItems: string[];
} {
  const missingItems: string[] = [];

  let score = 0;

  if (player.name.trim()) {
    score += 18;
  } else {
    missingItems.push(
      "Add the player name.",
    );
  }

  if (player.country?.trim()) {
    score += 8;
  } else {
    missingItems.push(
      "Add the player country.",
    );
  }

  if (player.nickname?.trim()) {
    score += 6;
  } else {
    missingItems.push(
      "Add a nickname or signature quote.",
    );
  }

  if (player.heroImage) {
    score += 18;
  } else if (player.portraitImage) {
    score += 10;
    missingItems.push(
      "Add a dedicated Hero image.",
    );
  } else {
    missingItems.push(
      "Add a Hero or Portrait image.",
    );
  }

  if (player.ranking) {
    score += 14;
  } else {
    missingItems.push(
      "Connect an ATP ranking record.",
    );
  }

  if (
    (player.atpTitles ?? 0) > 0 ||
    (player.grandSlams ?? 0) > 0
  ) {
    score += 12;
  } else {
    missingItems.push(
      "Add career titles or Grand Slam data.",
    );
  }

  if (
    (player.artifactCount ?? 0) > 0
  ) {
    score += 10;
  } else {
    missingItems.push(
      "Connect at least one Artifact.",
    );
  }

  if (
    (player.collectionCount ?? 0) > 0
  ) {
    score += 10;
  } else {
    missingItems.push(
      "Connect at least one Museum Collection.",
    );
  }

  if (
    player.active !== false
  ) {
    score += 4;
  } else {
    missingItems.push(
      "Activate the public player profile.",
    );
  }

  return {
    score: Math.min(
      score,
      100,
    ),
    missingItems,
  };
}

export default function PlayerPreviewCard({
  player,
}: PlayerPreviewCardProps) {
  const name =
    player.name.trim() ||
    "New Player";

  const accent =
    player.accent?.trim() ||
    "#C8FF00";

  const heroImage =
    player.heroImage ??
    player.portraitImage ??
    null;

  const textColor =
    getReadableTextColor(accent);

  const collectionType =
    player.collectionType ??
    "ARCHIVE";

  const archiveQuality =
    calculateArchiveQuality(
      player,
    );

  return (
    <aside className="border-t border-white/10 bg-[#07101D]/60 p-5 xl:border-l xl:border-t-0 xl:p-6">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
        Digital player card
      </p>

      <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#050B18]">
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={{
            background:
              `radial-gradient(circle at 50% 18%, ${accent}24, transparent 38%), linear-gradient(145deg, #0A1425, #050B18)`,
          }}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt={name}
              fill
              sizes="330px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div
                  className="mx-auto grid h-24 w-24 place-items-center rounded-full border text-3xl font-black"
                  style={{
                    borderColor:
                      `${accent}55`,
                    backgroundColor:
                      `${accent}14`,
                    color: accent,
                  }}
                >
                  {getInitials(name)}
                </div>

                <ImageIcon className="mx-auto mt-5 h-5 w-5 text-white/20" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/10 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em] backdrop-blur"
              style={{
                borderColor:
                  `${accent}55`,
                backgroundColor:
                  `${accent}18`,
                color: accent,
              }}
            >
              {formatLabel(
                collectionType,
              )}
            </span>

            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/50 backdrop-blur">
              {player.active === false
                ? "Inactive"
                : "Active"}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p
              className="text-[8px] font-black uppercase tracking-[0.2em]"
              style={{
                color: accent,
              }}
            >
              {player.ranking
                ? `ATP #${player.ranking}`
                : "AGE202 Player Archive"}
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
              {name}
            </h2>

            <p className="mt-3 text-xs text-white/45">
              {player.country ??
                "International"}
            </p>
          </div>
        </div>

        <div className="p-5">
          {player.nickname ? (
            <p className="text-sm italic leading-6 text-white/55">
              “{player.nickname}”
            </p>
          ) : (
            <p className="text-sm text-white/30">
              Add a nickname or quote to enrich the profile.
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <PreviewMetric
              icon={Trophy}
              label="ATP Titles"
              value={
                player.atpTitles ?? 0
              }
            />

            <PreviewMetric
              icon={Crown}
              label="Grand Slams"
              value={
                player.grandSlams ??
                0
              }
            />

            <PreviewMetric
              icon={UserRound}
              label="Artifacts"
              value={
                player.artifactCount ??
                0
              }
            />

            <PreviewMetric
              icon={FolderKanban}
              label="Collections"
              value={
                player.collectionCount ??
                0
              }
            />
          </div>

          <div className="mt-5">
            <PlayerArchiveQuality
              score={
                archiveQuality.score
              }
              missingItems={
                archiveQuality.missingItems
              }
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
            <div>
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.15em] text-white/25">
                ATP points
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {player.points ??
                  "Not linked"}
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.15em]"
              style={{
                backgroundColor:
                  accent,
                color: textColor,
              }}
            >
              <Sparkles
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
              Player profile
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

type PreviewMetricProps = {
  icon: typeof Trophy;
  label: string;
  value: number;
};

function PreviewMetric({
  icon: Icon,
  label,
  value,
}: PreviewMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <Icon
        className="h-4 w-4 text-white/25"
        aria-hidden="true"
      />

      <p className="mt-3 text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/25">
        {label}
      </p>
    </div>
  );
}