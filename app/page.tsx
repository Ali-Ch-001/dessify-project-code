"use client";
// pages/index.tsx
import { NextPage } from 'next';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from "@/components/HeroSection";

const LandingPage: NextPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animation variants for the navbar
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Animation variants for the mobile nav menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-[#A9BAEF] min-h-screen text-[#29224F]">
      {/* NAVIGATION BAR */}
      <motion.nav
        className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="text-2xl font-bold">
          Dressify
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-[#29224F] transition-colors">Home</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Trial</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Contact</a>
        </div>
        <div className="flex items-center">
          {/* Desktop Login Button */}
          <button
            className="bg-[#29224F] text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors hidden md:block"
            type="button"
          >
            Login
          </button>
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden ml-2"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden container mx-auto px-4 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col space-y-2 py-2">
              <a href="#" className="block hover:text-[#29224F] transition-colors">Home</a>
              <a href="#" className="block hover:text-[#29224F] transition-colors">Trial</a>
              <a href="#" className="block hover:text-[#29224F] transition-colors">Shop</a>
              <a href="#" className="block hover:text-[#29224F] transition-colors">Contact</a>
              <a
                href="#"
                className="block bg-[#29224F] text-white px-5 py-2 rounded-md text-center hover:bg-gray-800 transition-colors"
              >
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Page Sections */}
      <HeroSection />
      {/* Add more sections here as needed */}
    </div>
  );
};

export default LandingPage;
