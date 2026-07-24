import type { ReactNode } from "react";

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminPanel({
  children,
  className = "",
}: AdminPanelProps) {
  return (
    <section
      className={[
        "rounded-[28px] border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.18)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
