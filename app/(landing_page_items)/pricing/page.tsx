"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function PricingPage() {
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
            {/* Pricing Badge */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold text-sm sm:text-base">Pricing Plans</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Our Pricing
              </span>
              <br />
              <span className="text-[#29224F]">Plans</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Flexible plans to fit your 
              <span className="font-semibold text-[#29224F]"> style and budget</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.main 
        className="flex-grow py-12 sm:py-16 lg:py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.key}
                className={`group relative flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden ${
                  plan.featured
                    ? "border-purple-300 bg-gradient-to-br from-white via-purple-50/30 to-white shadow-2xl scale-105 sm:scale-110"
                    : "border-purple-200/50 bg-gradient-to-br from-white via-[#FAFAFC] to-white shadow-xl hover:shadow-2xl"
                }`}
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  boxShadow: plan.featured 
                    ? "0 25px 50px rgba(139, 92, 246, 0.25)"
                    : "0 25px 50px rgba(139, 92, 246, 0.15)"
                }}
              >
                {/* Featured Badge */}
                {plan.featured && (
                  <motion.div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />

                <div className="relative z-10 p-6 sm:p-8 flex-grow flex flex-col">
                  {/* Plan Title */}
                  <motion.div
                    className="text-center mb-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#29224F] mb-2">
                      {plan.title}
                    </h2>
                    {plan.price && (
                      <motion.p 
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#29224F]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {plan.price}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Features */}
                  <motion.ul 
                    className="space-y-3 sm:space-y-4 flex-grow mb-6 sm:mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {plan.features.map((feat, featIndex) => (
                      <motion.li 
                        key={feat} 
                        className="flex items-start gap-3 text-sm sm:text-base text-[#29224F]/80"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.2 + featIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5, color: "#29224F" }}
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span>{feat}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={plan.href}
                      className={`block text-center py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                        plan.featured
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                          : "border-2 border-purple-300 text-[#29224F] hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-transparent"
                      }`}
                    >
                      {plan.btnText}
                    </Link>
                  </motion.div>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
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
