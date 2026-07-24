"use client";

import { useCallback } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { type FileRejection, useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

type DropZoneProps = {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
  remainingSlots?: number;
};

function getRejectionMessage(rejection: FileRejection): string {
  const fileName = rejection.file.name;
  return rejection.errors
    .map((error) => {
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
    })
    .join(" ");
}

export default function DropZone({
  onFilesAccepted,
  disabled = false,
  remainingSlots = MAX_FILES,
}: DropZoneProps) {
  const handleDropAccepted = useCallback(
    (files: File[]) => onFilesAccepted(files),
    [onFilesAccepted],
  );

  const handleDropRejected = useCallback((rejections: FileRejection[]) => {
    window.alert(rejections.map(getRejectionMessage).join("\n"));
  }, []);

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
    maxFiles: Math.max(1, remainingSlots),
    maxSize: MAX_FILE_SIZE,
    disabled,
  });

  const stateClass = isDragReject
    ? "border-red-400/60 bg-red-400/[0.06]"
    : isDragAccept
      ? "border-lime-300/60 bg-lime-300/[0.06]"
      : isDragActive
        ? "border-cyan-300/60 bg-cyan-300/[0.06]"
        : "border-white/10 bg-[#08111F] hover:border-lime-300/40 hover:bg-lime-300/[0.03]";

  return (
    <div
      {...getRootProps()}
      className={`group cursor-pointer rounded-3xl border border-dashed p-8 text-center transition ${stateClass} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition group-hover:bg-lime-300/10 group-hover:text-lime-300">
        {isDragActive ? <UploadCloud size={26} /> : <ImagePlus size={26} />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">
        {isDragReject
          ? "Alcuni file non sono validi"
          : isDragActive
            ? "Rilascia qui le immagini"
            : "Carica le immagini del reperto"}
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/45">
        Trascina le fotografie oppure clicca per selezionarle dal computer.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/35">
        <span>JPG</span><span>•</span><span>PNG</span><span>•</span><span>WEBP</span><span>•</span><span>Max 10 MB</span><span>•</span><span>{remainingSlots} posti disponibili</span>
      </div>
      <span className="mt-5 inline-flex rounded-xl bg-lime-300 px-4 py-2 text-sm font-semibold text-[#08111F]">
        Sfoglia immagini
      </span>
    </div>
  );
}
