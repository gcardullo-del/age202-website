"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CircleCheck,
  Plus,
  Save,
  Trophy,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";

type TournamentCategoryOption =
  | "GRAND_SLAM"
  | "MASTERS_1000"
  | "ATP_500"
  | "ATP_250";

type CourtSurfaceOption =
  | "HARD"
  | "CLAY"
  | "GRASS"
  | "CARPET"
  | "INDOOR_HARD"
  | "OTHER";

type FormState = {
  name: string;
  shortName: string;
  slug: string;
  category: TournamentCategoryOption;
  surface: CourtSurfaceOption;
  city: string;
  country: string;
  countryCode: string;
  venue: string;
  foundedYear: string;
  description: string;
  history: string;
  heroImage: string;
  logoUrl: string;
  websiteUrl: string;
  displayOrder: string;
  active: boolean;
  featured: boolean;
};

const initialState: FormState = {
  name: "",
  shortName: "",
  slug: "",
  category: "MASTERS_1000",
  surface: "HARD",
  city: "",
  country: "",
  countryCode: "",
  venue: "",
  foundedYear: "",
  description: "",
  history: "",
  heroImage: "",
  logoUrl: "",
  websiteUrl: "",
  displayOrder: "",
  active: true,
  featured: false,
};

function makeSlug(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

export default function NewTournamentPage() {
  const router =
    useRouter();

  const [
    form,
    setForm,
  ] = useState<FormState>(
    initialState,
  );

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const publicPreview =
    useMemo(
      () => {
        if (!form.slug) {
          return "Public route generated after slug";
        }

        switch (
          form.category
        ) {
          case "MASTERS_1000":
            return `/results/masters-1000/${form.slug}`;

          case "ATP_500":
            return `/results/atp-500/${form.slug}`;

          case "ATP_250":
            return `/results/atp-250/${form.slug}`;

          case "GRAND_SLAM":
            return `/results/grand-slams/${form.slug}`;
        }
      },
      [
        form.category,
        form.slug,
      ],
    );

  function updateText(
    key:
      | "name"
      | "shortName"
      | "slug"
      | "city"
      | "country"
      | "countryCode"
      | "venue"
      | "foundedYear"
      | "description"
      | "history"
      | "heroImage"
      | "logoUrl"
      | "websiteUrl"
      | "displayOrder",
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/tournaments",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                ...form,
                foundedYear:
                  form.foundedYear ||
                  null,
                displayOrder:
                  form.displayOrder ||
                  null,
              }),
          },
        );

      const payload =
        (await response.json()) as {
          error?: string;
          tournament?: {
            slug: string;
          };
        };

      if (
        !response.ok ||
        !payload.tournament
      ) {
        throw new Error(
          payload.error ||
            "Unable to create tournament.",
        );
      }

      router.push(
        `/admin/tournaments/${payload.tournament.slug}`,
      );

      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof
          Error
          ? submissionError.message
          : "Unable to create tournament.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell
      title="New Tournament"
      description="Create the tournament identity first, then continue inside Tournament Studio."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Tournament CMS · Create"
          title="New Tournament"
          description="Create the base tournament record. Gallery, milestones, chapters, iconic moments, editions and champions are managed after creation."
          icon={Trophy}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/tournaments",
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Tournament Studio
          </button>

          <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.06] px-4 py-3">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/60">
              Public route
            </p>

            <p className="mt-1 text-xs font-semibold text-lime-100">
              {publicPreview}
            </p>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-100"
          >
            {error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          <AdminPanel className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Step 01 · Identity
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Tournament identity
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                Name, slug, category, surface and country are the required Tournament fields.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                required
                placeholder="Miami Open"
                onChange={(
                  value,
                ) => {
                  updateText(
                    "name",
                    value,
                  );

                  if (
                    !slugEdited
                  ) {
                    updateText(
                      "slug",
                      makeSlug(
                        value,
                      ),
                    );
                  }
                }}
              />

              <Field
                label="Short name"
                value={
                  form.shortName
                }
                placeholder="Miami"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "shortName",
                    value,
                  )
                }
              />

              <Field
                label="Slug"
                value={form.slug}
                required
                placeholder="miami"
                hint="Used by the admin editor and public route."
                onChange={(
                  value,
                ) => {
                  setSlugEdited(
                    true,
                  );

                  updateText(
                    "slug",
                    makeSlug(
                      value,
                    ),
                  );
                }}
              />

              <SelectField
                label="Category"
                value={
                  form.category
                }
                options={[
                  {
                    value:
                      "GRAND_SLAM",
                    label:
                      "Grand Slam",
                  },
                  {
                    value:
                      "MASTERS_1000",
                    label:
                      "Masters 1000",
                  },
                  {
                    value:
                      "ATP_500",
                    label:
                      "ATP 500",
                  },
                  {
                    value:
                      "ATP_250",
                    label:
                      "ATP 250",
                  },
                ]}
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      category:
                        value as TournamentCategoryOption,
                    }),
                  )
                }
              />

              <SelectField
                label="Surface"
                value={
                  form.surface
                }
                options={[
                  {
                    value: "HARD",
                    label: "Hard",
                  },
                  {
                    value: "CLAY",
                    label: "Clay",
                  },
                  {
                    value: "GRASS",
                    label: "Grass",
                  },
                  {
                    value:
                      "INDOOR_HARD",
                    label:
                      "Indoor hard",
                  },
                  {
                    value:
                      "CARPET",
                    label: "Carpet",
                  },
                  {
                    value:
                      "OTHER",
                    label: "Other",
                  },
                ]}
                onChange={(
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      surface:
                        value as CourtSurfaceOption,
                    }),
                  )
                }
              />

              <Field
                label="Display order"
                value={
                  form.displayOrder
                }
                type="number"
                placeholder="2"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "displayOrder",
                    value,
                  )
                }
              />
            </div>
          </AdminPanel>

          <AdminPanel className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Step 02 · Place
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Location & venue
              </h2>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="City"
                value={form.city}
                placeholder="Miami Gardens"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "city",
                    value,
                  )
                }
              />

              <Field
                label="Country"
                value={
                  form.country
                }
                required
                placeholder="United States"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "country",
                    value,
                  )
                }
              />

              <Field
                label="Country code"
                value={
                  form.countryCode
                }
                placeholder="USA"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "countryCode",
                    value
                      .toUpperCase()
                      .slice(
                        0,
                        3,
                      ),
                  )
                }
              />

              <Field
                label="Venue"
                value={form.venue}
                placeholder="Hard Rock Stadium"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "venue",
                    value,
                  )
                }
              />

              <Field
                label="Founded year"
                value={
                  form.foundedYear
                }
                type="number"
                placeholder="1985"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "foundedYear",
                    value,
                  )
                }
              />

              <Field
                label="Website"
                value={
                  form.websiteUrl
                }
                placeholder="https://..."
                onChange={(
                  value,
                ) =>
                  updateText(
                    "websiteUrl",
                    value,
                  )
                }
              />
            </div>
          </AdminPanel>

          <AdminPanel className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Step 03 · Editorial base
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Story & media
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                These fields are optional now and can be completed later from the normal tournament editor.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <TextAreaField
                label="Description"
                value={
                  form.description
                }
                rows={5}
                onChange={(
                  value,
                ) =>
                  updateText(
                    "description",
                    value,
                  )
                }
              />

              <TextAreaField
                label="History"
                value={
                  form.history
                }
                rows={5}
                onChange={(
                  value,
                ) =>
                  updateText(
                    "history",
                    value,
                  )
                }
              />

              <Field
                label="Hero image"
                value={
                  form.heroImage
                }
                placeholder="/tournaments/miami/hero.jpg"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "heroImage",
                    value,
                  )
                }
              />

              <Field
                label="Logo URL"
                value={
                  form.logoUrl
                }
                placeholder="/tournaments/miami/logo.svg"
                onChange={(
                  value,
                ) =>
                  updateText(
                    "logoUrl",
                    value,
                  )
                }
              />
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <ToggleCard
                checked={
                  form.active
                }
                title="Active"
                description="The tournament is available to the CMS and tournament engine."
                onChange={(
                  checked,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      active:
                        checked,
                    }),
                  )
                }
              />

              <ToggleCard
                checked={
                  form.featured
                }
                title="Featured"
                description="Highlight this tournament inside Tournament Studio."
                onChange={(
                  checked,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      featured:
                        checked,
                    }),
                  )
                }
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-sm text-white/35">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-300/60" />

                <p className="max-w-2xl leading-6">
                  After creation you will be redirected to the existing Tournament Studio editor for this tournament.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 text-sm font-black text-[#050B18] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Save className="h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Tournament
                  </>
                )}
              </button>
            </div>
          </AdminPanel>
        </form>
      </div>
    </AdminShell>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  required?: boolean;
  type?:
    | "text"
    | "number";
  hint?: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  hint,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
        {required
          ? " *"
          : ""}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={
          placeholder
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35"
      />

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-white/25">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (
    value: string,
  ) => void;
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition focus:border-lime-300/35"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          ),
        )}
      </select>
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  rows: number;
  onChange: (
    value: string,
  ) => void;
};

function TextAreaField({
  label,
  value,
  rows,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-[#050B18] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-lime-300/35"
      />
    </label>
  );
}

type ToggleCardProps = {
  checked: boolean;
  title: string;
  description: string;
  onChange: (
    checked: boolean,
  ) => void;
};

function ToggleCard({
  checked,
  title,
  description,
  onChange,
}: ToggleCardProps) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/15">
      <input
        type="checkbox"
        checked={checked}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.checked,
          )
        }
        className="mt-1 h-4 w-4 accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white/75">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-white/30">
          {description}
        </span>
      </span>
    </label>
  );
}