// components/DownloadIcon.tsx
import React from "react";

export default function DownloadIcon({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={`w-12 h-12 text-gray-400 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
