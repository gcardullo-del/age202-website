"use client";

import {
  LoaderCircle,
  LockKeyhole,
  ShoppingBag,
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

export default function StripeCheckoutButton({
  itemId,
  itemType,
  label = "Acquista",
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleCheckout() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            itemId,
            itemType,
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

      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-lime-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050b18] transition hover:-translate-y-0.5 hover:bg-lime-200 disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70"
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}

        {isLoading
          ? "Apertura checkout..."
          : label}
      </button>

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