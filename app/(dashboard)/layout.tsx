// app/(dashboard)/layout.tsx
"use client";

import { ReactNode, useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
import Image from 'next/image';
import {
  Upload,
  Pencil,
  Shirt,
  ShoppingCart,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image as ImageIconLucide,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLink from '@/components/SidebarLink';
import ProfileButton from '@/components/ProfileButton';
import AppShell from '@/components/mobile/AppShell';
import MobileUserMenu from '@/components/mobile/MobileUserMenu';
import { ToastProvider } from '@/components/ui/Toast';
import DesktopToolbar from '@/components/desktop/DesktopToolbar';
import CommandPalette from '@/components/desktop/CommandPalette';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SpeedInsights } from "@vercel/speed-insights/next"

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/home',            label: 'Home',            icon: <Shirt size={24} /> },
  { href: '/upload_wardrobe', label: 'Upload Wardrobe', icon: <Upload        size={24} /> },
  { href: '/closet_manager',  label: 'Closet Manager',   icon: <Pencil        size={24} /> },
  { href: '/styled_looks',           label: 'Styled Looks',     icon: <Shirt         size={24} /> },
  { href: '/shop_your_style',            label: 'Shop Your Style',  icon: <ShoppingCart  size={24} /> },
  { href: '/virtual_tryon',   label: 'Virtual Try-On',  icon: <ImageIconLucide         size={24} /> },
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

  // Resolve current title from nav items (fallback to Dashboard)
  const currentTitle = useMemo(() => {
    const found = navItems.find((n) => n.href === pathname);
    return found?.label ?? 'Dashboard';
  }, [pathname]);

  // 4) Until auth check finishes, render nothing
  if (!authReady) return null;

  const effectiveCollapsed = isMobile ? true : collapsed;
  const EXPANDED_W  = 256;
  const COLLAPSED_W =  64;

  // Mobile-first shell with bottom tabs
  if (isMobile) {
    return (
      <ToastProvider>
        <AppShell title={currentTitle} rightActions={<div className="flex items-center gap-2"><ProfileButton /><MobileUserMenu /></div>}> 
          {/* Content card container for mobile */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-white/20">
            <div className="p-4">
              {children}
            </div>
          </div>
        </AppShell>
      </ToastProvider>
    );
  }

  // Desktop layout with sidebar
  return (
    <ToastProvider>
  <div className="flex w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 gap-4">
      {/* ——— Sidebar ——— */}
      <motion.aside
        initial={false}
        animate={{ width: effectiveCollapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl flex flex-col overflow-hidden h-full shadow-sm"
      >
        {/* Logo */}
        <motion.div 
          className="flex justify-center items-center mb-4 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {effectiveCollapsed ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <Image
                  src="/landing_img/Logo_Initial.png"
                  alt="Logo D"
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <Image
                  src="/landing_img/Logo_Initial.png"
                  alt="Logo D"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 flex-1 w-full">
          <AnimatePresence>
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.16, delay: 0.04 + i * 0.02 }}
                className="w-full"
              >
                <SidebarLink
                  href={item.href}
                  icon={item.icon}
                  label={effectiveCollapsed ? '' : item.label}
                  active={pathname === item.href}
                  collapsed={effectiveCollapsed}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>

        {/* Collapse/expand toggle (only on desktop) */}
        {!isMobile && (
          <motion.div 
            className="mt-auto flex justify-center items-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <motion.button
              onClick={() => setCollapsed(v => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                         rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <AnimatePresence mode="wait">
                {effectiveCollapsed ? (
                  <motion.div
                    key="right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    <ChevronRight size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </motion.aside>

      {/* ——— Main Content Area ——— */}
      <motion.div 
        className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
  {/* Desktop Toolbar (no search in top bar) */}
  <DesktopToolbar title={currentTitle} rightSlot={<ProfileButton />} />

        {/* Command Palette */}
        <CommandPalette />
        
        {/* Main content */}
  <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
    </ToastProvider>
  );
}