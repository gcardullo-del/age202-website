"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteArtifactAction } from "@/app/admin/artifacts/actions/deleteArtifact";

type DeleteArtifactButtonProps = {
  artifactId: string;
  artifactTitle?: string;
  className?: string;
};

export default function DeleteArtifactButton({
  artifactId,
  artifactTitle,
  className = "",
}: DeleteArtifactButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  function handleDelete() {
    if (isPending) {
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteArtifactAction(artifactId);

        if (!result.ok) {
          toast.error(result.message);
          setIsConfirming(false);
          return;
        }

        if (result.storageCleanupFailed) {
          toast.warning(
            "Artifact deleted, but one or more image files could not be removed from storage.",
          );
        } else {
          toast.success(
            artifactTitle
              ? `“${artifactTitle}” has been deleted.`
              : "Artifact deleted successfully.",
          );
        }

        setIsConfirming(false);
        router.refresh();
      } catch (error) {
        console.error("Unable to delete artifact", error);

        toast.error(
          "The artifact could not be deleted. Please try again.",
        );

        setIsConfirming(false);
      }
    });
  }

  function cancelDelete() {
    if (isPending) {
      return;
    }

    setIsConfirming(false);
  }

  if (isConfirming) {
    return (
      <div
        className={`flex flex-wrap items-center justify-end gap-2 ${className}`}
      >
        <span className="text-xs text-red-300">
          Delete permanently?
        </span>

        <button
          type="button"
          onClick={cancelDelete}
          disabled={isPending}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/50 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2
            aria-hidden="true"
            className="h-4 w-4"
          />

          {isPending ? "Deleting..." : "Confirm delete"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={
        artifactTitle
          ? `Delete ${artifactTitle}`
          : "Delete artifact"
      }
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Trash2
        aria-hidden="true"
        className="h-4 w-4"
      />

      Delete
    </button>
  );
}