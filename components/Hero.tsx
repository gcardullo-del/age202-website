import Image from "next/image";
import Button from "./ui/Button";
import Container from "./ui/Container";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">

        <Image
          src="/images/hero/federer-hero.jpg"
          alt="Roger Federer"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#07192f] via-[#07192f]/40 to-transparent" />

      </div>

      {/* Content */}

      <Container>

        <div className="relative z-10 flex h-screen items-center">

          <div className="max-w-2xl">

            <span className="tracking-[8px] uppercase text-lime-400 text-sm">

              Curated Tennis Collections

            </span>

            <h1 className="mt-8 text-7xl lg:text-8xl font-black text-white leading-none">

              AGE202

            </h1>

            <h2 className="mt-8 text-5xl lg:text-6xl text-white font-light">

              SECOND HAND.

            </h2>

            <h2 className="text-5xl lg:text-6xl font-black text-lime-400">

              FIRST SET.

            </h2>

            <p className="mt-8 max-w-xl text-xl leading-9 text-white/80">

              Collezioni autentiche dedicate ai più grandi campioni
              della storia del tennis.

            </p>

            <div className="mt-12 flex gap-5">

              <Button>

                Esplora le Collezioni

              </Button>

              <Button variant="secondary">

                The Vault

              </Button>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}