"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Upload,
  Pencil,
  Shirt,
  ShoppingCart,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import SidebarLink from "@/components/SidebarLink";
import ProfileButton from "@/components/ProfileButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/home",            label: "Home",            icon: <GraduationCap size={24} /> },
  { href: "/upload_wardrobe", label: "Upload Wardrobe", icon: <Upload        size={24} /> },
  { href: "/closet",          label: "Closet Manager",   icon: <Pencil        size={24} /> },
  { href: "/looks",           label: "Styled Looks",     icon: <Shirt         size={24} /> },
  { href: "/shop",            label: "Shop Your Style",  icon: <ShoppingCart  size={24} /> },
  { href: "/stylist",         label: "StyleBot",         icon: <Bot           size={24} /> },
  { href: "/logout",          label: "Logout",           icon: <LogOut        size={24} /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname() || "/";
  const [collapsed, setCollapsed] = useState(false);

  const EXPANDED_W = 256;
  const COLLAPSED_W = 64;

  return (
    <div className="flex w-full bg-white p-6 gap-6">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ type: "tween", duration: 0.2 }}
        className="bg-gradient-to-b from-[#8898CD] to-[#925FE2]
                   text-white p-4 rounded-xl flex flex-col overflow-hidden self-start"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <GraduationCap size={60} />
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center w-full
                          ${collapsed ? "justify-center" : "justify-start"}`}
            >
              <SidebarLink
                href={item.href}
                icon={item.icon}
                label={collapsed ? "" : item.label}
                active={pathname === item.href}
              />
            </div>
          ))}
        </nav>

        {/* Collapse / Expand */}
        <div className="mt-40 flex justify-center">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={24} className="text-white" />
            ) : (
              <ChevronLeft size={24} className="text-white" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto max-h-screen">
        {/* Top bar */}
        <div className="flex justify-end items-center mb-6">
          <ProfileButton />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
