import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export default function FormSection({
  title,
  description,
  icon,
  children,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-8 py-6">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
              {icon}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-2 text-sm text-white/45">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {children}
      </div>
    </section>
  );
}