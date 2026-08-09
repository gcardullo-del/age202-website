"use client";

import {
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  useState,
  useSyncExternalStore,
} from "react";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

function subscribeToClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function ArtifactDraftRecoveryBanner() {
  const isClient =
    useSyncExternalStore(
      subscribeToClient,
      getClientSnapshot,
      getServerSnapshot,
    );

  const [
    dismissed,
    setDismissed,
  ] = useState(false);

  const {
    getLocalDraftInfo,
    restoreLocalDraft,
    clearLocalDraft,
  } = useArtifactStudio();

  if (
    !isClient ||
    dismissed
  ) {
    return null;
  }

  const draftInfo =
    getLocalDraftInfo();

  if (!draftInfo) {
    return null;
  }

  const savedAt =
    new Intl.DateTimeFormat(
      "it-IT",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(
      new Date(
        draftInfo.savedAt,
      ),
    );

  function handleRestore() {
    const restored =
      restoreLocalDraft();

    if (restored) {
      setDismissed(true);
    }
  }

  function handleDiscard() {
    clearLocalDraft();
    setDismissed(true);
  }

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-amber-300/20 bg-amber-300/[0.055]">
      <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            Local draft found
          </p>

          <p className="mt-2 text-sm leading-6 text-white/55">
            AGE202 found an unsaved local draft from{" "}
            <span className="font-semibold text-white/80">
              {savedAt}
            </span>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <Trash2
              className="h-4 w-4"
              aria-hidden="true"
            />
            Discard
          </button>

          <button
            type="button"
            onClick={handleRestore}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-200 px-4 py-2.5 text-sm font-semibold text-[#151006] transition hover:bg-amber-100"
          >
            <RotateCcw
              className="h-4 w-4"
              aria-hidden="true"
            />
            Restore draft
          </button>
        </div>
      </div>
    </div>
  );
}