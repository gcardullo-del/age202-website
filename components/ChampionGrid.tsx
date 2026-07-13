import Image from "next/image";
import Link from "next/link";

import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";

import { players } from "@/data/players";

export default function ChampionGrid() {
  return (
    <section className="bg-[#07192f] py-24">

      <Container>

        <SectionTitle
          eyebrow="Collections"
          title="The Champions"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-4">

          {players.map((player) => (

            <Link
              key={player.id}
              href={`/${player.id}`}
              className="group relative overflow-hidden rounded-3xl"
            >

              <Image
                src={player.image}
                alt={player.name}
                width={700}
                height={900}
                className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8">

                <p className="text-sm uppercase tracking-[4px] text-lime-400">

                  {player.nickname}

                </p>

                <h3 className="mt-2 text-4xl font-bold text-white">

                  {player.name}

                </h3>

              </div>

            </Link>

          ))}

        </div>

      </Container>

    </section>
  );
}