"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";

const MotionLink = motion(Link);

export default function SupportPage() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Trial", href: "/#info" },
    { label: "Shop", href: "/products" },
    { label: "Contact", href: "/contact" },
  ];

  const heroTitle = "Support & Resources";
  const heroSubtitle =
    "Everything you need to maximize your experience with Dressify—from step-by-step guides to enterprise solutions.";

  const guides = [
    {
      title: "Getting Started: Your First 5 Minutes",
      items: [
        "Create and verify your account via email or social login.",
        "Complete your profile: upload photos and set body measurements.",
        "Customize your style: choose preferred categories and filters.",
        "Explore the Virtual Try-On and StyleBot features from the main menu.",
      ],
    },
    {
      title: "Advanced Features & Pro Tips",
      items: [
        "Multi-Angle Try-On for 360° garment views.",
        "Voice-Powered StyleBot with pin favorites.",
        "Smart Wardrobe Sync for auto-categorization.",
        "AI Packing Lists and Trend Alerts.",
      ],
    },
    {
      title: "Developer & API Documentation",
      items: [
        "Authentication: OAuth 2.0 and API Key flows.",
        "Endpoints: Products, Recommendations, User Profile, Analytics.",
        "SDKs: JavaScript, Python, Ruby, and Postman collection.",
        "Usage limits: 1,000 requests per minute, adjustable.",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I set up my account and preferences?",
      answer:
        "After signing up, go to Preferences to set style categories, color palettes, budgets, and sustainability filters. Save to apply immediately.",
    },
    {
      question: "What are the system requirements for Virtual Try-On?",
      answer:
        "Requires ARKit (iOS 13+) or ARCore (Android 8+), camera permissions, stable internet, and battery >50%.",
    },
    {
      question: "How can I integrate Dressify API?",
      answer:
        "Use our REST and GraphQL endpoints. Visit /docs/api for auth, code samples, rate limits, and SDKs.",
    },
    {
      question: "Where can I find user guides?",
      answer:
        "See our Guides section above for detailed walkthroughs and enterprise case studies.",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#29224F]">
      {/* Navbar */}
      <div className="bg-[#A9BAEF]">
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

          {/* Centered Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {navLinks.map(({ label, href }, idx) => (
              <MotionLink
                key={label}
                href={href}
                className="text-lg hover:underline"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: idx * 0.05 }}
              >
                {label}
              </MotionLink>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center">
            <MotionLink
              href="/sign-in"
              className="bg-[#29224F] text-white px-5 py-2 rounded-md hover:bg-[#8898CD] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </MotionLink>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden text-[#29224F]"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
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
              {navLinks.map(({ label, href }, idx) => (
                <MotionLink
                  key={label}
                  href={href}
                  className="block py-2 text-lg hover:underline"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {label}
                </MotionLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section className="bg-[#FAFAFC] py-16 md:py-24">
        <div className="container mx-auto text-center px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4">
            {heroTitle}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Guides & FAQs */}
      <motion.main className="container mx-auto px-4 md:px-0 py-12 flex-1 space-y-16">
        {/* Guides */}
        <section className="space-y-12">
          {guides.map(({ title, items }, idx) => (
            <article
              key={idx}
              className="bg-white rounded-2xl shadow p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                {title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* FAQs Accordion */}
        <section className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center text-lg md:text-xl"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <span className="text-2xl">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-6 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
