"use client";


import {
  useMemo,
  useState,
} from "react";

import {
  Archive,
  Check,
  MessageSquareText,
  RotateCcw,
  Star,
} from "lucide-react";

import {
  toast,
} from "sonner";

export type AdminFeedbackStatus =
  | "NEW"
  | "REVIEWED"
  | "ARCHIVED";

export type AdminFeedbackCategory =
  | "LIKE"
  | "MISSING_SOMETHING"
  | "IDEA";

export type AdminFeedbackItem = {
  id: string;
  rating: number;
  category: AdminFeedbackCategory | null;
  message: string | null;
  sourcePath: string | null;
  status: AdminFeedbackStatus;
  createdAt: string;
  updatedAt: string;
};

type AdminFeedbackManagerProps = {
  initialFeedback: AdminFeedbackItem[];
};

type FilterValue =
  | "ALL"
  | AdminFeedbackStatus;

const FILTERS: Array<{
  value: FilterValue;
  label: string;
}> = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "REVIEWED",
    label: "Reviewed",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
  },
];

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "it-IT",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );
}

function getCategoryLabel(
  category: AdminFeedbackCategory | null,
) {
  switch (category) {
    case "LIKE":
      return "I like it";

    case "MISSING_SOMETHING":
      return "Something's missing";

    case "IDEA":
      return "I have an idea";

    default:
      return "General feedback";
  }
}

