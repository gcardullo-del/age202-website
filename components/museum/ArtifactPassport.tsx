import type { MuseumArtifactView } from "@/lib/museum/artifact-view";

type ArtifactPassportProps = {
  artifact: MuseumArtifactView;
};

const rarityLabels: Record<
  MuseumArtifactView["classification"]["rarity"],
  string
> = {
  common: "Common",
  rare: "Rare",
  "very-rare": "Very Rare",
  legendary: "Legendary",
};

export default function ArtifactPassport({
  artifact,
}: ArtifactPassportProps) {
  const { identity, classification, preservation } = artifact;

  return (
    <section
      aria-labelledby="artifact-passport-title"
      className="mx-auto max-w-7xl px-6 pb-20 md:px-8 lg:pb-28"
    >
      <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#08101F] shadow-[0_32px_100px_rgba(0,0,0,0.3)]">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative overflow-hidden border-b border-white/10 bg-[#0A1425] p-8 md:p-10 lg:border-b-0 lg:border-r">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-24 text-[220px] font-black leading-none tracking-[-0.12em] text-white/[0.025]"
            >
              A
            </div>

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#C8FF00]">
                Museum passport
              </p>

              <h2
                id="artifact-passport-title"
                className="mt-5 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl"
              >
                Official archive identity
              </h2>

              <p className="mt-5 max-w-md leading-7 text-white/48">
                A structured identity record for this piece inside the AGE202
                Digital Tennis Museum.
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                <PassportCode
                  label="Archive number"
                  value={identity.archiveNumber}
                />

                <div className="mt-6">
                  <PassportCode
                    label="Authenticity code"
                    value={identity.authenticityCode}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
              <PassportField label="Player" value={identity.player} />
              <PassportField
                label="Tournament"
                value={classification.tournament}
              />
              <PassportField
                label="Year"
                value={String(classification.year)}
              />
              <PassportField label="Brand" value={classification.brand} />
              <PassportField
                label="Category"
                value={classification.category}
              />
              <PassportField
                label="Collection"
                value={classification.collection}
              />
              <PassportField
                label="Rarity"
                value={rarityLabels[classification.rarity]}
              />
              <PassportField
                label="Condition"
                value={preservation.condition}
              />
              <PassportField
                label="Authentication"
                value={preservation.authentic ? "Verified" : "Pending"}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusPill active={preservation.authentic}>
                {preservation.authentic
                  ? "Authenticity verified"
                  : "Authentication pending"}
              </StatusPill>

              <StatusPill active={preservation.vintage}>
                {preservation.vintage ? "Vintage piece" : "Modern archive"}
              </StatusPill>

              <StatusPill active>
                {preservation.status.replace("-", " ")}
              </StatusPill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PassportCode({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/30">
        {label}
      </p>
      <p className="mt-2 break-all font-mono text-sm font-bold tracking-[0.14em] text-white">
        {value}
      </p>
    </div>
  );
}

function PassportField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-28 bg-[#0A1425] p-5">
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/28">
        {label}
      </p>
      <p className="mt-4 text-sm font-bold capitalize leading-6 text-white/82">
        {value}
      </p>
    </div>
  );
}

function StatusPill({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={[
        "rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em]",
        active
          ? "border-[#C8FF00]/25 bg-[#C8FF00]/10 text-[#C8FF00]"
          : "border-white/10 bg-white/[0.03] text-white/35",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
