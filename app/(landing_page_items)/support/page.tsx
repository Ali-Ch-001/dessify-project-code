"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import FooterSection from "@/components/FooterSection";

export default function SupportPage() {

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

  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            {/* Support Badge */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold text-sm sm:text-base">Support Center</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Support
              </span>
              <br />
              <span className="text-[#29224F]">& Resources</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Everything you need to maximize your experience with Dressify—from 
              <span className="font-semibold text-[#29224F]"> step-by-step guides</span> to 
              <span className="font-semibold text-[#29224F]"> enterprise solutions</span>
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
        {/* Guides */}
        <motion.section 
          className="space-y-6 sm:space-y-8 lg:space-y-12"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {guides.map(({ title, items }, idx) => (
            <motion.article
              key={idx}
              className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-4 sm:p-6 lg:p-8 overflow-hidden"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 25px 50px rgba(139, 92, 246, 0.15)"
              }}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                {/* Guide Icon */}
                <motion.div
                  className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <motion.h2 
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] group-hover:text-purple-700 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {title}
                  </motion.h2>
                </motion.div>

                {/* Guide Items */}
                <motion.ul 
                  className="space-y-3 sm:space-y-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  {items.map((item, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80 leading-relaxed"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5, color: "#29224F" }}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Hover Effect Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
              />
            </motion.article>
          ))}
        </motion.section>

        {/* FAQs Accordion */}
        <motion.section 
          className="space-y-4 sm:space-y-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#29224F] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-[#29224F]/70 max-w-2xl mx-auto">
              Quick answers to common questions about Dressify
            </p>
          </motion.div>

          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              className="group bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-200/30 overflow-hidden"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.1)"
              }}
            >
              <motion.button
                className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left font-semibold flex justify-between items-center text-base sm:text-lg lg:text-xl text-[#29224F] hover:text-purple-700 transition-colors duration-300"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex-1 pr-4">{faq.question}</span>
                <motion.span 
                  className="text-2xl sm:text-3xl text-purple-600 flex-shrink-0"
                  animate={{ rotate: openIndex === idx ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                      <motion.p 
                        className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
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
