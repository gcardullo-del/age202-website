"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Loader2,
  Truck,
} from "lucide-react";


type CreateInPostShipmentButtonProps = {
  orderId: string;

  disabled?: boolean;

  disabledReason?: string;
};


type CreateShipmentResponse = {
  success?: boolean;

  error?: string;

  orderId?: string;

  orderNumber?: string;

  trackingNumber?: string;
};


export default function CreateInPostShipmentButton({
  orderId,
  disabled = false,
  disabledReason,
}: CreateInPostShipmentButtonProps) {
  const router =
    useRouter();

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    false,
  );

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<
    string | null
  >(
    null,
  );


  async function handleCreateShipment() {
    if (
      disabled ||
      isLoading
    ) {
      return;
    }


    setError(
      null,
    );

    setSuccessMessage(
      null,
    );

    setIsLoading(
      true,
    );


    try {
      const response =
        await fetch(
          "/api/inpost/shipments",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId,
              }),
          },
        );


      const payload =
        (await response.json()) as CreateShipmentResponse;


      if (
        !response.ok ||
        !payload.success
      ) {
        throw new Error(
          payload.error ||
            "Impossibile creare la spedizione InPost.",
        );
      }


      const trackingNumber =
        payload.trackingNumber
          ?.trim();


      setSuccessMessage(
        trackingNumber
          ? `Spedizione InPost creata. Tracking: ${trackingNumber}`
          : "Spedizione InPost creata correttamente.",
      );


      router.refresh();
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Errore sconosciuto durante la creazione della spedizione InPost.",
      );
    } finally {
      setIsLoading(
        false,
      );
    }
  }


  return (
    <div className="flex flex-col items-stretch gap-3 sm:items-end">
      <button
        type="button"
        disabled={
          disabled ||
          isLoading
        }
        onClick={
          handleCreateShipment
        }
        className={
          disabled ||
          isLoading
            ? "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white/30"
            : "inline-flex items-center justify-center gap-2 rounded-full bg-[#c8ff00] px-6 py-3.5 text-sm font-bold text-[#050b18] transition hover:bg-[#d6ff42]"
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Truck className="h-4 w-4" />
        )}

        {isLoading
          ? "Creating shipment..."
          : "Create InPost shipment"}
      </button>


      {disabled &&
      disabledReason ? (
        <p className="max-w-sm text-right text-xs leading-5 text-white/35">
          {disabledReason}
        </p>
      ) : null}


      {error ? (
        <div className="max-w-md rounded-[16px] border border-red-300/20 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200">
          {error}
        </div>
      ) : null}


      {successMessage ? (
        <div className="max-w-md rounded-[16px] border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-sm leading-6 text-emerald-200">
          {successMessage}
        </div>
      ) : null}
    </div>
  );
}