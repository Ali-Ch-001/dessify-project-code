"use client";

import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";
import TrendingSection from "@/components/TrendingSection";
import ExclusiveOfferPage from "@/components/exclusive-offer";
import FooterSection from "@/components/FooterSection";
import AnimatedBlob from "@/components/AnimatedBlob";
import FloatingElements from "@/components/FloatingElements";

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
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(243, 232, 255, 0)", "rgba(243, 232, 255, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Set loaded state after initial render to reduce initial lag
    const timer = setTimeout(() => setIsLoaded(true), 200);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Enhanced animation variants for the navbar
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      } 
    },
  };

  // Animation variants for the mobile nav menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    },
  };

  return (
    <div className="bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#FCE7F3] min-h-screen text-[#29224F] relative">
      {/* Animated Background Elements - Load progressively */}
      {isLoaded && (
        <>
          <AnimatedBlob />
          <FloatingElements />
        </>
      )}
      
      {/* Fixed Navigation Bar with Glassmorphism */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{ background: navbarBackground }}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        {/* Logo with gradient animation */}
        <MotionLink
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-[#29224F] via-purple-700 to-[#29224F] bg-clip-text text-transparent bg-[length:200%_auto]"
          whileHover={{ 
            scale: 1.05,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          Dressify
        </MotionLink>

        {/* Desktop Navigation Links with underline animation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map(({ label, href }, index) => (
            <motion.div
              key={label}
              className="relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MotionLink
                href={href}
                className="text-lg font-medium relative group"
                whileHover={{ scale: 1.05 }}
              >
                {label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"
                />
              </MotionLink>
            </motion.div>
          ))}
        </div>

        {/* Right Section: Desktop Login & Mobile Hamburger */}
        <div className="flex items-center">
          {/* Enhanced Desktop Login Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MotionLink
              href="/sign-in"
              className="relative inline-block bg-gradient-to-r from-[#29224F] to-purple-700 text-white px-6 py-2.5 rounded-full font-medium text-lg overflow-hidden group hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionLink>
          </motion.div>

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
        </div>
      </motion.nav>

      {/* Enhanced Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl z-40 mx-4 rounded-2xl overflow-hidden"
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

      {/* Landing Page Sections with scroll animations */}
      <motion.div 
        className="pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>

      {/* Trial Section with parallax */}
      <motion.div 
        id="info"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <InfoSection />
      </motion.div>

      {/* Shop Section with stagger */}
      <motion.div 
        id="shop"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <TrendingSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <ExclusiveOfferPage />
      </motion.div>
      
      <FooterSection />
    </div>
  );
};

export default LandingPage;
