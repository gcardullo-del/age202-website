"use client";

import {
  useState,
} from "react";

import {
  RefreshCw,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";


type SyncInPostTrackingButtonProps = {
  trackingNumber: string;
  isTest?: boolean;
};


type SyncResponse = {
  success?: boolean;
  updated?: boolean;
  ignored?: boolean;
  error?: string;
  message?: string;
};


export default function SyncInPostTrackingButton({
  trackingNumber,
  isTest = false,
}: SyncInPostTrackingButtonProps) {
  const router =
    useRouter();

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      false,
    );

  const [
    message,
    setMessage,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    isError,
    setIsError,
  ] =
    useState(
      false,
    );


  async function handleSync() {
    if (
      isLoading ||
      isTest
    ) {
      return;
    }

    setIsLoading(
      true,
    );

    setMessage(
      null,
    );

    setIsError(
      false,
    );

    try {
      const response =
        await fetch(
          `/api/inpost/shipments/${encodeURIComponent(
            trackingNumber,
          )}/sync`,
          {
            method:
              "POST",
          },
        );

      let data:
        SyncResponse =
        {};

      try {
        data =
          (await response.json()) as SyncResponse;
      } catch {
        data =
          {};
      }

      if (
        !response.ok ||
        data.success ===
          false
      ) {
        throw new Error(
          data.error ||
            "Unable to synchronize InPost tracking.",
        );
      }

      if (
        data.ignored
      ) {
        setMessage(
          data.message ||
            "Tracking checked. No order status changes were required.",
        );
      } else if (
        data.updated
      ) {
        setMessage(
          "InPost tracking synchronized successfully.",
        );
      } else {
        setMessage(
          "Tracking checked successfully.",
        );
      }

      router.refresh();
    } catch (
      error
    ) {
      setIsError(
        true,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while synchronizing InPost tracking.",
      );
    } finally {
      setIsLoading(
        false,
      );
    }
  }


  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={
          handleSync
        }
        disabled={
          isLoading ||
          isTest
        }
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RefreshCw
          className={`h-4 w-4 ${
            isLoading
              ? "animate-spin"
              : ""
          }`}
        />

        {isLoading
          ? "Syncing tracking..."
          : "Sync tracking now"}
      </button>

      {isTest ? (
        <p className="text-xs leading-5 text-amber-200/70">
          TEST ORDER · Real InPost tracking sync is disabled.
        </p>
      ) : null}

      {message ? (
        <p
          className={`text-xs leading-5 ${
            isError
              ? "text-red-300"
              : "text-emerald-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
