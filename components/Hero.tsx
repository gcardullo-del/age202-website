import Image from "next/image";
import Button from "./ui/button";
import Container from "./ui/Container";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0">

<Image
  src="/hero/federer-hero.png"
  alt="Roger Federer"
  fill
  priority
  className="object-cover"
  style={{
    objectPosition: "65% center",
  }}
/>

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18]/95 via-[#050B18]/60 to-transparent" />

      </div>

      {/* Content */}

      <Container>

        <div className="relative z-10 flex h-screen items-center">

          <div className="max-w-3xl">

            <span className="text-sm font-bold uppercase tracking-[0.45em] text-[#C8FF00]">

              AGE202 DIGITAL ARCHIVE

            </span>

            <h1 className="mt-8 text-6xl leading-[0.95] font-black text-white md:text-7xl xl:text-8xl">

              Every Shirt
              <br />
              Tells a Story.

            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-white/80">

              Discover authentic tennis apparel worn during the sport&apos;s
              most iconic moments. Every piece is carefully curated,
              authenticated and preserved inside the AGE202 Archive.

            </p>

            <div className="mt-14 flex flex-wrap gap-5">

              <Button>

                Explore Archive

              </Button>

              <Button variant="secondary">

                Enter The Vault

              </Button>

            </div>

            <div className="mt-20 flex items-center gap-10">

              <div>

                <p className="text-4xl font-black text-[#C8FF00]">
                  500+
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-400">
                  Archive Pieces
                </p>

              </div>

              <div>

                <p className="text-4xl font-black text-[#C8FF00]">
                  5
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-400">
                  Champions
                </p>

              </div>

              <div>

                <p className="text-4xl font-black text-[#C8FF00]">
                  100%
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-400">
                  Authentic
                </p>

              </div>

            </div>

          </div>

        </div>

      </Container>

      {/* Scroll Indicator */}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">

        <div className="h-14 w-[2px] bg-white/20">

          <div className="h-7 w-[2px] animate-pulse bg-[#C8FF00]" />

        </div>

      </div>

    </section>
  );
}