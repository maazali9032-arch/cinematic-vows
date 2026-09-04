import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

export function QRCode({
  url,
  centerText,
  className,
  size = 240,
}: {
  url: string;
  centerText: string;
  className?: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    QRCodeLib.toDataURL(
      url,
      {
        errorCorrectionLevel: "H",
        width: size,
        margin: 2,
        color: {
          dark: "#d4af37",
          light: "#0b1412",
        },
      },
      (err, out) => {
        if (cancelled) return;
        if (!err && out) setDataUrl(out);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <div
        className="grid place-items-center rounded-lg border border-gold/30 bg-background p-2"
        style={{ width: size + 16, height: size + 16 }}
      >
        <div className="relative grid place-items-center" style={{ width: size, height: size }}>
          {dataUrl ? (
            <img src={dataUrl} alt={`QR code for ${url}`} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full border border-dashed border-gold/20" />
          )}
        </div>
      </div>
      {centerText && (
        <p className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-gold/75">
          {centerText}
        </p>
      )}
    </div>
  );
}
