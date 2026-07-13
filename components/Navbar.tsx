"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Heart, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/federer", label: "Collections" },
    { href: "/vault", label: "The Vault" },
    { href: "/brands", label: "Brands" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[#07192f]/95 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}

        <Link href="/">
          <Image
            src="/images/logo/logo.png"
            alt="AGE202"
            width={170}
            height={50}
            priority
          />
        </Link>

        {/* MENU DESKTOP */}

        <nav className="hidden lg:flex gap-10 text-sm uppercase tracking-[2px]">

          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white hover:text-lime-400 transition"
            >
              {link.label}
            </Link>
          ))}

        </nav>

        {/* RIGHT */}

        <div className="hidden lg:flex items-center gap-5">

          <button className="text-white hover:text-lime-400 transition">
            <Search size={20} />
          </button>

          <button className="text-white hover:text-lime-400 transition">
            <Heart size={20} />
          </button>

          <a
            href="https://www.vinted.it/member/168958431-age202"
            target="_blank"
            className="rounded-full bg-lime-400 px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Vai su Vinted
          </a>

        </div>

        {/* MOBILE */}

        <button
          className="text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="lg:hidden bg-[#07192f] border-t border-white/10">

          <nav className="flex flex-col px-6 py-6 gap-5">

            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white uppercase tracking-[2px]"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.age202.com"
              target="_blank"
              className="mt-4 rounded-full bg-lime-400 px-6 py-3 text-center font-semibold text-black"
            >
              Vai su Vinted
            </a>

          </nav>

        </div>
      )}
    </header>
  );
}