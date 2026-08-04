"use client";

import { Check, Clipboard, Eye, FolderOpen, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { MediaFolder } from "@/generated/prisma/client";
import type { MediaAssetWithFolder } from "@/lib/repositories/media.repository";
import {
  deleteMediaAssetAction,
  updateMediaAssetAction,
} from "@/app/admin/media/actions";

type FolderWithCount = MediaFolder & { _count: { assets: number } };

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function MediaCard({
  asset,
  folders,
}: {
  asset: MediaAssetWithFolder;
  folders: FolderWithCount[];
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(asset.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#08111F] transition hover:-translate-y-0.5 hover:border-lime-300/20">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="relative block aspect-square w-full overflow-hidden bg-[#050B18]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset.url} alt={asset.alt ?? asset.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
          <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <span className="rounded-full bg-black/60 p-3 text-white">
              <Eye className="h-5 w-5" />
            </span>
          </span>
          <span className={`absolute left-3 top-3 rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] ${
            asset.isUsed
              ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-200"
              : "border-amber-400/25 bg-amber-400/15 text-amber-200"
          }`}>
            {asset.isUsed ? "Used" : "Unused"}
          </span>
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white/65">
            {asset.extension}
          </span>
        </button>

        <div className="p-4">
          <h3 className="truncate text-sm font-semibold text-white">{asset.title}</h3>
          <p className="mt-1 truncate text-xs text-white/35">{asset.originalName}</p>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/35">
            <span>{formatBytes(asset.size)}</span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{asset.folder?.name ?? "Unfiled"}</span>
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={copyUrl} className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-semibold text-white/55 hover:bg-white/5 hover:text-white">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Clipboard className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy URL"}
            </button>

            <button type="button" onClick={() => setEditOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/50 hover:bg-white/5 hover:text-white">
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <form
              action={deleteMediaAssetAction}
              onSubmit={(event) => {
                if (!window.confirm(`Delete "${asset.title}" from Media Library and storage?`)) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={asset.id} />
              <button type="submit" className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/15 text-red-300/60 hover:bg-red-400/10 hover:text-red-200">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </article>

      {previewOpen ? (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPreviewOpen(false);
        }}>
          <button type="button" onClick={() => setPreviewOpen(false)} className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 p-3 text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw] text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.alt ?? asset.title} className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" />
            <p className="mt-4 text-sm text-white/70">{asset.title}</p>
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditOpen(false);
        }}>
          <form action={updateMediaAssetAction} className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#08111F] p-6 shadow-2xl">
            <input type="hidden" name="id" value={asset.id} />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">Asset metadata</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Edit media</h2>
              </div>
              <button type="button" onClick={() => setEditOpen(false)} className="rounded-full border border-white/10 p-2 text-white/50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input name="title" required defaultValue={asset.title} placeholder="Title" className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none" />
              <input name="alt" defaultValue={asset.alt ?? ""} placeholder="Alt text" className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none" />
              <input name="tags" defaultValue={asset.tags.join(", ")} placeholder="Tags separated by commas" className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none" />
              <select name="folderId" defaultValue={asset.folderId ?? ""} className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white/70 outline-none">
                <option value="">Unfiled</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050B18] px-4 py-4">
                <input type="checkbox" name="isUsed" defaultChecked={asset.isUsed} className="h-4 w-4 accent-lime-300" />
                <span className="text-sm font-semibold text-white">Mark as used</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] hover:bg-lime-200">
                <Check className="h-4 w-4" />
                Save metadata
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
