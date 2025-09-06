"use client";

import React from "react";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  readTime: string;
}

const articles: NewsArticle[] = [
  {
    id: 1,
    title: "Dressify Launches New Virtual Try-On Feature",
    date: "April 28, 2026",
    category: "Product Update",
    readTime: "3 min read",
    content:
      "Our cutting-edge AR-powered try-on feature harnesses advanced computer vision and ARKit/ARCore integration to overlay virtual garments onto your live camera feed. Simply point your phone at yourself, select any item from our catalog, and watch as it conforms to your body in real time. No dressing room needed; experience hyper-realistic fabric draping, material shaders, and dynamic lighting adjustments on the go. This initiative reduces return rates by over 30% and boosts user engagement through interactive style exploration.",
  },
  {
    id: 2,
    title: "AI StyleBot Now Supports Voice Commands",
    date: "April 15, 2026",
    category: "AI Innovation",
    readTime: "4 min read",
    content:
      "Chat hands-free with our StyleBot—now equipped with voice recognition powered by the latest NLP models. Ask for outfit suggestions, color matching tips, or even wardrobe organization advice without lifting a finger. Our integration with Whisper.js ensures high accuracy in noisy environments, while personalized context retention remembers your past preferences. Try saying 'StyleBot, show me summer dresses for a beach trip' and see AI-driven recommendations instantly.",
  },
  {
    id: 3,
    title: "Dressify Partners with EcoFabric Initiative",
    date: "March 30, 2026",
    category: "Sustainability",
    readTime: "2 min read",
    content:
      "In our commitment to sustainability, Dressify has partnered with the EcoFabric Initiative to highlight eco-friendly materials in every recommendation. We now surface details about fabric origin, water usage, and carbon footprint for each garment. Our algorithm weighs these factors alongside style and fit, so you can make choices that look good and feel good. Early trials show a 20% uptick in eco-conscious selections among active users.",
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] via-white to-[#F3E8FF] text-[#29224F]">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold text-sm sm:text-base">Latest Updates</span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Latest
              </span>
              <br />
              <span className="text-[#29224F]">News</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Stay updated with Dressify&apos;s newest features and 
              <span className="font-semibold text-[#29224F]"> groundbreaking announcements</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.main
        className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-20 pb-12 sm:pb-16 lg:pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        {/* News Articles */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {articles.map(({ id, title, date, content, category, readTime }, index) => (
            <motion.article
              key={id}
              className="group relative"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl border border-purple-200/30 relative overflow-hidden h-full flex flex-col">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Category and Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <motion.span
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-[#29224F] text-xs sm:text-sm font-semibold rounded-full self-start"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category}
                    </motion.span>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#29224F]/60">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {readTime}
                    </div>
                  </div>

                  {/* Date */}
                  <motion.time 
                    className="text-xs sm:text-sm text-[#29224F]/60 mb-3 sm:mb-4"
                    whileHover={{ color: "#29224F" }}
                    transition={{ duration: 0.3 }}
                  >
                    {date}
                  </motion.time>

                  {/* Title */}
                  <motion.h2 
                    className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 flex-1 text-[#29224F] group-hover:text-purple-700 transition-colors duration-300 leading-tight"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {title}
                  </motion.h2>

                  {/* Content */}
                  <motion.p 
                    className="text-sm sm:text-base text-[#29224F]/80 leading-relaxed flex-1"
                    whileHover={{ color: "#29224F" }}
                    transition={{ duration: 0.3 }}
                  >
                    {content}
                  </motion.p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                />
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.section
          className="relative"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 shadow-xl sm:shadow-2xl border border-purple-200/30 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />
            
            <div className="relative z-10 text-center">
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#29224F]">Stay in the Loop</h2>
              </motion.div>
              
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-[#29224F]/80 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Get the latest updates, exclusive features, and style tips delivered straight to your inbox.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto px-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm sm:text-base text-[#29224F] placeholder-[#29224F]/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
                <motion.button
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
      >
        <FooterSection />
      </motion.div>
    </div>
  );
}
