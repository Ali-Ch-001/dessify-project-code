"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const navLinks = ["Home", "Trial", "Shop", "Contact"];

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  content: string;
}

const articles: NewsArticle[] = [
  {
    id: 1,
    title: "Dressify Launches New Virtual Try-On Feature",
    date: "April 28, 2026",
    content:
      "Our cutting-edge AR-powered try-on feature harnesses advanced computer vision and ARKit/ARCore integration to overlay virtual garments onto your live camera feed. Simply point your phone at yourself, select any item from our catalog, and watch as it conforms to your body in real time. No dressing room needed; experience hyper-realistic fabric draping, material shaders, and dynamic lighting adjustments on the go. This initiative reduces return rates by over 30% and boosts user engagement through interactive style exploration.",
  },
  {
    id: 2,
    title: "AI StyleBot Now Supports Voice Commands",
    date: "April 15, 2026",
    content:
      "Chat hands-free with our StyleBot—now equipped with voice recognition powered by the latest NLP models. Ask for outfit suggestions, color matching tips, or even wardrobe organization advice without lifting a finger. Our integration with Whisper.js ensures high accuracy in noisy environments, while personalized context retention remembers your past preferences. Try saying ‘StyleBot, show me summer dresses for a beach trip’ and see AI-driven recommendations instantly.",
  },
  {
    id: 3,
    title: "Dressify Partners with EcoFabric Initiative",
    date: "March 30, 2026",
    content:
      "In our commitment to sustainability, Dressify has partnered with the EcoFabric Initiative to highlight eco-friendly materials in every recommendation. We now surface details about fabric origin, water usage, and carbon footprint for each garment. Our algorithm weighs these factors alongside style and fit, so you can make choices that look good and feel good. Early trials show a 20% uptick in eco-conscious selections among active users.",
  },
];

export default function NewsPage() {
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
    <div className="min-h-screen bg-white text-[#29224F] flex flex-col">
      {/* Navbar */}
      <div className="bg-[#A9BAEF]">
        <motion.nav
          className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <motion.a
            href="/"
            className="text-3xl font-bold hover:opacity-80"
            whileTap={{ scale: 0.95 }}
          >
            Dressify
          </motion.a>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-lg hover:underline"
                transition={{ delay: i * 0.05 }}
              >
                {link}
              </motion.a>
            ))}
          </div>
          <motion.button
            className="md:hidden ml-2 text-[#29224F]"
            onClick={() => setIsMobileMenuOpen(o => !o)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
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
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link}
                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="block text-lg hover:underline"
                    transition={{ delay: i * 0.05 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <motion.main
        className="container mx-auto px-6 lg:px-8 py-16 flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <section className="text-center mb-6">
          <h1 className="text-5xl font-extrabold mb-4">Latest News</h1>
          <p className="text-lg text-gray-700 mb-8">
            Stay updated with Dressify’s newest features and announcements.
          </p>
        </section>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(({ id, title, date, content }) => (
            <motion.article
              key={id}
              className="bg-[#FAFAFC] rounded-2xl shadow-lg p-6 flex flex-col"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <time className="text-sm text-gray-500 mb-2">{date}</time>
              <h2 className="text-xl font-semibold mb-2 flex-1">{title}</h2>
              <p className="text-gray-600 whitespace-pre-line">{content}</p>
            </motion.article>
          ))}
        </div>
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
