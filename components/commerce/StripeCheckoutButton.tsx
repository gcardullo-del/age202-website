"use client";

import {
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Navigation,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";

type StripeCheckoutButtonProps = {
  itemId: string;
  itemType:
    | "ARTIFACT"
    | "MEMORABILIA"
    | "ORIGINAL_PRODUCT";
  label?: string;
};

type CheckoutResponse = {
  success?: boolean;
  checkoutUrl?: string;
  error?: string;
};

type InPostPointAddress = {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
};

type InPostPoint = {
  id: string;
  name?: string;
  displayName?: string;
  type?: string;
  distance?: number;

  address?: InPostPointAddress;
};

type InPostPointsResponse = {
  success?: boolean;
  count?: number;
  points?: InPostPoint[];
  error?: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function StripeCheckoutButton({
  itemId,
  itemType,
  label = "Acquista",
}: StripeCheckoutButtonProps) {
  const [isLoadingPoints, setIsLoadingPoints] =
    useState(false);

  const [isLoadingCheckout, setIsLoadingCheckout] =
    useState(false);

  const [showPointSelector, setShowPointSelector] =
    useState(false);

  const [points, setPoints] =
    useState<InPostPoint[]>([]);

  const [selectedPoint, setSelectedPoint] =
    useState<InPostPoint | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const isLoading =
    isLoadingPoints ||
    isLoadingCheckout;

  async function handleStartCheckout() {
    if (isLoading) {
      return;
    }

    setError(null);

    if (
      showPointSelector &&
      points.length > 0
    ) {
      return;
    }

    setIsLoadingPoints(true);

    try {
      const coordinates =
        await getCurrentPosition();

      const searchParams =
        new URLSearchParams({
          latitude:
            String(
              coordinates.latitude,
            ),

          longitude:
            String(
              coordinates.longitude,
            ),

          country:
            "IT",

          maxDistance:
            "10000",

          limit:
            "10",
        });

      const response =
        await fetch(
          `/api/inpost/points?${searchParams.toString()}`,
          {
            method:
              "GET",

            cache:
              "no-store",
          },
        );

      const data =
        (await response.json()) as InPostPointsResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            "Impossibile trovare i punti InPost vicini.",
        );
      }

      const receivedPoints =
        Array.isArray(data.points)
          ? data.points
          : [];

      if (
        receivedPoints.length === 0
      ) {
        throw new Error(
          "Non sono stati trovati punti InPost nelle vicinanze.",
        );
      }

      setPoints(
        receivedPoints,
      );

      setSelectedPoint(
        null,
      );

      setShowPointSelector(
        true,
      );
    } catch (pointError) {
      setError(
        pointError instanceof Error
          ? pointError.message
          : "Impossibile trovare i punti InPost vicini.",
      );
    } finally {
      setIsLoadingPoints(
        false,
      );
    }
  }

  async function handleCheckout() {
    if (
      isLoading ||
      !selectedPoint
    ) {
      return;
    }

    setIsLoadingCheckout(
      true,
    );

    setError(
      null,
    );

    try {
      const response =
        await fetch(
          "/api/stripe/checkout",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                itemId,
                itemType,

                inpostPointId:
                  selectedPoint.id,

                inpostPointType:
                  selectedPoint.type ??
                  "",

                inpostPointName:
                  getPointName(
                    selectedPoint,
                  ),

                inpostPointAddress:
                  formatPointAddress(
                    selectedPoint,
                  ),
              }),
          },
        );

      const data =
        (await response.json()) as CheckoutResponse;

      if (
        !response.ok ||
        !data.checkoutUrl
      ) {
        throw new Error(
          data.error ??
            "Impossibile avviare il checkout.",
        );
      }

      window.location.assign(
        data.checkoutUrl,
      );
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Impossibile avviare il checkout.",
      );

      setIsLoadingCheckout(
        false,
      );
    }
  }

  function handleCloseSelector() {
    if (isLoadingCheckout) {
      return;
    }

    setShowPointSelector(
      false,
    );

    setSelectedPoint(
      null,
    );

    setPoints(
      [],
    );

    setError(
      null,
    );
  }

  return (
    <div className="space-y-3">
      {!showPointSelector ? (
        <button
          type="button"
          onClick={
            handleStartCheckout
          }
          disabled={
            isLoading
          }
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-lime-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050b18] transition hover:-translate-y-0.5 hover:bg-lime-200 disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70"
        >
          {isLoadingPoints ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}

          {isLoadingPoints
            ? "Cerco punti InPost..."
            : label}
        </button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08101d]">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-white">
                <MapPin className="h-4 w-4 text-lime-300" />

                Scegli punto InPost
              </div>

              <p className="mt-1 text-xs leading-5 text-white/45">
                Seleziona il locker o
                punto di ritiro più
                comodo.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleCloseSelector
              }
              disabled={
                isLoadingCheckout
              }
              aria-label="Chiudi selezione punto InPost"
              className="rounded-xl border border-white/10 p-2 text-white/45 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">
            {points.map(
              (point) => {
                const isSelected =
                  selectedPoint?.id ===
                  point.id;

                return (
                  <button
                    key={
                      point.id
                    }
                    type="button"
                    onClick={() =>
                      setSelectedPoint(
                        point,
                      )
                    }
                    disabled={
                      isLoadingCheckout
                    }
                    className={[
                      "w-full rounded-xl border p-4 text-left transition",

                      isSelected
                        ? "border-lime-300/60 bg-lime-300/[0.08]"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]",
                    ].join(
                      " ",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={[
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",

                          isSelected
                            ? "border-lime-300/50 bg-lime-300/10 text-lime-300"
                            : "border-white/10 text-white/40",
                        ].join(
                          " ",
                        )}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {getPointName(
                              point,
                            )}
                          </span>

                          {point.type ? (
                            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.12em] text-white/45">
                              {
                                point.type
                              }
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-white/50">
                          {formatPointAddress(
                            point,
                          )}
                        </p>

                        {typeof point.distance ===
                        "number" ? (
                          <div className="mt-2 flex items-center gap-1.5 text-[0.68rem] font-bold text-lime-200/70">
                            <Navigation className="h-3 w-3" />

                            {formatDistance(
                              point.distance,
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              },
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={
                handleCheckout
              }
              disabled={
                !selectedPoint ||
                isLoadingCheckout
              }
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-lime-300 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-[#050b18] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoadingCheckout ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}

              {isLoadingCheckout
                ? "Apertura checkout..."
                : selectedPoint
                  ? "Continua al pagamento"
                  : "Seleziona un punto"}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/30">
        <LockKeyhole className="h-3.5 w-3.5" />

        Pagamento sicuro tramite Stripe
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}


function getCurrentPosition(): Promise<Coordinates> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      if (
        !navigator.geolocation
      ) {
        reject(
          new Error(
            "Il browser non supporta la geolocalizzazione.",
          ),
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (
          position,
        ) => {
          resolve({
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          });
        },

        (
          error,
        ) => {
          if (
            error.code ===
            error.PERMISSION_DENIED
          ) {
            reject(
              new Error(
                "Per trovare i punti InPost vicini devi consentire l'accesso alla posizione.",
              ),
            );

            return;
          }

          if (
            error.code ===
            error.POSITION_UNAVAILABLE
          ) {
            reject(
              new Error(
                "La posizione non è disponibile in questo momento.",
              ),
            );

            return;
          }

          if (
            error.code ===
            error.TIMEOUT
          ) {
            reject(
              new Error(
                "La ricerca della posizione ha impiegato troppo tempo. Riprova.",
              ),
            );

            return;
          }

          reject(
            new Error(
              "Impossibile determinare la posizione.",
            ),
          );
        },

        {
          enableHighAccuracy:
            false,

          timeout:
            10_000,

          maximumAge:
            300_000,
        },
      );
    },
  );
}


function getPointName(
  point: InPostPoint,
): string {
  return (
    point.displayName?.trim() ||
    point.name?.trim() ||
    point.id
  );
}


function formatPointAddress(
  point: InPostPoint,
): string {
  const address =
    point.address;

  const streetLine = [
    address?.street,
    address?.buildingNumber,
  ]
    .filter(Boolean)
    .join(" ");

  const cityLine = [
    address?.postalCode,
    address?.city,
  ]
    .filter(Boolean)
    .join(" ");

  const formatted = [
    streetLine,
    cityLine,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    formatted ||
    "Indirizzo non disponibile"
  );
}


function formatDistance(
  distance: number,
): string {
  if (
    distance < 1000
  ) {
    return `${Math.round(
      distance,
    )} m`;
  }

  return `${(
    distance / 1000
  ).toFixed(1)} km`;
}