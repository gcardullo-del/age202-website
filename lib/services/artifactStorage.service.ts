import "server-only";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "artifacts";

export async function uploadArtifactImage(
  artifactId: string,
  file: File,
) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() ?? "jpg";

  const fileName =
    `${artifactId}/${randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteArtifactImage(
  publicUrl: string,
) {
  const bucketIndex = publicUrl.indexOf(
    `/${BUCKET}/`,
  );

  if (bucketIndex === -1) {
    return;
  }

  const path = publicUrl.substring(
    bucketIndex + BUCKET.length + 2,
  );

  await supabaseAdmin.storage
    .from(BUCKET)
    .remove([path]);
}