"use client";

import { NextPage } from "next";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";
import TrendingSection from "@/components/TrendingSection";
import ExclusiveOfferPage from "@/components/exclusive-offer";
import FooterSection from "@/components/FooterSection";

// Wrap Next.js Link with Framer Motion
const MotionLink = motion(Link);
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trial", href: "#info" },
  { label: "Shop", href: "#shop" },
  { label: "Contact", href: "/contact" },
];

const LandingPage: NextPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animation variants for the navbar (subtle slide from top)
  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Animation variants for the mobile nav menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-[#A9BAEF] min-h-screen text-[#29224F]">
      {/* Navigation Bar */}
      <motion.nav
        className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        {/* Logo */}
        <MotionLink
          href="/"
          className="text-3xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Dressify
        </MotionLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map(({ label, href }, index) => (
            <MotionLink
              key={label}
              href={href}
              className="text-lg hover:text-[#29224F] transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.05 }}
            >
              {label}
            </MotionLink>
          ))}
        </div>

        {/* Right Section: Desktop Login & Mobile Hamburger */}
        <div className="flex items-center">
          {/* Desktop Login Link */}
          <MotionLink
            href="/sign-in"
            className="bg-[#29224F] text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors hidden md:block text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </MotionLink>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden ml-2"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
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
              {navLinks.map(({ label, href }, idx) => (
                <MotionLink
                  key={label}
                  href={href}
                  className="block text-lg hover:text-[#29224F] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu after click
                >
                  {label}
                </MotionLink>
              ))}
              <MotionLink
                href="/sign-in"
                className="block bg-[#29224F] text-white px-5 py-2 rounded-md text-center hover:bg-gray-800 transition-colors text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </MotionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Page Sections */}
      <HeroSection />

      {/* Trial Section Anchor */}
      <div id="info">
        <InfoSection />
      </div>

      {/* Shop Scroll Target */}
      <div id="shop">
        <TrendingSection />
      </div>

      <ExclusiveOfferPage />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
