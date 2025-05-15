"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const plans = [
  {
    key: "Personal",
    title: "Personal",
    price: "Free",
    features: [
      "Custom subdomain",
      "Auto-sleep after 30 min inactivity",
      "Basic analytics dashboard",
    ],
    btnText: "Get Started",
    href: "/signup",
    featured: false,
  },
  {
    key: "PRO",
    title: "PRO",
    price: "$15/mo",
    features: [
      "Guaranteed uptime",
      "Unlimited team members",
      "Advanced analytics & reporting",
      "Priority email support",
    ],
    btnText: "Start Free Trial",
    href: "/start-trial",
    featured: true,
  },
  {
    key: "Enterprise",
    title: "Enterprise",
    price: null,
    features: [
      "Dedicated AI stylist integration",
      "Custom branding & white labeling",
      "Enterprise-grade security",
      "White-glove onboarding & training",
    ],
    btnText: "Contact Sales",
    href: "/contact-sales",
    featured: false,
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trial", href: "/#info" },
  { label: "Shop", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const MotionLink = motion(Link);

export default function PricingPage() {
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
    <div className="flex flex-col min-h-screen bg-white text-[#29224F]">
      {/* ✅ Updated Navbar */}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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

      {/* Header */}
      <header className="bg-white py-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold text-[#29224F]">
            Our Pricing Plans
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Flexible plans to fit your style and budget.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <main className="flex-grow bg-[#F9FAFB] py-16 px-4">
        <div className="container mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`flex flex-col rounded-2xl border ${
                plan.featured
                  ? "border-[#29224F] bg-white shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="text-2xl font-semibold text-[#29224F] mb-2">
                  {plan.title}
                </h2>
                {plan.price && (
                  <p className="text-4xl font-bold text-[#29224F] mb-4">
                    {plan.price}
                  </p>
                )}
                <ul className="space-y-4 flex-grow">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center text-gray-700">
                      <span className="w-6 h-6 mr-2 bg-[#29224F] text-white rounded-full text-xs flex items-center justify-center">
                        ✔
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block text-center py-3 rounded-md font-semibold ${
                    plan.featured
                      ? "bg-[#29224F] text-white hover:opacity-90"
                      : "border border-[#29224F] text-[#29224F] hover:bg-white hover:opacity-90"
                  }`}
                >
                  {plan.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
