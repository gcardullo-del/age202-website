"use client";

import { ReactNode } from "react";

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
    <div className="flex min-h-screen bg-[#050B18]">

      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <AdminHeader
          title={title}
          description={description}
        />

        <div className="flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-7xl px-8 py-8">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}