"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";

const MotionLink = motion(Link);

export default function TermsAndConditionsPage() {
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
            {/* Terms Badge */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold text-sm sm:text-base">Legal Terms</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Terms &
              </span>
              <br />
              <span className="text-[#29224F]">Conditions</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Effective Date: 
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
        {/* 1. Acceptance of Terms */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              1. Acceptance of Terms
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              By accessing or using Dressify&apos;s website, mobile applications, or services (&quot;Services&quot;), you agree to these Terms &amp; Conditions (&quot;Terms&quot;). If you do not agree, you may not use the Services. Dressify, Inc. reserves the right to modify these Terms at any time; continued use constitutes acceptance of the updated Terms.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 2. Definitions */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              2. Definitions
            </motion.h2>
            <motion.ul 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span><strong>&quot;User&quot;</strong> refers to any individual or entity that uses the Services.</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span><strong>&quot;Content&quot;</strong> means all text, images, videos, audio, and other materials provided on or through the Services.</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span><strong>&quot;User Content&quot;</strong> refers to any Content you submit or upload.</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span><strong>&quot;Virtual Try-On&quot;</strong> refers to the augmented reality feature that overlays clothing images onto a live camera feed.</span>
              </motion.li>
            </motion.ul>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 3. Eligibility */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              3. Eligibility
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              You must be at least 16 years old (or older if required by local law) to use the Services. By registering, you represent and warrant that you meet the eligibility requirements. Minors may use the Services if supervised by a parent or legal guardian who accepts these Terms on their behalf.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 4. Account Registration & Security */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              4. Account Registration & Security
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                To access certain features, you must register an account. You agree to provide accurate information, maintain the security of your password, and accept responsibility for all activities under your account.
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                If you suspect unauthorized use, you must notify us immediately at support@dressify.com.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 5. User Content & License */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              5. User Content & License
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                You retain ownership of your User Content. By uploading, you grant Dressify a worldwide, royalty-free, sublicensable license to use, reproduce, and display your content as necessary to provide and improve the Services.
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                You warrant that you own all rights to your content and that its use does not violate any law or third-party rights.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 6. Virtual Try-On Terms */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              6. Virtual Try-On Terms
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              Virtual Try-On is provided for your personal, non-commercial use. The accuracy of garment fit and color is an approximation; actual products may vary due to lighting, screen settings, and manufacturing tolerances. Dressify disclaims liability for discrepancies between virtual and actual appearance.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 7. Subscriptions & Fees */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              7. Subscriptions & Fees
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                Certain features require a paid subscription (&quot;Premium Services&quot;). Fees, billing cycles, and cancellation policies are described on our Pricing page. All fees are non-refundable except as required by law.
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                We may change fees upon 30 days&apos; notice. Continued use after fee changes constitutes acceptance.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 8. Payment Processing */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              8. Payment Processing
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              Payments are processed through third-party providers (e.g., Stripe, PayPal). You agree to their terms and fees. Dressify does not store full payment card data; tokens are stored securely by our payment partners.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 9. Intellectual Property Rights */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              9. Intellectual Property Rights
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                Dressify and its licensors retain all rights, title, and interest in the Services, including trademarks, copyrights, and patents. The Services are licensed, not sold.
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                You may not copy, modify, distribute, or reverse-engineer the Services, except to the extent permitted by law or with prior written permission.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 10. Prohibited Conduct */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.0 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              10. Prohibited Conduct
            </motion.h2>
            <motion.ul 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              viewport={{ once: true }}
            >
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.4 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span>Using the Services for unlawful purposes or in violation of these Terms.</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.5 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span>Uploading malicious code or unsolicited advertising (spam).</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.6 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span>Impersonating others or engaging in harassment.</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.7 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, color: "#29224F" }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-2.5 flex-shrink-0" />
                <span>Attempting to circumvent security or reverse engineer the Services.</span>
              </motion.li>
            </motion.ul>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 11. Privacy & Data Protection */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              11. Privacy & Data Protection
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              Your use of data is governed by our Privacy Policy, incorporated by reference. You consent to our collection and use of data as described therein.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 12. Disclaimers & Warranties */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.4 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              12. Disclaimers & Warranties
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. DRESSIFY DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                We do not warrant uninterrupted access, error-free operation, or that defects will be corrected.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 13. Limitation of Liability */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.6 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              13. Limitation of Liability
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DRESSIFY&apos;S LIABILITY FOR ANY CLAIM IS LIMITED TO THE AMOUNT YOU PAID FOR THE SERVICE IN THE LAST 12 MONTHS. IN NO EVENT SHALL DRESSIFY BE LIABLE FOR INDIRECT, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 14. Indemnification */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.8 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              14. Indemnification
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              You agree to defend, indemnify, and hold harmless Dressify and its affiliates from all claims, liabilities, damages, and expenses arising from your breach of these Terms or your use of the Services.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 15. Termination */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.0 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              15. Termination
            </motion.h2>
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                We may suspend or terminate your access for violation of these Terms or for any reason with notice. Upon termination, your right to use the Services ceases, but some provisions will survive (e.g., limitations of liability).
              </motion.p>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
                whileHover={{ color: "#29224F" }}
                transition={{ duration: 0.3 }}
              >
                You may also terminate your account at any time by contacting support@dressify.com. Certain data may be retained as required by law.
              </motion.p>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 16. Governing Law & Jurisdiction */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.2 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              16. Governing Law & Jurisdiction
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              These Terms shall be governed by the laws of the State of California, without regard to conflict of laws principles. Any dispute shall be resolved in the state or federal courts located in San Francisco County, California.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 17. Arbitration */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.4 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              17. Arbitration Agreement
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              You and Dressify agree to resolve disputes through final and binding arbitration under the rules of the American Arbitration Association in San Francisco, CA, unless you opt out within 30 days of first use by emailing arbitration-optout@dressify.com.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 18. Changes to Terms */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.6 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              18. Changes to Terms
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              We may revise these Terms from time to time. We will notify you of material changes by email or prominent notice on our site. Your continued use after changes constitutes acceptance.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 19. Severability */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.8 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              19. Severability
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              If any provision is held invalid or unenforceable, the remainder of these Terms will continue in full force and effect.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 20. Entire Agreement */}
        <motion.section
          className="group relative bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-purple-200/30 p-6 sm:p-8 overflow-hidden"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 4.0 }}
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
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-4 sm:mb-6 group-hover:text-purple-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              20. Entire Agreement
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-[#29224F]/80 leading-relaxed"
              whileHover={{ color: "#29224F" }}
              transition={{ duration: 0.3 }}
            >
              These Terms, together with our Privacy Policy and any additional terms applicable to specific services, constitute the entire agreement between you and Dressify regarding the Services.
            </motion.p>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          />
        </motion.section>

        {/* 21. Contact Information */}
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
            Contact Us for T&C Questions
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
