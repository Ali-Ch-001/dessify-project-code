"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export type HeaderProps = {
  title?: string;
  rightActions?: ReactNode;
  compact?: boolean;
};

export default function Header({ title, rightActions, compact = false }: HeaderProps) {
  return (
    <motion.header
      role="banner"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-white/40 safe-pt-header"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="h-16 flex items-center justify-between px-4">
        <motion.h1
          className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent truncate max-w-[60%]"
          animate={{
            fontSize: compact ? "1.125rem" : "2.0625rem", // 18px vs 33px
            letterSpacing: compact ? "0px" : "-0.5px",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {title ?? "Dressify"}
        </motion.h1>
        <div className="flex items-center gap-2 shrink-0">
          {rightActions}
        </div>
      </div>
    </motion.header>
  );
}
