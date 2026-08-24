"use client";

import {
  ImageIcon,
  ImagePlus,
  Images,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type GalleryItem = {
  url: string;
  alt: string;
  caption: string;
  localPreview: string | null;
};

export type LegendGalleryInitialItem = {
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
};

type GallerySectionProps = {
  initialImages?: LegendGalleryInitialItem[];
};

const MAX_IMAGES = 7;
const MIN_COMPLETE = 6;

const createEmptyItem = (): GalleryItem => ({
  url: "",
  alt: "",
  caption: "",
  localPreview: null,
});

function createInitialItems(
  initialImages: LegendGalleryInitialItem[],
): GalleryItem[] {
  return Array.from(
    { length: MAX_IMAGES },
    (_, index) => {
      const image =
        initialImages[index];

      if (!image) {
        return createEmptyItem();
      }

      return {
        url:
          image.url ?? "",
        alt:
          image.alt ?? "",
        caption:
          image.caption ?? "",
        localPreview: null,
      };
    },
  );
}

export default function GallerySection({
  initialImages = [],
}: GallerySectionProps) {
  const [items, setItems] =
    useState<GalleryItem[]>(
      () =>
        createInitialItems(
          initialImages.slice(
            0,
            MAX_IMAGES,
          ),
        ),
    );

  useEffect(() => {
    return () => {
      for (const item of items) {
        if (item.localPreview) {
          URL.revokeObjectURL(
            item.localPreview,
          );
        }
      }
    };
  }, [items]);

  const filledCount =
    useMemo(
      () =>
        items.filter(
          (item) =>
            item.url.trim().length > 0 ||
            Boolean(item.localPreview),
        ).length,
      [items],
    );

  function updateItem(
    index: number,
    patch: Partial<GalleryItem>,
  ) {
    setItems((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                ...patch,
              }
            : item,
      ),
    );
  }

  function handleFileChange(
    index: number,
    file: File | null,
  ) {
    setItems((current) =>
      current.map(
        (item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          if (item.localPreview) {
            URL.revokeObjectURL(
              item.localPreview,
            );
          }

          return {
            ...item,
            localPreview:
              file
                ? URL.createObjectURL(
                    file,
                  )
                : null,
          };
        },
      ),
    );
  }

  function clearItem(
    index: number,
  ) {
    setItems((current) =>
      current.map(
        (item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          if (item.localPreview) {
            URL.revokeObjectURL(
              item.localPreview,
            );
          }

          return createEmptyItem();
        },
      ),
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Images className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend gallery
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Defining career moments
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Add between six and seven photographs that visually tell the
          legend&apos;s story. Upload directly from your computer or keep a
          manual public URL as fallback.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
              Gallery progress
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {filledCount}/{MAX_IMAGES}
            </p>
          </div>

          <span
            className={[
              "rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em]",
              filledCount >= MIN_COMPLETE
                ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200"
                : "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
            ].join(" ")}
          >
            {filledCount >= MIN_COMPLETE
              ? "Gallery complete"
              : `Minimum ${MIN_COMPLETE} images`}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {items.map(
          (item, index) => {
            const slotNumber =
              index + 1;

            const previewUrl =
              item.localPreview ??
              item.url;

            return (
              <article
                key={slotNumber}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101D]/55"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#050B18]">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <div className="text-center">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                          <ImageIcon className="size-6 text-white/20" />
                        </div>

                        <p className="mt-3 text-xs font-semibold text-white/30">
                          Gallery slot {slotNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#050B18]/80 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/60 backdrop-blur">
                    Photo {slotNumber}
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                      Upload from PC
                    </span>

                    <div className="mt-2.5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300/25 bg-lime-300/[0.035] px-5 py-5 text-center transition hover:border-lime-300/40 hover:bg-lime-300/[0.055]">
                      <span className="grid size-10 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                        <ImagePlus className="size-4.5" />
                      </span>

                      <span className="mt-3 text-sm font-semibold text-white">
                        Choose gallery image
                      </span>

                      <span className="mt-1.5 text-xs leading-5 text-white/35">
                        Registered automatically in the AGE202 Media Library.
                      </span>

                      <input
                        type="file"
                        name={`galleryFile${slotNumber}`}
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(event) =>
                          handleFileChange(
                            index,
                            event.target.files?.[0] ??
                              null,
                          )
                        }
                        className="mt-4 block w-full cursor-pointer rounded-2xl border border-white/10 bg-[#050B18] px-3 py-3 text-xs text-white/55 file:mr-3 file:rounded-xl file:border-0 file:bg-lime-300 file:px-3 file:py-2 file:text-xs file:font-black file:text-[#050B18] hover:file:bg-lime-200"
                      />
                    </div>
                  </label>

                  <Field
                    label="Manual image URL"
                  >
                    <input
                      name={`galleryImage${slotNumber}`}
                      type="url"
                      value={item.url}
                      placeholder="https://..."
                      onChange={(event) =>
                        updateItem(
                          index,
                          {
                            url:
                              event.target.value,
                          },
                        )
                      }
                      className={inputClasses}
                    />
                  </Field>

                  <Field
                    label="Alt text"
                  >
                    <input
                      name={`galleryAlt${slotNumber}`}
                      value={item.alt}
                      placeholder="Describe the image for accessibility"
                      onChange={(event) =>
                        updateItem(
                          index,
                          {
                            alt:
                              event.target.value,
                          },
                        )
                      }
                      className={inputClasses}
                    />
                  </Field>

                  <Field
                    label="Caption"
                  >
                    <textarea
                      name={`galleryCaption${slotNumber}`}
                      rows={3}
                      value={item.caption}
                      placeholder="Optional short caption..."
                      onChange={(event) =>
                        updateItem(
                          index,
                          {
                            caption:
                              event.target.value,
                          },
                        )
                      }
                      className={textareaClasses}
                    />
                  </Field>

                  <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                      <Plus className="size-3.5" />
                      Order {slotNumber}
                    </div>

                    {previewUrl ||
                    item.alt ||
                    item.caption ? (
                      <button
                        type="button"
                        onClick={() =>
                          clearItem(
                            index,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-200/65 transition hover:border-red-300/20 hover:bg-red-300/[0.05] hover:text-red-200"
                      >
                        <Trash2 className="size-3.5" />
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5">
        <p className="text-sm font-semibold text-white/80">
          Gallery direction
        </p>

        <p className="mt-1 text-xs leading-6 text-white/35">
          Six strong images are enough; the seventh is optional. Every uploaded
          file follows the same Supabase + Media Library pipeline used by the
          Tournament Studio.
        </p>
      </div>
    </section>
  );
}

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

const textareaClasses =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <div className="mt-2.5">
        {children}
      </div>
    </label>
  );
}