"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import GlobalMuseumSearch from "@/components/public/GlobalMuseumSearch";

const playerLinks = [
  ["Roger Federer", "/archives/federer"],
  ["Rafael Nadal", "/archives/nadal"],
  ["Novak Djokovic", "/archives/djokovic"],
  ["Jannik Sinner", "/archives/sinner"],
  ["Carlos Alcaraz", "/archives/alcaraz"],
  ["Other Players", "/players/other-players"],
] as const;

const primaryLinks = [
  ["ATP Ranking", "/atp-ranking"],
  ["Results", "/tournament-results"],
  ["Tennis History", "/tennis-history"],
  ["Memorabilia", "/memorabilia"],
  ["Collaborations", "/collaborations"],
  ["Originals", "/age202-originals"],
] as const;

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MuseumNavbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const updateNavbar = () => {
      setScrolled(window.scrollY > 24);
    };

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateNavbar);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMenuOpen(false);
      setPlayersOpen(false);
      setSearchOpen(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const playersActive =
    pathname === "/players" ||
    pathname.startsWith("/players/") ||
    pathname.startsWith("/archives/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-[#030812]/92 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            : "border-white/10 bg-[#030812]/78 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[86px] max-w-[1680px] items-center px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="AGE202 home"
            className="relative z-10 flex h-[74px] w-[112px] shrink-0 items-center justify-start sm:w-[128px]"
          >
            <Image
              src="/brand/age202-logo-official.png"
              alt="AGE202 — Second Hand. First Set."
              width={150}
              height={134}
              priority
              className="h-[68px] w-auto object-contain object-left transition duration-300 hover:opacity-80"
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="mx-auto hidden h-full items-center gap-5 2xl:flex"
          >
            <Link
              href="/"
              className={`group relative flex h-full items-center text-[10px] font-bold uppercase tracking-[.18em] transition ${
                pathname === "/"
                  ? "text-[#d7ff00]"
                  : "text-white/72 hover:text-white"
              }`}
            >
              Home

              <span
                className={`absolute inset-x-0 bottom-[20px] h-px origin-left bg-[#d7ff00] transition-transform duration-300 ${
                  pathname === "/"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => setPlayersOpen(true)}
              onMouseLeave={() => setPlayersOpen(false)}
            >
              <Link
                href="/players"
                aria-haspopup="menu"
                aria-expanded={playersOpen}
                className={`group relative flex h-full items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.18em] transition ${
                  playersActive
                    ? "text-[#d7ff00]"
                    : "text-white/72 hover:text-white"
                }`}
              >
                Players

                <ChevronDown
                  size={13}
                  strokeWidth={1.8}
                  className={`transition-transform duration-200 ${
                    playersOpen ? "rotate-180" : ""
                  }`}
                />

                <span
                  className={`absolute inset-x-0 bottom-[20px] h-px origin-left bg-[#d7ff00] transition-transform duration-300 ${
                    playersActive || playersOpen
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2 transition duration-200 ${
                  playersOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div
                  role="menu"
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#07101f]/98 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl"
                >
                  {playerLinks.map(([label, href]) => {
                    const active = isCurrent(pathname, href);

                    return (
                      <Link
                        key={label}
                        href={href}
                        role="menuitem"
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[.16em] transition ${
                          active
                            ? "bg-white/[.06] text-[#d7ff00]"
                            : "text-white/65 hover:bg-white/[.06] hover:text-[#d7ff00]"
                        }`}
                      >
                        <span>{label}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {primaryLinks.map(([label, href]) => {
              const active = isCurrent(pathname, href);

              return (
                <Link
                  key={label}
                  href={href}
                  className={`group relative flex h-full items-center whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] transition ${
                    active
                      ? "text-[#d7ff00]"
                      : "text-white/72 hover:text-white"
                  }`}
                >
                  {label}

                  <span
                    className={`absolute inset-x-0 bottom-[20px] h-px origin-left bg-[#d7ff00] transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/shop"
              aria-label="Open shop"
              className="grid h-11 w-11 place-items-center text-white/85 transition hover:text-[#d7ff00]"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search museum"
              className="grid h-11 w-11 place-items-center text-white/85 transition hover:text-[#d7ff00]"
            >
              <Search size={20} strokeWidth={1.7} />
            </button>

            <span className="hidden h-8 w-px bg-white/15 sm:block" />

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center text-white transition hover:text-[#d7ff00] 2xl:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="max-h-[calc(100svh-86px)] overflow-y-auto border-t border-white/10 bg-[#030812]/98 px-5 py-5 backdrop-blur-2xl 2xl:hidden"
          >
            <div className="mx-auto max-w-7xl">
              <Link
                href="/"
                className="flex items-center justify-between border-b border-white/10 py-4 text-lg font-black uppercase tracking-[-.02em] text-white transition hover:text-[#d7ff00]"
              >
                Home
                <span className="text-sm text-[#d7ff00]">↗</span>
              </Link>

              <button
                type="button"
                onClick={() => setPlayersOpen((value) => !value)}
                aria-expanded={playersOpen}
                className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left text-lg font-black uppercase tracking-[-.02em] text-white transition hover:text-[#d7ff00]"
              >
                Players

                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    playersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {playersOpen && (
                <div className="border-b border-white/10 bg-white/[.025] px-4 py-2">
                  <Link
                    href="/players"
                    className="flex items-center justify-between py-3 text-sm font-bold uppercase tracking-[.08em] text-white/60 transition hover:text-[#d7ff00]"
                  >
                    All Players
                    <span aria-hidden="true">↗</span>
                  </Link>

                  {playerLinks.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-between py-3 text-sm font-bold uppercase tracking-[.08em] text-white/60 transition hover:text-[#d7ff00]"
                    >
                      {label}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              )}

              {primaryLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between border-b border-white/10 py-4 text-lg font-black uppercase tracking-[-.02em] text-white transition hover:text-[#d7ff00]"
                >
                  {label}
                  <span className="text-sm text-[#d7ff00]">↗</span>
                </Link>
              ))}

              <Link
                href="/shop"
                className="flex items-center justify-between border-b border-white/10 py-4 text-lg font-black uppercase tracking-[-.02em] text-white transition hover:text-[#d7ff00]"
              >
                Shop
                <span className="text-sm text-[#d7ff00]">↗</span>
              </Link>
            </div>
          </nav>
        )}
      </header>

      <GlobalMuseumSearch open={searchOpen} onClose={closeSearch} />
    </>
  );
}