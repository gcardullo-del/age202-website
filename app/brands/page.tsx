export default function BrandsPage() {
  const brands = [
    "Nike",
    "Adidas",
    "On",
    "Asics",
  ];

  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <section className="mx-auto max-w-7xl px-8 py-32">

        <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
          BRANDS
        </span>

        <h1 className="mt-6 text-6xl font-black">
          Iconic Tennis Brands
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {brands.map((brand) => (

            <div
              key={brand}
              className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center transition hover:border-[#C8FF00]"
            >
              <h2 className="text-3xl font-black">
                {brand}
              </h2>
            </div>

          ))}

        </div>

      </section>
    </main>
  );
}