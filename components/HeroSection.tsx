import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto flex flex-row items-center px-4 md:px-0 gap-4 min-h-[35vh] md:min-h-screen md:my-16">
      {/* Left Text Content */}
      <motion.div
        className="w-1/2 text-left"
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
        <motion.button
          className="bg-[#29224F] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-base sm:text-lg"
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Explore Now
        </motion.button>
      </motion.div>

      {/* Right Image / Visual Content */}
      <motion.div
        className="w-1/2 flex justify-center md:justify-end relative"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Image
            src="/landing_img/landing1.png" // Path from public folder
            alt="Model wearing a pastel dress"
            width={450}
            height={500}
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
