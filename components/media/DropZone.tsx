"use client";

import { useCallback } from "react";
import {
  ImagePlus,
  UploadCloud,
} from "lucide-react";
import {
  type FileRejection,
  useDropzone,
} from "react-dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

type DropZoneProps = {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
};

function getRejectionMessage(
  rejection: FileRejection,
): string {
  const fileName = rejection.file.name;

  const messages = rejection.errors.map((error) => {
    switch (error.code) {
      case "file-invalid-type":
        return `${fileName}: formato non supportato.`;

      case "file-too-large":
        return `${fileName}: il file supera 10 MB.`;

      case "too-many-files":
        return `Puoi selezionare al massimo ${MAX_FILES} immagini.`;

      default:
        return `${fileName}: impossibile aggiungere il file.`;
    }
  });

  return messages.join(" ");
}

export default function DropZone({
  onFilesAccepted,
  disabled = false,
}: DropZoneProps) {
  const handleDropAccepted = useCallback(
    (files: File[]) => {
      onFilesAccepted(files);
    },
    [onFilesAccepted],
  );

  const handleDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      const message = rejections
        .map(getRejectionMessage)
        .join("\n");

      window.alert(message);
    },
    [],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,

    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },

    multiple: true,
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    disabled,
  });

  const dropZoneStateClass = isDragReject
    ? "border-red-400/60 bg-red-400/[0.06]"
    : isDragAccept
      ? "border-lime-300/60 bg-lime-300/[0.06]"
      : isDragActive
        ? "border-cyan-300/60 bg-cyan-300/[0.06]"
        : "border-white/10 bg-[#08111F] hover:border-lime-300/40 hover:bg-lime-300/[0.03]";

  return (
    <div
      {...getRootProps({
        className: [
          "group flex min-h-[280px] cursor-pointer flex-col",
          "items-center justify-center rounded-3xl border-2",
          "border-dashed p-8 text-center outline-none transition",
          "focus-visible:border-lime-300/60",
          "focus-visible:ring-4 focus-visible:ring-lime-300/10",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "",
          dropZoneStateClass,
        ].join(" "),
      })}
    >
      <input {...getInputProps()} />

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.04] text-white/40 transition group-hover:bg-lime-300/10 group-hover:text-lime-300">
        {isDragActive ? (
          <ImagePlus
            size={34}
            strokeWidth={1.6}
          />
        ) : (
          <UploadCloud
            size={34}
            strokeWidth={1.6}
          />
        )}
      </div>

      <h3 className="mt-7 text-xl font-semibold text-white">
        {isDragReject
          ? "Some files are not valid"
          : isDragActive
            ? "Drop the images here"
            : "Upload Artifact Images"}
      </h3>

      <p className="mt-3 max-w-lg text-sm leading-7 text-white/40">
        Drag and drop photographs here, or click to browse
        your computer.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          JPG
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          PNG
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          WEBP
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          Maximum 10 MB
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          Up to 10 images
        </span>
      </div>

      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition group-hover:border-lime-300/30">
        Browse Images
      </div>
    </div>
  );
}