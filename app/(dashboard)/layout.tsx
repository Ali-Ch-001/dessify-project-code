// app/(dashboard)/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarLink from '@/components/SidebarLink';
import ProfileButton from '@/components/ProfileButton';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SpeedInsights } from "@vercel/speed-insights/next"

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/home',            label: 'Home',            icon: <GraduationCap size={24} /> },
  { href: '/upload_wardrobe', label: 'Upload Wardrobe', icon: <Upload        size={24} /> },
  { href: '/closet_manager',  label: 'Closet Manager',   icon: <Pencil        size={24} /> },
  { href: '/styled_looks',           label: 'Styled Looks',     icon: <Shirt         size={24} /> },
  { href: '/shop_your_style',            label: 'Shop Your Style',  icon: <ShoppingCart  size={24} /> },
  { href: '/style_bot',         label: 'StyleBot',         icon: <Bot           size={24} /> },
  { href: '/logout',          label: 'Logout',           icon: <LogOut        size={24} /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // 1) Auth guard — redirects if no session
  const authReady = useRequireAuth();
  // 2) Hooks must always run in the same order:
  const pathname = usePathname() || '/';
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 3) Media-query listener to auto-collapse on mobile
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // 4) Until auth check finishes, render nothing
  if (!authReady) return null;

  const effectiveCollapsed = isMobile ? true : collapsed;
  const EXPANDED_W  = 256;
  const COLLAPSED_W =  64;

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white p-6 gap-6">
      {/* ——— Sidebar ——— */}
      <motion.aside
        initial={false}
        animate={{ width: effectiveCollapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="
          bg-gradient-to-b from-purple-400 to-indigo-500
          text-white p-4 rounded-xl flex flex-col overflow-hidden h-full
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <GraduationCap size={60} />
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center w-full ${
                effectiveCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <SidebarLink
                href={item.href}
                icon={item.icon}
                label={effectiveCollapsed ? '' : item.label}
                active={pathname === item.href}
              />
            </div>
          ))}
        </nav>

        {/* Collapse/expand toggle (only on desktop) */}
        {!isMobile && (
          <div className="mt-auto flex justify-center">
            <button
              onClick={() => setCollapsed(v => !v)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              {effectiveCollapsed ? (
                <ChevronRight size={24} className="text-white" />
              ) : (
                <ChevronLeft  size={24} className="text-white" />
              )}
            </button>
          </div>
        )}
      </motion.aside>

      {/* ——— Main Content Area ——— */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto h-full">
        {/* top-right profile button */}
        <div className="flex justify-end items-center mb-6">
          <ProfileButton />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
