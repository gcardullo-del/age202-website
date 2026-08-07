type CertificateCornerProps = {
  position: string;
  accent: string;
};

export default function CertificateCorner({
  position,
  accent,
}: CertificateCornerProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${position} h-10 w-10`}
    >
      <span
        className="absolute left-0 top-0 h-px w-10"
        style={{
          backgroundColor:
            `${accent}80`,
        }}
      />

      <span
        className="absolute left-0 top-0 h-10 w-px"
        style={{
          backgroundColor:
            `${accent}80`,
        }}
      />
    </div>
  );
}
