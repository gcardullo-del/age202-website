"use client";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

type AuthenticityCardProps = {
  authentic?: boolean;
  authenticityCode?: string | null;
  vintage?: boolean;
  tags?: string[] | null;
};

export default function AuthenticityCard({
  authentic = false,
  authenticityCode = "",
  vintage = false,
  tags = [],
}: AuthenticityCardProps) {
  const {
    updatePreview,
  } = useArtifactStudio();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
          Museum verification
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Authenticity
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Record the authenticity status, certificate code,
          vintage classification and internal archive tags.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-amber-300/40">
            <input
              type="checkbox"
              name="authentic"
              value="true"
              defaultChecked={authentic}
              onChange={(event) =>
                updatePreview({
                  authentic:
                    event.target.checked,
                })
              }
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 accent-amber-300"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Authentic piece
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-400">
                Mark this artifact as verified by the AGE202
                archive.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-amber-300/40">
            <input
              type="checkbox"
              name="vintage"
              value="true"
              defaultChecked={vintage}
              onChange={(event) =>
                updatePreview({
                  vintage:
                    event.target.checked,
                })
              }
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 accent-amber-300"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Vintage piece
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-400">
                Identify the artifact as part of a historical
                or discontinued collection.
              </span>
            </span>
          </label>
        </div>

        <div>
          <label
            htmlFor="authenticityCode"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Certificate code
          </label>

          <input
            id="authenticityCode"
            name="authenticityCode"
            type="text"
            defaultValue={authenticityCode ?? ""}
            placeholder="AGE202-RF-2017-000125"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Use a unique internal code. A public certificate page
            can be connected to this value later.
          </p>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Archive tags
          </label>

          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={tags?.join(", ") ?? ""}
            placeholder="match worn, player issue, limited edition"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Separate multiple tags with commas.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
                Internal verification
              </p>

              <p className="mt-1 text-sm text-slate-300">
                The verification badge will become active when the
                artifact is marked as authentic.
              </p>
            </div>

            <div className="shrink-0 rounded-full border border-amber-300/30 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200">
              AGE202 verified
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}