"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";

import { useFormStatus } from "react-dom";

type StudioSaveState =
  | "saved"
  | "unsaved"
  | "error";

type StudioSaveBarProps = {
  state?: StudioSaveState;

  saveLabel?: string;
  savingLabel?: string;

  previewHref?: string;

  onReset?: () => void;

  className?: string;
};

const stateConfig = {
  saved: {
    label: "Saved",
    icon: CheckCircle2,
    className:
      "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200",
  },

  unsaved: {
    label: "Unsaved changes",
    icon: AlertCircle,
    className:
      "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
  },

  error: {
    label: "Save error",
    icon: AlertCircle,
    className:
      "border-red-300/20 bg-red-300/[0.07] text-red-200",
  },
} as const;

export default function StudioSaveBar({
  state = "saved",
  saveLabel = "Save changes",
  savingLabel = "Saving...",
  previewHref,
  onReset,
  className = "",
}: StudioSaveBarProps) {
  const {
    pending,
  } = useFormStatus();

  const config =
    stateConfig[state];

  const StateIcon =
    config.icon;

  return (
    <div
      className={[
        "sticky bottom-4 z-40 mx-4 mb-4 rounded-2xl border border-white/10 bg-[#060D1A]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={[
            "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2",
            config.className,
          ].join(" ")}
        >
          <StateIcon
            className="h-4 w-4"
            aria-hidden="true"
          />

          <span className="text-[10px] font-black uppercase tracking-[0.16em]">
            {config.label}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {previewHref ? (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Eye className="h-4 w-4" />

              Preview
            </a>
          ) : null}

          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />

              Reset
            </button>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-[#050B18] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />

                {savingLabel}
              </>
            ) : (
              <>
                <Save
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                {saveLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}