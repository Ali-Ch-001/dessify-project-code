"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/mobile/Header";
import TabBar from "@/components/mobile/TabBar";

export type AppShellProps = {
  title?: string;
  rightActions?: ReactNode;
  children: ReactNode;
};

/**
 * Mobile-first application shell with a fixed header and bottom tab bar.
 * Uses CSS safe-area insets and 100dvh-friendly layout.
 */
export default function AppShell({ title, rightActions, children }: AppShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const [compactHeader, setCompactHeader] = useState(false);

  // Restore per-route scroll position (session-scoped)
  useEffect(() => {
    const key = "tabScrollPositions";
    const map = (() => {
      try { return JSON.parse(sessionStorage.getItem(key) || "{}"); } catch { return {}; }
    })();
    const pos = map[pathname as string] ?? 0;
    if (mainRef.current) mainRef.current.scrollTop = pos;
    // save on scroll
    const onScroll = () => {
      const st = mainRef.current?.scrollTop ?? 0;
      setCompactHeader(st > 8);
      map[pathname as string] = st;
      try { sessionStorage.setItem(key, JSON.stringify(map)); } catch {}
    };
    const el = mainRef.current;
    el?.addEventListener("scroll", onScroll, { passive: true });
    // initial compact state
    setCompactHeader((el?.scrollTop ?? 0) > 8);
    return () => el?.removeEventListener("scroll", onScroll as EventListener);
  }, [pathname]);

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Header */}
      <Header title={title} rightActions={rightActions} compact={compactHeader} />

      {/* Scrollable content area */}
      <main
        ref={mainRef}
        aria-label="Main content"
        className="flex-1 overflow-y-auto px-4 pt-3 pb-24 safe-pt-header"
        data-pathname={pathname}
      >
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <TabBar />
    </div>
  );
}
