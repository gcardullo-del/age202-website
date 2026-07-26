import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Archive,
  Sparkles,
  Trophy,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { getOtherPlayers } from "@/lib/repositories/player.repository";

export const metadata: Metadata = {
  title: "Other Players | AGE202",
  description:
    "Explore the growing AGE202 archive dedicated to tennis players beyond the five principal champion galleries.",
};

type OtherPlayer = Awaited<
  ReturnType<typeof getOtherPlayers>
>[number];

type PlayerCollectionType =
  | "LEGEND"
  | "RISING_STAR"
  | "ARCHIVE";

type PlayerGroup = {
  type: PlayerCollectionType;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  icon: typeof Trophy;
};

const playerGroups: PlayerGroup[] = [
  {
    type: "LEGEND",
    eyebrow: "Historical champions",
    title: "Tennis Legends",
    description:
      "Players whose achievements, style and influence helped define previous eras of professional tennis.",
    emptyMessage:
      "No tennis legends have been published in the extended archive yet.",
    icon: Trophy,
  },
  {
    type: "RISING_STAR",
    eyebrow: "The next generation",
    title: "Rising Stars",
    description:
      "Emerging champions and active tour players shaping the next chapter of the sport.",
    emptyMessage:
      "No rising stars have been published in the extended archive yet.",
    icon: Sparkles,
  },
  {
    type: "ARCHIVE",
    eyebrow: "Extended collection",
    title: "Archive Players",
    description:
      "Additional players represented through authenticated garments, memorabilia and historical references.",
    emptyMessage:
      "No additional archive players have been published yet.",
    icon: Archive,
  },
];

