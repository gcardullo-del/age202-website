import type {
  ReactNode,
} from "react";

type StudioLayoutProps = {
  sidebar: ReactNode;
  content: ReactNode;
  preview?: ReactNode;
  footer?: ReactNode;

  sidebarWidth?: string;
  previewWidth?: string;

  className?: string;
};

export default function StudioLayout({
  sidebar,
  content,
  preview,
  footer,
  sidebarWidth = "280px",
  previewWidth = "360px",
  className = "",
}: StudioLayoutProps) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[28px] border border-white/10 bg-[#07101F]",
        className,
      ].join(" ")}
    >
      <div
        className="grid min-h-[680px]"
        style={{
          gridTemplateColumns: preview
            ? `${sidebarWidth} minmax(0, 1fr) ${previewWidth}`
            : `${sidebarWidth} minmax(0, 1fr)`,
        }}
      >
        <aside className="min-w-0 border-r border-white/10 bg-[#060D1A]">
          {sidebar}
        </aside>

        <section className="min-w-0 bg-[#08111F]/35">
          {content}
        </section>

        {preview ? (
          <aside className="min-w-0 border-l border-white/10 bg-[#060D1A]">
            {preview}
          </aside>
        ) : null}
      </div>

      {footer ? (
        <footer className="border-t border-white/10 bg-[#060D1A]">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}