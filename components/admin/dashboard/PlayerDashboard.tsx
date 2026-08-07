"use client";

import {
  Archive,
  CalendarClock,
  Crown,
  ExternalLink,
  FolderKanban,
  History,
  Medal,
  Pencil,
  Shirt,
  Sparkles,
  Trophy,
} from "lucide-react";

import EntityDashboardHero from "./EntityDashboardHero";
import EntityQuickActions from "./EntityQuickActions";
import EntityStatCard from "./EntityStatCard";
import PlayerTimeline from "./PlayerTimeline";

import type {
  PlayerDashboardData,
} from "@/lib/types/player-dashboard";

type PlayerDashboardProps = {
  player: PlayerDashboardData;
};

function formatCollectionType(
  value: PlayerDashboardData["collectionType"],
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

function getRankingMovement(
  rank: number,
  previousRank: number | null,
): string {
  if (
    previousRank === null ||
    previousRank === rank
  ) {
    return "No change";
  }

  const difference =
    previousRank - rank;

  return difference > 0
    ? `Up ${difference}`
    : `Down ${Math.abs(difference)}`;
}

export default function PlayerDashboard({
  player,
}: PlayerDashboardProps) {
  const image =
    player.heroImage ??
    player.portraitImage ??
    player.ranking?.imageUrl ??
    null;

  const subtitle =
    [
      player.country,
      player.nickname
        ? `“${player.nickname}”`
        : null,
    ]
      .filter(Boolean)
      .join(" · ") ||
    "AGE202 Player Archive";

  const publicHref =
    `/players/${player.slug}`;

  const editHref =
    `/admin/players/${player.id}`;

  return (
    <div className="space-y-7">
      <EntityDashboardHero
        title={player.name}
        subtitle={subtitle}
        image={image}
        badge={
          <span
            className="rounded-full border px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em]"
            style={{
              borderColor:
                `${player.accent}55`,
              backgroundColor:
                `${player.accent}18`,
              color:
                player.accent,
            }}
          >
            {formatCollectionType(
              player.collectionType,
            )}
          </span>
        }
        status={
          <span
            className={[
              "rounded-full border px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em]",
              player.active
                ? player.publishedAt
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-lime-300/20 bg-lime-300/10 text-lime-200"
                : "border-red-400/20 bg-red-400/10 text-red-200",
            ].join(" ")}
          >
            {player.active
              ? player.publishedAt
                ? "Published"
                : "Active"
              : "Inactive"}
          </span>
        }
        meta={
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <HeroMetric
              icon={Trophy}
              label="ATP Ranking"
              value={
                player.ranking
                  ? `#${player.ranking.rank}`
                  : "Not linked"
              }
            />

            <HeroMetric
              icon={Medal}
              label="Career High"
              value={
                player.profile
                  ?.careerHigh
                  ? `#${player.profile.careerHigh}`
                  : "Not recorded"
              }
            />

            <HeroMetric
              icon={CalendarClock}
              label="Last Update"
              value={formatDate(
                player.updatedAt,
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

              Edit Player
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
          icon={Trophy}
          value={
            player.profile
              ?.atpTitles ??
            0
          }
          label="ATP Titles"
          description="Tour-level titles recorded in the Player Profile."
          tone="museum"
          trend={
            player.ranking ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
                {getRankingMovement(
                  player.ranking.rank,
                  player.ranking
                    .previousRank,
                )}
              </span>
            ) : null
          }
        />

        <EntityStatCard
          icon={Crown}
          value={
            player.profile
              ?.grandSlams ??
            0
          }
          label="Grand Slams"
          description="Major singles titles connected to this archive profile."
          tone="warning"
        />

        <EntityStatCard
          icon={Shirt}
          value={
            player.stats.artifacts
          }
          label="Artifacts"
          description="Museum artifacts currently connected to this player."
          tone="info"
        />

        <EntityStatCard
          icon={FolderKanban}
          value={
            player.stats.collections
          }
          label="Collections"
          description="Museum exhibitions and archive collections featuring this player."
          tone="success"
        />
      </div>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EntityQuickActions
          title="Player tools"
          description="Open the most important AGE202 workflows connected to this player."
          columns={2}
          actions={[
            {
              label:
                "Edit Player",
              href: editHref,
              icon: Pencil,
              description:
                "Update identity, career, SEO and publishing data.",
              tone: "museum",
            },
            {
              label:
                "Public Page",
              href: publicHref,
              icon:
                ExternalLink,
              description:
                "Open the public archive profile in a new tab.",
              tone: "success",
              external: true,
            },
            {
              label:
                "Artifacts",
              href:
                `/admin/artifacts?playerId=${player.id}`,
              icon: Shirt,
              description:
                "Review objects and apparel connected to this player.",
              tone: "info",
              badge: (
                <QuickBadge>
                  {
                    player.stats
                      .artifacts
                  }{" "}
                  linked
                </QuickBadge>
              ),
            },
            {
              label:
                "Museum Collections",
              href:
                `/admin/collections?playerId=${player.id}`,
              icon:
                FolderKanban,
              description:
                "Explore exhibitions and collection relationships.",
              tone:
                "warning",
              badge: (
                <QuickBadge>
                  {
                    player.stats
                      .collections
                  }{" "}
                  linked
                </QuickBadge>
              ),
            },
          ]}
        />

        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <History
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
                Archive activity
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Player overview
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <ActivityRow
              icon={Sparkles}
              label="Career events"
              value={
                player.stats
                  .careerEvents
              }
            />

            <ActivityRow
              icon={Archive}
              label="Archive created"
              value={formatDate(
                player.createdAt,
              )}
            />

            <ActivityRow
              icon={CalendarClock}
              label="Last updated"
              value={formatDate(
                player.updatedAt,
              )}
            />

            <ActivityRow
              icon={Trophy}
              label="ATP points"
              value={
                player.ranking
                  ?.points
                  ?.toLocaleString(
                    "en-US",
                  ) ??
                "Not linked"
              }
            />
          </div>

          {player.quote ? (
            <blockquote className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm italic leading-6 text-white/45">
                “{player.quote}”
              </p>
            </blockquote>
          ) : null}
        </section>
      </div>

      <PlayerTimeline
        player={player}
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
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
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

      <span className="shrink-0 text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}