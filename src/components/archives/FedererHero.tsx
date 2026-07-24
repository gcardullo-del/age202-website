import Image from "next/image";

export default function FedererHero() {
  return (
    <section className="relative h-[85vh] min-h-[700px] overflow-hidden">

      <Image
        src="/players/federer-hero.jpeg"
        alt="Roger Federer"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/95 via-[#050B18]/70 to-black/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8">

        <div className="max-w-3xl">

          <span className="badge">
            Roger Federer Archive
          </span>

          <h1 className="mt-8 text-7xl font-black leading-none text-white">
            Roger
            <br />
            Federer
          </h1>

          <p className="mt-6 text-2xl text-gray-300">
            The Swiss Maestro
          </p>

          <div className="mt-12 flex flex-wrap gap-10">

            <div>
              <div className="text-5xl font-black text-[#C8FF00]">
                20
              </div>

              <div className="mt-2 uppercase tracking-widest text-gray-400">
                Grand Slam
              </div>
            </div>

            <div>
              <div className="text-5xl font-black text-[#C8FF00]">
                103
              </div>

              <div className="mt-2 uppercase tracking-widest text-gray-400">
                ATP Titles
              </div>
            </div>

            <div>
              <div className="text-5xl font-black text-[#C8FF00]">
                310
              </div>

              <div className="mt-2 uppercase tracking-widest text-gray-400">
                Weeks No.1
              </div>
            </div>

          </div>

          <a
            href="#collection"
            className="btn-primary mt-14 inline-flex"
          >
            Explore Archive →
          </a>

        </div>

      </div>

    </section>
  );
}