"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";
import { DressifyCardsCarouselDemo } from "@/components/ui/FeaturesDemo";
import Founders from "@/components/Founders";

const MotionLink = motion(Link);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trial", href: "/#info" },
  { label: "Shop", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-white text-[#29224F]">
      {/* Navbar */}
      <div className="bg-[#A9BAEF]">
        <motion.nav
          className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <MotionLink
            href="/"
            className="text-3xl font-bold text-[#29224F] hover:opacity-80"
            whileTap={{ scale: 0.95 }}
          >
            Dressify
          </MotionLink>

          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ label, href }, i) => (
              <MotionLink
                key={label}
                href={href}
                className="text-lg text-[#29224F] hover:underline"
                transition={{ delay: i * 0.05 }}
              >
                {label}
              </MotionLink>
            ))}
          </div>

          <div className="flex items-center">
            <MotionLink
              href="/sign-in"
              className="hidden md:block bg-[#29224F] text-white px-5 py-2 rounded-md hover:bg-[#8898CD]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </MotionLink>
            <motion.button
              className="md:hidden ml-2 text-[#29224F]"
              onClick={() => setIsMobileMenuOpen(o => !o)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-[#8898CD] container mx-auto px-4 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              <div className="flex flex-col space-y-2 py-2">
                {navLinks.map(({ label, href }, i) => (
                  <MotionLink
                    key={label}
                    href={href}
                    className="block text-lg text-[#29224F] hover:underline"
                    transition={{ delay: i * 0.05 }}
                  >
                    {label}
                  </MotionLink>
                ))}
                <MotionLink
                  href="/sign-in"
                  className="block bg-[#29224F] text-white px-5 py-2 rounded-md text-center hover:bg-[#8898CD]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </MotionLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <motion.main
        className="container mx-auto px-6 lg:px-8 py-16 space-y-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <section className="rounded-3xl border-2 border-[#29224F] p-12 lg:p-20 shadow-2xl bg-[#FAFAFC]">
          <h1 className="text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-[#29224F]">
            About Dressify
          </h1>
          <p className="text-2xl text-[#29224F] leading-relaxed max-w-4xl">
            Dressify is your AI-powered style companion that transforms clothing
            indecision into effortless confidence. By fusing advanced computer
            vision, hybrid recommendation engines, and natural-language
            understanding, we turn your own wardrobe into a 24/7 personal stylist.
            Whether it is a boardroom debut, a spontaneous getaway, or just
            elevating your everyday look, our smart algorithms learn your unique
            tastes, respect your eco-goals, and deliver curated outfits that match
            your mood and the moment.
          </p>
        </section>

        {/* Features Carousel */}
        <DressifyCardsCarouselDemo />

        {/* Meet the Founders */}
        <Founders />
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
