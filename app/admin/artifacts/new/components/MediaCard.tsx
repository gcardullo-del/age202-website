import { ImagePlus } from "lucide-react";

import FormSection from "@/components/admin/FormSection";
import MediaUploader, {
  type ExistingMediaImage,
} from "@/components/media/MediaUploader";

type MediaCardProps = {
  existingImages?: ExistingMediaImage[];
};

export default function MediaCard({
  existingImages = [],
}: MediaCardProps) {
  return (
    <FormSection
      title="Media"
      description="Upload and manage the images for this museum artifact."
      icon={<ImagePlus size={20} />}
    >
      <div className="space-y-6">
        <MediaUploader
          existingImages={existingImages}
        />

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <h3 className="text-sm font-semibold text-cyan-300">
            Image Guidelines
          </h3>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/60">
            <li>
              • Upload high-quality photographs whenever possible.
            </li>

            <li>
              • Supported formats: JPG, PNG and WEBP.
            </li>

            <li>
              • Maximum file size: 10 MB per image.
            </li>

            <li>
              • The cover image will represent the artifact in the museum.
            </li>

            <li>
              • You can upload multiple images for each artifact.
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}