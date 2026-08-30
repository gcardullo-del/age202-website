import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  Archive,
  ExternalLink,
  Trash2,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import NextGenPlayerForm from "@/components/admin/next-gen/NextGenPlayerForm";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import {
  archiveNextGenPlayer,
} from "../actions/archiveNextGenPlayer";

import {
  deleteNextGenPlayer,
} from "../actions/deleteNextGenPlayer";

import {
  updateNextGenPlayer,
} from "../actions/updateNextGenPlayer";

export const dynamic =
  "force-dynamic";

type NextGenPlayerAdminPageProps = {
  params: Promise<{
    playerKey: string;
  }>;
};

function formatDateInput(
  value: Date | null,
): string {
  if (!value) {
    return "";
  }

  return value
    .toISOString()
    .slice(0, 10);
}

function formatRank(
  value: number | null,
): string {
  return value
    ? `#${value}`
    : "—";
}

export default async function NextGenPlayerAdminPage({
  params,
}: NextGenPlayerAdminPageProps) {
  await requireAdmin();

  const {
    playerKey,
  } = await params;

  const [
    player,
    ranking,
    mediaAssets,
  ] =
    await Promise.all([
      prisma.nextGenPlayer.findUnique({
        where: {
          playerKey,
        },
      }),

      prisma.nextGenRanking.findUnique({
        where: {
          playerKey,
        },
      }),

      getAllMedia({
        mimeType:
          "image/",
      }),
    ]);

  if (!player) {
    notFound();
  }

  const updateAction =
    updateNextGenPlayer.bind(
      null,
      player.playerKey,
    );

  const archiveAction =
    archiveNextGenPlayer.bind(
      null,
      player.playerKey,
    );

  const deleteAction =
    deleteNextGenPlayer.bind(
      null,
      player.playerKey,
    );

  return (
    <AdminShell
      title={player.name}
      description={`AGE202 NEXT GEN · ${String(
        player.archiveNumber,
      ).padStart(
        2,
        "0",
      )} · Edit archive dossier`}
    >
      <div className="w-full space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              ATP Rank
            </p>

            <p className="mt-3 text-2xl font-bold text-white">
              {formatRank(
                ranking?.currentRank ??
                  null,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Previous
            </p>

            <p className="mt-3 text-2xl font-bold text-white">
              {formatRank(
                ranking?.previousRank ??
                  null,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Career High
            </p>

            <p className="mt-3 text-2xl font-bold text-[#C8FF00]">
              {formatRank(
                ranking?.careerHighRank ??
                  null,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ranking Sync
            </p>

            <p className="mt-3 text-sm font-semibold text-white">
              {ranking?.lastSyncedAt
                ? ranking.lastSyncedAt.toLocaleString(
                    "it-IT",
                  )
                : "Awaiting first sync"}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            href="/admin/next-gen"
          >
            ← Back to NEXT GEN
          </Link>

          {player.atpProfileUrl ? (
            <a
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
              href={
                player.atpProfileUrl
              }
              rel="noreferrer"
              target="_blank"
            >
              ATP Profile
              <ExternalLink
                size={15}
              />
            </a>
          ) : null}
        </div>

        <NextGenPlayerForm
          action={
            updateAction
          }
          libraryAssets={
            mediaAssets
          }
          initialValues={{
            archiveNumber:
              player.archiveNumber,
            playerKey:
              player.playerKey,
            name:
              player.name,
            firstName:
              player.firstName,
            lastName:
              player.lastName,
            country:
              player.country,
            countryCode:
              player.countryCode,
            flag:
              player.flag,
            birthDate:
              formatDateInput(
                player.birthDate,
              ),
            birthPlace:
              player.birthPlace,
            plays:
              player.plays,
            backhand:
              player.backhand,
            story:
              player.story,
            highlights:
              player.highlights,
            portraitImage:
              player.portraitImage,
            portraitAlt:
              player.portraitAlt,
            atpProfileUrl:
              player.atpProfileUrl,
            contributionStatus:
              player.contributionStatus,
            contributionTitle:
              player.contributionTitle,
            contributionText:
              player.contributionText,
            contributionImage:
              player.contributionImage,
            contributionDate:
              formatDateInput(
                player.contributionDate,
              ),
            contributionSource:
              player.contributionSource,
            status:
              player.status,
            featured:
              player.featured,
          }}
          mode="edit"
        />

        <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.035] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Archive Player
              </p>

              <h2 className="mt-2 text-lg font-semibold text-white">
                Preserve the dossier without publishing it
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Archive keeps the player record in AGE202 but disables automatic ranking sync and removes it from published NEXT GEN content.
              </p>
            </div>

            <form
              action={
                archiveAction
              }
            >
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/30 px-5 text-sm font-bold text-amber-200 transition hover:bg-amber-400/10"
                type="submit"
              >
                <Archive
                  size={17}
                />
                Archive Player
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.035] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                Danger Zone
              </p>

              <h2 className="mt-2 text-lg font-semibold text-white">
                Permanently delete player
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                This permanently deletes both the NEXT GEN dossier and its automatic ranking record. Use Archive whenever you want to preserve the historical record.
              </p>
            </div>

            <form
              action={
                deleteAction
              }
            >
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                type="submit"
              >
                <Trash2
                  size={17}
                />
                Delete Permanently
              </button>
            </form>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
