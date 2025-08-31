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
          flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300
          relative overflow-hidden group
          ${collapsed ? 'justify-center' : ''}
          ${active
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
            : "hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 text-gray-700 hover:text-gray-900"
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background gradient for active state */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Hover background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.2 }}
        />
        
        {/* Content */}
        <motion.div
          className="relative z-10 flex items-center gap-3 w-full"
          animate={active ? { x: [0, 2, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={active ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            {icon}
          </motion.div>
          {label && !collapsed && (
            <motion.span 
              className="whitespace-nowrap font-medium flex-1"
              initial={active ? { opacity: 0, x: -10 } : {}}
              animate={active ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              {label}
            </motion.span>
          )}
          
          {/* Active indicator - positioned to the right */}
          {active && !collapsed && (
            <motion.div
              className="w-2 h-2 bg-white rounded-full flex-shrink-0 ml-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}
