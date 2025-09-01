"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type DesktopToolbarProps = {
  title: string;
  rightSlot?: ReactNode; // avatar / menu
  showSearch?: boolean;
};

export default function DesktopToolbar({ title, rightSlot, showSearch = false }: DesktopToolbarProps) {
  const [compact, setCompact] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQ = useMemo(() => (searchParams?.get("q") ?? ""), [searchParams]);
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep local state in sync with URL if it changes externally
  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  // Debounce updating the URL query as the user types
  useEffect(() => {
    if (!showSearch) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (q && q.trim().length > 0) params.set("q", q.trim());
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showSearch, pathname, router]);

  return (
    <motion.header
      className="sticky top-0 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between px-5 py-3">
        <motion.h1
          className="font-semibold truncate bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          animate={{ fontSize: compact ? "1.25rem" : "2rem", letterSpacing: compact ? "0" : "-0.2px" }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h1>

        <div className="flex items-center gap-3 shrink-0">
          {/* Global search (only when requested) */}
      {showSearch && (
            <div className="hidden md:flex items-center gap-2 w-80 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                aria-label="Search"
        placeholder="Search closet..."
        className="w-full bg-transparent outline-none text-sm text-gray-700"
        value={q}
        onChange={(e) => setQ(e.target.value)}
              />
              <kbd className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">⌘K</kbd>
            </div>
          )}

          {rightSlot}
        </div>
      </div>
    </motion.header>
  );
}
