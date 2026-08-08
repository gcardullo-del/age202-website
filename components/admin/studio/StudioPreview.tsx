import type {
  ReactNode,
} from "react";

import {
  Eye,
} from "lucide-react";

type StudioPreviewProps = {
  title?: string;
  description?: string;
  status?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function StudioPreview({
  title = "Live Preview",
  description,
  status = "Live",
  children,
  footer,
}: StudioPreviewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Eye
                size={16}
                className="text-lime-300"
              />

              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-lime-300">
                Preview
              </p>
            </div>

            <h2 className="mt-3 text-xl font-bold text-white">
              {title}
            </h2>

            {description ? (
              <p className="mt-2 text-xs leading-5 text-white/35">
                {description}
              </p>
            ) : null}
          </div>

          <span className="shrink-0 rounded-full border border-lime-300/20 bg-lime-300/[0.07] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-lime-200">
            {status}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {children}
      </div>

      {footer ? (
        <div className="border-t border-white/10 p-5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}