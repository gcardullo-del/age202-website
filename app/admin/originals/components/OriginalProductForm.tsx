"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Eye,
  FileText,
  Images,
  Landmark,
  Save,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductStatus,
} from "@/generated/prisma/client";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

import MediaUploader, {
  type ExistingMediaImage,
} from "@/components/media/MediaUploader";

import {
  createOriginalProduct,
} from "../actions/createOriginalProduct";

import {
  updateOriginalProduct,
} from "../actions/updateOriginalProduct";

type FormMode =
  | "create"
  | "edit";

type SectionId =
  | "general"
  | "media"
  | "marketplace"
  | "seo"
  | "publication";

export type OriginalProductInitialValues = {
  title?: string;
  subtitle?: string | null;
  slug?: string;
  description?: string | null;
  collection?: string | null;
  edition?: string | null;
  category?: OriginalProductCategory;
  material?: string | null;
  colour?: string | null;
  sizes?: string[];
  tags?: string[];
  price?: number | string | null;
  currency?: string | null;
  vintedUrl?: string | null;
  availability?: OriginalProductAvailability;
  status?: OriginalProductStatus;
  featured?: boolean;
  displayOrder?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: ExistingMediaImage[];
};

const sections = [
  {
    id: "general",
    label: "General",
    description:
      "Identity and product details",
    icon: Landmark,
  },
  {
    id: "media",
    label: "Media",
    description:
      "Cover and product gallery",
    icon: Images,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description:
      "Price and availability",
    icon: ShoppingBag,
  },
  {
    id: "seo",
    label: "SEO",
    description:
      "Search and social metadata",
    icon: Sparkles,
  },
  {
    id: "publication",
    label: "Publication",
    description:
      "Status and visibility",
    icon: FileText,
  },
] as const;

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

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

