"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/vault", label: "The Vault" },
  { href: "/brands", label: "Brands" },
  { href: "/saved", label: "Saved" },
  { href: "/about", label: "About" },
] as const;

const playerLinks = [
  {
    href: "/archives/federer",
    label: "Federer",
    subtitle: "Swiss precision",
    code: "RF",
  },
  {
    href: "/archives/nadal",
    label: "Nadal",
    subtitle: "Clay court legacy",
    code: "RN",
  },
  {
    href: "/archives/djokovic",
    label: "Djokovic",
    subtitle: "Historic dominance",
    code: "ND",
  },
  {
    href: "/archives/sinner",
    label: "Sinner",
    subtitle: "Italian evolution",
    code: "JS",
  },
  {
    href: "/archives/alcaraz",
    label: "Alcaraz",
    subtitle: "The new era",
    code: "CA",
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const mobileMenuId = useId();
  const playersMenuId = useId();
  const playersRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMobileMenuOpen(false);
      setPlayersOpen(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setPlayersOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        playersRef.current &&
        !playersRef.current.contains(event.target as Node)
      ) {
        setPlayersOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const playersActive = playerLinks.some((link) => isActive(link.href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        }
        className={[
          "mx-auto max-w-[1720px] rounded-[26px] border transition-all duration-500",
          scrolled || mobileMenuOpen
            ? "border-white/12 bg-[#07101D]/92 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
            : "border-white/[0.08] bg-[#07101D]/55 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-between gap-5 px-4 transition-all duration-500 sm:px-6 lg:px-7",
            scrolled ? "h-[72px]" : "h-[82px]",
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
              width={160}
              height={60}
              priority
              sizes="(max-width: 640px) 126px, 150px"
              className={[
                "h-auto w-auto transition-all duration-500",
                scrolled
                  ? "max-w-[126px] sm:max-w-[138px]"
                  : "max-w-[136px] sm:max-w-[150px]",
              ].join(" ")}
            />

            <span className="hidden h-9 w-px bg-white/10 md:block" />

            <span className="hidden md:block">
              <span className="block text-[8px] font-black uppercase tracking-[0.32em] text-[#C8FF00]">
                Digital Museum
              </span>

              <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.23em] text-white/38">
                Tennis Apparel Archive
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 xl:flex">
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1.5"
            >
              {mainLinks.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}

              <div ref={playersRef} className="relative">
                <button
                  type="button"
                  aria-expanded={playersOpen}
                  aria-controls={playersMenuId}
                  aria-haspopup="menu"
                  aria-current={playersActive ? "page" : undefined}
                  onClick={() => setPlayersOpen((current) => !current)}
                  className={[
                    "group flex min-h-10 items-center gap-2 rounded-full px-4",
                    "text-[10px] font-black uppercase tracking-[0.18em]",
                    "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
                    playersActive || playersOpen
                      ? "bg-[#C8FF00] text-black"
                      : "text-white/72 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  Players

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={[
                      "h-3 w-3 transition-transform duration-300",
                      playersOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {playersOpen && (
                    <motion.div
                      id={playersMenuId}
                      role="menu"
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, y: 12, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 8, scale: 0.985 }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                      }
                      className="absolute right-0 top-[calc(100%+14px)] w-[390px] overflow-hidden rounded-[26px] border border-white/10 bg-[#07101D]/98 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.56)] backdrop-blur-2xl"
                    >
                      <div className="flex items-end justify-between gap-6 border-b border-white/10 px-3 pb-4 pt-2">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                            Champion Archives
                          </p>

                          <p className="mt-2 text-[10px] leading-5 text-white/35">
                            Five players. Five eras. One living collection.
                          </p>
                        </div>

                        <span className="font-mono text-[9px] tracking-[0.2em] text-white/20">
                          01—05
                        </span>
                      </div>

                      <div className="mt-3 grid gap-1">
                        {playerLinks.map((link, index) => {
                          const active = isActive(link.href);

                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              aria-current={active ? "page" : undefined}
                              className={[
                                "group/item flex items-center gap-4 rounded-[18px] px-3 py-3",
                                "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
                                "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
                                active
                                  ? "bg-[#C8FF00] text-black"
                                  : "text-white hover:bg-white/[0.055]",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                                  "font-mono text-[9px] font-bold tracking-[0.12em]",
                                  active
                                    ? "border-black/15 bg-black/[0.08]"
                                    : "border-white/10 bg-white/[0.035] text-[#C8FF00]",
                                ].join(" ")}
                              >
                                {link.code}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block text-xs font-black uppercase tracking-[0.18em]">
                                  {link.label}
                                </span>

                                <span
                                  className={[
                                    "mt-1 block text-[9px] uppercase tracking-[0.16em]",
                                    active ? "text-black/55" : "text-white/30",
                                  ].join(" ")}
                                >
                                  {link.subtitle}
                                </span>
                              </span>

                              <span
                                aria-hidden="true"
                                className={[
                                  "font-mono text-[9px] transition-transform duration-300 group-hover/item:translate-x-1",
                                  active ? "text-black/55" : "text-[#C8FF00]",
                                ].join(" ")}
                              >
                                {String(index + 1).padStart(2, "0")} ↗
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <Link
              href="/archive"
              className={[
                "group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full",
                "bg-[#C8FF00] px-6 text-[10px] font-black uppercase tracking-[0.18em] text-black",
                "shadow-[0_0_0_rgba(200,255,0,0)] transition duration-300",
                "hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_40px_rgba(200,255,0,0.18)]",
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
            onClick={() => setMobileMenuOpen((current) => !current)}
            className={[
              "relative z-50 flex h-12 w-12 items-center justify-center rounded-full border",
              "border-white/10 bg-white/[0.035] text-white transition duration-300",
              "hover:border-[#C8FF00]/45 hover:bg-white/[0.06] hover:text-[#C8FF00]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]",
              "focus-visible:ring-offset-4 focus-visible:ring-offset-[#07101D] xl:hidden",
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
                  mobileMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
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
                shouldReduceMotion
                  ? false
                  : { opacity: 0, height: 0 }
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
                  : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
              }
              className="overflow-hidden border-t border-white/[0.08] xl:hidden"
            >
              <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto px-4 pb-5 pt-5 sm:px-6">
                <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#C8FF00]">
                      Museum Navigation
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/28">
                      AGE202 · Digital Tennis Archive
                    </p>
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/18">
                    MENU
                  </span>
                </div>

                <nav
                  aria-label="Mobile primary navigation"
                  className="mt-5 grid gap-2 sm:grid-cols-2"
                >
                  {mainLinks.map((link, index) => (
                    <MobileNavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      index={index + 1}
                      active={isActive(link.href)}
                    />
                  ))}
                </nav>

                <div className="my-7 flex items-center gap-4">
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="text-[8px] font-black uppercase tracking-[0.28em] text-white/24">
                    Champion Archives
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <nav
                  aria-label="Mobile player navigation"
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {playerLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={[
                        "group flex items-center gap-4 rounded-[20px] border p-3.5",
                        "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
                        isActive(link.href)
                          ? "border-[#C8FF00] bg-[#C8FF00] text-black"
                          : "border-white/[0.08] bg-white/[0.025] text-white hover:border-white/15 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                          "font-mono text-[9px] font-bold tracking-[0.12em]",
                          isActive(link.href)
                            ? "border-black/15 bg-black/[0.08]"
                            : "border-white/10 bg-white/[0.03] text-[#C8FF00]",
                        ].join(" ")}
                      >
                        {link.code}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-black uppercase tracking-[0.17em]">
                          {link.label}
                        </span>

                        <span
                          className={[
                            "mt-1 block truncate text-[8px] uppercase tracking-[0.14em]",
                            isActive(link.href)
                              ? "text-black/55"
                              : "text-white/28",
                          ].join(" ")}
                        >
                          {link.subtitle}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="font-mono text-[8px] opacity-40"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  ))}
                </nav>

                <Link
                  href="/archive"
                  className={[
                    "group mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-full",
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
        "relative flex min-h-10 items-center rounded-full px-4",
        "text-[10px] font-black uppercase tracking-[0.18em]",
        "transition duration-300 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#C8FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101D]",
        active
          ? "bg-white text-black"
          : "text-white/68 hover:bg-white/[0.06] hover:text-white",
      ].join(" ")}
    >
      {label}

      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#C8FF00]"
        />
      )}
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
          ? "border-[#C8FF00] bg-[#C8FF00] text-black"
          : "border-white/[0.08] bg-white/[0.025] text-white hover:border-white/15 hover:bg-white/[0.05]",
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

        <span className="text-[11px] font-black uppercase tracking-[0.18em]">
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