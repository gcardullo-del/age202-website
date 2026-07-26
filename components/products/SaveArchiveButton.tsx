"use client";

import { useEffect, useState } from "react";

type SaveArchiveButtonProps = {
  productId: string;
  title: string;
};

const STORAGE_KEY = "age202-saved-archives";

export default function SaveArchiveButton({
  productId,
  title,
}: SaveArchiveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedArchives = getSavedArchives();
        setIsSaved(savedArchives.includes(productId));
      } catch {
        setIsSaved(false);
      } finally {
        setIsReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [productId]);

  function handleSave() {
    try {
      const savedArchives = getSavedArchives();

      const updatedArchives = savedArchives.includes(productId)
        ? savedArchives.filter((id) => id !== productId)
        : [...savedArchives, productId];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedArchives)
      );

      setIsSaved(updatedArchives.includes(productId));
    } catch (error) {
      console.error("Unable to save archive:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={!isReady}
      aria-label={
        isSaved
          ? `Remove ${title} from saved archives`
          : `Save ${title} to your collection`
      }
      aria-pressed={isSaved}
      className={`group inline-flex items-center gap-3 rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-wait disabled:opacity-60 ${
        isSaved
          ? "border-[#C8FF00]/40 bg-[#C8FF00]/10 text-[#C8FF00]"
          : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-[#C8FF00]/30 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]"
      }`}
    >
      <BookmarkIcon filled={isSaved} />

      <span>
        {isSaved ? "Archive Saved" : "Save Archive"}
      </span>

      {isSaved && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8FF00] text-[11px] text-black">
          ✓
        </span>
      )}
    </button>
  );
}

function getSavedArchives(): string[] {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  const parsedValue: unknown = JSON.parse(storedValue);

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter(
    (item): item is string => typeof item === "string"
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className="h-4 w-4"
    >
      <path
        d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3.25L7 21V4.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}