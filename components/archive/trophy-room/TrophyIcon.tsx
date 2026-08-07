import type {
  TrophyIconProps,
} from "./types";

export default function TrophyIcon({
  accent,
}: TrophyIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-9 w-9 sm:h-11 sm:w-11"
      fill="none"
    >
      <path
        d="M21 12H43V24C43 31.18 38.07 37.21 31.41 38.83C25.49 37.42 21 32.08 21 25.66V12Z"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <path
        d="M21 17H14V21C14 27.08 18.48 32.12 24.32 33"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M43 17H50V21C50 27.08 45.52 32.12 39.68 33"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M32 39V48"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M24 53H40"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M27 48H37"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
