"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import MuseumNavbar from "@/components/layout/MuseumNavbar";

type SiteChromeProps = Readonly<{
  children: ReactNode;
}>;

export default function SiteChrome({
  children,
}: SiteChromeProps) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return (
      <main
        id="main-content"
        className="min-h-screen"
      >
        {children}
      </main>
    );
  }

  return (
    <>
      <MuseumNavbar />

      {/*
       * MuseumNavbar è fixed e alta 86px.
       * Questo spacer riserva fisicamente lo spazio
       * della navbar per tutte le pagine pubbliche.
       */}
      <div
        aria-hidden="true"
        className="h-[86px] shrink-0"
      />

      <main
        id="main-content"
        className="min-h-screen"
      >
        {children}
      </main>

      <Footer />
    </>
  );
}