import { FileText } from "lucide-react";

import FormSection from "@/components/admin/FormSection";

export type StoryInitialValues = {
  description?: string | null;
  museumStory?: string | null;
  historicalContext?: string | null;
  curatorNote?: string | null;
};

type StoryCardProps = {
  initialValues?: StoryInitialValues;
};

const textareaClass =
  "min-h-[180px] w-full resize-y rounded-2xl border border-white/10 bg-[#0A1222] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/40";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

export default function StoryCard({
  initialValues,
}: StoryCardProps) {
  return (
    <FormSection
      title="Artifact Story"
      description="Document the museum narrative, historical context and curatorial notes."
      icon={<FileText size={20} />}
    >
      <div className="space-y-8">
        <div>
          <label
            htmlFor="description"
            className={labelClass}
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={8}
            className={textareaClass}
            placeholder="Describe the artifact, its design, colours, materials, collection and verified details."
            defaultValue={
              initialValues?.description ?? ""
            }
          />

          <p className="mt-3 text-sm leading-6 text-white/35">
            Main description shown on the public artifact page.
          </p>
        </div>

        <div>
          <label
            htmlFor="museumStory"
            className={labelClass}
          >
            Museum Story
          </label>

          <textarea
            id="museumStory"
            name="museumStory"
            rows={8}
            className={textareaClass}
            placeholder="Tell the story of this artifact and explain why it belongs in the AGE202 Museum."
            defaultValue={
              initialValues?.museumStory ?? ""
            }
          />

          <p className="mt-3 text-sm leading-6 text-white/35">
            Use this field for the narrative and emotional story of the piece.
          </p>
        </div>

        <div>
          <label
            htmlFor="historicalContext"
            className={labelClass}
          >
            Historical Context
          </label>

          <textarea
            id="historicalContext"
            name="historicalContext"
            rows={7}
            className={textareaClass}
            placeholder="Describe the season, tournament, player era or historical moment connected to the artifact."
            defaultValue={
              initialValues?.historicalContext ?? ""
            }
          />

          <p className="mt-3 text-sm leading-6 text-white/35">
            Include only verified dates, tournaments and historical details.
          </p>
        </div>

        <div>
          <label
            htmlFor="curatorNote"
            className={labelClass}
          >
            Curator Note
          </label>

          <textarea
            id="curatorNote"
            name="curatorNote"
            rows={6}
            className={textareaClass}
            placeholder="Add the AGE202 curator perspective, collecting relevance or a short editorial note."
            defaultValue={
              initialValues?.curatorNote ?? ""
            }
          />

          <p className="mt-3 text-sm leading-6 text-white/35">
            This note can express the curatorial point of view of AGE202.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <h3 className="text-sm font-semibold text-amber-300">
            Museum writing guidelines
          </h3>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/55">
            <li>
              • Explain why the garment is relevant to the player, season or
              collection.
            </li>

            <li>
              • Mention tournaments and historical events only when verified.
            </li>

            <li>
              • Describe design details, colours, materials and visual
              identity.
            </li>

            <li>
              • Do not describe the garment as match-worn or player-worn
              without documented provenance.
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}