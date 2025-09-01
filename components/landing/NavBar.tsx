"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string };

export default function NavBar({ links }: { links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // close menu when route changes
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg bg-[#F3E8FF]/95" : "bg-[#F3E8FF]/0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-[#29224F] via-purple-700 to-[#29224F] bg-clip-text text-transparent"
        >
          Dressify
        </Link>

    <div className="hidden md:flex space-x-8">
          {links.map(({ label, href }) => (
            <Link key={label} href={href} className="text-lg font-medium relative group" scroll>
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <Link
            href="/sign-in"
            className="hidden md:inline-block bg-gradient-to-r from-[#29224F] to-purple-700 text-white px-6 py-2.5 rounded-full font-medium text-lg hover:shadow-lg transition-shadow"
          >
            Login
          </Link>
          <button
            className="md:hidden ml-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl z-40 mx-4 rounded-2xl overflow-hidden">
          <div className="flex flex-col space-y-2 py-2">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="block text-lg hover:text-[#29224F] transition-colors px-4"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="block bg-[#29224F] text-white px-5 py-2 rounded-md text-center hover:bg-gray-800 transition-colors text-lg mx-4"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
