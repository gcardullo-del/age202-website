import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[36px] border border-dashed border-white/10 bg-[#08101F] px-8 py-24 text-center">
      <div className="text-6xl">🎾</div>

      <h2 className="mt-8 text-3xl font-black">
        Nessun capo trovato
      </h2>

      <p className="mt-5 max-w-lg text-lg leading-8 text-gray-400">
        Nessun articolo corrisponde ai filtri selezionati.
        Prova a modificare la ricerca oppure esplora
        l'intero archivio AGE202.
      </p>

      <Link
        href="/archive"
        className="mt-10 rounded-full bg-[#C8FF00] px-8 py-4 font-black uppercase tracking-[0.2em] text-black transition hover:scale-105"
      >
        Mostra tutto
      </Link>
    </div>
  );
}