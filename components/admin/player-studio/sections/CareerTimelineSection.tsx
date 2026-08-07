"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Flag,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  CAREER_EVENT_CATEGORIES,
  createEmptyCareerTimelineDraft,
  getCareerEventCategoryLabel,
  normalizeCareerTimelineDraft,
  validateCareerTimelineDraft,
  type CareerTimelineDraft,
} from "../types/CareerTimeline";

type CareerTimelineSectionProps = {
  initialEvents?: CareerTimelineDraft[];
};

const inputClassName =
  "h-11 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

const textareaClassName =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

export default function CareerTimelineSection({
  initialEvents = [],
}: CareerTimelineSectionProps) {
  const [events, setEvents] =
    useState<CareerTimelineDraft[]>(
      initialEvents,
    );

  const serializedEvents =
    useMemo(
      () =>
        JSON.stringify(
          events.map(
            normalizeCareerTimelineDraft,
          ),
        ),
      [events],
    );

  function addEvent() {
    setEvents((current) => [
      ...current,
      createEmptyCareerTimelineDraft(
        current.length,
      ),
    ]);
  }

  function updateEvent(
    clientId: string,
    values: Partial<CareerTimelineDraft>,
  ) {
    setEvents((current) =>
      current.map((event) =>
        event.clientId === clientId
          ? {
              ...event,
              ...values,
            }
          : event,
      ),
    );
  }

  function removeEvent(
    clientId: string,
  ) {
    setEvents((current) =>
      current
        .filter(
          (event) =>
            event.clientId !==
            clientId,
        )
        .map(
          (event, index) => ({
            ...event,
            sortOrder: index,
          }),
        ),
    );
  }

  function moveEvent(
    clientId: string,
    direction: -1 | 1,
  ) {
    setEvents((current) => {
      const currentIndex =
        current.findIndex(
          (event) =>
            event.clientId ===
            clientId,
        );

      const nextIndex =
        currentIndex + direction;

      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >=
          current.length
      ) {
        return current;
      }

      const next = [...current];

      [
        next[currentIndex],
        next[nextIndex],
      ] = [
        next[nextIndex],
        next[currentIndex],
      ];

      return next.map(
        (event, index) => ({
          ...event,
          sortOrder: index,
        }),
      );
    });
  }

  return (
    <section className="space-y-7">
      <input
        type="hidden"
        name="careerEvents"
        value={serializedEvents}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            Career timeline
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Milestones and defining moments
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Build the chronological story of the player through titles,
            rankings, rivalries and historic events.
          </p>
        </div>

        <button
          type="button"
          onClick={addEvent}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
        >
          <Plus
            className="h-4 w-4"
            aria-hidden="true"
          />
          Add event
        </button>
      </div>

      {events.length === 0 ? (
        <TimelineEmptyState
          onAdd={addEvent}
        />
      ) : (
        <div className="space-y-4">
          {events.map(
            (event, index) => (
              <TimelineEventEditor
                key={event.clientId}
                event={event}
                index={index}
                total={events.length}
                onChange={(values) =>
                  updateEvent(
                    event.clientId,
                    values,
                  )
                }
                onRemove={() =>
                  removeEvent(
                    event.clientId,
                  )
                }
                onMoveUp={() =>
                  moveEvent(
                    event.clientId,
                    -1,
                  )
                }
                onMoveDown={() =>
                  moveEvent(
                    event.clientId,
                    1,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      {events.length > 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <Sparkles className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-semibold text-white">
                {events.length} timeline{" "}
                {events.length === 1
                  ? "event"
                  : "events"}
              </p>

              <p className="mt-1 text-xs text-white/35">
                Events are serialized in the hidden{" "}
                <code>careerEvents</code> field, ready for the future Server
                Action integration.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type TimelineEventEditorProps = {
  event: CareerTimelineDraft;
  index: number;
  total: number;
  onChange: (
    values: Partial<CareerTimelineDraft>,
  ) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function TimelineEventEditor({
  event,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: TimelineEventEditorProps) {
  const errors =
    validateCareerTimelineDraft(
      event,
    );

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
            <Trophy className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
              Event {index + 1}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              {event.title.trim() ||
                "Untitled milestone"}
            </h3>

            <p className="mt-1 text-xs text-white/35">
              {event.year || "Year"} ·{" "}
              {getCareerEventCategoryLabel(
                event.category,
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Move event up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={
              index === total - 1
            }
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            aria-label="Move event down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="grid h-9 w-9 place-items-center rounded-xl border border-red-300/15 text-red-200/55 transition hover:bg-red-300/10 hover:text-red-200"
            aria-label="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          <TimelineInput
            label="Year *"
            type="number"
            min="1800"
            max="2100"
            value={event.year}
            onChange={(value) =>
              onChange({
                year: value,
              })
            }
          />

          <TimelineInput
            label="Month"
            type="number"
            min="1"
            max="12"
            value={event.month}
            onChange={(value) =>
              onChange({
                month: value,
              })
            }
          />

          <TimelineInput
            label="Day"
            type="number"
            min="1"
            max="31"
            value={event.day}
            onChange={(value) =>
              onChange({
                day: value,
              })
            }
          />
        </div>

        <TimelineInput
          label="Title *"
          value={event.title}
          placeholder="First Wimbledon title"
          onChange={(value) =>
            onChange({
              title: value,
            })
          }
        />

        <TimelineInput
          label="Subtitle"
          value={event.subtitle}
          placeholder="A defining chapter begins"
          onChange={(value) =>
            onChange({
              subtitle: value,
            })
          }
        />

        <label>
          <FieldLabel>
            Category
          </FieldLabel>

          <select
            value={event.category}
            onChange={(changeEvent) =>
              onChange({
                category:
                  changeEvent.target
                    .value as CareerTimelineDraft["category"],
              })
            }
            className={inputClassName}
          >
            {CAREER_EVENT_CATEGORIES.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>

        <TimelineInput
          label="Tournament"
          value={event.tournament}
          placeholder="Wimbledon"
          onChange={(value) =>
            onChange({
              tournament: value,
            })
          }
        />

        <TimelineInput
          label="Location"
          value={event.location}
          placeholder="London, United Kingdom"
          onChange={(value) =>
            onChange({
              location: value,
            })
          }
        />

        <TimelineInput
          label="Image path or URL"
          value={event.imageUrl}
          placeholder="/players/example/timeline/event.jpg"
          onChange={(value) =>
            onChange({
              imageUrl: value,
            })
          }
        />

        <label className="md:col-span-2">
          <FieldLabel>
            Description
          </FieldLabel>

          <textarea
            value={event.description}
            onChange={(changeEvent) =>
              onChange({
                description:
                  changeEvent.target
                    .value,
              })
            }
            rows={5}
            className={textareaClassName}
            placeholder="Describe why this moment matters in the player's career."
          />
        </label>

        <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#08111F] p-4">
          <input
            type="checkbox"
            checked={event.featured}
            onChange={(changeEvent) =>
              onChange({
                featured:
                  changeEvent.target
                    .checked,
              })
            }
            className="mt-0.5 h-4 w-4 accent-lime-300"
          />

          <span>
            <span className="block text-sm font-semibold text-white">
              Featured milestone
            </span>

            <span className="mt-1 block text-xs leading-5 text-white/35">
              Highlight this event in premium archive and Hall of Fame
              experiences.
            </span>
          </span>
        </label>
      </div>

      {errors.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">
            Event needs attention
          </p>

          <ul className="mt-2 space-y-1">
            {errors.map((error) => (
              <li
                key={error}
                className="text-xs text-white/40"
              >
                • {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function TimelineEmptyState({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
          <Flag className="h-6 w-6" />
        </span>

        <h3 className="mt-5 text-xl font-semibold text-white">
          No career events yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
          Add the first milestone and begin building the chronological story
          of this player.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-semibold text-[#050B18]"
        >
          <Plus className="h-4 w-4" />
          Add first event
        </button>
      </div>
    </div>
  );
}

type TimelineInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "number";
  min?: string;
  max?: string;
  onChange: (
    value: string,
  ) => void;
};

function TimelineInput({
  label,
  value,
  placeholder,
  type = "text",
  min,
  max,
  onChange,
}: TimelineInputProps) {
  return (
    <label>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={inputClassName}
        placeholder={placeholder}
      />
    </label>
  );
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">
      {children}
    </span>
  );
}