import Image from "next/image";

import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";
import Button from "./ui/Button";

import { featured } from "@/data/featured";

export default function FeaturedCollection() {
  return (
    <section className="bg-[var(--background-secondary)] py-28">

      <Container>

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl">

            <Image
              src={featured.image}
              alt={featured.title}
              width={900}
              height={900}
              className="h-[650px] w-full object-cover transition duration-700 hover:scale-105"
            />

          </div>

          <div>

            <SectionTitle
              eyebrow={featured.subtitle}
              title={featured.title}
            />

            <p className="mt-8 text-lg leading-9 text-[color:var(--text-secondary)]">

              {featured.description}

            </p>

            <div className="mt-10">

              <Button>

                {featured.button}

              </Button>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}