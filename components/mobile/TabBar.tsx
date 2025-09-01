"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Upload, Image as ImageIcon, User, Bot } from "lucide-react";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/upload_wardrobe", label: "Upload", icon: Upload },
  { href: "/virtual_tryon", label: "Try-On", icon: ImageIcon },
  { href: "/style_bot", label: "Chat", icon: Bot },
  { href: "/userinfo", label: "Profile", icon: User },
];

export default function TabBar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  return (
    <nav
      role="navigation"
      aria-label="Primary"
  className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-[72px]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="relative flex flex-col items-center justify-center text-[12px] font-semibold touch-target"
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute -inset-3 rounded-full bg-gray-100"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    aria-hidden
                  />
                )}
                <Icon className={`w-7 h-7 relative z-10 ${active ? "text-indigo-600" : "text-gray-600"}`} />
              </div>
              <span className={`mt-1 relative z-10 ${active ? "text-indigo-700" : "text-gray-700"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
