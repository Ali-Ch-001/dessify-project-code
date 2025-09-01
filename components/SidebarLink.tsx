"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label?: string;
  active?: boolean;
  collapsed?: boolean;
}

export default function SidebarLink({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
}: SidebarLinkProps) {
  return (
    <Link href={href}>
      <motion.div
        className={`
          flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200
          relative group border border-transparent
          ${collapsed ? 'justify-center' : ''}
          ${active
            ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-900 shadow-sm border-gray-200"
            : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50"
          } hover:-translate-y-0.5 hover:shadow-md
        `}
        whileHover={{}}
        whileTap={{}}
      >
        {/* Active indicator stripe */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-indigo-600 rounded-full" />
        )}

        {/* Content */}
        <motion.div
          className="relative z-10 flex items-center gap-3 w-full"
        >
          <div className="flex-shrink-0">
            {icon}
          </div>
          {label && !collapsed && (
            <span className="whitespace-nowrap font-medium flex-1">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}
