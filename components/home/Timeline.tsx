import Link from "next/link";

const eras = [
  {
    year: "2003",
    player: "Roger Federer",
    slug: "federer",
    color: "#D9FF00",
  },
  {
    year: "2005",
    player: "Rafael Nadal",
    slug: "nadal",
    color: "#FF6B35",
  },
  {
    year: "2008",
    player: "Novak Djokovic",
    slug: "djokovic",
    color: "#00C853",
  },
  {
    year: "2020",
    player: "Jannik Sinner",
    slug: "sinner",
    color: "#FF6F00",
  },
  {
    year: "2022",
    player: "Carlos Alcaraz",
    slug: "alcaraz",
    color: "#29B6F6",
  },
];

export default function Timeline() {
  return (
    <section className="bg-[#08101F] py-32">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">

          <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
            TENNIS HISTORY
          </span>

          <h2 className="mt-5 text-6xl font-black text-white">
            The Modern Era
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-400">
            Discover the champions that shaped modern tennis and explore
            the collections inspired by their most iconic moments.
          </p>

        </div>

        <div className="relative mt-24">

          <div className="absolute left-0 right-0 top-12 h-px bg-white/10" />

          <div className="grid gap-12 md:grid-cols-5">

            {eras.map((era) => (

              <Link
                key={era.slug}
                href={`/archives/${era.slug}`}
                className="group relative text-center"
              >

                <div
                  className="mx-auto h-6 w-6 rounded-full border-4 bg-[#08101F]"
                  style={{ borderColor: era.color }}
                />

                <p className="mt-8 text-sm uppercase tracking-[0.3em] text-gray-500">
                  {era.year}
                </p>

                <h3
                  className="mt-3 text-2xl font-black transition group-hover:scale-105"
                  style={{ color: era.color }}
                >
                  {era.player}
                </h3>

              </Link>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}