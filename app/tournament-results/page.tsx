"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

type Tournament = {
  name: string;
  city: string;
  country: string;
  category: "Grand Slam" | "Masters 1000" | "ATP 500" | "ATP 250";
  surface: "Hard" | "Clay" | "Grass";
  champion: string;
  finalist: string;
  score: string;
  date: string;
  status: "Completed" | "Upcoming";
  href?: string;
};

const tournaments: Tournament[] = [
  {
    name: "Australian Open",
    city: "Melbourne",
    country: "Australia",
    category: "Grand Slam",
    surface: "Hard",
    champion: "Jannik Sinner",
    finalist: "Alexander Zverev",
    score: "6–3 7–6 6–3",
    date: "January",
    status: "Completed",
    href: "/slams/australian-open",
  },
  {
    name: "Roland Garros",
    city: "Paris",
    country: "France",
    category: "Grand Slam",
    surface: "Clay",
    champion: "Carlos Alcaraz",
    finalist: "Jannik Sinner",
    score: "4–6 6–7 6–4 7–6 7–6",
    date: "June",
    status: "Completed",
    href: "/slams/roland-garros",
  },
  {
    name: "Wimbledon",
    city: "London",
    country: "Great Britain",
    category: "Grand Slam",
    surface: "Grass",
    champion: "Jannik Sinner",
    finalist: "Carlos Alcaraz",
    score: "4–6 6–4 6–4 6–4",
    date: "July",
    status: "Completed",
    href: "/slams/wimbledon",
  },
  {
    name: "US Open",
    city: "New York",
    country: "United States",
    category: "Grand Slam",
    surface: "Hard",
    champion: "—",
    finalist: "—",
    score: "Tournament preview",
    date: "August–September",
    status: "Upcoming",
    href: "/slams/us-open",
  },
  {
    name: "Indian Wells",
    city: "Indian Wells",
    country: "United States",
    category: "Masters 1000",
    surface: "Hard",
    champion: "Jack Draper",
    finalist: "Holger Rune",
    score: "6–2 6–2",
    date: "March",
    status: "Completed",
  },
  {
    name: "Monte-Carlo Masters",
    city: "Monte Carlo",
    country: "Monaco",
    category: "Masters 1000",
    surface: "Clay",
    champion: "Carlos Alcaraz",
    finalist: "Lorenzo Musetti",
    score: "3–6 6–1 6–0",
    date: "April",
    status: "Completed",
  },
  {
    name: "Barcelona Open",
    city: "Barcelona",
    country: "Spain",
    category: "ATP 500",
    surface: "Clay",
    champion: "Holger Rune",
    finalist: "Carlos Alcaraz",
    score: "7–6 6–2",
    date: "April",
    status: "Completed",
  },
  {
    name: "Queen’s Club",
    city: "London",
    country: "Great Britain",
    category: "ATP 500",
    surface: "Grass",
    champion: "Carlos Alcaraz",
    finalist: "Jiri Lehecka",
    score: "7–5 6–7 6–2",
    date: "June",
    status: "Completed",
  },
];

const categories = ["All", "Grand Slam", "Masters 1000", "ATP 500", "ATP 250"] as const;
const surfaces = ["All surfaces", "Hard", "Clay", "Grass"] as const;

