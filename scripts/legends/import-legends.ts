import "dotenv/config";

import {
  createLegend,
  getLegendBySlug,
  replaceLegendImages,
  replaceLegendMilestones,
} from "../../lib/repositories/legend.repository";

import {
  legendProfiles,
} from "./data";

async function importLegend(
  profile: (typeof legendProfiles)[number],
) {
  const existing =
    await getLegendBySlug(
      profile.slug,
    );

  if (existing) {
    console.log(
      `Skipped existing: ${existing.name} (${existing.slug})`,
    );

    console.log(
      "  Existing CMS data, media, gallery and timeline were preserved.",
    );

    return;
  }

  const {
    milestones = [],
    images = [],
    ...legendData
  } = profile;

  const legend =
    await createLegend(
      legendData,
    );

  if (milestones.length > 0) {
    await replaceLegendMilestones(
      legend.id,
      milestones,
    );
  }

  if (images.length > 0) {
    await replaceLegendImages(
      legend.id,
      images,
    );
  }

  console.log(
    `Created: ${legend.name} (${legend.slug})`,
  );

  console.log(
    `  milestones: ${milestones.length}`,
  );

  console.log(
    `  gallery images: ${images.length}`,
  );
}

async function main() {
  console.log(
    `Importing ${legendProfiles.length} AGE202 legend profile(s)...`,
  );

  for (const profile of legendProfiles) {
    await importLegend(
      profile,
    );
  }

  console.log(
    "Legend import completed.",
  );
}

main().catch((error) => {
  console.error(
    "Legend import failed:",
    error,
  );

  process.exitCode = 1;
});