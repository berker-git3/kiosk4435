import React, { useState } from "react";

export default function OperatorLogo({
  name,
  size = 48,
}: {
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const svgUrl = `/assets/operators/${slug}.svg`;
  const pngUrl = `/assets/operators/${slug}.png`;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full overflow-hidden"
    >
      {!imgError ? (
        // try svg then png
        <img
          src={svgUrl}
          alt={name}
          onError={(e) => {
            if ((e.target as HTMLImageElement).src.endsWith(".svg")) {
              (e.target as HTMLImageElement).src = pngUrl;
            } else {
              setImgError(true);
            }
          }}
          style={{ width: size, height: size, objectFit: "cover" }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-red-600 text-white font-semibold"
          style={{ width: size, height: size }}
        >
          <span style={{ fontSize: Math.max(12, size / 3) }}>{initials}</span>
        </div>
      )}
    </div>
  );
}
