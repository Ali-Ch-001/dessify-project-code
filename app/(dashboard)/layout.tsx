'use client';

import { ReactNode } from 'react';
import { GraduationCap, Upload, Pencil, Shirt, ShoppingCart, Bot, LogOut, EyeOff } from 'lucide-react';
import SidebarLink from '@/components/SidebarLink';
import ProfileButton from '@/components/ProfileButton';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/home', label: 'Home', icon: <GraduationCap size={18} /> },
  { href: '/upload_wardrobe', label: 'Upload Wardrobe', icon: <Upload size={18} /> },
  { href: '/closet', label: 'Closet Manager', icon: <Pencil size={18} /> },
  { href: '/looks', label: 'Styled Looks', icon: <Shirt size={18} /> },
  { href: '/shop', label: 'Shop Your Style', icon: <ShoppingCart size={18} /> },
  { href: '/stylist', label: 'StyleBot', icon: <Bot size={18} /> },
  { href: '/logout', label: 'Logout', icon: <LogOut size={18} /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white p-6 gap-6">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gradient-to-b from-[#8898CD] to-[#925FE2] text-white p-8 rounded-xl flex flex-col">
        <div className="flex justify-center mb-6">
          <GraduationCap size={40} />
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map((item, i) => (
            <SidebarLink key={i} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>

        <div className="mt-auto pt-4 text-sm text-white/60 flex items-center gap-2">
          <EyeOff size={16} />
          Hidden Button
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto max-h-screen">
        {/* Top bar */}
        <div className="flex justify-end items-center mb-6">
          <ProfileButton />
        </div>

        {/* Dynamic children */}
        <main>{children}</main>
      </div>
    </div>
  );
}
