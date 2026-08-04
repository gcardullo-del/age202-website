"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  deleteCollection,
} from "../actions/deleteCollection";

type DeleteCollectionButtonProps = {
  collectionId: string;
  collectionTitle: string;
};

export default function DeleteCollectionButton({
  collectionId,
  collectionTitle,
}: DeleteCollectionButtonProps) {
  const [
    confirming,
    setConfirming,
  ] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() =>
          setConfirming(true)
        }
        className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    );
  }

  return (
    <form
      action={deleteCollection}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      <input
        type="hidden"
        name="collectionId"
        value={collectionId}
      />

      <span className="text-xs text-red-300">
        Delete “{collectionTitle}”?
      </span>

      <button
        type="button"
        onClick={() =>
          setConfirming(false)
        }
        className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        Confirm delete
      </button>
    </form>
  );
}
