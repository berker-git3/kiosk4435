import React from "react";

export default function OperatorLogo({ name, size = 48 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-red-600 text-white font-semibold"
    >
      <span style={{ fontSize: Math.max(12, size / 3) }}>{initials}</span>
    </div>
  );
}
