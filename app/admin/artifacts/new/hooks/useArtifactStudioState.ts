"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  ArtifactPreviewData,
} from "../components/ArtifactPreviewCard";

export type ArtifactStudioMode =
  | "create"
  | "edit";

type StoredArtifactDraft = {
  version: 1;
  savedAt: string;
  preview: ArtifactPreviewData;
};

type UseArtifactStudioStateOptions = {
  initialPreview: ArtifactPreviewData;
  mode?: ArtifactStudioMode;
  draftKey?: string;
};

export type ArtifactLocalDraftInfo = {
  savedAt: string;
};

export type ArtifactStudioState = {
  preview: ArtifactPreviewData;

  setPreview: Dispatch<
    SetStateAction<ArtifactPreviewData>
  >;

  updatePreview: (
    values: Partial<ArtifactPreviewData>,
  ) => void;

  mode: ArtifactStudioMode;

  isDirty: boolean;

  markClean: () => void;

  resetPreview: () => void;

  restoreLocalDraft: () => boolean;

  clearLocalDraft: () => void;

  getLocalDraftInfo: () =>
    ArtifactLocalDraftInfo | null;

  draftStorageKey: string;
};

const DEFAULT_DRAFT_PREFIX =
  "age202-artifact-studio-draft";

function readStoredDraft(
  storageKey: string,
): StoredArtifactDraft | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const rawValue =
      window.localStorage.getItem(
        storageKey,
      );

    if (!rawValue) {
      return null;
    }

    const parsedValue =
      JSON.parse(
        rawValue,
      ) as Partial<StoredArtifactDraft>;

    if (
      parsedValue.version !== 1 ||
      !parsedValue.preview ||
      typeof parsedValue.savedAt !==
        "string"
    ) {
      return null;
    }

    return {
      version: 1,
      savedAt:
        parsedValue.savedAt,
      preview:
        parsedValue.preview,
    };
  } catch {
    return null;
  }
}

export default function useArtifactStudioState({
  initialPreview,
  mode = "create",
  draftKey,
}: UseArtifactStudioStateOptions): ArtifactStudioState {
  const [
    initialPreviewSnapshot,
  ] = useState<ArtifactPreviewData>(
    () => initialPreview,
  );

  const [
    preview,
    setPreviewState,
  ] = useState<ArtifactPreviewData>(
    () => initialPreview,
  );

  const [
    isDirty,
    setIsDirty,
  ] = useState(false);

  const draftStorageKey =
    draftKey?.trim() ||
    `${DEFAULT_DRAFT_PREFIX}:${mode}`;

  const setPreview =
    useCallback<
      Dispatch<
        SetStateAction<ArtifactPreviewData>
      >
    >(
      (nextValue) => {
        setIsDirty(true);

        setPreviewState(
          nextValue,
        );
      },
      [],
    );

  const updatePreview =
    useCallback(
      (
        values:
          Partial<ArtifactPreviewData>,
      ) => {
        setIsDirty(true);

        setPreviewState(
          (current) => ({
            ...current,
            ...values,
          }),
        );
      },
      [],
    );

  const clearLocalDraft =
    useCallback(() => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      try {
        window.localStorage.removeItem(
          draftStorageKey,
        );
      } catch {
        // Draft persistence is optional.
      }
    }, [
      draftStorageKey,
    ]);

  const markClean =
    useCallback(() => {
      setIsDirty(false);
      clearLocalDraft();
    }, [
      clearLocalDraft,
    ]);

  const resetPreview =
    useCallback(() => {
      setPreviewState(
        initialPreviewSnapshot,
      );

      setIsDirty(false);
      clearLocalDraft();
    }, [
      clearLocalDraft,
      initialPreviewSnapshot,
    ]);

  const getLocalDraftInfo =
    useCallback(():
      ArtifactLocalDraftInfo | null => {
      const storedDraft =
        readStoredDraft(
          draftStorageKey,
        );

      if (!storedDraft) {
        return null;
      }

      return {
        savedAt:
          storedDraft.savedAt,
      };
    }, [
      draftStorageKey,
    ]);

  const restoreLocalDraft =
    useCallback(() => {
      const storedDraft =
        readStoredDraft(
          draftStorageKey,
        );

      if (!storedDraft) {
        return false;
      }

      setPreviewState(
        storedDraft.preview,
      );

      setIsDirty(true);

      return true;
    }, [
      draftStorageKey,
    ]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const storedDraft:
      StoredArtifactDraft = {
      version: 1,
      savedAt:
        new Date().toISOString(),
      preview,
    };

    try {
      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify(
          storedDraft,
        ),
      );
    } catch {
      // The editor continues to work if localStorage is unavailable.
    }
  }, [
    draftStorageKey,
    isDirty,
    preview,
  ]);

  return useMemo(
    () => ({
      preview,

      setPreview,

      updatePreview,

      mode,

      isDirty,

      markClean,

      resetPreview,

      restoreLocalDraft,

      clearLocalDraft,

      getLocalDraftInfo,

      draftStorageKey,
    }),
    [
      preview,
      setPreview,
      updatePreview,
      mode,
      isDirty,
      markClean,
      resetPreview,
      restoreLocalDraft,
      clearLocalDraft,
      getLocalDraftInfo,
      draftStorageKey,
    ],
  );
}