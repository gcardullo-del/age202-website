"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Boxes,
  Eye,
  FileText,
  Images,
  Landmark,
  Plus,
  Save,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductLogoTone,
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
  | "variants"
  | "commerce"
  | "seo"
  | "publication";


type VariantStockInitialValue = {
  id?: string;
  size: string;
  stock: number;
  active: boolean;
};


type VariantInitialValue = {
  id?: string;
  name: string;
  colour: string;
  colourHex?: string | null;
  logoTone: OriginalProductLogoTone;
  sku?: string | null;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
  images?: ExistingMediaImage[];
  stock: VariantStockInitialValue[];
};


type VariantStockDraft = {
  size: string;
  stock: string;
  active: boolean;
};


type VariantDraft = {
  clientId: string;
  id?: string;
  name: string;
  colour: string;
  colourHex: string;
  logoTone: OriginalProductLogoTone;
  sku: string;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
  images: ExistingMediaImage[];
  stock: VariantStockDraft[];
};


export type OriginalProductInitialValues = {
  title?: string;
  subtitle?: string | null;
  slug?: string;
  description?: string | null;
  collection?: string | null;
  edition?: string | null;
  category?: OriginalProductCategory;
  material?: string | null;

  /*
   * Legacy fields.
   * Restano nel tipo temporaneamente
   * per compatibilità con record esistenti.
   */
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
  variants?: VariantInitialValue[];
};


