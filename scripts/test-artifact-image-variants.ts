import "dotenv/config";

import {
  processArtifactPendingImage,
} from "@/lib/services/artifactImageProcessing.service";

function getRequiredArgument(
  index: number,
  label: string,
): string {
  const value =
    process.argv[index]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${label}.`,
    );
  }

  return value;
}

async function main() {
  const sourcePath =
    getRequiredArgument(
      2,
      "Supabase pending source path",
    );

  const artifactId =
    (
      process.argv[3] ??
      "image-pipeline-test"
    ).trim();

  if (
    !sourcePath.startsWith(
      "pending/",
    )
  ) {
    throw new Error(
      'The source path must start with "pending/".',
    );
  }

  console.log(
    "\nAGE202 artifact image pipeline test",
  );
  console.log(
    "-----------------------------------",
  );
  console.log(
    `Source: ${sourcePath}`,
  );
  console.log(
    `Artifact namespace: ${artifactId}`,
  );
  console.log(
    "\nNo database records will be modified.",
  );
  console.log(
    "The pending source image will not be deleted.\n",
  );

  const result =
    await processArtifactPendingImage({
      artifactId,
      sourcePath,
    });

  console.log(
    "Variants created successfully:\n",
  );

  for (
    const variant of
    result.variants
  ) {
    console.log(
      `${variant.name}:`,
    );
    console.log(
      `  path: ${variant.path}`,
    );
    console.log(
      `  url:  ${variant.publicUrl}\n`,
    );
  }

  console.log(
    "TEST COMPLETED SUCCESSFULLY",
  );
}

main().catch(
  (error: unknown) => {
    console.error(
      "\nTEST FAILED",
    );

    if (
      error instanceof Error
    ) {
      console.error(
        error.message,
      );
    } else {
      console.error(
        error,
      );
    }

    process.exitCode = 1;
  },
);
