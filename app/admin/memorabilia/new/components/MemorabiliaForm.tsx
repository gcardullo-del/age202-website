"use client";

import Link from "next/link";

import {
  BadgeCheck,
  CircleDollarSign,
  FileText,
  Gem,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import { createMemorabilia } from "../../actions/createMemorabilia";
import { updateMemorabilia } from "../../actions/updateMemorabilia";

import MediaUploader, {
  type ExistingMediaImage,
} from "@/components/media/MediaUploader";

type PlayerOption = {
  id: string;
  name: string;
};

export type MemorabiliaFormInitialValues = {
  title?: string;
  subtitle?: string | null;
  inventoryNumber?: string;
  slug?: string;
  description?: string | null;
  type?: string;
  status?: string;
  availability?: string;
  condition?: string | null;
  rarity?: string;
  featured?: boolean;
  displayOrder?: number | null;
  playerId?: string | null;
  year?: number | null;
  brand?: string | null;
  collection?: string | null;
  edition?: string | null;
  serialNumber?: string | null;
  cardSet?: string | null;
  cardNumber?: string | null;
  gradingCompany?: string | null;
  grade?: string | null;
  gradingCertNumber?: string | null;
  signed?: boolean;
  signedBy?: string | null;
  signatureLocation?: string | null;
  authentic?: boolean;
  authenticationCompany?: string | null;
  authenticityCode?: string | null;
  certificateUrl?: string | null;
  material?: string | null;
  size?: string | null;
  colour?: string | null;
  price?: number | string | null;
  currency?: string | null;
  tags?: string[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: ExistingMediaImage[];
};

type MemorabiliaFormProps = {
  players: PlayerOption[];
  mode?: "create" | "edit";
  memorabiliaId?: string;
  initialValues?: MemorabiliaFormInitialValues;
};

const types = [
  "TRADING_CARD",
  "SIGNED_JERSEY",
  "SIGNED_RACQUET",
  "SIGNED_BALL",
  "SIGNED_PHOTO",
  "SIGNED_ITEM",
  "RACQUET",
  "TROPHY",
  "PROGRAMME",
  "TICKET",
  "OTHER",
] as const;

const statuses = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

const availabilities = [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "COMING_SOON",
  "NOT_FOR_SALE",
] as const;

const conditions = [
  "",
  "MINT",
  "NEAR_MINT",
  "EXCELLENT",
  "VERY_GOOD",
  "GOOD",
  "FAIR",
  "POOR",
] as const;

const rarities = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "ULTRA_RARE",
  "ONE_OF_ONE",
] as const;

function formatLabel(
  value: string,
) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/30 focus:bg-white/[0.05]";

const selectClass =
  `${inputClass} [color-scheme:dark] [&>option]:bg-[#0B132B] [&>option]:text-white`;

const textareaClass =
  "min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/30 focus:bg-white/[0.05]";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35";

function Section({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Gem;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
      <div className="flex items-start gap-4 border-b border-white/[0.07] pb-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06] text-lime-300">
          <Icon className="size-5" />
        </span>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300/65">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

export default function MemorabiliaForm({
  players,
  mode = "create",
  memorabiliaId,
  initialValues,
}: MemorabiliaFormProps) {
  const isEditing =
    mode === "edit";

  if (
    isEditing &&
    !memorabiliaId
  ) {
    throw new Error(
      "memorabiliaId is required in edit mode.",
    );
  }

  const formAction =
    isEditing
      ? updateMemorabilia
      : createMemorabilia;

  return (
    <form
      action={formAction}
      className="space-y-7"
    >
      {isEditing ? (
        <input
          type="hidden"
          name="memorabiliaId"
          value={memorabiliaId}
        />
      ) : null}
      <section className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 size-64 rounded-full bg-lime-300/[0.08] blur-3xl"
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime-300/70">
              <Sparkles className="size-4" />
              Collectible Studio
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">
              {isEditing ? "Edit memorabilia record." : "Create memorabilia record."}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
              {isEditing
                ? "Update the collectible record while preserving its catalog identity."
                : "Build the museum record first. Stripe, images and the public detail page can then use this same catalog entry."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/memorabilia"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Save className="size-4" />
              {isEditing ? "Save Changes" : "Create Memorabilia"}
            </button>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Identity"
        title="General information"
        description="The core catalog identity used by both the CMS and public archive."
        icon={Gem}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className={labelClass}
            >
              Title *
            </label>

            <input
              id="title"
              name="title"
              required
              defaultValue={initialValues?.title ?? ""}
              className={inputClass}
              placeholder="e.g. Roger Federer signed photo"
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className={labelClass}
            >
              Subtitle
            </label>

            <input
              id="subtitle"
              name="subtitle"
              defaultValue={initialValues?.subtitle ?? ""}
              className={inputClass}
              placeholder="Optional secondary title"
            />
          </div>

          <div>
            <label
              htmlFor="inventoryNumber"
              className={labelClass}
            >
              Inventory number
            </label>

            <input
              id="inventoryNumber"
              name="inventoryNumber"
              defaultValue={initialValues?.inventoryNumber ?? ""}
              className={inputClass}
              placeholder="Auto-generated if empty"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className={labelClass}
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              defaultValue={initialValues?.slug ?? ""}
              className={inputClass}
              placeholder="Auto-generated from title"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className={labelClass}
            >
              Type *
            </label>

            <select
              id="type"
              name="type"
              required
              defaultValue={initialValues?.type ?? "TRADING_CARD"}
              className={selectClass}
            >
              {types.map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="playerId"
              className={labelClass}
            >
              Player
            </label>

            <select
              id="playerId"
              name="playerId"
              defaultValue={initialValues?.playerId ?? ""}
              className={selectClass}
            >
              <option value="">
                Not assigned
              </option>

              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                >
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className={labelClass}
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={initialValues?.description ?? ""}
              className={textareaClass}
              placeholder="Describe the object, provenance and museum context."
            />
          </div>
        </div>
      </Section>


      <Section
        eyebrow="Media"
        title="Images & cover"
        description="Upload up to 10 images, choose the cover, reorder the gallery and remove existing media."
        icon={Gem}
      >
        <MediaUploader
          existingImages={
            initialValues?.images ?? []
          }
        />

        <div className="mt-5 rounded-2xl border border-sky-300/15 bg-sky-300/[0.04] px-4 py-4 text-sm leading-6 text-white/40">
          Supported formats: JPG, PNG, WEBP and AVIF. The selected cover
          represents the memorabilia item in the CMS and public catalog.
        </div>
      </Section>

      <Section
        eyebrow="Classification"
        title="Object details"
        description="Describe the physical item and its place in the collection."
        icon={Star}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label
              htmlFor="year"
              className={labelClass}
            >
              Year
            </label>

            <input
              id="year"
              name="year"
              type="number"
              min="1800"
              max="2100"
              defaultValue={initialValues?.year ?? ""}
              className={inputClass}
              placeholder="2025"
            />
          </div>

          <div>
            <label
              htmlFor="brand"
              className={labelClass}
            >
              Brand
            </label>

            <input
              id="brand"
              name="brand"
              defaultValue={initialValues?.brand ?? ""}
              className={inputClass}
              placeholder="Nike, Wilson, Topps..."
            />
          </div>

          <div>
            <label
              htmlFor="collection"
              className={labelClass}
            >
              Collection
            </label>

            <input
              id="collection"
              name="collection"
              defaultValue={initialValues?.collection ?? ""}
              className={inputClass}
              placeholder="US Open, Wimbledon..."
            />
          </div>

          <div>
            <label
              htmlFor="edition"
              className={labelClass}
            >
              Edition
            </label>

            <input
              id="edition"
              name="edition"
              defaultValue={initialValues?.edition ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="serialNumber"
              className={labelClass}
            >
              Serial number
            </label>

            <input
              id="serialNumber"
              name="serialNumber"
              defaultValue={initialValues?.serialNumber ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="condition"
              className={labelClass}
            >
              Condition
            </label>

            <select
              id="condition"
              name="condition"
              defaultValue={initialValues?.condition ?? ""}
              className={selectClass}
            >
              {conditions.map((value) => (
                <option
                  key={value || "none"}
                  value={value}
                >
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rarity"
              className={labelClass}
            >
              Rarity
            </label>

            <select
              id="rarity"
              name="rarity"
              defaultValue={initialValues?.rarity ?? "COMMON"}
              className={selectClass}
            >
              {rarities.map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="material"
              className={labelClass}
            >
              Material
            </label>

            <input
              id="material"
              name="material"
              defaultValue={initialValues?.material ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="size"
              className={labelClass}
            >
              Size
            </label>

            <input
              id="size"
              name="size"
              defaultValue={initialValues?.size ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="colour"
              className={labelClass}
            >
              Colour
            </label>

            <input
              id="colour"
              name="colour"
              defaultValue={initialValues?.colour ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="displayOrder"
              className={labelClass}
            >
              Display order
            </label>

            <input
              id="displayOrder"
              name="displayOrder"
              type="number"
              defaultValue={initialValues?.displayOrder ?? ""}
              className={inputClass}
            />
          </div>

          <label className="flex h-12 items-center gap-3 self-end rounded-2xl border border-white/10 bg-white/[0.025] px-4 text-sm text-white/65">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initialValues?.featured ?? false}
              className="size-4 accent-lime-300"
            />

            Featured item
          </label>
        </div>
      </Section>

      <Section
        eyebrow="Card data"
        title="Trading card & grading"
        description="Optional fields for collectible cards and professionally graded pieces."
        icon={FileText}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label
              htmlFor="cardSet"
              className={labelClass}
            >
              Card set
            </label>

            <input
              id="cardSet"
              name="cardSet"
              defaultValue={initialValues?.cardSet ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className={labelClass}
            >
              Card number
            </label>

            <input
              id="cardNumber"
              name="cardNumber"
              defaultValue={initialValues?.cardNumber ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="gradingCompany"
              className={labelClass}
            >
              Grading company
            </label>

            <input
              id="gradingCompany"
              name="gradingCompany"
              defaultValue={initialValues?.gradingCompany ?? ""}
              className={inputClass}
              placeholder="PSA, BGS..."
            />
          </div>

          <div>
            <label
              htmlFor="grade"
              className={labelClass}
            >
              Grade
            </label>

            <input
              id="grade"
              name="grade"
              defaultValue={initialValues?.grade ?? ""}
              className={inputClass}
              placeholder="10, 9.5..."
            />
          </div>

          <div>
            <label
              htmlFor="gradingCertNumber"
              className={labelClass}
            >
              Grading certificate
            </label>

            <input
              id="gradingCertNumber"
              name="gradingCertNumber"
              defaultValue={initialValues?.gradingCertNumber ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Provenance"
        title="Signature & authenticity"
        description="Record signatures, authentication data and supporting certificates."
        icon={ShieldCheck}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 text-sm text-white/65">
            <input
              type="checkbox"
              name="signed"
              defaultChecked={initialValues?.signed ?? false}
              className="size-4 accent-lime-300"
            />

            Signed item
          </label>

          <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 text-sm text-white/65">
            <input
              type="checkbox"
              name="authentic"
              defaultChecked={initialValues?.authentic ?? false}
              className="size-4 accent-lime-300"
            />

            Authenticated
          </label>

          <div>
            <label
              htmlFor="signedBy"
              className={labelClass}
            >
              Signed by
            </label>

            <input
              id="signedBy"
              name="signedBy"
              defaultValue={initialValues?.signedBy ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="signatureLocation"
              className={labelClass}
            >
              Signature location
            </label>

            <input
              id="signatureLocation"
              name="signatureLocation"
              defaultValue={initialValues?.signatureLocation ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="authenticationCompany"
              className={labelClass}
            >
              Authentication company
            </label>

            <input
              id="authenticationCompany"
              name="authenticationCompany"
              defaultValue={initialValues?.authenticationCompany ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="authenticityCode"
              className={labelClass}
            >
              Authenticity code
            </label>

            <input
              id="authenticityCode"
              name="authenticityCode"
              defaultValue={initialValues?.authenticityCode ?? ""}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <label
              htmlFor="certificateUrl"
              className={labelClass}
            >
              Certificate URL
            </label>

            <input
              id="certificateUrl"
              name="certificateUrl"
              type="url"
              defaultValue={initialValues?.certificateUrl ?? ""}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Commerce"
        title="Marketplace"
        description="Set sale availability and the price used by the commerce layer."
        icon={CircleDollarSign}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="availability"
              className={labelClass}
            >
              Availability
            </label>

            <select
              id="availability"
              name="availability"
              defaultValue={initialValues?.availability ?? "COMING_SOON"}
              className={selectClass}
            >
              {availabilities.map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className={labelClass}
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialValues?.price ?? ""}
              className={inputClass}
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className={labelClass}
            >
              Currency
            </label>

            <input
              id="currency"
              name="currency"
              defaultValue={initialValues?.currency ?? "EUR"}
              maxLength={3}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className={labelClass}
            >
              Publication status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={initialValues?.status ?? "DRAFT"}
              className={selectClass}
            >
              {statuses.map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Discovery"
        title="Tags & SEO"
        description="Optional metadata for search, grouping and future public presentation."
        icon={BadgeCheck}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="tags"
              className={labelClass}
            >
              Tags
            </label>

            <input
              id="tags"
              name="tags"
              defaultValue={initialValues?.tags?.join(", ") ?? ""}
              className={inputClass}
              placeholder="federer, signed, wimbledon, 2009"
            />

            <p className="mt-2 text-xs text-white/25">
              Separate tags with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="metaTitle"
              className={labelClass}
            >
              Meta title
            </label>

            <input
              id="metaTitle"
              name="metaTitle"
              defaultValue={initialValues?.metaTitle ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="metaDescription"
              className={labelClass}
            >
              Meta description
            </label>

            <input
              id="metaDescription"
              name="metaDescription"
              defaultValue={initialValues?.metaDescription ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
        >
          <Save className="size-4" />
          {isEditing ? "Save Changes" : "Create Memorabilia"}
        </button>
      </div>
    </form>
  );
}