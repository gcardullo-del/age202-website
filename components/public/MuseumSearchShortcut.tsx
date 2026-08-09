"use client";

import {
  useEffect,
} from "react";

type MuseumSearchShortcutProps = {
  onOpen: () => void;
};

export default function MuseumSearchShortcut({
  onOpen,
}: MuseumSearchShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const isShortcut =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k";

      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      onOpen();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    onOpen,
  ]);

  return null;
}