"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FooterSection from '@/components/FooterSection';

// Supported currencies
type Currency = 'USD' | 'EUR' | 'PKR';
// Supported plan keys
type PlanKey = 'Personal' | 'PRO' | 'Enterprise';

// Pricing configuration per currency and plan
const pricingConfig: Record<Currency, Record<PlanKey, { monthly: string; yearly: string }>> = {
  USD: {
    Personal: { monthly: 'Free', yearly: 'Free' },
    PRO: { monthly: '$15/mo', yearly: '$150/yr (save $30)' },
    Enterprise: { monthly: '', yearly: '' },
  },
  EUR: {
    Personal: { monthly: 'Free', yearly: 'Free' },
    PRO: { monthly: '€13/mo', yearly: '€130/yr (save €26)' },
    Enterprise: { monthly: '', yearly: '' },
  },
  PKR: {
    Personal: { monthly: 'Free', yearly: 'Free' },
    PRO: { monthly: '₨2500/mo', yearly: '₨25000/yr (save ₨5000)' },
    Enterprise: { monthly: '', yearly: '' },
  },
};

// Plan definitions
const plans: { key: PlanKey; title: string; features: string[]; btnText: string; href: string; featured: boolean }[] = [
  { key: 'Personal', title: 'Personal', features: ['Custom subdomain', 'Auto-sleep after 30 min inactivity', 'Basic analytics dashboard'], btnText: 'Get Started', href: '/signup', featured: false },
  { key: 'PRO', title: 'PRO', features: ['Guaranteed uptime', 'Unlimited team members', 'Advanced analytics & reporting', 'Priority email support'], btnText: 'Start Free Trial', href: '/start-trial', featured: true },
  { key: 'Enterprise', title: 'Enterprise', features: ['Dedicated AI stylist integration', 'Custom branding & white labeling', 'Enterprise-grade security', 'White-glove onboarding & training'], btnText: 'Contact Sales', href: '/contact-sales', featured: false },
];

const navLinks = ['Home', 'Pricing', 'Shop', 'Contact'];

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const selectedPrices = pricingConfig[currency];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav className="bg-white shadow-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}>
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <motion.div className="text-2xl font-extrabold text-[#29224F]">Dressify</motion.div>
          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link key={link} href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-lg font-medium text-[#29224F] hover:opacity-80">
                {link}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signup" className="hidden md:inline-block px-5 py-2 bg-[#29224F] text-white rounded-md hover:opacity-90">
              Login
            </Link>
            <button className="md:hidden ml-4" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
              <svg className="w-6 h-6 text-[#29224F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="md:hidden bg-white shadow-sm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link} href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="block text-[#29224F] text-lg hover:opacity-80">
                  {link}
                </Link>
              ))}
              <Link href="/signup" className="block w-full text-center px-5 py-2 bg-[#29224F] text-white rounded-md hover:opacity-90">
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white py-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold text-[#29224F]">Our Pricing Plans</h1>
          <p className="mt-4 text-lg text-gray-600">Flexible plans to fit your style and budget. Save when you pay yearly.</p>
          {/* Controls */}
          <div className="mt-8 flex justify-center items-center space-x-6">
            {/* Currency Dropdown */}
            <div className="relative inline-block text-left">
              <button onClick={() => setIsCurrencyOpen((prev) => !prev)} className="flex items-center bg-[#29224F] text-white border border-[#29224F] rounded-md px-4 py-2 text-sm hover:shadow-lg">
                {currency}
                <svg className="ml-2 h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 12a1 1 0 01-.7-.3l-3-3a1 1 0 111.4-1.4L10 9.6l2.3-2.3a1 1 0 111.4 1.4l-3 3A1 1 0 0110 12z" clipRule="evenodd" />
                </svg>
              </button>
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute mt-2 w-full bg-white border border-[#29224F] rounded-md shadow-lg z-10">
                    {Object.keys(pricingConfig).map((curr) => (
                      <button key={curr} onClick={() => { setCurrency(curr as Currency); setIsCurrencyOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#F0F4FF] text-[#29224F] text-sm">
                        {curr}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Billing Toggle */}
            <div className="flex items-center space-x-2 text-sm">
              <button onClick={() => setBillingPeriod('monthly')} className={`px-3 py-2 rounded ${billingPeriod === 'monthly' ? 'bg-[#29224F] text-white' : 'bg-gray-200 text-gray-600'}`}>Monthly</button>
              <button onClick={() => setBillingPeriod('yearly')} className={`px-3 py-2 rounded ${billingPeriod === 'yearly' ? 'bg-[#29224F] text-white' : 'bg-gray-200 text-gray-600'}`}>Yearly</button>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Cards */}
      <main className="flex-grow bg-[#F9FAFB] py-16 px-4">
        <div className="container mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => {
            const priceObj = selectedPrices[plan.key];
            const displayPrice = plan.key !== 'Enterprise' ? priceObj[billingPeriod] : '';
            return (
              <div key={plan.key} className={`flex flex-col rounded-2xl border ${plan.featured ? 'border-[#29224F] bg-white shadow-lg' : 'border-gray-200 bg-white'}`}>                  <div className="p-8 flex-grow flex flex-col">                    <h2 className="text-2xl font-semibold text-[#29224F] mb-2">{plan.title}</h2>                    {displayPrice && <p className="text-4xl font-bold text-[#29224F] mb-4">{displayPrice}</p>}                    <ul className="space-y-4 flex-grow">                      {plan.features.map((feat) => (<li key={feat} className="flex items-center text-gray-700"><span className="inline-block w-6 h-6 mr-2 bg-[#29224F] text-white rounded-full flex items-center justify-center text-xs">✔</span>{feat}</li>))}                    </ul>                    <Link href={plan.href} className={`mt-8 block text-center py-3 rounded-md font-semibold ${plan.featured ? 'bg-[#29224F] text-white hover:opacity-90' : 'border border-[#29224F] text-[#29224F] hover:bg-white hover:opacity-90'}`}>{plan.btnText}</Link>                  </div>                </div>            );          })}        </div>      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