export default function TournamentResultsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [surface, setSurface] = useState<(typeof surfaces)[number]>("All surfaces");

  const filteredTournaments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return tournaments.filter((tournament) => {
      const matchesQuery =
        !normalized ||
        `${tournament.name} ${tournament.city} ${tournament.country} ${tournament.champion}`
          .toLowerCase()
          .includes(normalized);
      const matchesCategory = category === "All" || tournament.category === category;
      const matchesSurface = surface === "All surfaces" || tournament.surface === surface;

      return matchesQuery && matchesCategory && matchesSurface;
    });
  }, [category, query, surface]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(215,255,0,.13),transparent_30%)]" />
        <div className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-[#d7ff00]/10" />
        <div className="absolute -right-10 top-6 h-80 w-80 rounded-full border border-white/[.04]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-[#d7ff00]">
            <span className="h-px w-10 bg-[#d7ff00]" /> AGE202 tour intelligence
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="max-w-6xl text-[clamp(3.5rem,8.4vw,8.5rem)] font-black uppercase leading-[.8] tracking-[-.07em]">
                Tournament<br />
                <span className="text-[#d7ff00]">Results.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                A curated tour overview connecting champions, surfaces and iconic venues with the AGE202 museum archive.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-white/[.035] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[.23em] text-white/45">Platform status</span>
                <Sparkles size={17} className="text-[#d7ff00]" />
              </div>
              <p className="mt-8 text-2xl font-black uppercase tracking-[-.04em]">Results preview</p>
              <p className="mt-3 text-sm leading-7 text-white/48">
                The interface is ready for a future connection to a verified tournament data provider.
              </p>
              <div className="mt-6 border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.18em] text-[#d7ff00]">
                Curated prototype · Not live
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Featured events", "08", "Tour selection"],
              ["Grand Slams", "04", "Major stages"],
              ["Surfaces", "03", "Hard · Clay · Grass"],
              ["Museum links", "04", "Slam exhibitions"],
            ].map(([label, value, detail]) => (
              <article key={label} className="rounded-[1.45rem] border border-white/10 bg-white/[.028] p-6">
                <p className="text-[9px] font-black uppercase tracking-[.24em] text-[#d7ff00]">{label}</p>
                <p className="mt-6 text-4xl font-black uppercase tracking-[-.055em]">{value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-white/38">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 border-t border-white/10 pt-7">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#d7ff00]">Season overview</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">Tour calendar</h2>
              </div>

              <label className="relative block w-full lg:max-w-sm">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tournament or champion"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[.035] pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#d7ff00]/55"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-4 rounded-[1.4rem] border border-white/10 bg-white/[.022] p-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[.2em] text-white/35">
                <Filter size={15} className="text-[#d7ff00]" /> Filter archive
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[.16em] transition ${
                      category === item
                        ? "border-[#d7ff00] bg-[#d7ff00] text-[#050b18]"
                        : "border-white/10 text-white/45 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {surfaces.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSurface(item)}
                    className={`rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[.16em] transition ${
                      surface === item
                        ? "border-[#d7ff00]/70 bg-[#d7ff00]/10 text-[#d7ff00]"
                        : "border-white/10 text-white/45 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {filteredTournaments.map((tournament, index) => {
              const content = (
                <article className="group relative h-full overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[.022] p-6 transition hover:border-[#d7ff00]/35 hover:bg-white/[.035] sm:p-7">
                  <div className="absolute right-0 top-0 text-[7rem] font-black leading-none tracking-[-.08em] text-white/[.025] sm:text-[9rem]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative flex h-full flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#d7ff00]/25 bg-[#d7ff00]/[.06] px-3 py-1.5 text-[8px] font-black uppercase tracking-[.18em] text-[#d7ff00]">
                          {tournament.category}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.18em] text-white/45">
                          {tournament.surface}
                        </span>
                      </div>

                      <span className={`inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[.18em] ${tournament.status === "Completed" ? "text-emerald-300" : "text-amber-200"}`}>
                        {tournament.status === "Completed" ? <Check size={13} /> : <CircleDot size={13} />}
                        {tournament.status}
                      </span>
                    </div>

                    <div className="mt-9">
                      <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-white/35">
                        <MapPin size={13} className="text-[#d7ff00]" /> {tournament.city} · {tournament.country}
                      </p>
                      <h3 className="mt-4 max-w-xl text-3xl font-black uppercase tracking-[-.045em] sm:text-4xl">
                        {tournament.name}
                      </h3>
                    </div>

                    <div className="mt-10 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/30">
                          {tournament.status === "Completed" ? "Champion" : "Tournament window"}
                        </p>
                        <p className="mt-2 text-xl font-black uppercase tracking-[-.025em]">
                          {tournament.status === "Completed" ? tournament.champion : tournament.date}
                        </p>
                        <p className="mt-2 text-sm text-white/45">
                          {tournament.status === "Completed"
                            ? `Final vs ${tournament.finalist} · ${tournament.score}`
                            : tournament.score}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-white/35">
                          <CalendarDays size={14} /> {tournament.date}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/40 transition group-hover:border-[#d7ff00]/50 group-hover:text-[#d7ff00]">
                          <ChevronRight size={17} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );

              return tournament.href ? (
                <Link key={tournament.name} href={tournament.href} className="block h-full">
                  {content}
                </Link>
              ) : (
                <div key={tournament.name}>{content}</div>
              );
            })}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/[.02] px-6 py-20 text-center">
              <Trophy size={28} className="mx-auto text-[#d7ff00]" />
              <p className="mt-5 text-sm font-black uppercase tracking-[.18em] text-white/60">No tournaments found</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setSurface("All surfaces");
                }}
                className="mt-5 text-[10px] font-black uppercase tracking-[.2em] text-[#d7ff00]"
              >
                Reset filters
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col justify-between gap-6 rounded-[1.5rem] border border-[#d7ff00]/20 bg-[#d7ff00]/[.045] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <Trophy className="mt-1 shrink-0 text-[#d7ff00]" size={23} />
              <div>
                <p className="text-base font-black uppercase tracking-[-.02em]">The Grand Slam rooms</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/48">
                  Continue from the results overview into dedicated museum rooms for tennis&apos;s four most iconic stages.
                </p>
              </div>
            </div>
            <Link href="/slams" className="group inline-flex shrink-0 items-center gap-3 text-[10px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
              Explore tournaments <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
