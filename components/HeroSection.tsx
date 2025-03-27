// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row items-center mt-10 px-4 md:px-0 gap-8">
      {/* Left Text Content */}
      <motion.div
        className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold leading-tight mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Fashion Simplified: <br />
          Explore, Try, and Shop <br />
          with Dressify
        </motion.h1>
        <motion.button
          className="bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Explore Now
        </motion.button>
      </motion.div>

      {/* Right Image / Visual Content */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end relative mb-8 md:mb-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative z-10">
          <Image
            src="/img/landing1.png"  // Path from public folder
            alt="Model wearing a pastel dress"
            width={400}              // Adjust width/height as needed
            height={500}
            objectFit="cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
