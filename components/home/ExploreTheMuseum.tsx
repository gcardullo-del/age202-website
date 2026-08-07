import {
  BookOpen,
  Crown,
  Landmark,
  LibraryBig,
  Trophy,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

const museumRooms = [
  {
    title: "Hall of Champions",
    description:
      "Enter the permanent galleries dedicated to Roger Federer, Rafael Nadal, Novak Djokovic, Jannik Sinner and Carlos Alcaraz.",
    badge: "Permanent Gallery",
    status: "open" as const,
    href: "#collections",
    accent: "#C8FF00",
    icon: (
      <Crown
        size={24}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "ATP Archive",
    description:
      "Explore the living archive of today's tour, with rankings, player profiles, careers, titles and museum connections.",
    badge: "Living Archive",
    status: "coming-soon" as const,
    accent: "#4F8CFF",
    icon: (
      <LibraryBig
        size={24}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "History of Tennis",
    description:
      "Travel through the Open Era, defining rivalries, legendary champions and the evolution of tennis culture.",
    badge: "Historical Wing",
    status: "coming-soon" as const,
    accent: "#D4AF37",
    icon: (
      <BookOpen
        size={24}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "Grand Slam Museum",
    description:
      "Discover the history, champions and iconic moments of the Australian Open, Roland Garros, Wimbledon and US Open.",
    badge: "Major Championships",
    status: "coming-soon" as const,
    accent: "#E85D75",
    icon: (
      <Trophy
        size={24}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "Hall of Fame",
    description:
      "A permanent tribute to the players, identities and achievements that shaped the history of the game.",
    badge: "Legacy Gallery",
    status: "coming-soon" as const,
    accent: "#FFFFFF",
    icon: (
      <Landmark
        size={24}
        aria-hidden="true"
      />
    ),
  },
];

export default function ExploreTheMuseum() {
  return (
    <section
      id="explore-the-museum"
      className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,255,0,0.055),transparent_35%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <SectionTitle
            eyebrow="Museum Directory"
            title="Explore the Museum"
            description="Choose your next destination inside AGE202. Permanent galleries live alongside new museum wings that are currently being prepared."
            align="left"
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          {museumRooms.map(
            (room, index) => {
              const large =
                index === 0 ||
                index === 1;

              return (
                <Reveal
                  key={room.title}
                  delay={
                    index * 0.08
                  }
                >
                  <Card
                    title={room.title}
                    description={
                      room.description
                    }
                    href={room.href}
                    badge={room.badge}
                    status={room.status}
                    accent={room.accent}
                    icon={room.icon}
                    className={[
                      "h-full min-h-[330px]",
                      large
                        ? "xl:col-span-6"
                        : index === 4
                          ? "md:col-span-2 xl:col-span-4"
                          : "xl:col-span-4",
                    ].join(" ")}
                  >
                    <div className="mt-8 border-t border-white/10 pt-5">
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                        Museum Room{" "}
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              );
            },
          )}
        </div>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-white/40">
              AGE202 is a living museum.
              New galleries will open as
              the archive grows.
            </p>

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C8FF00]">
              01 permanent · 04 in
              preparation
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}