function getStatusClasses(
  status: AdminFeedbackStatus,
) {
  switch (status) {
    case "NEW":
      return "border-[#c8ff00]/25 bg-[#c8ff00]/10 text-[#c8ff00]";

    case "REVIEWED":
      return "border-sky-300/20 bg-sky-300/[0.08] text-sky-200";

    case "ARCHIVED":
      return "border-white/10 bg-white/[0.04] text-white/35";
  }
}

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} stelle su 5`}
    >
      {Array.from(
        {
          length: 5,
        },
        (_, index) => (
          <Star
            key={index}
            className={[
              "h-4 w-4",
              index < rating
                ? "fill-[#c8ff00] text-[#c8ff00]"
                : "text-white/15",
            ].join(" ")}
          />
        ),
      )}
    </div>
  );
}

export default function AdminFeedbackManager({
  initialFeedback,
}: AdminFeedbackManagerProps) {
  const [
    feedback,
    setFeedback,
  ] = useState(
    initialFeedback,
  );

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<FilterValue>(
      "ALL",
    );

  const [
    pendingId,
    setPendingId,
  ] =
    useState<string | null>(
      null,
    );

  const counts =
    useMemo(
      () => ({
        ALL:
          feedback.length,

        NEW:
          feedback.filter(
            (item) =>
              item.status ===
              "NEW",
          ).length,

        REVIEWED:
          feedback.filter(
            (item) =>
              item.status ===
              "REVIEWED",
          ).length,

        ARCHIVED:
          feedback.filter(
            (item) =>
              item.status ===
              "ARCHIVED",
          ).length,
      }),
      [
        feedback,
      ],
    );

  const visibleFeedback =
    useMemo(
      () =>
        activeFilter ===
        "ALL"
          ? feedback
          : feedback.filter(
              (item) =>
                item.status ===
                activeFilter,
            ),
      [
        activeFilter,
        feedback,
      ],
    );

  async function updateStatus(
    id: string,
    status: AdminFeedbackStatus,
  ) {
    setPendingId(
      id,
    );

    try {
      const response =
        await fetch(
          `/api/admin/feedback/${id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                status,
              }),
          },
        );

      const result =
        (await response.json()) as {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Impossibile aggiornare il feedback.",
        );
      }

      setFeedback(
        (current) =>
          current.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    status,
                    updatedAt:
                      new Date().toISOString(),
                  }
                : item,
          ),
      );

      toast.success(
        status === "REVIEWED"
          ? "Feedback marked as reviewed."
          : status === "ARCHIVED"
            ? "Feedback archived."
            : "Feedback restored.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossibile aggiornare il feedback.",
      );
    } finally {
      setPendingId(
        null,
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(
          (filter) => {
            const active =
              activeFilter ===
              filter.value;

            return (
              <button
                key={
                  filter.value
                }
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter.value,
                  )
                }
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition",
                  active
                    ? "border-[#c8ff00]/35 bg-[#c8ff00]/12 text-[#c8ff00]"
                    : "border-white/10 bg-white/[0.025] text-white/40 hover:border-white/20 hover:text-white/70",
                ].join(" ")}
              >
                {
                  filter.label
                }

                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[9px]",
                    active
                      ? "bg-[#c8ff00] text-[#050b18]"
                      : "bg-white/[0.06] text-white/35",
                  ].join(" ")}
                >
                  {
                    counts[
                      filter.value
                    ]
                  }
                </span>
              </button>
            );
          },
        )}
      </div>

      {visibleFeedback.length ===
      0 ? (
        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-10 text-center">
          <MessageSquareText className="mx-auto h-10 w-10 text-white/25" />

          <h3 className="mt-5 text-xl font-semibold text-white">
            Nessun feedback
          </h3>

          <p className="mt-3 text-sm text-white/45">
            Non ci sono feedback
            con questo stato.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {visibleFeedback.map(
            (item) => {
              const loading =
                pendingId ===
                item.id;

              return (
                <article
                  key={
                    item.id
                  }
                  className="rounded-[28px] border border-white/10 bg-[#08101f] p-6 transition hover:border-white/15 sm:p-7"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <RatingStars
                          rating={
                            item.rating
                          }
                        />

                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          {getCategoryLabel(
                            item.category,
                          )}
                        </span>

                        <span
                          className={[
                            "inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]",
                            getStatusClasses(
                              item.status,
                            ),
                          ].join(" ")}
                        >
                          {
                            item.status
                          }
                        </span>
                      </div>

                      <p className="mt-6 max-w-4xl whitespace-pre-wrap text-base leading-8 text-white/80">
                        {item.message ??
                          "Nessun commento aggiuntivo."}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5 text-xs text-white/35">
                        <span>
                          Source:{" "}
                          <strong className="font-medium text-white/55">
                            {
                              item.sourcePath ?? "/"
                            }
                          </strong>
                        </span>

                        <span>
                          {formatDate(
                            item.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[300px] xl:items-end">
                      <div className="text-left xl:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                          Visitor rating
                        </p>

                        <p className="mt-2 text-3xl font-semibold text-[#c8ff00]">
                          {
                            item.rating
                          }

                          <span className="text-sm font-normal text-white/25">
                            /5
                          </span>
                        </p>
                      </div>

                      <div className="flex w-full flex-wrap gap-2 xl:justify-end">
                        {item.status ===
                        "NEW" ? (
                          <button
                            type="button"
                            disabled={
                              loading
                            }
                            onClick={() =>
                              void updateStatus(
                                item.id,
                                "REVIEWED",
                              )
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.07] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-sky-200 transition hover:bg-sky-300/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Check className="h-4 w-4" />

                            Mark reviewed
                          </button>
                        ) : null}

                        {item.status !==
                        "ARCHIVED" ? (
                          <button
                            type="button"
                            disabled={
                              loading
                            }
                            onClick={() =>
                              void updateStatus(
                                item.id,
                                "ARCHIVED",
                              )
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-white/45 transition hover:border-white/20 hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Archive className="h-4 w-4" />

                            Archive
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              loading
                            }
                            onClick={() =>
                              void updateStatus(
                                item.id,
                                "REVIEWED",
                              )
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#c8ff00]/20 bg-[#c8ff00]/[0.07] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#c8ff00] transition hover:bg-[#c8ff00]/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <RotateCcw className="h-4 w-4" />

                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </section>
      )}
    </div>
  );
}
