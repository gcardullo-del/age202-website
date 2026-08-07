import type {
  LegacyMarkProps,
} from "./types";

export default function LegacyMark({
  accent,
}: LegacyMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-10 w-10 sm:h-12 sm:w-12"
      fill="none"
    >
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke={accent}
        strokeWidth="2.4"
      />

      <circle
        cx="32"
        cy="32"
        r="12"
        stroke={accent}
        strokeWidth="2.4"
        opacity="0.5"
      />

      <path
        d="M32 8V18"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M32 46V56"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M8 32H18"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M46 32H56"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <circle
        cx="32"
        cy="32"
        r="3.5"
        fill={accent}
      />
    </svg>
  );
}