const DEFAULT_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];


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
      "Main product gallery",
    icon: Images,
  },
  {
    id: "variants",
    label: "Variants",
    description:
      "Colours, logos, sizes and stock",
    icon: Boxes,
  },
  {
    id: "commerce",
    label: "Commerce",
    description:
      "AGE202 price and availability",
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


function createClientId(): string {
  return `variant-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}


function createDefaultStock(): VariantStockDraft[] {
  return DEFAULT_SIZES.map(
    (size) => ({
      size,
      stock: "0",
      active: true,
    }),
  );
}


function makeVariantDraft(
  initial?: VariantInitialValue,
): VariantDraft {
  return {
    clientId:
      initial?.id ??
      createClientId(),

    id:
      initial?.id,

    name:
      initial?.name ??
      "",

    colour:
      initial?.colour ??
      "",

    colourHex:
      initial?.colourHex ??
      "#000000",

    logoTone:
      initial?.logoTone ??
      "WHITE",

    sku:
      initial?.sku ??
      "",

    active:
      initial?.active ??
      true,

    isDefault:
      initial?.isDefault ??
      false,

    sortOrder:
      initial?.sortOrder ??
      0,

    images:
      initial?.images ??
      [],

    stock:
      initial?.stock?.length
        ? initial.stock.map(
            (item) => ({
              size:
                item.size,

              stock:
                String(
                  item.stock,
                ),

              active:
                item.active,
            }),
          )
        : createDefaultStock(),
  };
}


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
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<SectionId>(
      "general",
    );

  const [
    title,
    setTitle,
  ] =
    useState(
      initialValues?.title ??
        "",
    );

  const [
    subtitle,
    setSubtitle,
  ] =
    useState(
      initialValues?.subtitle ??
        "",
    );

  const [
    category,
    setCategory,
  ] =
    useState<OriginalProductCategory>(
      initialValues?.category ??
        "TSHIRT",
    );

  const [
    collection,
    setCollection,
  ] =
    useState(
      initialValues?.collection ??
        "",
    );

  const [
    price,
    setPrice,
  ] =
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

  const [
    featured,
    setFeatured,
  ] =
    useState(
      initialValues?.featured ??
        false,
    );

  const [
    variants,
    setVariants,
  ] =
    useState<VariantDraft[]>(
      () =>
        initialValues?.variants?.length
          ? initialValues.variants.map(
              (
                variant,
              ) =>
                makeVariantDraft(
                  variant,
                ),
            )
          : [],
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
      [
        initialValues?.images,
      ],
    );


  const defaultVariant =
    useMemo(
      () =>
        variants.find(
          (variant) =>
            variant.isDefault,
        ) ??
        variants[0] ??
        null,
      [variants],
    );


  const variantsJson =
    useMemo(
      () =>
        JSON.stringify(
          variants.map(
            (
              variant,
              index,
            ) => ({
              id:
                variant.id ??
                null,

              /*
               * Stable form namespace used by the
               * variant-specific MediaUploader.
               *
               * The backend will use this key to
               * associate the submitted media fields
               * with this exact variant.
               */
              mediaKey:
                variant.clientId,

              name:
                variant.name.trim(),

              colour:
                variant.colour.trim(),

              colourHex:
                variant.colourHex.trim() ||
                null,

              logoTone:
                variant.logoTone,

              sku:
                variant.sku.trim() ||
                null,

              active:
                variant.active,

              isDefault:
                variant.isDefault,

              sortOrder:
                index,

              stock:
                variant.stock
                  .filter(
                    (item) =>
                      item.size.trim(),
                  )
                  .map(
                    (
                      item,
                    ) => ({
                      size:
                        item.size
                          .trim()
                          .toUpperCase(),

                      stock:
                        Math.max(
                          0,
                          Number.parseInt(
                            item.stock ||
                              "0",
                            10,
                          ) ||
                            0,
                        ),

                      active:
                        item.active,
                    }),
                  ),
            }),
          ),
        ),
      [variants],
    );


  function addVariant() {
    setVariants(
      (
        current,
      ) => {
        const next =
          makeVariantDraft();

        next.isDefault =
          current.length ===
          0;

        next.sortOrder =
          current.length;

        return [
          ...current,
          next,
        ];
      },
    );
  }


  function removeVariant(
    clientId: string,
  ) {
    setVariants(
      (
        current,
      ) => {
        const removed =
          current.find(
            (variant) =>
              variant.clientId ===
              clientId,
          );

        const next =
          current.filter(
            (variant) =>
              variant.clientId !==
              clientId,
          );

        if (
          removed?.isDefault &&
          next.length >
            0
        ) {
          return next.map(
            (
              variant,
              index,
            ) => ({
              ...variant,

              isDefault:
                index ===
                0,

              sortOrder:
                index,
            }),
          );
        }

        return next.map(
          (
            variant,
            index,
          ) => ({
            ...variant,

            sortOrder:
              index,
          }),
        );
      },
    );
  }


  function updateVariant(
    clientId: string,
    patch: Partial<VariantDraft>,
  ) {
    setVariants(
      (
        current,
      ) =>
        current.map(
          (variant) =>
            variant.clientId ===
            clientId
              ? {
                  ...variant,
                  ...patch,
                }
              : variant,
        ),
    );
  }


  function setDefaultVariant(
    clientId: string,
  ) {
    setVariants(
      (
        current,
      ) =>
        current.map(
          (variant) => ({
            ...variant,

            isDefault:
              variant.clientId ===
              clientId,
          }),
        ),
    );
  }


  function updateStock(
    clientId: string,
    stockIndex: number,
    patch: Partial<VariantStockDraft>,
  ) {
    setVariants(
      (
        current,
      ) =>
        current.map(
          (variant) => {
            if (
              variant.clientId !==
              clientId
            ) {
              return variant;
            }

            return {
              ...variant,

              stock:
                variant.stock.map(
                  (
                    item,
                    index,
                  ) =>
                    index ===
                    stockIndex
                      ? {
                          ...item,
                          ...patch,
                        }
                      : item,
                ),
            };
          },
        ),
    );
  }


  function addStockSize(
    clientId: string,
  ) {
    setVariants(
      (
        current,
      ) =>
        current.map(
          (variant) =>
            variant.clientId ===
            clientId
              ? {
                  ...variant,

                  stock: [
                    ...variant.stock,
                    {
                      size:
                        "",
                      stock:
                        "0",
                      active:
                        true,
                    },
                  ],
                }
              : variant,
        ),
    );
  }


  function removeStockSize(
    clientId: string,
    stockIndex: number,
  ) {
    setVariants(
      (
        current,
      ) =>
        current.map(
          (variant) =>
            variant.clientId ===
            clientId
              ? {
                  ...variant,

                  stock:
                    variant.stock.filter(
                      (
                        _,
                        index,
                      ) =>
                        index !==
                        stockIndex,
                    ),
                }
              : variant,
        ),
    );
  }


  return (
    <form
      action={
        formAction
      }
      className="pb-8"
    >
      {productId ? (
        <input
          type="hidden"
          name="productId"
          value={
            productId
          }
        />
      ) : null}


      <input
        type="hidden"
        name="variantsJson"
        value={
          variantsJson
        }
      />


      {/*
        Legacy compatibility.

        Vinted is no longer exposed
        anywhere in AGE202 Originals.
      */}
      <input
        type="hidden"
        name="vintedUrl"
        value=""
      />


      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
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
              Manage an official AGE202
              product sold directly
              through AGE202.com.
            </p>
          </div>


          <div className="flex flex-wrap items-center gap-3">
            {previewHref ? (
              <Link
                href={
                  previewHref
                }
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
                (
                  section,
                ) => {
                  const Icon =
                    section.icon;

                  const isActive =
                    activeSection ===
                    section.id;

                  return (
                    <button
                      key={
                        section.id
                      }
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
                          {
                            section.label
                          }
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
            {/* ==============================
                GENERAL
            ============================== */}

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
                      value={
                        title
                      }
                      onChange={(
                        event,
                      ) =>
                        setTitle(
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="AGE202 Essential T-Shirt"
                    />
                  </label>


                  <label className="md:col-span-2">
                    <FieldLabel>
                      Subtitle
                    </FieldLabel>

                    <input
                      name="subtitle"
                      value={
                        subtitle
                      }
                      onChange={(
                        event,
                      ) =>
                        setSubtitle(
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="Official AGE202 tennis lifestyle essential"
                    />
                  </label>


                  <label>
                    <FieldLabel>
                      Category *
                    </FieldLabel>

                    <select
                      name="category"
                      required
                      value={
                        category
                      }
                      onChange={(
                        event,
                      ) =>
                        setCategory(
                          event
                            .target
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
                        (
                          value,
                        ) => (
                          <option
                            key={
                              value
                            }
                            value={
                              value
                            }
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
                      value={
                        collection
                      }
                      onChange={(
                        event,
                      ) =>
                        setCollection(
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="AGE202 Core Collection"
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
                      placeholder="100% cotton"
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
                        ) ??
                        ""
                      }
                      className={
                        inputClassName
                      }
                      placeholder="age202, tennis, original, essential"
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
                      rows={
                        7
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35"
                      placeholder="Describe the AGE202 Original, its materials, design and identity."
                    />
                  </label>
                </div>


                <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.035] p-5">
                  <p className="text-sm font-semibold text-lime-200">
                    Colours and sizes now
                    belong to Variants.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/40">
                    A single Original can
                    contain BLACK, WHITE
                    and future colourways,
                    each with its own logo
                    tone and stock.
                  </p>
                </div>
              </div>
            </SectionPanel>


            {/* ==============================
                MEDIA
            ============================== */}

            <SectionPanel
              active={
                activeSection ===
                "media"
              }
            >
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Product media
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Media
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                    Keep a global gallery for the
                    Original and, when needed, attach
                    a dedicated gallery to each colour
                    variant. Variant galleries remain
                    isolated from the main gallery.
                  </p>
                </div>

                <section className="rounded-3xl border border-white/10 bg-[#07101D] p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-200/70">
                      Main product gallery
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-white">
                      Global images
                    </h4>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Used as the product-level gallery
                      and as a fallback when a selected
                      colour does not have its own media.
                    </p>
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
                </section>

                <section className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-200/70">
                      Variant galleries
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-white">
                      Images by colour
                    </h4>

                    <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                      Each gallery is submitted with
                      its own namespaced form fields,
                      so BLACK, WHITE and future
                      colourways cannot overwrite one
                      another or the global gallery.
                    </p>
                  </div>

                  {variants.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/12 bg-[#08111F]/55 p-8 text-center">
                      <Images className="mx-auto h-9 w-9 text-lime-300/40" />

                      <p className="mt-4 text-sm font-semibold text-white">
                        Create a colour variant first
                      </p>

                      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/35">
                        Variant-specific galleries will
                        appear here automatically after
                        you add BLACK, WHITE or another
                        colourway in the Variants section.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {variants.map(
                        (
                          variant,
                          variantIndex,
                        ) => {
                          const variantLabel =
                            variant.name.trim() ||
                            variant.colour.trim() ||
                            `Variant ${
                              variantIndex + 1
                            }`;

                          return (
                            <div
                              key={
                                `media-${variant.clientId}`
                              }
                              className="overflow-hidden rounded-3xl border border-white/10 bg-[#07101D]"
                            >
                              <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                  <span
                                    className="h-10 w-10 shrink-0 rounded-full border border-white/20"
                                    style={{
                                      backgroundColor:
                                        variant.colourHex ||
                                        "#000000",
                                    }}
                                  />

                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-semibold text-white">
                                        {variantLabel}
                                      </p>

                                      {variant.isDefault ? (
                                        <span className="rounded-full bg-lime-300 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#050B18]">
                                          Default
                                        </span>
                                      ) : null}
                                    </div>

                                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/30">
                                      {variant.logoTone} AGE202 logo
                                    </p>
                                  </div>
                                </div>

                                <p className="text-xs text-white/30">
                                  Independent gallery · max 10 images
                                </p>
                              </div>

                              <div className="p-5 sm:p-6">
                                <MediaUploader
                                  existingImages={
                                    variant.images
                                  }
                                  libraryAssets={
                                    libraryAssets
                                  }
                                  fieldNamePrefix={
                                    `variantMedia_${variant.clientId}`
                                  }
                                />
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </section>

                <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.035] p-5">
                  <p className="text-sm font-semibold text-lime-200">
                    Safe media isolation
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/40">
                    The global uploader still uses the
                    original field names. Only these
                    Original variant galleries use the
                    optional field prefix, so existing
                    AGE202 upload flows remain unchanged.
                  </p>
                </div>
              </div>
            </SectionPanel>


            {/* ==============================
                VARIANTS
            ============================== */}

            <SectionPanel
              active={
                activeSection ===
                "variants"
              }
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                      Product variants
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      Colours, logo & stock
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                      Each colour has its
                      own AGE202 logo tone
                      and inventory by size.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addVariant
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
                  >
                    <Plus className="h-4 w-4" />

                    Add colour variant
                  </button>
                </div>


                {variants.length ===
                0 ? (
                  <div className="rounded-3xl border border-dashed border-white/12 bg-[#08111F]/55 p-10 text-center">
                    <Boxes className="mx-auto h-10 w-10 text-lime-300/45" />

                    <h4 className="mt-4 text-lg font-semibold text-white">
                      No variants yet
                    </h4>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/38">
                      Add BLACK, WHITE or
                      another colourway and
                      configure logo and
                      stock.
                    </p>

                    <button
                      type="button"
                      onClick={
                        addVariant
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-lime-300/25 px-4 py-2.5 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/10"
                    >
                      <Plus className="h-4 w-4" />

                      Create first variant
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {variants.map(
                      (
                        variant,
                        variantIndex,
                      ) => (
                        <div
                          key={
                            variant.clientId
                          }
                          className="overflow-hidden rounded-3xl border border-white/10 bg-[#07101D]"
                        >
                          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <span
                                className="h-11 w-11 shrink-0 rounded-full border border-white/20 shadow-inner"
                                style={{
                                  backgroundColor:
                                    variant.colourHex ||
                                    "#000000",
                                }}
                              />

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-semibold text-white">
                                    {variant.name ||
                                      variant.colour ||
                                      `Variant ${
                                        variantIndex +
                                        1
                                      }`}
                                  </h4>

                                  {variant.isDefault ? (
                                    <span className="rounded-full bg-lime-300 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#050B18]">
                                      Default
                                    </span>
                                  ) : null}

                                  {!variant.active ? (
                                    <span className="rounded-full border border-white/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/35">
                                      Disabled
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-1 text-xs text-white/35">
                                  Logo:{" "}
                                  {
                                    variant.logoTone
                                  }
                                </p>
                              </div>
                            </div>


                            <button
                              type="button"
                              onClick={() =>
                                removeVariant(
                                  variant.clientId,
                                )
                              }
                              className="inline-flex items-center gap-2 self-start rounded-xl border border-red-400/15 px-3 py-2 text-xs font-semibold text-red-300/70 transition hover:bg-red-400/10 sm:self-auto"
                            >
                              <Trash2 className="h-4 w-4" />

                              Remove
                            </button>
                          </div>


                          <div className="grid gap-5 p-5 md:grid-cols-2">
                            <label>
                              <FieldLabel>
                                Variant name *
                              </FieldLabel>

                              <input
                                value={
                                  variant.name
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    variant.clientId,
                                    {
                                      name:
                                        event
                                          .target
                                          .value,
                                    },
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
                                Colour *
                              </FieldLabel>

                              <input
                                value={
                                  variant.colour
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    variant.clientId,
                                    {
                                      colour:
                                        event
                                          .target
                                          .value,
                                    },
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
                                Colour HEX
                              </FieldLabel>

                              <div className="flex gap-3">
                                <input
                                  type="color"
                                  value={
                                    variant.colourHex ||
                                    "#000000"
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateVariant(
                                      variant.clientId,
                                      {
                                        colourHex:
                                          event
                                            .target
                                            .value,
                                      },
                                    )
                                  }
                                  className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-[#08111F] p-1"
                                />

                                <input
                                  value={
                                    variant.colourHex
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateVariant(
                                      variant.clientId,
                                      {
                                        colourHex:
                                          event
                                            .target
                                            .value,
                                      },
                                    )
                                  }
                                  className={
                                    inputClassName
                                  }
                                  placeholder="#000000"
                                />
                              </div>
                            </label>


                            <label>
                              <FieldLabel>
                                AGE202 logo tone *
                              </FieldLabel>

                              <select
                                value={
                                  variant.logoTone
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    variant.clientId,
                                    {
                                      logoTone:
                                        event
                                          .target
                                          .value as OriginalProductLogoTone,
                                    },
                                  )
                                }
                                className={
                                  inputClassName
                                }
                              >
                                <option value="WHITE">
                                  White logo
                                </option>

                                <option value="BLACK">
                                  Black logo
                                </option>
                              </select>
                            </label>


                            <label className="md:col-span-2">
                              <FieldLabel>
                                SKU
                              </FieldLabel>

                              <input
                                value={
                                  variant.sku
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    variant.clientId,
                                    {
                                      sku:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                className={
                                  inputClassName
                                }
                                placeholder="AGE202-TEE-BLK"
                              />
                            </label>


                            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
                              <input
                                type="radio"
                                name="defaultVariantPreview"
                                checked={
                                  variant.isDefault
                                }
                                onChange={() =>
                                  setDefaultVariant(
                                    variant.clientId,
                                  )
                                }
                                className="h-4 w-4 accent-lime-300"
                              />

                              <span>
                                <span className="block text-sm font-semibold text-white">
                                  Default colour
                                </span>

                                <span className="mt-1 block text-xs text-white/35">
                                  Selected first
                                  on the public
                                  product page.
                                </span>
                              </span>
                            </label>


                            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
                              <input
                                type="checkbox"
                                checked={
                                  variant.active
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    variant.clientId,
                                    {
                                      active:
                                        event
                                          .target
                                          .checked,
                                    },
                                  )
                                }
                                className="h-4 w-4 accent-lime-300"
                              />

                              <span>
                                <span className="block text-sm font-semibold text-white">
                                  Active variant
                                </span>

                                <span className="mt-1 block text-xs text-white/35">
                                  Available for
                                  selection when
                                  published.
                                </span>
                              </span>
                            </label>
                          </div>


                          <div className="border-t border-white/10 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  Size inventory
                                </p>

                                <p className="mt-1 text-xs text-white/35">
                                  Stock is tracked
                                  independently for
                                  each size.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  addStockSize(
                                    variant.clientId,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
                              >
                                <Plus className="h-3.5 w-3.5" />

                                Add size
                              </button>
                            </div>


                            <div className="mt-4 space-y-2">
                              {variant.stock.map(
                                (
                                  item,
                                  stockIndex,
                                ) => (
                                  <div
                                    key={`${variant.clientId}-${stockIndex}`}
                                    className="grid grid-cols-[minmax(0,1fr)_110px_42px] gap-2"
                                  >
                                    <input
                                      value={
                                        item.size
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateStock(
                                          variant.clientId,
                                          stockIndex,
                                          {
                                            size:
                                              event
                                                .target
                                                .value,
                                          },
                                        )
                                      }
                                      className={
                                        inputClassName
                                      }
                                      placeholder="Size"
                                    />

                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        item.stock
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateStock(
                                          variant.clientId,
                                          stockIndex,
                                          {
                                            stock:
                                              event
                                                .target
                                                .value,
                                          },
                                        )
                                      }
                                      className={
                                        inputClassName
                                      }
                                      placeholder="0"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeStockSize(
                                          variant.clientId,
                                          stockIndex,
                                        )
                                      }
                                      className="grid h-12 w-10 place-items-center rounded-xl border border-white/10 text-white/30 transition hover:border-red-400/20 hover:text-red-300"
                                      aria-label="Remove size"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </SectionPanel>


            {/* ==============================
                COMMERCE
            ============================== */}

            <SectionPanel
              active={
                activeSection ===
                "commerce"
              }
            >
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                    Direct AGE202 commerce
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Commerce
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Originals are sold
                    directly on AGE202.com.
                    No external marketplace.
                  </p>
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
                      value={
                        price
                      }
                      onChange={(
                        event,
                      ) =>
                        setPrice(
                          event
                            .target
                            .value,
                        )
                      }
                      className={
                        inputClassName
                      }
                      placeholder="29.00"
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
                      value={
                        availability
                      }
                      onChange={(
                        event,
                      ) =>
                        setAvailability(
                          event
                            .target
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


                  <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#08111F] px-4 py-4">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        featured
                      }
                      onChange={(
                        event,
                      ) =>
                        setFeatured(
                          event
                            .target
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
                        Show this Original
                        prominently on the
                        public collection.
                      </span>
                    </span>
                  </label>


                  <div className="md:col-span-2 rounded-2xl border border-lime-300/15 bg-lime-300/[0.035] p-5">
                    <p className="text-sm font-semibold text-lime-200">
                      AGE202 Checkout
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/40">
                      Purchase takes place
                      directly on the AGE202
                      website through the
                      checkout infrastructure.
                      There is no Vinted URL
                      for Originals.
                    </p>
                  </div>
                </div>
              </div>
            </SectionPanel>


            {/* ==============================
                SEO
            ============================== */}

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
                      placeholder="age202-essential-t-shirt"
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
                      rows={
                        5
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-lime-300/35"
                    />
                  </label>
                </div>
              </div>
            </SectionPanel>


            {/* ==============================
                PUBLICATION
            ============================== */}

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
                  Published Originals become
                  visible in the AGE202 store.
                  Drafts remain private inside
                  the Admin.
                </div>
              </div>
            </SectionPanel>
          </div>


          {/* ==============================
              LIVE PREVIEW
          ============================== */}

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
                      (coverImage.alt ??
                        title) ||
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


                {defaultVariant ? (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-5 w-5 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            defaultVariant.colourHex ||
                            "#000000",
                        }}
                      />

                      <div>
                        <p className="text-xs font-semibold text-white/70">
                          {defaultVariant.colour ||
                            defaultVariant.name ||
                            "Default variant"}
                        </p>

                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/30">
                          {
                            defaultVariant.logoTone
                          }{" "}
                          AGE202 logo
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>


            <div className="mt-4 rounded-2xl border border-white/10 p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
                Variants
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {
                  variants.length
                }
              </p>

              <p className="mt-1 text-xs text-white/30">
                Colourways configured
              </p>
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