export default function About() {
  return (
    <section className="bg-[#050B18] py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-8 lg:grid-cols-2">

        <div>
          <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
            About AGE202
          </span>

          <h2 className="mt-5 text-5xl font-black leading-tight text-white">
            More than Vintage.
            <br />
            Tennis Heritage.
          </h2>
        </div>

        <div>
          <p className="text-xl leading-9 text-gray-300">
            AGE202 nasce dalla passione per il tennis e per i suoi capi più
            iconici. Ogni prodotto racconta un momento storico: una finale,
            uno Slam, una stagione indimenticabile.
          </p>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Non vendiamo semplicemente abbigliamento usato.
            Selezioniamo capi autentici che hanno segnato la storia del tennis,
            creando una collezione pensata per collezionisti e appassionati.
          </p>
        </div>

      </div>
    </section>
  );
}