"use client";

import { Star, Trash2 } from "lucide-react";

export type ImageCardData = {
  id: string;
  src: string;
  name: string;
  size?: number;
  isCover: boolean;
  isExisting: boolean;
};

type ImageCardProps = {
  image: ImageCardData;
  index: number;
  onSelectCover: (id: string) => void;
  onRemove: (id: string) => void;
};

function formatFileSize(size?: number) {
  if (size === undefined) {
    return null;
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCard({
  image,
  index,
  onSelectCover,
  onRemove,
}: ImageCardProps) {
  return (
    <article
      className={[
        "overflow-hidden rounded-3xl border bg-[#08111F] transition",
        image.isCover
          ? "border-lime-300/50 shadow-[0_0_0_1px_rgba(190,242,100,0.08)]"
          : "border-white/10",
      ].join(" ")}
    >
      <div className="relative aspect-square overflow-hidden bg-white/[0.03]">
        <img
          src={image.src}
          alt={image.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#050B18]/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          Image {index + 1}
        </div>

        {image.isExisting && (
          <div className="absolute bottom-3 left-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-300 backdrop-blur">
            Existing
          </div>
        )}

        {image.isCover && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-semibold text-[#050B18]">
            <Star
              size={13}
              fill="currentColor"
            />

            Cover
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div className="min-w-0">
          <p
            className="truncate text-sm font-medium text-white/80"
            title={image.name}
          >
            {image.name}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-white/35">
            {formatFileSize(image.size) && (
              <span>{formatFileSize(image.size)}</span>
            )}

            <span>
              {image.isExisting
                ? "Already uploaded"
                : "New image"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              onSelectCover(image.id)
            }
            disabled={image.isCover}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              image.isCover
                ? "cursor-default bg-lime-300 text-[#08111F]"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <Star
              size={16}
              fill={
                image.isCover
                  ? "currentColor"
                  : "none"
              }
            />

            {image.isCover
              ? "Cover image"
              : "Set as cover"}
          </button>

          <button
            type="button"
            onClick={() =>
              onRemove(image.id)
            }
            aria-label={`Remove ${image.name}`}
            title={`Remove ${image.name}`}
            className="rounded-xl bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}