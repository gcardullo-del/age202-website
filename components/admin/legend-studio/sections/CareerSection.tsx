"use client";

import {
  CalendarRange,
  Medal,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import {
  useLegendStudio,
} from "@/components/admin/legend-studio/LegendStudioForm";

type CareerSectionProps = {
  initialTurnedPro?: number | null;
  initialRetiredYear?: number | null;
  initialPlays?: string | null;
  initialBackhand?: string | null;
  initialCareerHigh?: number | null;
  initialCareerTitles?: number | null;
  initialWeeksAtNo1?: number | null;
  initialYearEndNo1?: number | null;
  initialOlympicGold?: number | null;
  initialGrandSlams?: number | null;
};

export default function CareerSection({
  initialTurnedPro = null,
  initialRetiredYear = null,
  initialPlays = null,
  initialBackhand = null,
  initialCareerHigh = null,
  initialCareerTitles = null,
  initialWeeksAtNo1 = null,
  initialYearEndNo1 = null,
  initialOlympicGold = null,
  initialGrandSlams = null,
}: CareerSectionProps) {
  const {
    preview,
    updatePreview,
  } = useLegendStudio();

  const displayedGrandSlams =
    preview.grandSlams ||
    initialGrandSlams ||
    0;

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Sparkles className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend career
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Career profile & achievements
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Record the essential competitive profile of the legend:
          professional era, ranking peak, career titles and the
          achievements that define the player&apos;s historical record.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Turned pro"
          description="Year the player officially entered the professional tour."
        >
          <input
            name="turnedPro"
            type="number"
            defaultValue={initialTurnedPro ?? ""}
            min={1800}
            max={2100}
            placeholder="1963"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Retired year"
          description="Final season or retirement year."
        >
          <input
            name="retiredYear"
            type="number"
            defaultValue={initialRetiredYear ?? ""}
            min={1800}
            max={2100}
            placeholder="1979"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Plays"
          description="Primary playing hand."
        >
          <select
            name="plays"
            className={inputClasses}
            defaultValue={initialPlays ?? ""}
          >
            <option value="">
              Select
            </option>
            <option value="Right-handed">
              Right-handed
            </option>
            <option value="Left-handed">
              Left-handed
            </option>
          </select>
        </Field>

        <Field
          label="Backhand"
          description="Backhand style."
        >
          <select
            name="backhand"
            className={inputClasses}
            defaultValue={initialBackhand ?? ""}
          >
            <option value="">
              Select
            </option>
            <option value="One-handed">
              One-handed
            </option>
            <option value="Two-handed">
              Two-handed
            </option>
          </select>
        </Field>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
            <Trophy className="size-5 text-lime-300" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
              Career numbers
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Competitive record
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatField
            label="Career high"
            name="careerHigh"
            placeholder="1"
            initialValue={initialCareerHigh}
          />

          <StatField
            label="Career titles"
            name="careerTitles"
            placeholder="200"
            initialValue={
              initialCareerTitles ??
              preview.careerTitles
            }
            onChange={(value) =>
              updatePreview({
                careerTitles: value,
              })
            }
          />

          <StatField
            label="Weeks at No.1"
            name="weeksAtNo1"
            placeholder="200"
            initialValue={
              initialWeeksAtNo1 ??
              preview.weeksAtNo1
            }
            onChange={(value) =>
              updatePreview({
                weeksAtNo1: value,
              })
            }
          />

          <StatField
            label="Year-end No.1"
            name="yearEndNo1"
            placeholder="5"
            initialValue={initialYearEndNo1}
          />

          <StatField
            label="Olympic gold"
            name="olympicGold"
            placeholder="0"
            initialValue={initialOlympicGold}
          />

          <ReadOnlyStat
            label="Grand Slam titles"
            value={displayedGrandSlams}
          />
        </div>

        <p className="mt-5 text-[10px] leading-5 text-white/25">
          Grand Slam titles are synchronized from the dedicated Grand Slams
          section, which is the single source of truth for this value.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard
          icon={<Target className="size-5" />}
          title="Career high"
          text="Use the best singles ranking achieved during the player's career. For most major legends this will be World No.1."
        />

        <InfoCard
          icon={<Medal className="size-5" />}
          title="Historical achievements"
          text="Olympic titles and year-end No.1 finishes help the public profile tell a broader story beyond Grand Slam totals."
        />
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5">
        <div className="flex items-start gap-3">
          <CalendarRange className="mt-0.5 size-5 shrink-0 text-lime-300" />

          <div>
            <p className="text-sm font-semibold text-white/80">
              Timeline ready
            </p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              The professional start and retirement years will later
              anchor the public career timeline together with Legend
              milestones.
            </p>
          </div>
        </div>
      </div>

      <input
        type="hidden"
        name="careerTitlesPreview"
        value={preview.careerTitles}
        readOnly
      />
    </section>
  );
}

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/70">
        {label}
      </span>

      {description ? (
        <span className="mt-1 block text-[11px] leading-5 text-white/30">
          {description}
        </span>
      ) : null}

      <div className="mt-2.5">
        {children}
      </div>
    </label>
  );
}

function StatField({
  label,
  name,
  placeholder,
  initialValue,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  initialValue?: number | null;
  onChange?: (
    value: number,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <input
        name={name}
        type="number"
        min={0}
        placeholder={placeholder}
        defaultValue={
          initialValue ?? ""
        }
        onChange={(event) => {
          const value =
            Number(
              event.target.value || 0,
            );

          onChange?.(
            Number.isFinite(value)
              ? value
              : 0,
          );
        }}
        className={`${inputClasses} mt-2.5`}
      />
    </label>
  );
}

function ReadOnlyStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <div className={`${inputClasses} mt-2.5 cursor-default text-white/70`}>
        {value}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lime-300">
          {icon}
        </span>

        <div>
          <p className="text-sm font-semibold text-white/80">
            {title}
          </p>

          <p className="mt-1 text-xs leading-6 text-white/35">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}