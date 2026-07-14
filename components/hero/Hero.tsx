import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-96px)] overflow-hidden">
      <HeroBackground image="/players/federer-hero.jpeg" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#081224]/90 via-[#081224]/60 to-transparent" />

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6">
          <span className="inline-block rounded-full border border-lime-400 px-4 py-2 text-sm font-semibold text-lime-400">
            Roger Federer Collection
          </span>

          <h1 className="mt-6 max-w-3xl text-6xl font-black leading-tight text-white">
            Elegance Never Fades
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Scopri una selezione esclusiva di capi autentici dedicati
            al giocatore che ha rivoluzionato il tennis con la sua eleganza.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-full bg-lime-300 px-8 py-4 font-bold text-black transition hover:scale-105">
              Esplora la collezione
            </button>

            <button className="rounded-full border border-white/20 px-8 py-4 text-white hover:border-lime-300">
              The Vault
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}