interface Props {
  eyebrow: string;
  title: string;
}

export default function SectionTitle({
  eyebrow,
  title,
}: Props) {
  return (
    <>
      <p className="uppercase tracking-[8px] text-lime-400 text-sm">
        {eyebrow}
      </p>

      <h2 className="text-5xl font-black text-white mt-4">
        {title}
      </h2>
    </>
  );
}
