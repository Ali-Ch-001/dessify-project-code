"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";

const MotionLink = motion(Link);
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trial", href: "/#info" },
  { label: "Shop", href: "/products" },
  { label: "Contact", href: "/contact" }
];

export default function TermsAndConditionsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
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
          <MotionLink href="/" className="text-3xl font-bold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Dressify
          </MotionLink>
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {navLinks.map(({ label, href }, idx) => (
              <MotionLink
                key={idx}
                href={href}
                className="text-lg hover:underline"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: idx * 0.05 }}
              >
                {label}
              </MotionLink>
            ))}
          </div>
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
          <motion.button
            className="md:hidden text-[#29224F]"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
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
              {navLinks.map(({ label, href }, idx) => (
                <MotionLink
                  key={idx}
                  href={href}
                  className="block py-2 text-lg hover:underline"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {label}
                </MotionLink>
              ))}
              <MotionLink
                href="/sign-in"
                className="block bg-[#29224F] text-white px-4 py-2 mt-2 rounded-md text-center hover:bg-[#8898CD]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </MotionLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section className="bg-[#FAFAFC] py-16 md:py-24">
        <div className="container mx-auto text-center px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            Effective Date: May 1, 2025
          </p>
        </div>
      </section>

      <motion.main className="container mx-auto px-4 md:px-0 py-12 flex-1 space-y-16">
        {/* 1. Acceptance of Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using Dressify’s website, mobile applications, or services (&quot;Services&quot;), you agree to these Terms &amp; Conditions (&quot;Terms&quot;). If you do not agree, you may not use the Services. Dressify, Inc. reserves the right to modify these Terms at any time; continued use constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* 2. Definitions */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Definitions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>&quot;User&quot;</strong> refers to any individual or entity that uses the Services.</li>
            <li><strong>&quot;Content&quot;</strong> means all text, images, videos, audio, and other materials provided on or through the Services.</li>
            <li><strong>&quot;User Content&quot;</strong> refers to any Content you submit or upload.</li>
            <li><strong>&quot;Virtual Try-On&quot;</strong> refers to the augmented reality feature that overlays clothing images onto a live camera feed.</li>
          </ul>
        </section>

        {/* 3. Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Eligibility</h2>
          <p className="text-gray-700 leading-relaxed">
            You must be at least 16 years old (or older if required by local law) to use the Services. By registering, you represent and warrant that you meet the eligibility requirements. Minors may use the Services if supervised by a parent or legal guardian who accepts these Terms on their behalf.
          </p>
        </section>

        {/* 4. Account Registration & Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Account Registration & Security</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            To access certain features, you must register an account. You agree to provide accurate information, maintain the security of your password, and accept responsibility for all activities under your account.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you suspect unauthorized use, you must notify us immediately at support@dressify.com.
          </p>
        </section>

        {/* 5. User Content & License */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. User Content & License</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            You retain ownership of your User Content. By uploading, you grant Dressify a worldwide, royalty-free, sublicensable license to use, reproduce, and display your content as necessary to provide and improve the Services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You warrant that you own all rights to your content and that its use does not violate any law or third-party rights.
          </p>
        </section>

        {/* 6. Virtual Try-On Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Virtual Try-On Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            Virtual Try-On is provided for your personal, non-commercial use. The accuracy of garment fit and color is an approximation; actual products may vary due to lighting, screen settings, and manufacturing tolerances. Dressify disclaims liability for discrepancies between virtual and actual appearance.
          </p>
        </section>

        {/* 7. Subscriptions & Fees */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Subscriptions & Fees</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            Certain features require a paid subscription (&quot;Premium Services&quot;). Fees, billing cycles, and cancellation policies are described on our Pricing page. All fees are non-refundable except as required by law.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We may change fees upon 30 days’ notice. Continued use after fee changes constitutes acceptance.
          </p>
        </section>

        {/* 8. Payment Processing */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Payment Processing</h2>
          <p className="text-gray-700 leading-relaxed">
            Payments are processed through third-party providers (e.g., Stripe, PayPal). You agree to their terms and fees. Dressify does not store full payment card data; tokens are stored securely by our payment partners.
          </p>
        </section>

        {/* 9. Intellectual Property Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Intellectual Property Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            Dressify and its licensors retain all rights, title, and interest in the Services, including trademarks, copyrights, and patents. The Services are licensed, not sold.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may not copy, modify, distribute, or reverse-engineer the Services, except to the extent permitted by law or with prior written permission.
          </p>
        </section>

        {/* 10. Prohibited Conduct */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">10. Prohibited Conduct</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Using the Services for unlawful purposes or in violation of these Terms.</li>
            <li>Uploading malicious code or unsolicited advertising (spam).</li>
            <li>Impersonating others or engaging in harassment.</li>
            <li>Attempting to circumvent security or reverse engineer the Services.</li>
          </ul>
        </section>

        {/* 11. Privacy & Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">11. Privacy & Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            Your use of data is governed by our Privacy Policy, incorporated by reference. You consent to our collection and use of data as described therein.
          </p>
        </section>

        {/* 12. Disclaimers & Warranties */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">12. Disclaimers & Warranties</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. DRESSIFY DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We do not warrant uninterrupted access, error-free operation, or that defects will be corrected.
          </p>
        </section>

        {/* 13. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">13. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, DRESSIFY’S LIABILITY FOR ANY CLAIM IS LIMITED TO THE AMOUNT YOU PAID FOR THE SERVICE IN THE LAST 12 MONTHS. IN NO EVENT SHALL DRESSIFY BE LIABLE FOR INDIRECT, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
          </p>
        </section>

        {/* 14. Indemnification */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">14. Indemnification</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to defend, indemnify, and hold harmless Dressify and its affiliates from all claims, liabilities, damages, and expenses arising from your breach of these Terms or your use of the Services.
          </p>
        </section>

        {/* 15. Termination */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">15. Termination</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We may suspend or terminate your access for violation of these Terms or for any reason with notice. Upon termination, your right to use the Services ceases, but some provisions will survive (e.g., limitations of liability).
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may also terminate your account at any time by contacting support@dressify.com. Certain data may be retained as required by law.
          </p>
        </section>

        {/* 16. Governing Law & Jurisdiction */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">16. Governing Law & Jurisdiction</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by the laws of the State of California, without regard to conflict of laws principles. Any dispute shall be resolved in the state or federal courts located in San Francisco County, California.
          </p>
        </section>

        {/* 17. Arbitration */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">17. Arbitration Agreement</h2>
          <p className="text-gray-700 leading-relaxed">
            You and Dressify agree to resolve disputes through final and binding arbitration under the rules of the American Arbitration Association in San Francisco, CA, unless you opt out within 30 days of first use by emailing arbitration-optout@dressify.com.
          </p>
        </section>

        {/* 18. Changes to Terms */}

        <section>
          <h2 className="text-2xl font-semibold mb-2">18. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may revise these Terms from time to time. We will notify you of material changes by email or prominent notice on our site. Your continued use after changes constitutes acceptance.
          </p>
        </section>

        {/* 19. Severability */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">19. Severability</h2>
          <p className="text-gray-700 leading-relaxed">
            If any provision is held invalid or unenforceable, the remainder of these Terms will continue in full force and effect.
          </p>
        </section>

        {/* 20. Entire Agreement */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">20. Entire Agreement</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms, together with our Privacy Policy and any additional terms applicable to specific services, constitute the entire agreement between you and Dressify regarding the Services.
          </p>
        </section>

        {/* 21. Contact Information */}
        <section className="mt-12 text-center">
          <MotionLink
            href="/contact"
            className="inline-block bg-[#29224F] text-white px-6 py-3 rounded-lg hover:bg-[#4B3F72] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us for T&C Questions
          </MotionLink>
        </section>
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
