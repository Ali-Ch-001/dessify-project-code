"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FooterSection from '@/components/FooterSection';

const plans = [
  {
    key: 'Personal',
    title: 'Personal',
    price: 'Free',
    features: ['Custom subdomain', 'Auto-sleep after 30 min inactivity', 'Basic analytics dashboard'],
    btnText: 'Get Started',
    href: '/signup',
    featured: false,
  },
  {
    key: 'PRO',
    title: 'PRO',
    price: '$15/mo',
    features: ['Guaranteed uptime', 'Unlimited team members', 'Advanced analytics & reporting', 'Priority email support'],
    btnText: 'Start Free Trial',
    href: '/start-trial',
    featured: true,
  },
  {
    key: 'Enterprise',
    title: 'Enterprise',
    price: null,
    features: ['Dedicated AI stylist integration', 'Custom branding & white labeling', 'Enterprise-grade security', 'White-glove onboarding & training'],
    btnText: 'Contact Sales',
    href: '/contact-sales',
    featured: false,
  },
];

const navLinks = ['Home', 'Pricing', 'Shop', 'Contact'];

export default function PricingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav
        className="bg-[#A9BAEF] shadow-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <motion.div className="text-2xl font-extrabold text-[#29224F]">Dressify</motion.div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className="text-lg font-medium text-[#29224F] hover:opacity-90"
              >
                {link}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/signup"
              className="hidden md:inline-block px-5 py-2 bg-gray-800 text-white rounded-md font-medium hover:opacity-90"
            >
              Login
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-[#A9BAEF] shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="block text-white text-lg hover:opacity-90"
                >
                  {link}
                </Link>
              ))}
              <Link
                href="/signup"
                className="block w-full text-center px-5 py-2 bg-white text-[#29224F] rounded-md hover:opacity-90"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  ? 'border-[#29224F] bg-white shadow-lg' : 'border-gray-200 bg-white'
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
                      ? 'bg-[#29224F] text-white hover:opacity-90'
                      : 'border border-[#29224F] text-[#29224F] hover:bg-white hover:opacity-90'
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
