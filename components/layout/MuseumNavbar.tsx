"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/slams", label: "Grand Slams" },
  { href: "/archive", label: "Archive" },
  { href: "/brands", label: "Brands" },
] as const;

export default function MuseumNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const mobileMenuId = useId();
  const searchPanelId = useId();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    router.push(`/archive?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          }
          className={[
            "mx-auto max-w-[1450px] overflow-visible rounded-[28px] border transition-all duration-500",
            scrolled || mobileMenuOpen || searchOpen
              ? "border-white/12 bg-[#07101D]/94 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
              : "border-white/[0.08] bg-[#07101D]/58 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between gap-5 px-4 transition-all duration-500 sm:px-6 lg:px-8",
              scrolled ? "h-[74px]" : "h-[88px]",
            ].join(" ")}
          >
            <Link
              href="/"
              aria-label="AGE202 home"
              className="group relative z-50 flex shrink-0 items-center gap-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D]"
            >
              <Image
                src="/logo/age202-logo-white.png"
                alt="AGE202"
                width={170}
                height={70}
                priority
                sizes="(max-width: 640px) 128px, 155px"
                className={[
                  "h-auto w-auto drop-shadow-[0_0_18px_rgba(200,255,0,0.12)] transition-all duration-500",
                  "group-hover:drop-shadow-[0_0_24px_rgba(200,255,0,0.2)]",
                  scrolled
                    ? "max-w-[122px] sm:max-w-[142px]"
                    : "max-w-[132px] sm:max-w-[155px]",
                ].join(" ")}
              />

              <span className="hidden h-10 w-px bg-white/10 md:block" />

              <span className="hidden md:block">
                <span className="block text-[8px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                  Digital Museum
                </span>

                <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.22em] text-white/36">
                  Tennis Apparel Archive
                </span>
              </span>
            </Link>

            <div className="hidden h-8 w-px shrink-0 bg-white/10 lg:block" />

            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] p-1.5 lg:flex"
            >
              {navigation.map((item) => (
                <DesktopNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                aria-label="Open archive search"
                aria-expanded={searchOpen}
                aria-controls={searchPanelId}
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className={[
                  "group flex h-12 w-12 items-center justify-center rounded-full border",
                  "border-white/10 bg-white/[0.035] text-white/78 transition duration-300",
                  "hover:-translate-y-0.5 hover:border-[#C8FF00]/45 hover:bg-white/[0.08] hover:text-[#C8FF00]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                  "focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D]",
                ].join(" ")}
              >
                <SearchIcon />
              </button>

              <Link
                href="/archive"
                className={[
                  "group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#C8FF00] px-6",
                  "text-[10px] font-black uppercase tracking-[0.18em] text-black",
                  "transition duration-300 hover:-translate-y-0.5 hover:bg-white",
                  "hover:shadow-[0_14px_40px_rgba(200,255,0,0.18)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                  "focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D]",
                ].join(" ")}
              >
                Explore Archive

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>
            </div>

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              onClick={() => {
                setMobileMenuOpen((current) => !current);
                setSearchOpen(false);
              }}
              className={[
                "relative z-50 flex h-12 w-12 items-center justify-center rounded-full border",
                "border-white/10 bg-white/[0.035] text-white transition duration-300",
                "hover:border-[#C8FF00]/45 hover:bg-white/[0.08] hover:text-[#C8FF00]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                "focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D] lg:hidden",
              ].join(" ")}
            >
              <span className="sr-only">Navigation menu</span>

              <span className="relative block h-5 w-6">
                <span
                  className={[
                    "absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300",
                    mobileMenuOpen ? "translate-y-[9px] rotate-45" : "",
                  ].join(" ")}
                />

                <span
                  className={[
                    "absolute left-0 top-[9px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300",
                    mobileMenuOpen
                      ? "scale-x-0 opacity-0"
                      : "scale-x-100 opacity-100",
                  ].join(" ")}
                />

                <span
                  className={[
                    "absolute left-0 top-[18px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300",
                    mobileMenuOpen ? "-translate-y-[9px] -rotate-45" : "",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id={mobileMenuId}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, height: 0 }
                }
                animate={{ opacity: 1, height: "auto" }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, height: 0 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }
                className="overflow-hidden border-t border-white/[0.08] lg:hidden"
              >
                <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto px-4 pb-5 pt-5 sm:px-6">
                  <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                        Museum Navigation
                      </p>

                      <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/28">
                        AGE202 · Digital Tennis Archive
                      </p>
                    </div>

                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/18">
                      01—05
                    </span>
                  </div>

                  <nav
                    aria-label="Mobile primary navigation"
                    className="mt-5 grid gap-2 sm:grid-cols-2"
                  >
                    {navigation.map((item, index) => (
                      <MobileNavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        index={index + 1}
                        active={isActive(item.href)}
                      />
                    ))}
                  </nav>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className={[
                      "mt-6 flex min-h-14 w-full items-center justify-between rounded-[20px] border px-5",
                      "border-white/[0.08] bg-white/[0.025] text-white transition duration-300",
                      "hover:border-[#C8FF00]/35 hover:bg-white/[0.08]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                      "focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#C8FF00]">
                        <SearchIcon />
                      </span>

                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Search the archive
                      </span>
                    </span>

                    <span className="font-mono text-[8px] text-white/26">
                      CTRL K
                    </span>
                  </button>

                  <Link
                    href="/archive"
                    className={[
                      "group mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-full",
                      "bg-[#C8FF00] px-7 text-[10px] font-black uppercase tracking-[0.2em] text-black",
                      "transition duration-300 hover:bg-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                      "focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D]",
                    ].join(" ")}
                  >
                    Explore Archive

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </Link>

                  <p className="mt-6 text-center text-[8px] font-black uppercase tracking-[0.28em] text-white/18">
                    Second Hand. First Set.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            id={searchPanelId}
            role="dialog"
            aria-modal="true"
            aria-label="Search the AGE202 archive"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.22 }
            }
            className="fixed inset-0 z-[60] flex items-start justify-center bg-[#020713]/80 px-4 pt-28 backdrop-blur-xl sm:pt-36"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSearchOpen(false);
              }
            }}
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 18, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.985 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
              }
              className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-[#07101D]/98 shadow-[0_40px_120px_rgba(0,0,0,0.58)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                    Museum Search
                  </p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/28">
                    Players, brands, eras and archive pieces
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full border",
                    "border-white/10 bg-white/[0.03] text-white/55 transition",
                    "hover:border-[#C8FF00]/40 hover:bg-white/[0.08] hover:text-[#C8FF00]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
                  ].join(" ")}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSearch} className="p-6 sm:p-8">
                <label htmlFor="museum-search" className="sr-only">
                  Search the AGE202 archive
                </label>

                <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.035] px-5 focus-within:border-[#C8FF00]/50">
                  <span className="text-[#C8FF00]">
                    <SearchIcon />
                  </span>

                  <input
                    id="museum-search"
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search Federer, Nike, Wimbledon..."
                    className="min-h-16 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/24"
                  />

                  <button
                    type="submit"
                    className={[
                      "hidden min-h-10 items-center rounded-full bg-[#C8FF00] px-5",
                      "text-[9px] font-black uppercase tracking-[0.18em] text-black transition",
                      "hover:bg-white focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-[#C8FF00] sm:inline-flex",
                    ].join(" ")}
                  >
                    Search
                  </button>
                </div>

                <button
                  type="submit"
                  className={[
                    "mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-[#C8FF00]",
                    "text-[9px] font-black uppercase tracking-[0.2em] text-black transition",
                    "hover:bg-white focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[#C8FF00] sm:hidden",
                  ].join(" ")}
                >
                  Search Archive
                </button>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Federer", "Nadal", "Sinner", "Nike", "Wimbledon"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className={[
                          "rounded-full border border-white/10 bg-white/[0.025] px-4 py-2",
                          "text-[8px] font-bold uppercase tracking-[0.18em] text-white/45 transition",
                          "hover:border-[#C8FF00]/35 hover:bg-white/[0.08] hover:text-[#C8FF00]",
                        ].join(" ")}
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type DesktopNavLinkProps = {
  href: string;
  label: string;
  active: boolean;
};

function DesktopNavLink({
  href,
  label,
  active,
}: DesktopNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "relative flex min-h-10 items-center rounded-full px-5",
        "text-[10px] font-black uppercase tracking-[0.17em]",
        "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
        active
          ? "bg-[#C8FF00] text-black shadow-[0_0_24px_rgba(200,255,0,0.18)]"
          : "text-white/66 hover:bg-white/[0.08] hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

type MobileNavLinkProps = {
  href: string;
  label: string;
  index: number;
  active: boolean;
};

function MobileNavLink({
  href,
  label,
  index,
  active,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex min-h-14 items-center justify-between rounded-[18px] border px-4",
        "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
        active
          ? "border-[#C8FF00] bg-[#C8FF00] text-black shadow-[0_0_24px_rgba(200,255,0,0.14)]"
          : "border-white/[0.08] bg-white/[0.025] text-white hover:border-white/15 hover:bg-white/[0.08]",
      ].join(" ")}
    >
      <span className="flex items-center gap-4">
        <span
          className={[
            "font-mono text-[8px] tracking-[0.2em]",
            active ? "text-black/45" : "text-white/22",
          ].join(" ")}
        >
          {String(index).padStart(2, "0")}
        </span>

        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
          {label}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={[
          "transition-transform duration-300 group-hover:translate-x-1",
          active ? "text-black/55" : "text-[#C8FF00]",
        ].join(" ")}
      >
        →
      </span>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}