"use client";

import {
  Archive,
  Crown,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import type {
  PlayerCollectionType,
} from "@/generated/prisma/client";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

type IdentitySectionProps = {
  initialSlug?: string | null;
  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialDebutYear?: number | null;
  initialDisplayOrder?: number | null;
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

const collectionTypes: Array<{
  value: PlayerCollectionType;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    value: "FEATURED",
    label: "Featured",
    description:
      "Signature AGE202 champion.",
    icon: Star,
  },
  {
    value: "LEGEND",
    label: "Legend",
    description:
      "Historic Hall of Fame figure.",
    icon: Crown,
  },
  {
    value: "RISING_STAR",
    label: "Rising Star",
    description:
      "Emerging contemporary player.",
    icon: Sparkles,
  },
  {
    value: "ARCHIVE",
    label: "Archive",
    description:
      "Complete ATP archive profile.",
    icon: Archive,
  },
];

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

export default function IdentitySection({
  initialSlug = "",
  initialFirstName = "",
  initialLastName = "",
  initialDebutYear = null,
  initialDisplayOrder = null,
}: IdentitySectionProps) {
  const {
    preview,
    updatePreview,
  } = usePlayerStudio();

  const collectionType =
    (preview.collectionType ??
      "ARCHIVE") as PlayerCollectionType;

  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
          Player identity
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          General information
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Define the public identity, archive classification and display
          settings for this player.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <FieldLabel>
            Display name *
          </FieldLabel>

          <input
            name="name"
            required
            value={preview.name}
            onChange={(event) =>
              updatePreview({
                name:
                  event.target.value,
              })
            }
            className={inputClassName}
            placeholder="Roger Federer"
          />
        </label>

        <label>
          <FieldLabel>
            First name
          </FieldLabel>

          <input
            name="firstName"
            defaultValue={
              initialFirstName ?? ""
            }
            className={inputClassName}
            placeholder="Roger"
          />
        </label>

        <label>
          <FieldLabel>
            Last name
          </FieldLabel>

          <input
            name="lastName"
            defaultValue={
              initialLastName ?? ""
            }
            className={inputClassName}
            placeholder="Federer"
          />
        </label>

        <label>
          <FieldLabel>
            Slug
          </FieldLabel>

          <input
            name="slug"
            defaultValue={
              initialSlug ?? ""
            }
            className={inputClassName}
            placeholder="roger-federer"
          />

          <span className="mt-2 block text-xs leading-5 text-white/28">
            Leave empty to generate it automatically from the display name.
          </span>
        </label>

        <label>
          <FieldLabel>
            Country
          </FieldLabel>

          <input
            name="country"
            value={
              preview.country ?? ""
            }
            onChange={(event) =>
              updatePreview({
                country:
                  event.target.value,
              })
            }
            className={inputClassName}
            placeholder="Switzerland"
          />
        </label>

        <label>
          <FieldLabel>
            Nickname
          </FieldLabel>

          <input
            name="nickname"
            value={
              preview.nickname ?? ""
            }
            onChange={(event) =>
              updatePreview({
                nickname:
                  event.target.value,
              })
            }
            className={inputClassName}
            placeholder="The Maestro"
          />
        </label>

        <label>
          <FieldLabel>
            Debut year
          </FieldLabel>

          <input
            type="number"
            min="1800"
            max="2100"
            name="debutYear"
            defaultValue={
              initialDebutYear ?? ""
            }
            className={inputClassName}
            placeholder="1998"
          />
        </label>

        <label>
          <FieldLabel>
            Display order
          </FieldLabel>

          <input
            type="number"
            min="0"
            name="displayOrder"
            defaultValue={
              initialDisplayOrder ?? ""
            }
            className={inputClassName}
            placeholder="1"
          />
        </label>

        <label>
          <FieldLabel>
            Accent color
          </FieldLabel>

          <div className="flex gap-3">
            <input
              type="color"
              value={
                preview.accent ??
                "#C8FF00"
              }
              onChange={(event) =>
                updatePreview({
                  accent:
                    event.target.value.toUpperCase(),
                })
              }
              className="h-12 w-14 rounded-2xl border border-white/10 bg-[#08111F] p-1"
              aria-label="Choose accent color"
            />

            <input
              name="accent"
              value={
                preview.accent ??
                "#C8FF00"
              }
              onChange={(event) =>
                updatePreview({
                  accent:
                    event.target.value,
                })
              }
              className={inputClassName}
              placeholder="#C8FF00"
            />
          </div>
        </label>

        <div className="md:col-span-2">
          <FieldLabel>
            Archive classification
          </FieldLabel>

          <div className="grid gap-3 sm:grid-cols-2">
            {collectionTypes.map(
              (option) => {
                const Icon =
                  option.icon;

                const selected =
                  collectionType ===
                  option.value;

                return (
                  <label
                    key={option.value}
                    className={[
                      "cursor-pointer rounded-2xl border p-4 transition",
                      selected
                        ? "border-lime-300/35 bg-lime-300/[0.08]"
                        : "border-white/10 bg-[#08111F] hover:border-white/20",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="collectionType"
                      value={option.value}
                      checked={selected}
                      onChange={() =>
                        updatePreview({
                          collectionType:
                            option.value,
                        })
                      }
                      className="sr-only"
                    />

                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                          selected
                            ? "bg-lime-300 text-[#050B18]"
                            : "bg-white/[0.05] text-white/40",
                        ].join(" ")}
                      >
                        <Icon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-white">
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-white/35">
                          {
                            option.description
                          }
                        </span>
                      </span>
                    </div>
                  </label>
                );
              },
            )}
          </div>
        </div>

        <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
          <input
            type="checkbox"
            name="active"
            checked={
              preview.active !== false
            }
            onChange={(event) =>
              updatePreview({
                active:
                  event.target.checked,
              })
            }
            className="mt-0.5 h-4 w-4 accent-lime-300"
          />

          <span>
            <span className="block text-sm font-semibold text-white">
              Active public profile
            </span>

            <span className="mt-1 block text-xs leading-5 text-white/35">
              Active players can appear in the public archive and related
              museum experiences.
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}