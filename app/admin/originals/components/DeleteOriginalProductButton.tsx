"use client";

import {
  Trash2,
} from "lucide-react";

import {
  deleteOriginalProduct,
} from "../actions/deleteOriginalProduct";

export default function DeleteOriginalProductButton({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  return (
    <form
      action={deleteOriginalProduct}
      onSubmit={(event) => {
        const confirmed =
          window.confirm(
            `Delete "${productTitle}"? This action cannot be undone.`,
          );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      <button
        type="submit"
        aria-label={`Delete ${productTitle}`}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/15 text-red-300/70 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
      >
        <Trash2
          className="h-4 w-4"
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
