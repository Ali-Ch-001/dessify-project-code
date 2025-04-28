'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export default function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-300 ${
        isActive
          ? 'bg-gray-75 text-[#29224F] font-semibold shadow-md border-l-4 border-indigo-500 pl-4'
          : 'text-[#29224F]/50 hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
