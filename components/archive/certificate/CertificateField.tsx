type CertificateFieldProps = {
  label: string;
  value: string;
  accent?: string;
  featured?: boolean;
  wide?: boolean;
};

export default function CertificateField({
  label,
  value,
  accent,
  featured = false,
  wide = false,
}: CertificateFieldProps) {
  return (
    <div
      className={
        wide
          ? "lg:col-span-1"
          : undefined
      }
    >
      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-3 break-words font-black uppercase leading-tight ${
          featured
            ? "text-xl tracking-[-0.02em] sm:text-2xl"
            : "text-sm tracking-[0.08em]"
        }`}
        style={{
          color:
            accent ??
            "rgba(255,255,255,0.72)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
