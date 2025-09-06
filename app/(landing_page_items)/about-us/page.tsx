"use client";

import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";
import { DressifyCardsCarouselDemo } from "@/components/ui/FeaturesDemo";
import Founders from "@/components/Founders";

export default function AboutPage() {
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

        <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-purple-200/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse" />
              <span className="text-[#29224F] font-semibold">AI-Powered Style Revolution</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="text-[#29224F]">Dressify</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-[#29224F]/80 leading-relaxed max-w-4xl mx-auto mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your AI-powered style companion that transforms clothing indecision into 
              <span className="font-semibold text-[#29224F]"> effortless confidence</span>
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ), 
                  text: "AI-Powered" 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ), 
                  text: "Style Expert" 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ), 
                  text: "Eco-Friendly" 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ), 
                  text: "24/7 Available" 
                }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-purple-200/50 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ 
                    y: 20, 
                    opacity: 0,
                    rotateX: -90,
                    scale: 0.5
                  }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    rotateX: 0,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1 + index * 0.15,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-indigo-100/20 opacity-0 rounded-full"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.span 
                    className="text-[#29224F] relative z-10"
                    whileHover={{
                      rotate: 360,
                      scale: 1.2
                    }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {item.icon}
                  </motion.span>
                  
                  <motion.span 
                    className="text-[#29224F] font-medium relative z-10"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(41, 34, 79, 0)",
                        "0 0 10px rgba(41, 34, 79, 0.3)",
                        "0 0 0px rgba(41, 34, 79, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    {item.text}
                  </motion.span>
                  
                  {/* Floating particles effect */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Continuous floating animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(139, 92, 246, 0)",
                        "0 0 20px rgba(139, 92, 246, 0.2)",
                        "0 0 0px rgba(139, 92, 246, 0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
      </div>
      </motion.section>

      {/* Main Content */}
      <motion.main
        className="container mx-auto px-6 lg:px-8 space-y-20 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        {/* Mission Section */}
        <motion.section
          className="relative"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-white via-[#FAFAFC] to-white rounded-3xl p-8 lg:p-16 shadow-2xl border border-purple-200/30 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#29224F]">Our Mission</h2>
              </motion.div>
              
              <motion.p
                className="text-lg lg:text-xl text-[#29224F]/80 leading-relaxed max-w-4xl"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                By fusing advanced computer vision, hybrid recommendation engines, and natural-language 
                understanding, we turn your own wardrobe into a 24/7 personal stylist. Whether it&apos;s a 
                boardroom debut, a spontaneous getaway, or just elevating your everyday look, our smart 
                algorithms learn your unique tastes, respect your eco-goals, and deliver curated outfits 
                that match your mood and the moment.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Features Carousel */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
        <DressifyCardsCarouselDemo />
        </motion.div>

        {/* Meet the Founders */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
        <Founders />
        </motion.div>
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
