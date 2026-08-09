"use client";

import {
  CheckCircle2,
  CircleDotDashed,
} from "lucide-react";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

export default function ArtifactSaveStatus() {
  const {
    isDirty,
    mode,
  } = useArtifactStudio();

  if (isDirty) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-3 py-1 text-xs font-semibold text-amber-200">
        <CircleDotDashed
          className="h-3.5 w-3.5"
          aria-hidden="true"
        />

        Unsaved changes
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1 text-xs font-semibold text-emerald-200">
      <CheckCircle2
        className="h-3.5 w-3.5"
        aria-hidden="true"
      />

      {mode === "edit"
        ? "Saved"
        : "Ready"}
    </span>
  );
}