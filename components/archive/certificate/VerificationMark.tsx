type VerificationMarkProps = {
  accent: string;
};

export default function VerificationMark({
  accent,
}: VerificationMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-8 w-8"
      fill="none"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke={accent}
        strokeWidth="2"
      />

      <path
        d="M15.5 24.5L21 30L32.5 18.5"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
