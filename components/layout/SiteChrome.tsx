"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import MuseumNavbar from "@/components/layout/MuseumNavbar";

type SiteChromeProps = Readonly<{
  children: ReactNode;
}>;

export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return (
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <MuseumNavbar />

      <main id="main-content" className="min-h-screen pt-24">
        {children}
      </main>

      <Footer />
    </>
  );
}