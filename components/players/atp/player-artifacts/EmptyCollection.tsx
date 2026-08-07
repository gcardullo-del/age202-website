import {
  PackageSearch,
} from "lucide-react";

import type {
  EmptyCollectionProps,
} from "./types";

export default function EmptyCollection({
  playerName,
  accent,
}: EmptyCollectionProps) {
  return (
    <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-7 py-20 text-center">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-full border"
        style={{
          borderColor:
            `${accent}40`,
          backgroundColor:
            `${accent}0d`,
          color: accent,
        }}
      >
        <PackageSearch
          size={28}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-7 text-2xl font-black uppercase">
        Collection in preparation
      </h3>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
        No published artifacts are
        currently associated with{" "}
        {playerName}.
      </p>
    </div>
  );
}
