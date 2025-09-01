"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Item = { label: string; href?: string; action?: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const items = useMemo<Item[]>(
    () => [
      { label: "Go: Home", href: "/home" },
      { label: "Go: Upload Wardrobe", href: "/upload_wardrobe" },
      { label: "Go: Virtual Try-On", href: "/virtual_tryon" },
      { label: "Go: Closet Manager", href: "/closet_manager" },
      { label: "Go: Styled Looks", href: "/styled_looks" },
      { label: "Go: Shop Your Style", href: "/shop_your_style" },
      { label: "Go: Profile", href: "/userinfo" },
      { label: "Action: Upload photo", action: () => router.push("/upload_wardrobe") },
      { label: "Action: New look", action: () => router.push("/styled_looks") },
      { label: "Action: Logout", href: "/logout" },
    ],
    [router]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 bg-black/30">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command..."
            className="w-full outline-none text-sm"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {filtered.map((i, idx) => (
            <li
              key={idx}
              className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setOpen(false);
                if (i.href) router.push(i.href);
                if (i.action) i.action();
              }}
            >
              {i.label}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-sm text-gray-500">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
}