export default async function OtherPlayersPage() {
  const players = await getOtherPlayers();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <OtherPlayersHero totalPlayers={players.length} />

      <section
        aria-labelledby="other-players-collections"
        className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
                Expanding collection
              </p>

              <h2
                id="other-players-collections"
                className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
              >
                Beyond the principal galleries
              </h2>
            </div>

            <ArchiveCount count={players.length} />
          </div>

          {players.length > 0 ? (
            <div className="mt-20 space-y-24 lg:mt-28 lg:space-y-32">
              {playerGroups.map((group) => {
                const groupPlayers = players.filter(
                  (player) =>
                    player.collectionType === group.type
                );

                return (
                  <PlayerCollection
                    key={group.type}
                    group={group}
                    players={groupPlayers}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyArchive />
          )}
        </div>
      </section>

      <ReturnToPlayers />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

type OtherPlayersHeroProps = {
  totalPlayers: number;
};

function OtherPlayersHero({
  totalPlayers,
}: OtherPlayersHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(215,255,0,0.11),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_45%,transparent_80%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <Link
          href="/players"
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/35 transition hover:text-[#D7FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF00]/60"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Players
        </Link>

        <div className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#D7FF00]">
          <span
            aria-hidden="true"
            className="h-px w-9 bg-[#D7FF00] shadow-[0_0_14px_rgba(215,255,0,0.7)]"
          />

          Extended players archive
        </div>

        <div className="mt-9 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25">
              AGE202 collection · Other players
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.84] tracking-[-0.065em] sm:text-7xl lg:text-[112px]">
              Other
              <span className="block text-white/22">
                Players
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
              An expanding gallery of authentic tennis apparel, memorabilia
              and historical records connected to players beyond the five
              principal AGE202 champion collections.
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:items-end">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#D7FF00]/35 bg-[#D7FF00]/[0.06] text-[#D7FF00] sm:h-28 sm:w-28">
              <UserRoundSearch
                size={38}
                strokeWidth={1.35}
                aria-hidden="true"
              />
            </div>

            <div className="border-t border-white/10 pt-5 lg:text-right">
              <span className="block text-4xl font-black tracking-[-0.05em] text-white">
                {String(totalPlayers).padStart(2, "0")}
              </span>

              <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                Published player records
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COLLECTION
========================================================= */

type PlayerCollectionProps = {
  group: PlayerGroup;
  players: OtherPlayer[];
};

function PlayerCollection({
  group,
  players,
}: PlayerCollectionProps) {
  const Icon = group.icon;

  return (
    <section aria-labelledby={`group-${group.type}`}>
      <div className="grid gap-7 border-b border-white/10 pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7FF00]/25 bg-[#D7FF00]/[0.05] text-[#D7FF00]">
              <Icon
                size={17}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>

            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#D7FF00]">
              {group.eyebrow}
            </p>
          </div>

          <h3
            id={`group-${group.type}`}
            className="mt-5 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl lg:text-5xl"
          >
            {group.title}
          </h3>
        </div>

        <div className="lg:text-right">
          <p className="text-sm leading-7 text-white/45">
            {group.description}
          </p>

          <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
            {players.length}{" "}
            {players.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      {players.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.018] px-6 py-12 text-center">
          <p className="font-mono text-[9px] uppercase leading-6 tracking-[0.2em] text-white/25">
            {group.emptyMessage}
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   PLAYER CARD
========================================================= */

type PlayerCardProps = {
  player: OtherPlayer;
  index: number;
};

function PlayerCard({
  player,
  index,
}: PlayerCardProps) {
  const image =
    player.heroImage ??
    player.portraitImage ??
    null;

  const artifactCount = player._count.artifacts;

  return (
    <article className="group relative min-h-[520px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#09111f] transition duration-500 hover:-translate-y-1 hover:border-[#D7FF00]/35">
      {image ? (
        <Image
          src={image}
          alt={player.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.035]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(215,255,0,0.08),transparent_45%)]">
          <Users
            size={64}
            strokeWidth={0.8}
            className="text-white/10"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#020711] via-[#020711]/45 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#020711]/55 via-transparent to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#D7FF00]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <CollectionBadge
          type={player.collectionType}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <div className="flex flex-wrap gap-2">
          {player.country ? (
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
              {player.country}
            </span>
          ) : null}

          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
            {artifactCount}{" "}
            {artifactCount === 1
              ? "artifact"
              : "artifacts"}
          </span>
        </div>

        <h4 className="mt-5 text-3xl font-black uppercase leading-[0.9] tracking-[-0.045em] text-white sm:text-4xl">
          {player.name}
        </h4>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/50">
          {player.biography ??
            "A player record preserved within the expanding AGE202 digital tennis archive."}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
            AGE202 player record
          </span>

          <span
            aria-label="Individual player gallery not yet available"
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[7px] font-black uppercase tracking-[0.16em] text-white/35"
          >
            Archive record
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COLLECTION BADGE
========================================================= */

type CollectionBadgeProps = {
  type: OtherPlayer["collectionType"];
};

function CollectionBadge({
  type,
}: CollectionBadgeProps) {
  const labels: Partial<
    Record<OtherPlayer["collectionType"], string>
  > = {
    LEGEND: "Legend",
    RISING_STAR: "Rising star",
    ARCHIVE: "Archive",
  };

  return (
    <span className="rounded-full border border-[#D7FF00]/25 bg-black/30 px-3 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#D7FF00] backdrop-blur-md">
      {labels[type] ?? "Player"}
    </span>
  );
}

/* =========================================================
   ARCHIVE COUNT
========================================================= */

type ArchiveCountProps = {
  count: number;
};

function ArchiveCount({
  count,
}: ArchiveCountProps) {
  return (
    <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D7FF00]/10 text-[#D7FF00]">
        <Users size={14} aria-hidden="true" />
      </span>

      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
        {count} {count === 1 ? "player" : "players"}
      </span>
    </div>
  );
}

/* =========================================================
   EMPTY ARCHIVE
========================================================= */

function EmptyArchive() {
  return (
    <div className="mt-20 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-7 py-20 text-center sm:px-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D7FF00]/25 bg-[#D7FF00]/[0.05] text-[#D7FF00]">
        <UserRoundSearch
          size={27}
          strokeWidth={1.3}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-7 text-2xl font-black uppercase tracking-[-0.035em] sm:text-3xl">
        The extended archive is being prepared
      </h3>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
        Other Players will appear here as new authenticated records and
        collectible artifacts are published in the AGE202 database.
      </p>
    </div>
  );
}

/* =========================================================
   RETURN TO PLAYERS
========================================================= */

function ReturnToPlayers() {
  return (
    <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.028] p-8 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(215,255,0,0.09),transparent_30%)]"
          />

          <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D7FF00]">
                AGE202 player galleries
              </p>

              <h2 className="mt-5 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                Return to all players
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">
                Explore the five principal champion galleries and continue
                through the wider AGE202 players archive.
              </p>
            </div>

            <Link
              href="/players"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#D7FF00] px-6 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-[#050B18] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF00]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050B18]"
            >
              All players
              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}