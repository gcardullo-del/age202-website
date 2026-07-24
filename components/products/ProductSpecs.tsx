type Props = {
  player: string;
  brand: string;
  tournament: string;
  year: number;
  size: string;
  condition: string;
  rarity: string;
};

export default function ProductSpecs({
  player,
  brand,
  tournament,
  year,
  size,
  condition,
  rarity,
}: Props) {
  const specs = [
    ["Player", player],
    ["Brand", brand],
    ["Tournament", tournament],
    ["Year", year],
    ["Size", size],
    ["Condition", condition],
    ["Rarity", rarity],
  ];

  return (
    <section className="mt-24 border-t border-white/10 pt-20">
      <h2 className="text-4xl font-black text-white">
        Specifications
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {specs.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5"
          >
            <span className="text-gray-400">
              {label}
            </span>

            <span className="font-semibold text-white">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}