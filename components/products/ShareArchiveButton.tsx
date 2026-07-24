"use client";

import { useState } from "react";

type ShareArchiveButtonProps = {
  title: string;
  playerName: string;
};

export default function ShareArchiveButton({
  title,
  playerName,
}: ShareArchiveButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: `${title} | AGE202 Archive`,
      text: `Discover this ${playerName} collectible piece in the AGE202 Digital Archive.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Unable to share archive:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gray-300 transition-all duration-300 hover:border-[#C8FF00]/30 hover:bg-[#C8FF00]/10 hover:text-[#C8FF00]"
    >
      <ShareIcon />

      <span>{copied ? "Link Copied" : "Share Archive"}</span>

      {copied && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8FF00] text-[11px] text-black">
          ✓
        </span>
      )}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 18 8ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m8.7 10.3 6.6-3.6M8.7 13.7l6.6 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}