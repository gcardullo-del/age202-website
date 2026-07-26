import type { MuseumArtifactView } from "@/lib/museum/artifact-view";

type ArtifactProvenanceProps = {
  artifact: MuseumArtifactView;
};

export default function ArtifactProvenance({
  artifact,
}: ArtifactProvenanceProps) {
  const steps = [
    {
      label: "Archive acquisition",
      detail: `Registered inside the AGE202 collection as ${artifact.identity.archiveNumber}.`,
    },
    {
      label: "Curatorial review",
      detail: `${artifact.identity.player}, ${artifact.classification.tournament} ${artifact.classification.year}.`,
    },
    {
      label: "Authentication record",
      detail: artifact.preservation.authentic
        ? `Verified under code ${artifact.identity.authenticityCode}.`
        : "Authentication review is still pending.",
    },
    {
      label: "Digital cataloguing",
      detail: "Photographed, classified and published in the AGE202 Digital Tennis Museum.",
    },
  ];

  return (
    <section className="border-y border-white/10 bg-[#07101F]">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
              Provenance
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
              From collection to digital exhibition.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Every AGE202 artifact follows a transparent museum path before
              becoming part of the public archive.
            </p>

            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.025] p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-500">
                Preservation status
              </p>
              <p className="mt-3 text-lg font-black text-white">
                {artifact.preservation.condition}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {artifact.preservation.vintage
                  ? "Historical-period garment preserved as a vintage archive object."
                  : "Modern-era garment preserved as a documented archive object."}
              </p>
            </div>
          </div>

          <ol className="relative border-l border-white/10 pl-8 md:pl-12">
            {steps.map((step, index) => (
              <li
                key={step.label}
                className="relative pb-10 last:pb-0 md:pb-12"
              >
                <span className="absolute -left-[2.43rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#C8FF00]/35 bg-[#07101F] text-[9px] font-black text-[#C8FF00] md:-left-[3.43rem]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
                  {step.label}
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
