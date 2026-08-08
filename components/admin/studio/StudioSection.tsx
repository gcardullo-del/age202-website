import type {
  ReactNode,
} from "react";

type StudioSectionProps = {
  title: string;

  description?: string;

  children: ReactNode;

  actions?: ReactNode;

  className?: string;
};

export default function StudioSection({
  title,
  description,
  children,
  actions,
  className = "",
}: StudioSectionProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[24px] border border-white/10 bg-[#07101F]",
        className,
      ].join(" ")}
    >
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-white">
            {title}
          </h2>

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="shrink-0">
            {actions}
          </div>
        ) : null}
      </header>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}