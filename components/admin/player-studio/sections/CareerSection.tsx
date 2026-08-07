"use client";

import {
  Award,
  CalendarDays,
  Dumbbell,
  Medal,
  Ruler,
  Sparkles,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

type CareerSectionProps = {
  initialBirthDate?: string | null;
  initialBirthPlace?: string | null;
  initialResidence?: string | null;
  initialHeight?: number | null;
  initialWeight?: number | null;
  initialPlays?: string | null;
  initialBackhand?: string | null;
  initialCoach?: string | null;
  initialTurnedPro?: number | null;
  initialCareerHigh?: number | null;
  initialAtpTitles?: number | null;
  initialAustralianOpen?: number | null;
  initialRolandGarros?: number | null;
  initialWimbledon?: number | null;
  initialUsOpen?: number | null;
  initialGrandSlams?: number | null;
  initialMasters1000?: number | null;
  initialAtpFinals?: number | null;
  initialOlympicGold?: number | null;
  initialDavisCup?: number | null;
  initialPrizeMoney?: string | number | null;
  initialFavouriteSurface?: string | null;
  createProfileByDefault?: boolean;
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

const numberInputClassName =
  `${inputClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

function FieldLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">
      {children}
    </span>
  );
}

function toInputValue(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

function parseNonNegativeInteger(
  value: string,
): number {
  const parsed =
    Number.parseInt(
      value,
      10,
    );

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return 0;
  }

  return parsed;
}

export default function CareerSection({
  initialBirthDate = "",
  initialBirthPlace = "",
  initialResidence = "",
  initialHeight = null,
  initialWeight = null,
  initialPlays = "",
  initialBackhand = "",
  initialCoach = "",
  initialTurnedPro = null,
  initialCareerHigh = null,
  initialAtpTitles = 0,
  initialAustralianOpen = 0,
  initialRolandGarros = 0,
  initialWimbledon = 0,
  initialUsOpen = 0,
  initialGrandSlams = 0,
  initialMasters1000 = 0,
  initialAtpFinals = 0,
  initialOlympicGold = 0,
  initialDavisCup = 0,
  initialPrizeMoney = null,
  initialFavouriteSurface = "",
  createProfileByDefault = true,
}: CareerSectionProps) {
  const {
    preview,
    updatePreview,
  } = usePlayerStudio();

  const [
    australianOpen,
    setAustralianOpen,
  ] = useState(
    toInputValue(
      initialAustralianOpen,
    ),
  );

  const [
    rolandGarros,
    setRolandGarros,
  ] = useState(
    toInputValue(
      initialRolandGarros,
    ),
  );

  const [
    wimbledon,
    setWimbledon,
  ] = useState(
    toInputValue(
      initialWimbledon,
    ),
  );

  const [
    usOpen,
    setUsOpen,
  ] = useState(
    toInputValue(
      initialUsOpen,
    ),
  );

  const calculatedGrandSlams =
    useMemo(
      () =>
        parseNonNegativeInteger(
          australianOpen,
        ) +
        parseNonNegativeInteger(
          rolandGarros,
        ) +
        parseNonNegativeInteger(
          wimbledon,
        ) +
        parseNonNegativeInteger(
          usOpen,
        ),
      [
        australianOpen,
        rolandGarros,
        wimbledon,
        usOpen,
      ],
    );

  const [
    grandSlamsOverride,
    setGrandSlamsOverride,
  ] = useState(
    toInputValue(
      initialGrandSlams,
    ),
  );

  const displayedGrandSlams =
    grandSlamsOverride.trim()
      ? parseNonNegativeInteger(
          grandSlamsOverride,
        )
      : calculatedGrandSlams;

  function updateAtpTitles(
    value: string,
  ) {
    updatePreview({
      atpTitles:
        parseNonNegativeInteger(
          value,
        ),
    });
  }

  function updateGrandSlams(
    value: string,
  ) {
    setGrandSlamsOverride(
      value,
    );

    updatePreview({
      grandSlams:
        value.trim()
          ? parseNonNegativeInteger(
              value,
            )
          : calculatedGrandSlams,
    });
  }

  function updateSlamCount(
    setter: (
      value: string,
    ) => void,
    value: string,
  ) {
    setter(value);

    const nextValues = {
      australianOpen,
      rolandGarros,
      wimbledon,
      usOpen,
    };

    if (
      setter ===
      setAustralianOpen
    ) {
      nextValues.australianOpen =
        value;
    }

    if (
      setter ===
      setRolandGarros
    ) {
      nextValues.rolandGarros =
        value;
    }

    if (
      setter ===
      setWimbledon
    ) {
      nextValues.wimbledon =
        value;
    }

    if (
      setter ===
      setUsOpen
    ) {
      nextValues.usOpen =
        value;
    }

    const nextTotal =
      parseNonNegativeInteger(
        nextValues.australianOpen,
      ) +
      parseNonNegativeInteger(
        nextValues.rolandGarros,
      ) +
      parseNonNegativeInteger(
        nextValues.wimbledon,
      ) +
      parseNonNegativeInteger(
        nextValues.usOpen,
      );

    if (
      !grandSlamsOverride.trim()
    ) {
      updatePreview({
        grandSlams:
          nextTotal,
      });
    }
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            Career profile
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Career and achievements
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Record the player profile, tour milestones and championship
            achievements that power the AGE202 archive.
          </p>
        </div>

        <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3">
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/70">
            Live totals
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {preview.atpTitles ?? 0} ATP titles · {displayedGrandSlams} Slams
          </p>
        </div>
      </div>

      <input
        type="hidden"
        name="createProfile"
        value={
          createProfileByDefault
            ? "true"
            : "false"
        }
      />

      <CareerPanel
        eyebrow="Personal profile"
        title="Player details"
        description="Biographical and physical information stored in PlayerProfile."
        icon={UserRound}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <FieldLabel>
              Birth date
            </FieldLabel>

            <input
              type="date"
              name="birthDate"
              defaultValue={
                initialBirthDate ?? ""
              }
              className={inputClassName}
            />
          </label>

          <label>
            <FieldLabel>
              Birth place
            </FieldLabel>

            <input
              name="birthPlace"
              defaultValue={
                initialBirthPlace ?? ""
              }
              className={inputClassName}
              placeholder="Basel, Switzerland"
            />
          </label>

          <label>
            <FieldLabel>
              Residence
            </FieldLabel>

            <input
              name="residence"
              defaultValue={
                initialResidence ?? ""
              }
              className={inputClassName}
              placeholder="Dubai, United Arab Emirates"
            />
          </label>

          <label>
            <FieldLabel>
              Coach
            </FieldLabel>

            <input
              name="coach"
              defaultValue={
                initialCoach ?? ""
              }
              className={inputClassName}
              placeholder="Coach name"
            />
          </label>

          <label>
            <FieldLabel>
              Height (cm)
            </FieldLabel>

            <div className="relative">
              <Ruler className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

              <input
                type="number"
                min="1"
                name="height"
                defaultValue={
                  initialHeight ?? ""
                }
                className={`${numberInputClassName} pl-11`}
                placeholder="185"
              />
            </div>
          </label>

          <label>
            <FieldLabel>
              Weight (kg)
            </FieldLabel>

            <div className="relative">
              <Dumbbell className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

              <input
                type="number"
                min="1"
                name="weight"
                defaultValue={
                  initialWeight ?? ""
                }
                className={`${numberInputClassName} pl-11`}
                placeholder="85"
              />
            </div>
          </label>
        </div>
      </CareerPanel>

      <CareerPanel
        eyebrow="Technical identity"
        title="Playing profile"
        description="Define handedness, backhand and preferred competitive conditions."
        icon={Target}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <FieldLabel>
              Plays
            </FieldLabel>

            <select
              name="plays"
              defaultValue={
                initialPlays ?? ""
              }
              className={inputClassName}
            >
              <option value="">
                Select handedness
              </option>
              <option value="Right-handed">
                Right-handed
              </option>
              <option value="Left-handed">
                Left-handed
              </option>
            </select>
          </label>

          <label>
            <FieldLabel>
              Backhand
            </FieldLabel>

            <select
              name="backhand"
              defaultValue={
                initialBackhand ?? ""
              }
              className={inputClassName}
            >
              <option value="">
                Select backhand
              </option>
              <option value="One-handed">
                One-handed
              </option>
              <option value="Two-handed">
                Two-handed
              </option>
            </select>
          </label>

          <label>
            <FieldLabel>
              Favourite surface
            </FieldLabel>

            <select
              name="favouriteSurface"
              defaultValue={
                initialFavouriteSurface ??
                ""
              }
              className={inputClassName}
            >
              <option value="">
                Select surface
              </option>
              <option value="Hard">
                Hard
              </option>
              <option value="Clay">
                Clay
              </option>
              <option value="Grass">
                Grass
              </option>
              <option value="Carpet">
                Carpet
              </option>
              <option value="All surfaces">
                All surfaces
              </option>
            </select>
          </label>

          <label>
            <FieldLabel>
              Turned professional
            </FieldLabel>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

              <input
                type="number"
                min="1800"
                max="2100"
                name="turnedPro"
                defaultValue={
                  initialTurnedPro ?? ""
                }
                className={`${numberInputClassName} pl-11`}
                placeholder="1998"
              />
            </div>
          </label>
        </div>
      </CareerPanel>

      <CareerPanel
        eyebrow="Tour record"
        title="Ranking and titles"
        description="Core career totals used across the public archive and Digital Player Card."
        icon={Trophy}
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <NumberField
            name="careerHigh"
            label="Career high"
            initialValue={
              initialCareerHigh
            }
            placeholder="1"
          />

          <label>
            <FieldLabel>
              ATP titles
            </FieldLabel>

            <input
              type="number"
              min="0"
              name="atpTitles"
              defaultValue={
                initialAtpTitles ?? 0
              }
              onChange={(event) =>
                updateAtpTitles(
                  event.target.value,
                )
              }
              className={numberInputClassName}
              placeholder="0"
            />
          </label>

          <NumberField
            name="masters1000"
            label="Masters 1000"
            initialValue={
              initialMasters1000
            }
          />

          <NumberField
            name="atpFinals"
            label="ATP Finals"
            initialValue={
              initialAtpFinals
            }
          />

          <NumberField
            name="olympicGold"
            label="Olympic gold"
            initialValue={
              initialOlympicGold
            }
          />

          <NumberField
            name="davisCup"
            label="Davis Cup"
            initialValue={
              initialDavisCup
            }
          />

          <label className="sm:col-span-2 xl:col-span-3">
            <FieldLabel>
              Career prize money
            </FieldLabel>

            <input
              type="number"
              min="0"
              step="0.01"
              name="prizeMoney"
              defaultValue={
                initialPrizeMoney ??
                ""
              }
              className={numberInputClassName}
              placeholder="130594339.00"
            />
          </label>
        </div>
      </CareerPanel>

      <CareerPanel
        eyebrow="Grand Slam record"
        title="Major championships"
        description="Enter each Slam total. The overall Grand Slam count updates automatically unless manually overridden."
        icon={Award}
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ControlledNumberField
            name="australianOpen"
            label="Australian Open"
            value={australianOpen}
            onChange={(value) =>
              updateSlamCount(
                setAustralianOpen,
                value,
              )
            }
          />

          <ControlledNumberField
            name="rolandGarros"
            label="Roland Garros"
            value={rolandGarros}
            onChange={(value) =>
              updateSlamCount(
                setRolandGarros,
                value,
              )
            }
          />

          <ControlledNumberField
            name="wimbledon"
            label="Wimbledon"
            value={wimbledon}
            onChange={(value) =>
              updateSlamCount(
                setWimbledon,
                value,
              )
            }
          />

          <ControlledNumberField
            name="usOpen"
            label="US Open"
            value={usOpen}
            onChange={(value) =>
              updateSlamCount(
                setUsOpen,
                value,
              )
            }
          />
        </div>

        <div className="mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/[0.05] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-200/70">
                Grand Slam total
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {displayedGrandSlams}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Calculated from the four tournaments unless the field is manually set.
              </p>
            </div>

            <label className="w-full sm:max-w-[220px]">
              <FieldLabel>
                Manual total
              </FieldLabel>

              <input
                type="number"
                min="0"
                name="grandSlams"
                value={
                  grandSlamsOverride
                }
                onChange={(event) =>
                  updateGrandSlams(
                    event.target.value,
                  )
                }
                className={numberInputClassName}
                placeholder={String(
                  calculatedGrandSlams,
                )}
              />
            </label>
          </div>
        </div>
      </CareerPanel>

      <div className="rounded-3xl border border-white/10 bg-[#08111F] p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
            <Medal
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm font-semibold text-white">
              Career Timeline ready
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              These structured totals prepare the profile for the future visual
              Career Timeline and Hall of Fame modules.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type CareerPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  children: ReactNode;
};

function CareerPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: CareerPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </span>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
            {eyebrow}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}

type NumberFieldProps = {
  name: string;
  label: string;
  initialValue?: number | null;
  placeholder?: string;
};

function NumberField({
  name,
  label,
  initialValue = 0,
  placeholder = "0",
}: NumberFieldProps) {
  return (
    <label>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        name={name}
        defaultValue={
          initialValue ?? 0
        }
        className={numberInputClassName}
        placeholder={placeholder}
      />
    </label>
  );
}

type ControlledNumberFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
};

function ControlledNumberField({
  name,
  label,
  value,
  onChange,
}: ControlledNumberFieldProps) {
  return (
    <label>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        name={name}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={numberInputClassName}
        placeholder="0"
      />
    </label>
  );
}