
"use client";

import {
  FolderPlus,
  ImagePlus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

import type { MediaFolder } from "@/generated/prisma/client";
import type { MediaAssetWithFolder } from "@/lib/repositories/media.repository";

import {
  createMediaFolderAction,
} from "@/app/admin/media/actions";

import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPanel from "@/components/admin/ui/AdminPanel";

import MediaGrid from "./MediaGrid";
import MediaUploadDialog from "./MediaUploadDialog";

type FolderWithCount =
  MediaFolder & {
    _count: {
      assets: number;
    };
  };

type MediaLibraryProps = {
  assets: MediaAssetWithFolder[];
  folders: FolderWithCount[];
  query: string;
  folder: string;
  usage: string;
  type: string;
  hasActiveFilters: boolean;
};

export default function MediaLibrary({
  assets,
  folders,
  query,
  folder,
  usage,
  type,
  hasActiveFilters,
}: MediaLibraryProps) {
  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [folderOpen, setFolderOpen] =
    useState(false);

  return (
    <>
      <AdminPanel className="overflow-hidden">
        <form
          method="get"
          className="border-b border-white/10 p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                Library controls
              </p>

              <p className="mt-2 text-sm text-white/45">
                Search by title, filename,
                extension or tags.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {hasActiveFilters ? (
                <a
                  href="/admin/media"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />

                  Clear filters
                </a>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  setFolderOpen(true)
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/65 transition hover:bg-white/[0.05] hover:text-white"
              >
                <FolderPlus className="h-4 w-4" />

                New folder
              </button>

              <button
                type="button"
                onClick={() =>
                  setUploadOpen(true)
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <ImagePlus className="h-4 w-4" />

                Upload images
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_180px_auto]">
            <label className="relative md:col-span-2 xl:col-span-1">
              <span className="sr-only">
                Search media
              </span>

              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search media..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
              />
            </label>

            <select
              name="folder"
              defaultValue={folder}
              className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none"
            >
              <option value="">
                All folders
              </option>

              <option value="unfiled">
                Unfiled
              </option>

              {folders.map((entry) => (
                <option
                  key={entry.id}
                  value={entry.id}
                >
                  {entry.name} (
                  {entry._count.assets})
                </option>
              ))}
            </select>

            <select
              name="usage"
              defaultValue={usage}
              className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none"
            >
              <option value="">
                All usage
              </option>

              <option value="used">
                Used
              </option>

              <option value="unused">
                Unused
              </option>
            </select>

            <select
              name="type"
              defaultValue={type}
              className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none"
            >
              <option value="">
                All formats
              </option>

              <option value="images">
                Images
              </option>

              <option value="jpg">
                JPG
              </option>

              <option value="png">
                PNG
              </option>

              <option value="webp">
                WEBP
              </option>

              <option value="avif">
                AVIF
              </option>
            </select>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Search className="h-4 w-4" />

              Apply
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-white">
            {assets.length}{" "}
            {assets.length === 1
              ? "asset"
              : "assets"}
          </p>

          <p className="text-xs uppercase tracking-[0.16em] text-white/30">
            Newest first
          </p>
        </div>

        {assets.length > 0 ? (
          <MediaGrid
            assets={assets}
            folders={folders}
          />
        ) : hasActiveFilters ? (
          <AdminEmptyState
            title="No matching media"
            description="Adjust or clear the current search filters."
            actionLabel="Clear filters"
            actionHref="/admin/media"
            icon={ImagePlus}
          />
        ) : (
          <AdminEmptyState
            title="Your Media Library is empty"
            description="Upload the first reusable AGE202 image to start building the central asset library."
            actionLabel="Upload images"
            actionHref="#upload-media"
            icon={ImagePlus}
          />
        )}
      </AdminPanel>

      <MediaUploadDialog
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        folders={folders}
      />

      {folderOpen ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create media folder"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setFolderOpen(false);
            }
          }}
        >
          <form
            action={
              createMediaFolderAction
            }
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#08111F] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                  Organization
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  New media folder
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close folder dialog"
                onClick={() =>
                  setFolderOpen(false)
                }
                className="rounded-full border border-white/10 p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                name="name"
                required
                placeholder="Folder name"
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
              />

              <input
                name="slug"
                placeholder="Optional slug"
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
              />

              <textarea
                name="description"
                rows={4}
                placeholder="Optional description"
                className="w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <FolderPlus className="h-4 w-4" />

                Create folder
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}