export default function OriginalProductForm({
  mode = "create",
  productId,
  initialValues,
  libraryAssets = [],
}: {
  mode?: FormMode;
  productId?: string;
  initialValues?: OriginalProductInitialValues;
  libraryAssets?: MediaAssetWithFolder[];
}) {
  const [activeSection, setActiveSection] =
    useState<SectionId>(
      "general",
    );

  const [title, setTitle] =
    useState(
      initialValues?.title ?? "",
    );

  const [subtitle, setSubtitle] =
    useState(
      initialValues?.subtitle ?? "",
    );

  const [category, setCategory] =
    useState<OriginalProductCategory>(
      initialValues?.category ??
        "TSHIRT",
    );

  const [collection, setCollection] =
    useState(
      initialValues?.collection ??
        "",
    );

  const [colour, setColour] =
    useState(
      initialValues?.colour ?? "",
    );

  const [price, setPrice] =
    useState(
      initialValues?.price ===
        null ||
        initialValues?.price ===
          undefined
        ? ""
        : String(
            initialValues.price,
          ),
    );

  const [
    availability,
    setAvailability,
  ] =
    useState<OriginalProductAvailability>(
      initialValues?.availability ??
        "COMING_SOON",
    );

  const [featured, setFeatured] =
    useState(
      initialValues?.featured ??
        false,
    );

  const isEditing =
    mode === "edit";

  if (
    isEditing &&
    !productId
  ) {
    throw new Error(
      "productId is required in edit mode.",
    );
  }

  const formAction =
    isEditing
      ? updateOriginalProduct
      : createOriginalProduct;

  const previewHref =
    isEditing &&
    initialValues?.status ===
      "PUBLISHED" &&
    initialValues.slug
      ? `/age202-originals/${encodeURIComponent(
          initialValues.slug,
        )}`
      : null;

  const coverImage =
    useMemo(
      () =>
        initialValues?.images?.find(
          (image) =>
            image.isCover,
        ) ??
        initialValues?.images?.[0] ??
        null,
      [initialValues?.images],
    );

  return (
    <form
      action={formAction}
      className="pb-8"
    >
      {productId ? (
        <input
          type="hidden"
          name="productId"
          value={productId}
        />
      ) : null}

      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 xl:flex-row xl:items-center xl:justify-between lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
                {isEditing
                  ? "Original workspace"
                  : "New AGE202 product"}
              </span>

              {initialValues?.status ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/55">
                  {
                    initialValues.status
                  }
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white">
              {title ||
                (isEditing
                  ? "Edit Original"
                  : "Create Original")}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Manage the official
              AGE202 branded product
              record.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {previewHref ? (
              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/5 px-4 py-2.5 text-sm font-medium text-white/25"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-5 py-2.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Save className="h-4 w-4" />
              {isEditing
                ? "Save changes"
                : "Save Original"}
            </button>
          </div>
        </div>

        <div className="grid xl:grid-cols-[250px_minmax(0,1fr)_330px]">
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
                          {
                            section.description
                          }
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
                    Product identity
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    General information
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="md:col-span-2">
                    <FieldLabel>
                      Title *
                    </FieldLabel>

                    <input
                      name="title"
                      required
                      value={title}
                      onChange={(
                        event,
                      ) =>
                        setTitle(
                          event.target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="AGE202 Classic Logo Tee"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Subtitle
                    </FieldLabel>

                    <input
                      name="subtitle"
                      value={subtitle}
                      onChange={(
                        event,
                      ) =>
                        setSubtitle(
                          event.target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="Official branded tennis lifestyle product"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Category *
                    </FieldLabel>

                    <select
                      name="category"
                      required
                      value={category}
                      onChange={(
                        event,
                      ) =>
                        setCategory(
                          event.target
                            .value as OriginalProductCategory,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      {[
                        "TSHIRT",
                        "POLO",
                        "HOODIE",
                        "SWEATSHIRT",
                        "CAP",
                        "BOTTLE",
                        "BAG",
                        "POSTER",
                        "ACCESSORY",
                        "OTHER",
                      ].map(
                        (value) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {value.replaceAll(
                              "_",
                              " ",
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    <FieldLabel>
                      Collection
                    </FieldLabel>

                    <input
                      name="collection"
                      value={collection}
                      onChange={(
                        event,
                      ) =>
                        setCollection(
                          event.target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="Core Collection"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Edition
                    </FieldLabel>

                    <input
                      name="edition"
                      defaultValue={
                        initialValues?.edition ??
                        ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="First Edition"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Colour
                    </FieldLabel>

                    <input
                      name="colour"
                      value={colour}
                      onChange={(
                        event,
                      ) =>
                        setColour(
                          event.target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="Black"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Material
                    </FieldLabel>

                    <input
                      name="material"
                      defaultValue={
                        initialValues?.material ??
                        ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="100% organic cotton"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Sizes
                    </FieldLabel>

                    <input
                      name="sizes"
                      defaultValue={
                        initialValues?.sizes?.join(
                          ", ",
                        ) ?? ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="S, M, L, XL"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Tags
                    </FieldLabel>

                    <input
                      name="tags"
                      defaultValue={
                        initialValues?.tags?.join(
                          ", ",
                        ) ?? ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="logo, tennis, lifestyle"
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
                      rows={7}
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35"
                      placeholder="Describe the product, its design and its connection to AGE202."
                    />
                  </label>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "media"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Product gallery
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Media
                  </h3>
                </div>

                <MediaUploader
                  existingImages={
                    initialValues?.images ??
                    []
                  }
                  libraryAssets={
                    libraryAssets
                  }
                />
              </div>
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "marketplace"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Commercial details
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Marketplace
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <FieldLabel>
                      Price
                    </FieldLabel>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={price}
                      onChange={(
                        event,
                      ) =>
                        setPrice(
                          event.target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="39.00"
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Currency
                    </FieldLabel>

                    <input
                      name="currency"
                      defaultValue={
                        initialValues?.currency ??
                        "EUR"
                      }
                      className={
                        inputClassName
                      }
                    />
                  </label>

                  <label>
                    <FieldLabel>
                      Availability
                    </FieldLabel>

                    <select
                      name="availability"
                      value={availability}
                      onChange={(
                        event,
                      ) =>
                        setAvailability(
                          event.target
                            .value as OriginalProductAvailability,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="AVAILABLE">
                        Available
                      </option>
                      <option value="SOLD">
                        Sold
                      </option>
                      <option value="COMING_SOON">
                        Coming soon
                      </option>
                      <option value="NOT_FOR_SALE">
                        Not for sale
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
                      className={
                        inputClassName
                      }
                    />
                  </label>

                  <label className="md:col-span-2">
                    <FieldLabel>
                      Vinted URL
                    </FieldLabel>

                    <input
                      type="url"
                      name="vintedUrl"
                      defaultValue={
                        initialValues?.vintedUrl ??
                        ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="https://www.vinted.it/items/..."
                    />
                  </label>

                  <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={featured}
                      onChange={(
                        event,
                      ) =>
                        setFeatured(
                          event.target
                            .checked,
                        )
                      }
                      className="h-4 w-4 accent-lime-300"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Featured product
                      </span>

                      <span className="mt-1 block text-xs text-white/35">
                        Show this product
                        prominently on the
                        Originals page.
                      </span>
                    </span>
                  </label>
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
                      Slug
                    </FieldLabel>

                    <input
                      name="slug"
                      defaultValue={
                        initialValues?.slug ??
                        ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="age202-classic-logo-tee"
                    />
                  </label>

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
                      className={
                        inputClassName
                      }
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
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-lime-300/35"
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

                <label>
                  <FieldLabel>
                    Status
                  </FieldLabel>

                  <select
                    name="status"
                    defaultValue={
                      initialValues?.status ??
                      "DRAFT"
                    }
                    className={
                      inputClassName
                    }
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

                <div className="rounded-2xl border border-white/10 bg-[#08111F] p-5 text-sm leading-6 text-white/45">
                  Published products
                  become visible on the
                  public AGE202 Originals
                  catalog. Drafts remain
                  private inside the Admin.
                </div>
              </div>
            </SectionPanel>
          </div>

          <aside className="border-t border-white/10 bg-[#07101D]/60 p-5 xl:border-l xl:border-t-0 xl:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
              Live preview
            </p>

            <div className="mt-5 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#050B18]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(190,242,100,.14),transparent_38%),#0A1425]">
                {coverImage ? (
                  <Image
                    src={
                      coverImage.url
                    }
                    alt={
  (coverImage.alt ?? title) ||
  "Original preview"
}
                    fill
                    sizes="330px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Sparkles className="h-10 w-10 text-lime-300/55" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-lime-300">
                    {collection ||
                      "AGE202 Originals"}
                  </p>

                  <h4 className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
                    {title ||
                      "Original product"}
                  </h4>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-white/38">
                  {subtitle ||
                    category.replaceAll(
                      "_",
                      " ",
                    )}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-white">
                    {price
                      ? `€${price}`
                      : "Price on request"}
                  </span>

                  <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-lime-200">
                    {availability.replaceAll(
                      "_",
                      " ",
                    )}
                  </span>
                </div>

                {colour ? (
                  <p className="mt-3 text-xs text-white/30">
                    Colour: {colour}
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-3xl border border-white/10 bg-[#08111F] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/35">
          Save the complete AGE202
          Originals product record.
        </p>

        <div className="flex items-center justify-end gap-3">
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
              : "Save Original"}
          </button>
        </div>
      </div>
    </form>
  );
}
