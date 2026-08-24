"use client";

import { QRCodeSVG } from "qrcode.react";

type MuseumQrCodeProps = {
  value: string;
  title: string;
};

export default function MuseumQrCode({
  value,
  title,
}: MuseumQrCodeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-2xl shadow-black/35">
      <QRCodeSVG
        value={value}
        size={230}
        level="H"
        includeMargin={false}
        bgColor="#ffffff"
        fgColor="#050b18"
        title={title}
      />
    </div>
  );
}
