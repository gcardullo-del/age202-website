"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type {
  ArtifactStudioState,
} from "../hooks/useArtifactStudioState";

type ArtifactStudioContextValue =
  ArtifactStudioState;

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