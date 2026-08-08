import type { ReactNode } from "react";

type AdminSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AdminSection({
  title,
  description,
  children,
}: AdminSectionProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#07101F]/80 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">
            {description}
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}