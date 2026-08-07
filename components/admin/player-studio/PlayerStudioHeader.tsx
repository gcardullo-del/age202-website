"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";

type PlayerStudioHeaderProps = {
  mode: "create" | "edit";
  playerName: string;
  playerStatus?: string | null;
  previewHref?: string | null;
  submitLabel?: string;
  backHref?: string;
};

export default function PlayerStudioHeader({
  mode,
  playerName,
  playerStatus,
  previewHref,
  submitLabel,
  backHref = "/admin/players",
}: PlayerStudioHeaderProps) {
  const isEditing =
    mode === "edit";

  const resolvedTitle =
    playerName.trim() ||
    (isEditing
      ? "Edit Player"
      : "Create Player");

  const resolvedSubmitLabel =
    submitLabel ??
    (isEditing
      ? "Save changes"
      : "Create Player");

  return (
    <header className="border-b border-white/10 px-5 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-lime-200">
              <Sparkles
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {isEditing
                ? "Player workspace"
                : "New player"}
            </span>

            {playerStatus ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/50">
                {playerStatus.replaceAll(
                  "_",
                  " ",
                )}
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex min-w-0 items-start gap-3">
            <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-lime-200">
              <UserRound
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                {resolvedTitle}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                {isEditing
                  ? "Manage the complete AGE202 player record, public profile and archive connections."
                  : "Create a new player identity and prepare the initial AGE202 archive profile."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={backHref}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />
            Players
          </Link>

          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              <Eye
                className="h-4 w-4"
                aria-hidden="true"
              />
              Preview
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-2xl border border-white/5 px-4 text-sm font-semibold text-white/20"
            >
              <Eye
                className="h-4 w-4"
                aria-hidden="true"
              />
              Preview
            </button>
          )}

          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Save
              className="h-4 w-4"
              aria-hidden="true"
            />
            {resolvedSubmitLabel}
          </button>
        </div>
      </div>
    </header>
  );
}