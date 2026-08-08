"use client";

import { useFormStatus } from "react-dom";

import {
  Loader2,
  Save,
} from "lucide-react";

type AdminSubmitButtonProps = {
  label?: string;
  pendingLabel?: string;
  className?: string;
};

export default function AdminSubmitButton({
  label = "Save Changes",
  pendingLabel = "Saving...",
  className = "",
}: AdminSubmitButtonProps) {
  const {
    pending,
  } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl",
        "bg-lime-300 px-6 py-3",
        "text-sm font-semibold text-[#050B18]",
        "transition duration-200",
        "hover:bg-lime-200",
        "focus:outline-none focus:ring-4 focus:ring-lime-300/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {pending ? (
        <>
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />

          {pendingLabel}
        </>
      ) : (
        <>
          <Save
            className="h-4 w-4"
            aria-hidden="true"
          />

          {label}
        </>
      )}
    </button>
  );
}