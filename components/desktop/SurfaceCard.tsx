"use client";

import React, { ReactNode } from "react";
import clsx from "clsx";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  hoverLift?: boolean;
};

export default function SurfaceCard({ children, className, hoverLift = true }: SurfaceCardProps) {
  return (
    <div
      className={clsx(
  "bg-white rounded-2xl border border-gray-200 shadow-sm",
  hoverLift && "transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
