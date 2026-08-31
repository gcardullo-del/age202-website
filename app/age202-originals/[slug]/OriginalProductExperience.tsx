"use client";

import Image from "next/image";

import {
  Check,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";


type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isCover: boolean;
  sortOrder: number;
};


type VariantStock = {
  id: string;
  size: string;
  stock: number;
  active: boolean;
};


type ProductVariant = {
  id: string;
  name: string;
  colour: string;
  colourHex: string | null;
  logoTone:
    | "BLACK"
    | "WHITE";
  sku: string | null;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
  images: ProductImage[];
  stock: VariantStock[];
};


type Props = {
  productId: string;
  title: string;
  priceLabel: string;
  availability:
  | "AVAILABLE"
  | "SOLD"
  | "COMING_SOON"
  | "NOT_FOR_SALE";
  checkoutEnabled: boolean;
  globalImages: ProductImage[];
  variants: ProductVariant[];
};


export default function OriginalProductExperience({
  productId,
  title,
  priceLabel,
  availability,
  checkoutEnabled,
  globalImages,
  variants,
}: Props) {
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

  const [
    selectedVariantId,
    setSelectedVariantId,
  ] = useState<string | null>(
    defaultVariant?.id ??
      null,
  );

  const [
    selectedSize,
    setSelectedSize,
  ] = useState<string | null>(
    null,
  );


  const selectedVariant =
    useMemo(
      () =>
        variants.find(
          (variant) =>
            variant.id ===
            selectedVariantId,
        ) ??
        defaultVariant,
      [
        variants,
        selectedVariantId,
        defaultVariant,
      ],
    );


  const activeImages =
    selectedVariant &&
    selectedVariant.images.length >
      0
      ? selectedVariant.images
      : globalImages;


  const availableStock =
    selectedVariant?.stock ??
    [];


  const selectedStock =
    selectedSize
      ? availableStock.find(
          (item) =>
            item.size ===
            selectedSize,
        ) ?? null
      : null;


  const hasAnyStock =
    availableStock.some(
      (item) =>
        item.active &&
        item.stock > 0,
    );


  const canPurchase =
    checkoutEnabled &&
    availability ===
      "AVAILABLE" &&
    Boolean(selectedVariant) &&
    Boolean(selectedSize) &&
    Boolean(
      selectedStock &&
        selectedStock.stock >
          0,
    );


  function selectVariant(
  variantId: string,
) {
  const variant =
    variants.find(
      (item) =>
        item.id ===
        variantId,
    );

  setSelectedVariantId(
    variantId,
  );

  setSelectedSize(null);


  if (
    typeof window !==
      "undefined" &&
    variant
  ) {
    window.dispatchEvent(
      new CustomEvent(
        "age202:original-variant-change",
        {
          detail: {
            colour:
              variant.colour,
          },
        },
      ),
    );
  }
}


  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {activeImages.length >
        0 ? (
          activeImages.map(
            (
              image,
              index,
            ) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425] ${
                  index === 0
                    ? "aspect-[4/5] sm:col-span-2"
                    : "aspect-square"
                }`}
              >
                <Image
                  src={image.url}
                  alt={
                    image.alt ??
                    title
                  }
                  fill
                  priority={
                    index === 0
                  }
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            ),
          )
        ) : (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425] sm:col-span-2">
            <div className="absolute inset-0 grid place-items-center">
              <Sparkles className="h-12 w-12 text-[#D7FF00]/45" />
            </div>
          </div>
        )}
      </div>


      <div className="mt-8 border-t border-white/10 pt-7">
        {variants.length >
        0 ? (
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                  Colour
                </p>

                <p className="mt-2 text-sm font-black uppercase text-white">
                  {selectedVariant?.colour ??
                    "Select colour"}
                </p>
              </div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                {
                  variants.length
                }{" "}
                colour
                {variants.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>


            <div className="mt-4 flex flex-wrap gap-3">
              {variants.map(
                (variant) => {
                  const selected =
                    variant.id ===
                    selectedVariant?.id;

                  return (
                    <button
                      key={
                        variant.id
                      }
                      type="button"
                      onClick={() =>
                        selectVariant(
                          variant.id,
                        )
                      }
                      className={`group flex min-w-[118px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-[#D7FF00] bg-[#D7FF00]/8"
                          : "border-white/10 bg-white/[0.025] hover:border-white/25"
                      }`}
                    >
                      <span
                        className="relative h-7 w-7 shrink-0 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            variant.colourHex ??
                            variant.colour,
                        }}
                      >
                        {selected ? (
                          <span className="absolute inset-0 grid place-items-center">
                            <Check
                              className={`h-3.5 w-3.5 ${
                                variant.logoTone ===
                                "BLACK"
                                  ? "text-black"
                                  : "text-white"
                              }`}
                            />
                          </span>
                        ) : null}
                      </span>

                      <span>
                        <span className="block text-[10px] font-black uppercase text-white/80">
                          {
                            variant.colour
                          }
                        </span>

                        <span className="mt-0.5 block text-[7px] font-bold uppercase tracking-[0.12em] text-white/30">
                          {
                            variant.name
                          }
                        </span>
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ) : null}


        {selectedVariant &&
        availableStock.length >
          0 ? (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                Select size
              </p>

              {selectedStock ? (
              <p
  className={`text-[11px] font-black uppercase tracking-[0.12em] sm:text-xs ${
    selectedStock.stock > 0
      ? "text-[#D7FF00]"
      : "text-red-300"
  }`}
>
                  {selectedStock.stock >
                  0
                    ? `${selectedStock.stock} in stock`
                    : "Sold out"}
                </p>
              ) : null}
            </div>


            <div className="mt-3 flex flex-wrap gap-2">
              {availableStock.map(
                (item) => {
                  const soldOut =
                    !item.active ||
                    item.stock <=
                      0;

                  const selected =
                    selectedSize ===
                    item.size;

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      disabled={
                        soldOut
                      }
                      onClick={() =>
                        setSelectedSize(
                          item.size,
                        )
                      }
                      className={`min-w-[58px] rounded-xl border px-4 py-3 text-xs font-black uppercase transition ${
                        selected
                          ? "border-[#D7FF00] bg-[#D7FF00] text-[#050B18]"
                          : soldOut
                            ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-white/20 line-through"
                            : "border-white/10 bg-white/[0.025] text-white/70 hover:border-white/30"
                      }`}
                    >
                      {
                        item.size
                      }
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ) : null}


        <div className="mt-9 border-t border-white/10 pt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                AGE202 Original
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {
                  priceLabel
                }
              </p>
            </div>

            {selectedVariant?.sku ? (
              <p className="text-right text-[7px] font-bold uppercase tracking-[0.14em] text-white/25">
                SKU
                <br />
                {
                  selectedVariant.sku
                }
              </p>
            ) : null}
          </div>


          {availability ===
          "COMING_SOON" ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
              Coming soon
            </div>
          ) : availability ===
            "SOLD" ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
              Sold out
            </div>
          ) : (
            <>
              <button
                type="button"
                disabled={
                  !canPurchase
                }
                data-product-id={
                  productId
                }
                data-variant-id={
                  selectedVariant?.id ??
                  ""
                }
                data-size={
                  selectedSize ??
                  ""
                }
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D7FF00] px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                <ShoppingBag className="h-4 w-4" />

                {!checkoutEnabled
                  ? "Checkout temporarily unavailable"
                  : canPurchase
                    ? "Buy on AGE202"
                    : !selectedVariant
                      ? "Select colour"
                      : !hasAnyStock
                        ? "Sold out"
                        : !selectedSize
                          ? "Select a size"
                          : "Unavailable"}
              </button>

              <p className="mt-3 text-center text-[8px] leading-4 text-white/30">
                {checkoutEnabled
                  ? "Secure checkout directly through AGE202.com"
                  : "Purchases will reopen when AGE202 shipping is ready."}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}