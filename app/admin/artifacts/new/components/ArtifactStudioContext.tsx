"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type {
  ArtifactPreviewData,
} from "./ArtifactPreviewCard";

type ArtifactStudioContextValue = {
  preview: ArtifactPreviewData;

  setPreview: Dispatch<
    SetStateAction<ArtifactPreviewData>
  >;

  updatePreview: (
    values: Partial<ArtifactPreviewData>,
  ) => void;
};

const ArtifactStudioContext =
  createContext<
    ArtifactStudioContextValue | undefined
  >(undefined);

type ArtifactStudioProviderProps = {
  value: ArtifactStudioContextValue;
  children: ReactNode;
};

export function ArtifactStudioProvider({
  value,
  children,
}: ArtifactStudioProviderProps) {
  return (
    <ArtifactStudioContext.Provider
      value={value}
    >
      {children}
    </ArtifactStudioContext.Provider>
  );
}

export function useArtifactStudio() {
  const context =
    useContext(
      ArtifactStudioContext,
    );

  if (!context) {
    throw new Error(
      "useArtifactStudio must be used inside ArtifactStudioProvider.",
    );
  }

  return context;
}