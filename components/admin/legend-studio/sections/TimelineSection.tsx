"use client";

import {
  CalendarRange,
  ImageIcon,
  ImagePlus,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TimelineItem = {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  localPreview: string | null;
};

export type LegendTimelineInitialItem = {
  year?: number | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  featured?: boolean | null;
};

type TimelineSectionProps = {
  initialMilestones?: LegendTimelineInitialItem[];
};

const MAX_MILESTONES = 7;

const createEmptyItem = (): TimelineItem => ({
  year: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  featured: false,
  localPreview: null,
});

function createInitialItems(
  initialMilestones: LegendTimelineInitialItem[],
): TimelineItem[] {
  return Array.from(
    { length: MAX_MILESTONES },
    (_, index) => {
      const milestone =
        initialMilestones[index];

      if (!milestone) {
        return createEmptyItem();
      }

      return {
        year:
          milestone.year === null ||
          milestone.year === undefined
            ? ""
            : String(milestone.year),
        title:
          milestone.title ?? "",
        subtitle:
          milestone.subtitle ?? "",
        description:
          milestone.description ?? "",
        imageUrl:
          milestone.imageUrl ?? "",
        featured:
          milestone.featured ?? false,
        localPreview: null,
      };
    },
  );
}

function isFilled(
  item: TimelineItem,
): boolean {
  return (
    item.year.trim().length > 0 &&
    item.title.trim().length > 0
  );
}

export default function TimelineSection({
  initialMilestones = [],
}: TimelineSectionProps) {
  const [items, setItems] =
    useState<TimelineItem[]>(
      () =>
        createInitialItems(
          initialMilestones.slice(
            0,
            MAX_MILESTONES,
          ),
        ),
    );

  const objectUrlsRef =
    useRef<Set<string>>(
      new Set(),
    );

  useEffect(() => {
    const objectUrls =
      objectUrlsRef.current;

    return () => {
      for (const url of objectUrls) {
        URL.revokeObjectURL(url);
      }

      objectUrls.clear();
    };
  }, []);

  const filledCount =
    useMemo(
      () =>
        items.filter(
          isFilled,
        ).length,
      [items],
    );

  function updateItem(
    index: number,
    patch: Partial<TimelineItem>,
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

  function revokePreview(
    preview: string | null,
  ) {
    if (!preview) {
      return;
    }

    URL.revokeObjectURL(
      preview,
    );

    objectUrlsRef.current.delete(
      preview,
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

          revokePreview(
            item.localPreview,
          );

          const localPreview =
            file
              ? URL.createObjectURL(
                  file,
                )
              : null;

          if (localPreview) {
            objectUrlsRef.current.add(
              localPreview,
            );
          }

          return {
            ...item,
            localPreview,
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

          revokePreview(
            item.localPreview,
          );

          return createEmptyItem();
        },
      ),
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <CalendarRange className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend timeline
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Career milestones & chronology
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Build a chronological path through the defining seasons,
          breakthroughs and historical moments of the legend. Each
          milestone can include a dedicated museum image and can be
          highlighted as featured.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
              Timeline progress
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {filledCount}/{MAX_MILESTONES}
            </p>
          </div>

          <span
            className={[
              "rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em]",
              filledCount === MAX_MILESTONES
                ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200"
                : filledCount > 0
                  ? "border-amber-300/20 bg-amber-300/[0.07] text-amber-200"
                  : "border-white/10 bg-white/[0.03] text-white/35",
            ].join(" ")}
          >
            {filledCount === MAX_MILESTONES
              ? "Timeline complete"
              : filledCount > 0
                ? `${filledCount}/${MAX_MILESTONES} milestones`
                : "No milestones yet"}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {items.map(
          (item, index) => {
            const slotNumber =
              index + 1;

            const previewUrl =
              item.localPreview ??
              item.imageUrl;

            const filled =
              isFilled(item);

            return (
              <article
                key={slotNumber}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101D]/55"
              >
                <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
                  <div className="relative min-h-56 overflow-hidden border-b border-white/10 bg-[#050B18] lg:min-h-full lg:border-b-0 lg:border-r">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt={
                          item.title ||
                          `Timeline milestone ${slotNumber}`
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                            <ImageIcon className="size-6 text-white/20" />
                          </div>

                          <p className="mt-3 text-xs font-semibold text-white/30">
                            Milestone {slotNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B18]/85 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-[#050B18]/80 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/60 backdrop-blur">
                        {String(slotNumber).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {item.featured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-lime-200 backdrop-blur">
                          <Star className="size-3" />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    {item.year ? (
                      <div className="absolute bottom-4 left-4">
                        <p className="text-4xl font-black tracking-[-0.05em] text-white">
                          {item.year}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
                      <Field
                        label="Year"
                      >
                        <input
                          name={`timelineYear${slotNumber}`}
                          type="number"
                          min={1800}
                          max={2100}
                          value={item.year}
                          placeholder="1969"
                          onChange={(event) =>
                            updateItem(
                              index,
                              {
                                year:
                                  event.target.value,
                              },
                            )
                          }
                          className={inputClasses}
                        />
                      </Field>

                      <Field
                        label="Title"
                      >
                        <input
                          name={`timelineTitle${slotNumber}`}
                          value={item.title}
                          placeholder="Second Calendar Grand Slam"
                          onChange={(event) =>
                            updateItem(
                              index,
                              {
                                title:
                                  event.target.value,
                              },
                            )
                          }
                          className={inputClasses}
                        />
                      </Field>
                    </div>

                    <Field
                      label="Subtitle"
                    >
                      <input
                        name={`timelineSubtitle${slotNumber}`}
                        value={item.subtitle}
                        placeholder="A season that made tennis history"
                        onChange={(event) =>
                          updateItem(
                            index,
                            {
                              subtitle:
                                event.target.value,
                            },
                          )
                        }
                        className={inputClasses}
                      />
                    </Field>

                    <Field
                      label="Description"
                    >
                      <textarea
                        name={`timelineDescription${slotNumber}`}
                        rows={5}
                        value={item.description}
                        placeholder="Explain why this season, match or achievement belongs in the historical timeline..."
                        onChange={(event) =>
                          updateItem(
                            index,
                            {
                              description:
                                event.target.value,
                            },
                          )
                        }
                        className={textareaClasses}
                      />
                    </Field>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                          Upload image from PC
                        </span>

                        <div className="mt-2.5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300/25 bg-lime-300/[0.035] px-5 py-5 text-center transition hover:border-lime-300/40 hover:bg-lime-300/[0.055]">
                          <span className="grid size-10 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                            <ImagePlus className="size-4.5" />
                          </span>

                          <span className="mt-3 text-sm font-semibold text-white">
                            Choose milestone image
                          </span>

                          <span className="mt-1.5 text-xs leading-5 text-white/35">
                            Optional. Uploaded through the AGE202 Media Library pipeline.
                          </span>

                          <input
                            type="file"
                            name={`timelineFile${slotNumber}`}
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

                      <div className="space-y-5">
                        <Field
                          label="Manual image URL"
                        >
                          <input
                            name={`timelineImage${slotNumber}`}
                            type="url"
                            value={item.imageUrl}
                            placeholder="https://..."
                            onChange={(event) =>
                              updateItem(
                                index,
                                {
                                  imageUrl:
                                    event.target.value,
                                },
                              )
                            }
                            className={inputClasses}
                          />
                        </Field>

                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4">
                          <span>
                            <span className="flex items-center gap-2 text-xs font-semibold text-white/70">
                              <Sparkles className="size-4 text-lime-300/70" />
                              Featured milestone
                            </span>

                            <span className="mt-1 block text-[11px] leading-5 text-white/30">
                              Highlight this event as one of the defining moments of the career.
                            </span>
                          </span>

                          <input
                            type="checkbox"
                            name={`timelineFeatured${slotNumber}`}
                            checked={item.featured}
                            onChange={(event) =>
                              updateItem(
                                index,
                                {
                                  featured:
                                    event.target.checked,
                                },
                              )
                            }
                            className="size-5 rounded border-white/20 bg-[#050B18] accent-lime-300"
                          />
                        </label>
                      </div>
                    </div>

                    <input
                      type="hidden"
                      name={`timelineSortOrder${slotNumber}`}
                      value={index}
                      readOnly
                    />

                    <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                        <CalendarRange className="size-3.5" />
                        Chronology {slotNumber}
                      </div>

                      {filled ||
                      previewUrl ||
                      item.subtitle ||
                      item.description ||
                      item.featured ? (
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
                </div>
              </article>
            );
          },
        )}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5">
        <p className="text-sm font-semibold text-white/80">
          Timeline direction
        </p>

        <p className="mt-1 text-xs leading-6 text-white/35">
          Use one milestone for each genuinely defining chapter. The
          seven slots keep the first AGE202 Legend profiles consistent,
          while the underlying milestone model remains relational and
          can be expanded later without changing the public archive.
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
