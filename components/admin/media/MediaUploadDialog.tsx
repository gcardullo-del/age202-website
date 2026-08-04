"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import type { MediaFolder } from "@/generated/prisma/client";
import { uploadMediaAssets } from "@/app/admin/media/actions";

type FolderWithCount = MediaFolder & { _count: { assets: number } };

export default function MediaUploadDialog({
  open,
  onClose,
  folders,
}: {
  open: boolean;
  onClose: () => void;
  folders: FolderWithCount[];
}) {
  if (!open) return null;

  return (
    <div
      id="upload-media"
      className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form action={uploadMediaAssets} className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#08111F] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
              Media Library upload
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Upload images
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Add up to 20 reusable images in one operation.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-white/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300/25 bg-lime-300/[0.035] px-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-lime-300/10 text-lime-200">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="mt-4 text-sm font-semibold text-white">
            Choose images
          </span>
          <span className="mt-2 text-xs leading-5 text-white/35">
            JPG, PNG, WEBP or AVIF. Multiple selection supported.
          </span>
          <input
            type="file"
            name="files"
            required
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
          />
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <select name="folderId" className="h-12 rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white/70 outline-none">
            <option value="">Unfiled</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>

          <input name="tags" placeholder="Common tags: Federer, Nike..." className="h-12 rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none" />
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] hover:bg-lime-200">
            <Upload className="h-4 w-4" />
            Upload to library
          </button>
        </div>
      </form>
    </div>
  );
}
