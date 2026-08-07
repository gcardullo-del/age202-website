type Age202SealProps = {
  accent: string;
};

export default function Age202Seal({
  accent,
}: Age202SealProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="h-14 w-14 sm:h-16 sm:w-16"
      fill="none"
    >
      <circle
        cx="48"
        cy="48"
        r="39"
        stroke={accent}
        strokeWidth="1.8"
      />

      <circle
        cx="48"
        cy="48"
        r="31"
        stroke={accent}
        strokeWidth="1"
        opacity="0.45"
      />

      <path
        d="M31 58L42 32H50L61 58H54.5L52.2 52H39.5L37.2 58H31ZM41.5 46.5H50.2L45.9 35.5L41.5 46.5Z"
        fill={accent}
      />

      <path
        d="M65 34V58"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx="48"
        cy="13"
        r="2.5"
        fill={accent}
      />

      <circle
        cx="48"
        cy="83"
        r="2.5"
        fill={accent}
      />
    </svg>
  );
}
