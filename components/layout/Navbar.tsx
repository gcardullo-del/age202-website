"use client";

import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "HOME" },
  { href: "/players/federer", label: "FEDERER" },
  { href: "/players/nadal", label: "NADAL" },
  { href: "/players/djokovic", label: "DJOKOVIC" },
  { href: "/players/sinner", label: "SINNER" },
  { href: "/players/alcaraz", label: "ALCARAZ" },
  { href: "/vault", label: "THE VAULT" },
  { href: "/brands", label: "BRANDS" },
  { href: "/about", label: "ABOUT" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B132B]/80 backdrop-blur-md border-b border-white/10">
      <div className="container flex items-center justify-between h-24">

        <Link href="/">
          <Image
            src="/logo/age202-logo.png"
            alt="AGE202"
            width={170}
            height={70}
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm tracking-wider font-semibold transition hover:text-[var(--lime)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="https://www.age202.com"
          className="btn-primary hidden lg:inline-flex"
        >
          VAI SU AGE202 →
        </Link>
      </div>
    </header>
  );
}