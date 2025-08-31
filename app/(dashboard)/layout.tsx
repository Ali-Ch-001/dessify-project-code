// app/(dashboard)/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRequireAuth } from '@/lib/useRequireAuth';
import {
  Upload,
  Pencil,
  Shirt,
  ShoppingCart,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarLink from '@/components/SidebarLink';
import ProfileButton from '@/components/ProfileButton';
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
  { href: '/virtual_tryon',   label: 'Virtual Try-On',  icon: <Image         size={24} /> },
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
    <div className="flex w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 gap-4">
      {/* ——— Sidebar ——— */}
      <motion.aside
        initial={false}
        animate={{ width: effectiveCollapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ type: 'tween', duration: 0.3, ease: "easeInOut" }}
        className="
          bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200
          border border-white/30 backdrop-blur-xl
          text-gray-800 p-4 rounded-2xl flex flex-col overflow-hidden h-full
          shadow-xl shadow-black/5
        "
      >
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl opacity-20"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              {effectiveCollapsed ? (
                <Shirt size={24} className="text-white" />
              ) : (
                <Shirt size={40} className="text-white" />
              )}
            </div>
            {!effectiveCollapsed && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Sparkles size={16} className="text-yellow-400" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 flex-1">
          <AnimatePresence>
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`flex items-center w-full ${
                  effectiveCollapsed ? 'justify-center' : 'justify-start'
                }`}
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
            className="mt-auto flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setCollapsed(v => !v)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                         rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <AnimatePresence mode="wait">
                {effectiveCollapsed ? (
                  <motion.div
                    key="right"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="left"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
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
        className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 
                   border border-white/20 overflow-hidden h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Header with profile button */}
        <motion.div 
          className="flex justify-between items-center p-3 sm:p-4 border-b border-white/20 bg-white/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" />
            <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <span className="hidden sm:inline">Dressify Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </motion.div>
          <ProfileButton />
        </motion.div>
        
        {/* Main content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
