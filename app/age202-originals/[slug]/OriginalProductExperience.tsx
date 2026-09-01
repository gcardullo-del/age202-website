"use client";


import Image from "next/image";

import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
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

  const initialImageId =
    defaultVariant?.images[0]?.id ??
    globalImages[0]?.id ??
    null;

  const [
    selectedImageId,
    setSelectedImageId,
  ] = useState<string | null>(
    initialImageId,
  );


  const [
    lightboxOpen,
    setLightboxOpen,
  ] = useState(false);

  const [
    zoomLevel,
    setZoomLevel,
  ] = useState(1);


  const [
    panPosition,
    setPanPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const dragStartRef =
    useRef({
      pointerX: 0,
      pointerY: 0,
      panX: 0,
      panY: 0,
    });


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


  const selectedImage =
    useMemo(
      () =>
        activeImages.find(
          (image) =>
            image.id ===
            selectedImageId,
        ) ??
        activeImages[0] ??
        null,
      [
        activeImages,
        selectedImageId,
      ],
    );


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


  useEffect(
    () => {
      if (!lightboxOpen) {
        return;
      }

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        "hidden";

      function handleKeyDown(
        event: KeyboardEvent,
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          setLightboxOpen(
            false,
          );
          setZoomLevel(1);
          setPanPosition({
            x: 0,
            y: 0,
          });
          setDragging(false);
        }
      }

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        document.body.style.overflow =
          previousOverflow;

        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [lightboxOpen],
  );


  function openLightbox() {
    if (!selectedImage) {
      return;
    }

    setZoomLevel(1);
    setPanPosition({
      x: 0,
      y: 0,
    });
    setLightboxOpen(true);
  }


  function closeLightbox() {
    setLightboxOpen(false);
    setZoomLevel(1);
    setPanPosition({
      x: 0,
      y: 0,
    });
    setDragging(false);
  }


  function zoomIn() {
    setZoomLevel(
      (current) =>
        Math.min(
          current + 0.5,
          3,
        ),
    );
  }


  function zoomOut() {
    setZoomLevel(
      (current) => {
        const next =
          Math.max(
            current - 0.5,
            1,
          );

        if (next === 1) {
          setPanPosition({
            x: 0,
            y: 0,
          });
        }

        return next;
      },
    );
  }


  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (zoomLevel <= 1) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    dragStartRef.current = {
      pointerX:
        event.clientX,
      pointerY:
        event.clientY,
      panX:
        panPosition.x,
      panY:
        panPosition.y,
    };

    setDragging(true);
  }


  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (
      !dragging ||
      zoomLevel <= 1
    ) {
      return;
    }

    setPanPosition({
      x:
        dragStartRef.current
          .panX +
        (event.clientX -
          dragStartRef.current
            .pointerX),
      y:
        dragStartRef.current
          .panY +
        (event.clientY -
          dragStartRef.current
            .pointerY),
    });
  }


  function handlePointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setDragging(false);
  }


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

    const nextImages =
      variant &&
      variant.images.length >
        0
        ? variant.images
        : globalImages;

    setSelectedImageId(
      nextImages[0]?.id ??
        null,
    );


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
      {selectedImage ? (
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425]">
            <Image
              src={selectedImage.url}
              alt={
                selectedImage.alt ??
                title
              }
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />

            <button
              type="button"
              onClick={
                openLightbox
              }
              aria-label="Enlarge product image"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:border-[#D7FF00] hover:text-[#D7FF00]"
            >
              <ZoomIn className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={
                openLightbox
              }
              aria-label="Open enlarged product image"
              className="absolute inset-0 cursor-zoom-in"
            >
              <span className="sr-only">
                Enlarge product image
              </span>
            </button>
          </div>

          {activeImages.length >
          1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {activeImages.map(
                (
                  image,
                  index,
                ) => {
                  const selected =
                    image.id ===
                    selectedImage.id;

                  return (
                    <button
                      key={
                        image.id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedImageId(
                          image.id,
                        )
                      }
                      aria-label={`Show image ${index + 1} of ${activeImages.length}`}
                      className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-[#0A1425] transition sm:h-28 sm:w-28 ${
                        selected
                          ? "border-[#D7FF00]"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={
                          image.url
                        }
                        alt={
                          image.alt ??
                          `${title} image ${index + 1}`
                        }
                        fill
                        sizes="112px"
                        className="object-contain"
                      />

                      {selected ? (
                        <span className="absolute inset-x-0 bottom-0 h-1 bg-[#D7FF00]" />
                      ) : null}
                    </button>
                  );
                },
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="relative aspect-square overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0A1425]">
          <div className="absolute inset-0 grid place-items-center">
            <Sparkles className="h-12 w-12 text-[#D7FF00]/45" />
          </div>
        </div>
      )}


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


      {lightboxOpen &&
      selectedImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#02050B]/95 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
          onClick={
            closeLightbox
          }
        >
          <div
            className="relative flex h-full w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07101E]"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="absolute right-3 top-3 z-30 flex items-center gap-2 sm:right-5 sm:top-5">
              <div className="flex items-center overflow-hidden rounded-full border border-white/12 bg-black/45 backdrop-blur-md">
                <button
                  type="button"
                  onClick={
                    zoomOut
                  }
                  disabled={
                    zoomLevel <=
                    1
                  }
                  aria-label="Zoom out"
                  className="grid h-11 w-11 place-items-center text-white transition hover:text-[#D7FF00] disabled:cursor-not-allowed disabled:text-white/20"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-[52px] text-center text-[9px] font-black uppercase tracking-[0.12em] text-white/60">
                  {Math.round(
                    zoomLevel *
                      100,
                  )}
                  %
                </span>

                <button
                  type="button"
                  onClick={
                    zoomIn
                  }
                  disabled={
                    zoomLevel >=
                    3
                  }
                  aria-label="Zoom in"
                  className="grid h-11 w-11 place-items-center text-white transition hover:text-[#D7FF00] disabled:cursor-not-allowed disabled:text-white/20"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={
                  closeLightbox
                }
                aria-label="Close enlarged image"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-black/45 text-white backdrop-blur-md transition hover:border-[#D7FF00] hover:text-[#D7FF00]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>


            <div
              className={`relative flex-1 overflow-hidden select-none ${
                zoomLevel > 1
                  ? dragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-default"
              }`}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerUp
              }
              style={{
                touchAction:
                  zoomLevel > 1
                    ? "none"
                    : "auto",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <div className="relative h-full w-full">
                  <Image
                    src={
                      selectedImage.url
                    }
                    alt={
                      selectedImage.alt ??
                      title
                    }
                    fill
                    draggable={
                      false
                    }
                    sizes="100vw"
                    className="pointer-events-none object-contain"
                    style={{
                      transform:
                        `translate3d(${panPosition.x}px, ${panPosition.y}px, 0) scale(${zoomLevel})`,
                      transition:
                        dragging
                          ? "none"
                          : "transform 180ms ease-out",
                    }}
                    priority
                  />
                </div>
              </div>

              {zoomLevel > 1 ? (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-white/55 backdrop-blur-md">
                  Drag to inspect details
                </div>
              ) : null}
            </div>


            <div className="border-t border-white/10 bg-black/20 px-4 py-3 text-center sm:px-6">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
                Zoom with + / − · drag to inspect · ESC to close
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

