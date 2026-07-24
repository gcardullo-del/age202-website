import type { Metadata } from "next";
import Link from "next/link";

import SavedArchives from "@/components/products/SavedArchives";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Saved Archives | AGE202",
  description:
    "Your personal collection of saved tennis archive pieces from AGE202.",
};

export default function SavedArchivesPage() {
  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <div className="h-24" />

      <section className="relative overflow-hidden border-b border-white/10 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[#C8FF00]/5 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white"
          >
            ← Back to AGE202
          </Link>

          <p className="mt-14 text-sm font-black uppercase tracking-[0.4em] text-[#C8FF00]">
            Personal Collection
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.05] text-white md:text-7xl">
            Your saved
            <br />
            archive pieces.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl">
            A personal selection of the tennis garments, collections and
            historical pieces you want to remember.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SavedArchives products={products} />
        </div>
      </section>
    </main>
  );
}