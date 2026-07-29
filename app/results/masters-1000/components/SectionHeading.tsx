type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#55C9FF]">
          {eyebrow}
        </p>

        <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/43 lg:text-right">
        {description}
      </p>
    </div>
  );
}
