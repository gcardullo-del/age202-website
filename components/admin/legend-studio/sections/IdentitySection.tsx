"use client";

import {
  BadgeCheck,
  CalendarDays,
  Crown,
  Globe2,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  useLegendStudio,
} from "@/components/admin/legend-studio/LegendStudioForm";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

type IdentitySectionProps = {
  initialSlug?: string | null;
  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialCountryCode?: string | null;
  initialBirthPlace?: string | null;
  initialBirthDate?: Date | string | null;
};

function dateInputValue(
  value: Date | string | null | undefined,
): string {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function IdentitySection({
  initialSlug = "",
  initialFirstName = "",
  initialLastName = "",
  initialCountryCode = "",
  initialBirthPlace = "",
  initialBirthDate = null,
}: IdentitySectionProps) {
  const {
    preview,
    updatePreview,
  } = useLegendStudio();

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <UserRound className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend identity
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Build the archive identity
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Define the public name, archive branch,
          nationality and biographical identity of
          this tennis legend.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Display name"
          description="Main public name used across THE LEGENDS."
        >
          <input
            name="name"
            required
            defaultValue={preview.name}
            onChange={(event) => {
              const name =
                event.target.value;

              updatePreview({
                name,
              });

              const slugInput =
                document.querySelector<HTMLInputElement>(
                  'input[name="slug"]',
                );

              if (
                slugInput &&
                !slugInput.dataset.touched
              ) {
                slugInput.value =
                  slugify(name);
              }
            }}
            placeholder="Rod Laver"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Slug"
          description="Public URL identifier."
        >
          <input
            name="slug"
            required
            defaultValue={initialSlug ?? ""}
            placeholder="rod-laver"
            onChange={(event) => {
              event.currentTarget.dataset.touched =
                "true";
            }}
            className={inputClasses}
          />
        </Field>

        <Field
          label="First name"
          description="Optional structured first name."
        >
          <input
            name="firstName"
            defaultValue={initialFirstName ?? ""}
            placeholder="Rodney"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Last name"
          description="Optional structured surname."
        >
          <input
            name="lastName"
            defaultValue={initialLastName ?? ""}
            placeholder="Laver"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Nickname"
          description="A recognized nickname or archive title."
        >
          <input
            name="nickname"
            placeholder="The Rocket"
            onChange={(event) =>
              updatePreview({
                nickname:
                  event.target.value ||
                  null,
              })
            }
            className={inputClasses}
          />
        </Field>

        <Field
          label="Era"
          description="Historical period represented by the player."
        >
          <input
            name="era"
            placeholder="1960s–1970s"
            onChange={(event) =>
              updatePreview({
                era:
                  event.target.value ||
                  null,
              })
            }
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-lime-300/15 bg-lime-300/[0.06]">
            <Crown className="size-5 text-lime-300" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
              Archive branch
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Men&apos;s or Women&apos;s Legends
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className={[
              "cursor-pointer rounded-2xl border p-4 transition",
              preview.gender === "MALE"
                ? "border-lime-300/30 bg-lime-300/[0.08]"
                : "border-white/10 bg-white/[0.025] hover:border-white/20",
            ].join(" ")}
          >
            <input
              type="radio"
              name="gender"
              value="MALE"
              checked={
                preview.gender ===
                "MALE"
              }
              onChange={() =>
                updatePreview({
                  gender: "MALE",
                })
              }
              className="sr-only"
            />

            <p className="text-sm font-semibold text-white">
              Men&apos;s Legends
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Male tennis legends in the AGE202
              historical archive.
            </p>
          </label>

          <label
            className={[
              "cursor-pointer rounded-2xl border p-4 transition",
              preview.gender === "FEMALE"
                ? "border-lime-300/30 bg-lime-300/[0.08]"
                : "border-white/10 bg-white/[0.025] hover:border-white/20",
            ].join(" ")}
          >
            <input
              type="radio"
              name="gender"
              value="FEMALE"
              checked={
                preview.gender ===
                "FEMALE"
              }
              onChange={() =>
                updatePreview({
                  gender: "FEMALE",
                })
              }
              className="sr-only"
            />

            <p className="text-sm font-semibold text-white">
              Women&apos;s Legends
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Female tennis legends in the AGE202
              historical archive.
            </p>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-white/45">
          <Globe2 className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Nationality & origin
          </p>
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <Field
            label="Nationality"
            description="Public nationality label."
          >
            <input
              name="nationality"
              placeholder="Australian"
              onChange={(event) =>
                updatePreview({
                  nationality:
                    event.target.value ||
                    null,
                })
              }
              className={inputClasses}
            />
          </Field>

          <Field
            label="Country code"
            description="ISO-style country code, e.g. AU, DE, US."
          >
            <input
              name="countryCode"
              defaultValue={initialCountryCode ?? ""}
              maxLength={3}
              placeholder="AU"
              className={inputClasses}
            />
          </Field>

          <Field
            label="Birth place"
            description="City and country."
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

              <input
                name="birthPlace"
                defaultValue={initialBirthPlace ?? ""}
                placeholder="Rockhampton, Australia"
                className={`${inputClasses} pl-11`}
              />
            </div>
          </Field>

          <Field
            label="Birth date"
            description="Optional exact date of birth."
          >
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

              <input
                name="birthDate"
                type="date"
                defaultValue={dateInputValue(initialBirthDate)}
                className={`${inputClasses} pl-11`}
              />
            </div>
          </Field>
        </div>
      </div>

      <div className="rounded-[24px] border border-emerald-300/15 bg-emerald-300/[0.035] p-5">
        <div className="flex items-start gap-3">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />

          <div>
            <p className="text-sm font-semibold text-emerald-100">
              Archive identity foundation
            </p>

            <p className="mt-1 text-xs leading-6 text-white/40">
              Name, nationality and archive branch
              are the three core fields used by
              Legend Studio to evaluate this section.
            </p>
          </div>
        </div>
      </div>
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