type Props = {
  badge?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  badge,
  title,
  description,
}: Props) {
  return (
    <div className="mb-16">
      {badge && (
        <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
          {badge}
        </span>
      )}

      <h2 className="mt-4 text-5xl font-black text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}