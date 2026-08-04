"use client";

import Image from "next/image";

import {
  FileText,
  ImageIcon,
  Landmark,
  Palette,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CollectionStatus,
  CollectionType,
} from "@/generated/prisma/client";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

import {
  createCollection,
} from "../actions/createCollection";
import {
  updateCollection,
} from "../actions/updateCollection";

type SectionId =
  | "general"
  | "hero"
  | "design"
  | "seo"
  | "publication";

type CollectionFormMode =
  | "create"
  | "edit";

export type CollectionFormInitialValues = {
  name?: string;
  slug?: string;
  eyebrow?: string | null;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  type?: CollectionType;
  status?: CollectionStatus;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImageUrl?: string | null;
  heroMediaId?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  featured?: boolean;
  displayOrder?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

type CollectionFormProps = {
  mode?: CollectionFormMode;
  collectionId?: string;
  mediaAssets: MediaAssetWithFolder[];
  initialValues?: CollectionFormInitialValues;
};

const sections = [
  {
    id: "general",
    label: "General",
    description:
      "Identity and story",
    icon: Landmark,
  },
  {
    id: "hero",
    label: "Hero",
    description:
      "Primary visual",
    icon: ImageIcon,
  },
  {
    id: "design",
    label: "Design",
    description:
      "Collection palette",
    icon: Palette,
  },
  {
    id: "seo",
    label: "SEO",
    description:
      "Search metadata",
    icon: Sparkles,
  },
  {
    id: "publication",
    label: "Publication",
    description:
      "Status and order",
    icon: FileText,
  },
] as const;

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/35";

function SectionPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        active
          ? "block"
          : "hidden"
      }
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

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

