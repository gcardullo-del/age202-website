"use client";

import {
  Trash2,
} from "lucide-react";

import {
  deleteMemorabilia,
} from "../../actions/deleteMemorabilia";

type DeleteMemorabiliaButtonProps = {
  memorabiliaId: string;
};

export default function DeleteMemorabiliaButton({
  memorabiliaId,
}: DeleteMemorabiliaButtonProps) {
  return (
    <>
      <input
        type="hidden"
        name="memorabiliaId"
        value={memorabiliaId}
      />

      <button
        type="submit"
        formAction={deleteMemorabilia}
        onClick={(event) => {
          const confirmed =
            window.confirm(
              "Delete this memorabilia item permanently? This action cannot be undone.",
            );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-rose-300/20 bg-rose-300/[0.06] px-5 text-sm font-semibold text-rose-200 transition hover:border-rose-300/35 hover:bg-rose-300/10 sm:w-auto"
      >
        <Trash2 className="size-4" />
        Delete Memorabilia
      </button>
    </>
  );
}