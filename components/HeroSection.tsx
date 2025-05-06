"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Motion-wrapped Next.js Link component
const MotionLink = motion(Link);

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-0 gap-8 min-h-[35vh] md:min-h-screen">
      {/* Left Text Content */}
      <motion.div
        className="w-full md:w-1/2 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Fashion Simplified <br />
          Explore, Try & Shop <br />
          with Dressify
        </motion.h1>
        <MotionLink
          href="/sign-up"
          className="inline-block bg-[#29224F] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-base sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Now
        </MotionLink>
      </motion.div>

      {/* Right Image / Visual Content */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <motion.div
          className="relative w-full h-[35vh] md:h-screen overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Image
            src="/landing_img/landing1.png"
            alt="Model wearing a pastel dress"
            width={600}
            height={1000}
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
