"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Motion-wrapped Next.js Link component
const MotionLink = motion(Link);

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 50,
      y: (e.clientY - window.innerHeight / 2) / 50,
    });
  }, []);
  
  useEffect(() => {
    // Set loaded state after initial render
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Add mouse move listener with passive option for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <section className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-0 gap-8 min-h-[35vh] md:min-h-screen relative overflow-hidden">
      {/* Floating decorative elements - only animate after load */}
      {isLoaded && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </>
      )}

      {/* Left Text Content with optimized 3D effect */}
      <motion.div
        className="w-full md:w-1/2 text-left z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          transform: isLoaded ? `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)` : 'none',
        }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={isLoaded ? { 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "200% auto" }}
          >
            Fashion Simplified
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore, Try & Shop With
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-purple-600 font-extrabold">Dressify</span>
          </motion.span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <MotionLink
            href="/sign-up"
            className="relative inline-flex items-center gap-2 bg-gradient-to-r from-[#29224F] to-purple-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg overflow-hidden group shadow-xl"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(41, 34, 79, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Explore Now</span>
            {isLoaded && (
              <motion.svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            )}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </MotionLink>
        </motion.div>
      </motion.div>

      {/* Right Image with optimized parallax and 3D effect */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end relative"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{ y }}
      >
        <motion.div
          className="relative w-full max-w-[500px] aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl"
          whileHover={{ scale: 1.02 }}
          style={{
            transform: isLoaded ? `perspective(1000px) rotateY(${-mousePosition.x * 0.2}deg) rotateX(${mousePosition.y * 0.2}deg)` : 'none',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent z-10 pointer-events-none" />
          
          {/* Animated border - only animate after load */}
          {isLoaded && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.5), transparent)",
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
          
          <Image
            src="/landing_img/landing1.png"
            alt="Model wearing a pastel dress"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
            priority
          />
          
          {/* Floating fashion tags - only animate after load */}
          {isLoaded && (
            <>
              <motion.div
                className="absolute top-1/3 right-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.8 },
                  y: { duration: 2, repeat: Infinity, delay: 1 }
                }}
              >
                <span className="text-sm font-semibold">✨ AI Outfit Recommendations</span>
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 left-10 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1,
                  y: [0, 10, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 1 },
                  y: { duration: 2.5, repeat: Infinity, delay: 1.5 }
                }}
              >
                <span className="text-sm font-semibold">👗 Virtual Try-On</span>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
