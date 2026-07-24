"use client";

import { Eye, GripVertical, Star, Trash2 } from "lucide-react";

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
  onPreview: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnter: (id: string) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
};

function formatFileSize(size?: number) {
  if (size === undefined) return null;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCard({
  image,
  index,
  onSelectCover,
  onRemove,
  onPreview,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging = false,
}: ImageCardProps) {
  return (
    <article
      draggable
      onDragStart={() => onDragStart(image.id)}
      onDragEnter={(event) => {
        event.preventDefault();
        onDragEnter(image.id);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      className={`group overflow-hidden rounded-2xl border bg-[#08111F] transition ${
        isDragging ? "scale-[0.98] border-lime-300/60 opacity-55" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg bg-black/65 px-2 py-1 text-xs font-medium text-white/80 backdrop-blur">#{index + 1}</span>
          {image.isExisting && <span className="rounded-lg bg-black/65 px-2 py-1 text-xs text-white/65 backdrop-blur">Esistente</span>}
          {image.isCover && <span className="inline-flex items-center gap-1 rounded-lg bg-lime-300 px-2 py-1 text-xs font-semibold text-[#08111F]"><Star size={12} fill="currentColor" /> Copertina</span>}
        </div>
        <div className="absolute right-3 top-3 cursor-grab rounded-lg bg-black/65 p-2 text-white/65 backdrop-blur active:cursor-grabbing" title="Trascina per riordinare">
          <GripVertical size={17} />
        </div>
        <button type="button" onClick={() => onPreview(image.id)} className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/35 hover:opacity-100" aria-label={`Anteprima ${image.name}`}>
          <span className="inline-flex items-center gap-2 rounded-xl bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur"><Eye size={17} /> Anteprima</span>
        </button>
      </div>

      <div className="p-4">
        <p className="truncate text-sm font-medium text-white" title={image.name}>{image.name}</p>
        <p className="mt-1 text-xs text-white/40">{formatFileSize(image.size) ?? (image.isExisting ? "Già caricata" : "Nuova immagine")}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => onSelectCover(image.id)} disabled={image.isCover} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${image.isCover ? "cursor-default bg-lime-300 text-[#08111F]" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <Star size={16} /> {image.isCover ? "Copertina" : "Imposta copertina"}
          </button>
          <button type="button" onClick={() => onRemove(image.id)} aria-label={`Rimuovi ${image.name}`} title={`Rimuovi ${image.name}`} className="rounded-xl bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500/20 hover:text-red-300">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
