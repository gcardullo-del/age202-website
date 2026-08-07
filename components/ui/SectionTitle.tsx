type SectionTitleProps = {
  badge?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionTitle({
  badge,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionTitleProps) {
  const label = badge ?? eyebrow;

  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={`mb-16 flex flex-col ${alignment}`}>
      {label && (
        <>
          <div className="mb-5 h-px w-16 bg-[#C8FF00]" />

          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8FF00]">
            {label}
          </span>
        </>
      )}

      <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          {description}
        </p>
      )}
    </div>
  );
}