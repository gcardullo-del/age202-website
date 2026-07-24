import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

import { products } from "@/data/products";
import { champions } from "@/data/champions";
import { museumBrands } from "@/data/brands";

export default function AboutPage() {
  return (
    <main className="bg-[#050B18] text-white">
      {/* HERO */}

      <section className="relative h-[80vh]">
        <Image
          src="/about/about-hero.jpg"
          alt="AGE202"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/95 via-[#050B18]/70 to-transparent" />

        <Container className="relative flex h-full items-center">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.35em] text-[#C8FF00]">
              The Digital Tennis Archive
            </span>

            <h1 className="mt-6 text-6xl font-black">
              Every Garment Has a Story.
            </h1>

            <p className="mt-8 text-xl leading-9 text-gray-300">
              AGE202 preserves authentic tennis apparel, transforming iconic
              garments into a curated digital archive for collectors and
              enthusiasts.
            </p>
          </div>
        </Container>
      </section>

      {/* STORY */}

      <section className="py-28">
        <Container>
          <SectionTitle
            badge="Our Story"
            title="More than Second Hand."
            description="AGE202 nasce dalla passione per il tennis e dalla convinzione che alcuni capi raccontino momenti indimenticabili della storia di questo sport."
          />

          <div className="max-w-4xl space-y-8 text-lg leading-9 text-gray-300">
            <p>
              Ogni maglia, polo o giacca rappresenta molto più di un semplice
              indumento: è il ricordo di una finale, di un Grande Slam, di una
              stagione entrata nella storia.
            </p>

            <p>
              Il nostro obiettivo è preservare questi pezzi, catalogarli e
              renderli accessibili agli appassionati attraverso un archivio
              digitale curato.
            </p>
          </div>
        </Container>
      </section>

      {/* VALUES */}

      <section className="bg-[#08101F] py-28">
        <Container>
          <SectionTitle
            badge="Our Values"
            title="What defines AGE202"
          />

          <div className="grid gap-8 md:grid-cols-3">
            <ValueCard
              title="Authenticity"
              text="Ogni capo viene verificato, documentato e archiviato con un codice univoco."
            />

            <ValueCard
              title="History"
              text="Ogni prodotto è accompagnato dal contesto storico che lo rende speciale."
            />

            <ValueCard
              title="Collection"
              text="Non vendiamo semplicemente abbigliamento. Conserviamo la storia del tennis."
            />
          </div>
        </Container>
      </section>

      {/* NUMBERS */}

      <section className="py-28">
        <Container>
          <SectionTitle
            badge="The Archive"
            title="AGE202 in Numbers"
          />

          <div className="grid gap-8 md:grid-cols-4">
            <Number
              value={products.length}
              label="Archive Pieces"
            />

            <Number
              value={champions.length}
              label="Players"
            />

            <Number
              value={museumBrands.length}
              label="Brands"
            />

            <Number
              value="100%"
              label="Authenticity"
            />
          </div>
        </Container>
      </section>

      {/* CTA */}

      <section className="pb-32">
        <Container>
          <div className="rounded-[32px] border border-white/10 bg-[#08101F] p-16 text-center">
            <h2 className="text-5xl font-black">
              Explore the Archive
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Discover collectible tennis apparel inspired by the greatest
              champions in history.
            </p>

            <Link
              href="/"
              className="btn-primary mt-10"
            >
              Back to Home →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

function ValueCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="card p-10">
      <h3 className="text-2xl font-black">{title}</h3>

      <p className="mt-5 leading-8 text-gray-400">
        {text}
      </p>
    </div>
  );
}

function Number({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="text-6xl font-black text-[#C8FF00]">
        {value}
      </div>

      <div className="mt-3 uppercase tracking-[0.25em] text-gray-400">
        {label}
      </div>
    </div>
  );
}