function formatCollectionType(
  value: CollectionType,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function CollectionForm({
  mode = "create",
  collectionId,
  mediaAssets,
  initialValues,
}: CollectionFormProps) {
  const isEditing =
    mode === "edit";

  if (
    isEditing &&
    !collectionId
  ) {
    throw new Error(
      "collectionId is required in edit mode.",
    );
  }

  const [
    activeSection,
    setActiveSection,
  ] = useState<SectionId>(
    "general",
  );

  const [name, setName] =
    useState(
      initialValues?.name ?? "",
    );

  const [title, setTitle] =
    useState(
      initialValues?.title ?? "",
    );

  const [subtitle, setSubtitle] =
    useState(
      initialValues?.subtitle ?? "",
    );

  const [type, setType] =
    useState<CollectionType>(
      initialValues?.type ??
        "PLAYER",
    );

  const [status, setStatus] =
    useState<CollectionStatus>(
      initialValues?.status ??
        "DRAFT",
    );

  const [
    selectedHeroMediaId,
    setSelectedHeroMediaId,
  ] = useState(
    initialValues?.heroMediaId ??
      "",
  );

  const [
    heroImageUrl,
    setHeroImageUrl,
  ] = useState(
    initialValues?.heroImageUrl ??
      "",
  );

  const [
    primaryColor,
    setPrimaryColor,
  ] = useState(
    initialValues?.primaryColor ??
      "#C8FF00",
  );

  const [
    secondaryColor,
    setSecondaryColor,
  ] = useState(
    initialValues?.secondaryColor ??
      "#08111F",
  );

  const [
    accentColor,
    setAccentColor,
  ] = useState(
    initialValues?.accentColor ??
      "#FFFFFF",
  );

  const selectedHeroMedia =
    useMemo(
      () =>
        mediaAssets.find(
          (asset) =>
            asset.id ===
            selectedHeroMediaId,
        ) ?? null,
      [
        mediaAssets,
        selectedHeroMediaId,
      ],
    );

  const previewImage =
    selectedHeroMedia?.url ??
    heroImageUrl.trim();

  const formAction =
    isEditing
      ? updateCollection
      : createCollection;

  return (
    <form
      action={formAction}
      className="pb-8"
    >
      {collectionId ? (
        <input
          type="hidden"
          name="collectionId"
          value={collectionId}
        />
      ) : null}

      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-200/70">
              <Settings2 className="h-4 w-4" />
              Collections Builder
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {title ||
                name ||
                (isEditing
                  ? "Edit Museum Collection"
                  : "New Museum Collection")}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Define the identity, hero and publication settings for an AGE202 exhibition.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Save className="h-4 w-4" />
            {isEditing
              ? "Save changes"
              : "Save Collection"}
          </button>
        </div>

        <div className="grid xl:grid-cols-[250px_minmax(0,1fr)_340px]">
          <nav className="border-b border-white/10 p-3 xl:border-b-0 xl:border-r xl:p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {sections.map(
                (section) => {
                  const Icon =
                    section.icon;

                  const isActive =
                    activeSection ===
                    section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id,
                        )
                      }
                      className={`flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isActive
                          ? "bg-lime-300 text-[#050B18]"
                          : "text-white/55 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                          isActive
                            ? "bg-black/10"
                            : "bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {section.label}
                        </span>

                        <span
                          className={`hidden truncate text-xs xl:block ${
                            isActive
                              ? "text-[#050B18]/60"
                              : "text-white/30"
                          }`}
                        >
                          {section.description}
                        </span>
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </nav>

          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <SectionPanel
              active={
                activeSection ===
                "general"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Collection identity
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    General information
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <FieldLabel>
                      Internal name *
                    </FieldLabel>

                    <input
                      name="name"
                      required
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                      placeholder="Roger Federer Collection"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Type *
                    </FieldLabel>

                    <select
                      name="type"
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target
                            .value as CollectionType,
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="PLAYER">
                        Player
                      </option>
                      <option value="ERA">
                        Era
                      </option>
                      <option value="TOURNAMENT">
                        Tournament
                      </option>
                      <option value="THEME">
                        Theme
                      </option>
                      <option value="BRAND">
                        Brand
                      </option>
                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Public title *
                    </FieldLabel>

                    <input
                      name="title"
                      required
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                      placeholder="The Roger Federer Archive"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Subtitle
                    </FieldLabel>

                    <input
                      name="subtitle"
                      value={subtitle}
                      onChange={(event) =>
                        setSubtitle(
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                      placeholder="Elegance, innovation and twenty Grand Slam titles."
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Eyebrow
                    </FieldLabel>

                    <input
                      name="eyebrow"
                      defaultValue={
                        initialValues?.eyebrow ??
                        ""
                      }
                      className={inputClassName}
                      placeholder="Champion Collection"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Slug
                    </FieldLabel>

                    <input
                      name="slug"
                      defaultValue={
                        initialValues?.slug ??
                        ""
                      }
                      className={inputClassName}
                      placeholder="roger-federer"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Description
                    </FieldLabel>

                    <textarea
                      name="description"
                      defaultValue={
                        initialValues?.description ??
                        ""
                      }
                      rows={8}
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                      placeholder="Introduce the collection and explain its museum story."
                    />
                  </label>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "hero"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Primary visual
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Hero section
                  </h3>
                </div>

                <div className="space-y-5">
                  <label>
                    <FieldLabel>
                      Hero title
                    </FieldLabel>

                    <input
                      name="heroTitle"
                      defaultValue={
                        initialValues?.heroTitle ??
                        ""
                      }
                      className={inputClassName}
                      placeholder="The Maestro"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Hero subtitle
                    </FieldLabel>

                    <textarea
                      name="heroSubtitle"
                      defaultValue={
                        initialValues?.heroSubtitle ??
                        ""
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                      placeholder="A short immersive introduction for the collection hero."
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Media Library image
                    </FieldLabel>

                    <select
                      name="heroMediaId"
                      value={selectedHeroMediaId}
                      onChange={(event) =>
                        setSelectedHeroMediaId(
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="">
                        No Media Library image
                      </option>

                      {mediaAssets.map(
                        (asset) => (
                          <option
                            key={asset.id}
                            value={asset.id}
                          >
                            {asset.title}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    <FieldLabel>
                      External hero URL
                    </FieldLabel>

                    <input
                      name="heroImageUrl"
                      type="url"
                      value={heroImageUrl}
                      onChange={(event) =>
                        setHeroImageUrl(
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "design"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Visual identity
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Collection palette
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    {
                      name: "primaryColor",
                      label: "Primary",
                      value: primaryColor,
                      setter: setPrimaryColor,
                    },
                    {
                      name: "secondaryColor",
                      label: "Secondary",
                      value: secondaryColor,
                      setter: setSecondaryColor,
                    },
                    {
                      name: "accentColor",
                      label: "Accent",
                      value: accentColor,
                      setter: setAccentColor,
                    },
                  ].map(
                    (field) => (
                      <label key={field.name}>
                        <FieldLabel>
                          {field.label}
                        </FieldLabel>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] p-3">
                          <input
                            type="color"
                            name={field.name}
                            value={field.value}
                            onChange={(event) =>
                              field.setter(
                                event.target.value,
                              )
                            }
                            className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                          />

                          <span className="text-xs font-semibold uppercase text-white/55">
                            {field.value}
                          </span>
                        </div>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "seo"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Search visibility
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    SEO metadata
                  </h3>
                </div>

                <div className="space-y-5">
                  <label>
                    <FieldLabel>
                      Meta title
                    </FieldLabel>

                    <input
                      name="metaTitle"
                      defaultValue={
                        initialValues?.metaTitle ??
                        ""
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Meta description
                    </FieldLabel>

                    <textarea
                      name="metaDescription"
                      defaultValue={
                        initialValues?.metaDescription ??
                        ""
                      }
                      rows={5}
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none focus:border-lime-300/35"
                    />
                  </label>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "publication"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Visibility controls
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Publication
                  </h3>
                </div>

                <div className="space-y-5">
                  <label>
                    <FieldLabel>
                      Status
                    </FieldLabel>

                    <select
                      name="status"
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target
                            .value as CollectionStatus,
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="DRAFT">
                        Draft
                      </option>
                      <option value="PUBLISHED">
                        Published
                      </option>
                      <option value="ARCHIVED">
                        Archived
                      </option>
                    </select>
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
                        initialValues?.displayOrder ??
                        ""
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={
                        initialValues?.featured ??
                        false
                      }
                      className="h-4 w-4 accent-lime-300"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Featured collection
                      </span>

                      <span className="mt-1 block text-xs text-white/35">
                        Highlight this collection in the museum and future homepage sections.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </SectionPanel>
          </div>

          <aside
            className="border-t border-white/10 p-5 xl:border-l xl:border-t-0 xl:p-6"
            style={{
              backgroundColor:
                secondaryColor,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: primaryColor,
              }}
            >
              Live preview
            </p>

            <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#050B18]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={
                      title ||
                      name ||
                      "Collection preview"
                    }
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_20%,rgba(190,242,100,.15),transparent_35%),#0A1425]">
                    <ImageIcon
                      className="h-12 w-12"
                      style={{
                        color: primaryColor,
                      }}
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p
                    className="text-[8px] font-black uppercase tracking-[0.2em]"
                    style={{
                      color: primaryColor,
                    }}
                  >
                    {formatCollectionType(
                      type,
                    )}
                  </p>

                  <h4
                    className="mt-2 text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em]"
                    style={{
                      color: accentColor,
                    }}
                  >
                    {title ||
                      name ||
                      "Museum Collection"}
                  </h4>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-white/45">
                  {subtitle ||
                    "Your collection subtitle will appear here."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xs uppercase tracking-[0.14em] text-white/35">
                    {status}
                  </span>

                  <span
                    className="rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em]"
                    style={{
                      borderColor:
                        `${primaryColor}55`,
                      backgroundColor:
                        `${primaryColor}18`,
                      color: primaryColor,
                    }}
                  >
                    AGE202 Museum
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-3xl border border-white/10 bg-[#08111F] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/35">
          Save the collection identity first. Players, Artifacts, Originals and Media will be connected in the next builder step.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="reset"
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-6 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Save className="h-4 w-4" />
            {isEditing
              ? "Save changes"
              : "Save Collection"}
          </button>
        </div>
      </div>
    </form>
  );
}
