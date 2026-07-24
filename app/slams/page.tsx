import type { Metadata } from "next";

import Link from "next/link";

import {
  grandSlams,
  productMatchesGrandSlam,
} from "@/data/grandSlams";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Grand Slam Rooms | AGE202 Museum",
  description:
    "Enter the Australian Open, Roland Garros, Wimbledon and US Open rooms of the AGE202 Digital Tennis Museum.",
};

export default function GrandSlamsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* NAVBAR SPACER */}

      <div className="h-24" />

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#C8FF00]/[0.06] blur-[180px]" />

        <div className="pointer-events-none absolute -bottom-52 -left-40 h-[600px] w-[600px] rounded-full bg-blue-500/[0.05] blur-[190px]" />

        <div className="relative mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
          <Link
            href="/archive"
            className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-[#C8FF00]"
          >
            <span aria-hidden="true">←</span>
            Digital Archive
          </Link>

          <div className="mt-16 max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[#C8FF00]">
              AGE202 Museum Wing
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white md:text-7xl xl:text-8xl">
              The Grand Slam
              <span className="block text-gray-600">
                Rooms.
              </span>
            </h1>

            <p className="mt-9 max-w-3xl text-base leading-8 text-gray-400 md:text-lg md:leading-9">
              Four tournaments define the highest level of tennis history.
              Enter each room to explore the apparel, seasons and champions
              documented inside the AGE202 archive.
            </p>
          </div>
        </div>
      </section>

      {/* ROOMS */}

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1700px] px-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {grandSlams.map((grandSlam, index) => {
              const matchingProducts = products.filter((product) =>
                productMatchesGrandSlam(product, grandSlam)
              );

              return (
                <Link
                  key={grandSlam.slug}
                  href={`/slams/${grandSlam.slug}`}
                  className="group relative min-h-[520px] overflow-hidden rounded-[38px] border border-white/10 bg-[#0A1425] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#C8FF00]/30 hover:shadow-[0_35px_100px_rgba(0,0,0,0.4)] md:p-11"
                >
                  {/* GLOW */}

                  <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C8FF00]/0 blur-[130px] transition-all duration-700 group-hover:bg-[#C8FF00]/[0.08]" />

                  {/* LARGE INITIALS */}

                  <span className="pointer-events-none absolute -bottom-8 right-4 text-[170px] font-black leading-none tracking-[-0.1em] text-white/[0.025] transition-all duration-700 group-hover:-translate-y-4 group-hover:text-white/[0.055] md:text-[230px]">
                    {grandSlam.shortName}
                  </span>

                  <div className="relative flex min-h-[440px] flex-col justify-between">
                    <div className="flex items-start justify-between gap-6">
                      <span className="text-[10px] font-black tracking-[0.32em] text-gray-700 transition-colors group-hover:text-[#C8FF00]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#050B18]/70 text-xl text-white backdrop-blur-xl transition-all duration-500 group-hover:rotate-[-10deg] group-hover:border-[#C8FF00] group-hover:bg-[#C8FF00] group-hover:text-black">
                        →
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                        {grandSlam.city} · {grandSlam.country}
                      </p>

                      <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
                        {grandSlam.name}
                      </h2>

                      <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500 md:text-base md:leading-8">
                        {grandSlam.archiveDescription}
                      </p>

                      <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                        <RoomDetail
                          label="Surface"
                          value={grandSlam.surface}
                        />

                        <RoomDetail
                          label="Season"
                          value={grandSlam.season}
                        />

                        <RoomDetail
                          label="Archive"
                          value={`${matchingProducts.length} ${
                            matchingProducts.length === 1
                              ? "piece"
                              : "pieces"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8FF00] transition-all duration-700 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function RoomDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.24em] text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold leading-5 text-gray-300 md:text-sm">
        {value}
      </p>
    </div>
  );
}