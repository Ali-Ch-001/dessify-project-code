"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";

const MotionLink = motion(Link);

export default function PrivacyPolicyPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F3E8FF] via-white to-[#F3E8FF] text-[#29224F]">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-12 sm:py-16 lg:py-20 xl:py-24"
        style={{ y, opacity }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full blur-2xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Privacy Badge */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold text-sm sm:text-base">Privacy Policy</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Privacy
              </span>
              <br />
              <span className="text-[#29224F]">Policy</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Last updated: 
              <span className="font-semibold text-[#29224F]"> May 1, 2025</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.main 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1 space-y-12 sm:space-y-16 lg:space-y-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        {/* Comprehensive Policy */}
        <section>
          <h2 className="text-3xl font-semibold mb-4">Introduction & Scope</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Dressify, Inc., we prioritize the privacy and security of our global user base. This Privacy Policy applies to all personal data collected about individuals interacting with our websites, mobile applications, APIs, and associated digital or offline services (collectively, &quot;Services&quot;). It outlines how we collect, process, store, share, and protect personal information, in accordance with international privacy frameworks (GDPR, CCPA, PIPEDA, LGPD, Australia Privacy Act, etc.).
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using our Services, you consent to the collection and use of your data as described herein. If you do not agree, please discontinue use of the Services and contact us via the link at the bottom of this page.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">1. Data Collection & Sources</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect personal data directly from you when you register, interact, or complete forms within our Services, including:
          </p>
          <ul className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Registration Data</strong>: Name, email, password, username, and optional demographic information (age, gender).</li>
            <li><strong>Profile & Preference Data</strong>: Photos, body measurements, style preferences, budgets, and sustainability settings.</li>
            <li><strong>Payment & Transaction Data</strong>: Billing address, credit/debit card tokenization, purchase history, and refunds.</li>
            <li><strong>Device & Technical Data</strong>: IP address, device operating system, browser version, screen resolution, and unique device identifiers.</li>
            <li><strong>Usage & Interaction Data</strong>: Pages/screens viewed, clicks, time stamps, feature usage metrics, and in-app navigation paths.</li>
            <li><strong>Third-Party & Public Data</strong>: Social media profile information (when you connect via OAuth), marketing lists, publicly available data, and analytics providers (Google Analytics, Mixpanel).</li>
            <li><strong>Support & Communications Data</strong>: Messages, support tickets, feedback, call recordings, and chat logs when you contact customer support.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">2. Purpose of Processing & Legal Grounds</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We process your personal data for the following purposes, with corresponding legal bases under GDPR and equivalent global regulations:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Service Delivery (Contract Fulfillment)</strong>: To register accounts, process transactions, and deliver purchased virtual try-on services.</li>
            <li><strong>Personalization & Recommendations (Legitimate Interest)</strong>: To analyze style preferences and browsing behavior to customize outfit suggestions and UI experience.</li>
            <li><strong>Marketing & Communications (Consent)</strong>: With your consent, to send newsletters, promotions, surveys, and event invitations. You may withdraw consent anytime.</li>
            <li><strong>Security & Fraud Prevention (Legal Obligation/Legitimate Interest)</strong>: To detect and investigate fraudulent activity, enforce terms of service, and comply with law enforcement requests.</li>
            <li><strong>Product Improvement & Research (Legitimate Interest)</strong>: To conduct A/B testing, feature usage analysis, and internal research for product enhancements.</li>
            <li><strong>Legal Compliance (Legal Obligation)</strong>: To comply with tax laws, accounting standards, court orders, and other regulatory requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">3. Data Retention & Minimization</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain personal data only as long as necessary for the purposes outlined above, including legal, tax, or accounting obligations. Retention periods vary by data type:
          </p>
          <ul className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Account & Profile Data</strong>: Until you delete your account and for a maximum of 7 years thereafter for compliance purposes.</li>
            <li><strong>Transaction & Payment Data</strong>: 7 years for financial record-keeping obligations.</li>
            <li><strong>Support Communications</strong>: 3 years unless required longer for dispute resolution.</li>
            <li><strong>Analytics & Usage Logs</strong>: 2 years, aggregated or anonymized beyond this period.</li>
            <li><strong>Marketing Data</strong>: Until consent is withdrawn.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">4. Data Sharing & International Transfers</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To support our global operations, we may share your data with the following categories of recipients:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Service Providers</strong>: Cloud hosting (AWS, Azure), CDN, payment gateways (Stripe, PayPal), analytics providers.</li>
            <li><strong>Business Partners</strong>: Brand partners for co-marketing and wardrobe sync integrations.</li>
            <li><strong>Affiliates & Subsidiaries</strong>: Internal divisions for consolidated service delivery and support.</li>
            <li><strong>Legal & Regulatory Bodies</strong>: Law enforcement, tax authorities, and court orders when required by law.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Where data is transferred outside your jurisdiction, we employ Standard Contractual Clauses, Privacy Shield Frameworks, or equivalent safeguards to ensure adequate protection.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">5. Cookies, Tracking & Third-Party Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use cookies, local storage, and tracking pixels for functional, analytical, and advertising purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Strictly Necessary Cookies</strong>: Essential for site navigation and security.</li>
            <li><strong>Performance & Analytics Cookies</strong>: Google Analytics, Mixpanel, Hotjar for usage insights.</li>
            <li><strong>Functional Cookies</strong>: Remember user preferences, language settings, and video player states.</li>
            <li><strong>Advertising & Marketing Cookies</strong>: Facebook Pixel, Google Ads, and programmatic ad partners to measure campaign effectiveness.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            You can manage or disable cookies via your browser settings or through our Cookie Preferences banner.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">6. Data Subject Rights & Requests</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Depending on your jurisdiction, you may exercise the following rights:
          </p>
          <ul className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Right of Access:</strong> Obtain a copy of your personal data.</li>
            <li><strong>Right to Rectification:</strong> Correct incomplete or inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> Delete your personal data (“right to be forgotten”).</li>
            <li><strong>Right to Restriction:</strong> Restrict processing of your data under certain conditions.</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format.</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications at any time.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To submit a request, please email <a href="mailto:privacy@dressify.com" className="text-[#29224F] underline">privacy@dressify.com</a> with your details and request type. We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">7. Children’s Privacy & Age Restrictions</h2>
          <p className="text-gray-700 leading-relaxed">
            Our Services are not intended for children under 16 (or older if required by local law). We do not knowingly collect or process data from minors. If you become aware of any data from a minor, please contact us to request deletion.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">8. Security Measures & Incident Response</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We employ industry-standard security controls including encryption at rest and in transit (AES-256, TLS 1.2+), role-based access, regular penetration testing, and SOC 2 Type II audits. In the event of a data breach,
            we will notify affected users and regulators within 72 hours, per GDPR and other breach notification laws.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">9. International Transfers & Data Localization</h2>
          <p className="text-gray-700 leading-relaxed">
            Dressify’s infrastructure spans multiple regions. Where personal data is transferred across borders, we rely on approved mechanisms such as EU Standard Contractual Clauses, Privacy Shield, or binding corporate rules. For users in jurisdictions with data localization requirements (e.g., Russia, China), we maintain local data centers to ensure compliance.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">10. Policy Changes & Version Control</h2>
          <p className="text-gray-700 leading-relaxed">
            We review this Privacy Policy annually or when significant changes occur. A version history is maintained below:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Version 3.0 (May 1, 2025):</strong> Expanded international compliance, data retention, and incident response.</li>
            <li><strong>Version 2.5 (January 10, 2024):</strong> Added CCPA section and marketing cookies details.</li>
            <li><strong>Version 2.0 (June 5, 2023):</strong> Introduced Virtual Try-On data handling and API integration.
</li>
            <li><strong>Version 1.0 (March 1, 2022):</strong> Initial policy launch aligning with GDPR.</li>
          </ul>
        </section>

        <motion.section 
          className="mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <MotionLink
            href="/contact"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us About Privacy
          </MotionLink>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FooterSection />
      </motion.div>
    </div>
  );
}
