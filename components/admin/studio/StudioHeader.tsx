import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  Eye,
  ExternalLink,
  Save,
} from "lucide-react";

type StudioHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;

  backHref?: string;

  previewHref?: string;

  publicHref?: string;

  saveSlot?: ReactNode;
};

export default function StudioHeader({
  eyebrow,
  title,
  description,
  backHref,
  previewHref,
  publicHref,
  saveSlot,
}: StudioHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#060D1A] px-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lime-300">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          ) : null}

          {previewHref ? (
            <Link
              href={previewHref}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <Eye size={16} />
              Preview
            </Link>
          ) : null}

          {publicHref ? (
            <Link
              href={publicHref}
              target="_blank"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <ExternalLink size={16} />
              Public Page
            </Link>
          ) : null}

          {saveSlot ?? (
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-bold text-[#050B18] transition hover:scale-[1.02]"
            >
              <Save size={16} />
              Save
            </button>
          )}
        </div>
      </div>
    </header>
  );
}