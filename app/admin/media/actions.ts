"use server";

import { revalidatePath } from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createMedia,
  createMediaFolder,
  deleteMedia,
  getMediaById,
  updateMedia,
} from "@/lib/repositories/media.repository";

import {
  deleteArtifactImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

function optionalString(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
}

function requiredString(formData: FormData, name: string): string {
  const value = optionalString(formData, name);
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function stringList(value: string | null): string[] {
  if (!value) return [];
  return Array.from(
    new Set(value.split(",").map((entry) => entry.trim()).filter(Boolean)),
  );
}

function extensionFromFile(file: File): string {
  return file.name.split(".").pop()?.trim().toLowerCase() || "bin";
}

function titleFromFileName(fileName: string): string {
  return (
    fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled media"
  );
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadMediaAssets(formData: FormData): Promise<void> {
  await requireAdmin();

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, 20);

  if (files.length === 0) throw new Error("Select at least one image.");

  const folderId = optionalString(formData, "folderId");
  const tags = stringList(optionalString(formData, "tags"));
  const createdIds: string[] = [];
  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        throw new Error(`${file.name} is not a supported image.`);
      }

      const url = await uploadArtifactImage("media-library", file);
      uploadedUrls.push(url);

      const asset = await createMedia({
        title: titleFromFileName(file.name),
        alt: titleFromFileName(file.name),
        originalName: file.name,
        url,
        mimeType: file.type || "application/octet-stream",
        extension: extensionFromFile(file),
        size: file.size,
        width: null,
        height: null,
        tags,
        folderId,
        isUsed: false,
      });

      createdIds.push(asset.id);
    }
  } catch (error) {
    await Promise.allSettled(createdIds.map((id) => deleteMedia(id)));
    await Promise.allSettled(
      uploadedUrls.map((url) => deleteArtifactImage(url)),
    );
    throw error;
  }

  revalidatePath("/admin/media");
}

export async function updateMediaAssetAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = requiredString(formData, "id");

  await updateMedia(id, {
    title: requiredString(formData, "title"),
    alt: optionalString(formData, "alt"),
    folderId: optionalString(formData, "folderId"),
    tags: stringList(optionalString(formData, "tags")),
    isUsed: formData.get("isUsed") === "on",
  });

  revalidatePath("/admin/media");
}

export async function deleteMediaAssetAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = requiredString(formData, "id");
  const asset = await getMediaById(id);
  if (!asset) return;

  await deleteArtifactImage(asset.url);
  await deleteMedia(id);
  revalidatePath("/admin/media");
}

export async function createMediaFolderAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = requiredString(formData, "name");
  const slug = slugify(optionalString(formData, "slug") ?? name);

  if (!slug) throw new Error("Unable to create a valid folder slug.");

  await createMediaFolder({
    name,
    slug,
    description: optionalString(formData, "description"),
  });

  revalidatePath("/admin/media");
}