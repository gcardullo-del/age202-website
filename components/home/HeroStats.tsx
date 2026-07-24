export default function HeroStats() {
  const stats = [
    {
      value: "5",
      label: "Legendary Players",
    },
    {
      value: "100%",
      label: "Authentic Pieces",
    },
    {
      value: "24+",
      label: "Grand Slam Collections",
    },
    {
      value: "Vintage",
      label: "Tennis Apparel",
    },
  ];

  return (
    <section className="bg-[#08101F] border-y border-white/10">
      <div className="mx-auto max-w-7xl px-8 py-14">

        <div className="grid gap-10 text-center md:grid-cols-4">

          {stats.map((item) => (
            <div
              key={item.label}
              className="transition duration-300 hover:-translate-y-1"
            >
              <h3 className="text-5xl font-black text-[#C8FF00]">
                {item.value}
              </h3>

              <p className="mt-3 uppercase tracking-[0.3em] text-sm text-gray-400">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}