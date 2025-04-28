"use client";

import Link from "next/link";
import { ReactNode } from "react";

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label?: string;
  active?: boolean;
}

export default function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 py-2 px-3 rounded-md transition-colors
        ${active
          ? "bg-white/30 shadow-md text-white"
          : "hover:bg-white/20 text-white/90"}
      `}
    >
      {icon}
      {label && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
}
