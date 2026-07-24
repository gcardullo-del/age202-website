"use client";

import type { ReactNode } from "react";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AdminShell({
  title,
  description,
  children,
}: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050B18]">
      <AdminSidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader
          title={title}
          description={description}
        />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-7xl px-5 py-8 pb-28 sm:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
