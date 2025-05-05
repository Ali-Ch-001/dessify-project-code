// components/ComingSoon.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

const ringVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: i => ({
    opacity: [1, 0],
    scale: [0, 1.2],
    transition: {
      delay: i * 0.4,
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeOut',
    },
  }),
};

const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

const bounceVariants: Variants = {
  hidden: { y: 0 },
  show: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

interface ComingSoonProps {
  /** Main heading text (defaults to “Coming Soon”) */
  heading?: string;
  /** Sub-line below */
  tagline?: string;
  /** Width/height of the ring container */
  size?: number;
}

export default function ComingSoon({
  heading = 'Coming Soon',
  tagline = `We’re crafting something amazing. Hang tight!`,
  size = 192,
}: ComingSoonProps) {
  const ringSize = `${size}px`;
  const innerSize = `${Math.round(size * 0.5)}px`;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Pulsing Rings */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
      >
        {[0, 1, 2].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={ringVariants}
            initial="hidden"
            animate="show"
            className="absolute rounded-full border-2 border-indigo-400"
            style={{ width: '100%', height: '100%' }}
          />
        ))}

        {/* Static inner circle */}
        <div
          className="absolute rounded-full bg-white shadow-lg"
          style={{ width: innerSize, height: innerSize }}
        />
      </div>

      {/* Main Title */}
      <motion.h1
        className="mt-8 text-3xl sm:text-5xl font-extrabold text-gray-900 text-center"
        variants={textVariants}
        initial="hidden"
        animate="show"
      >
        {heading}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-4 text-gray-700 text-sm sm:text-base text-center max-w-xs"
        variants={bounceVariants}
        initial="hidden"
        animate="show"
      >
        {tagline}
      </motion.p>
    </div>
  );
}
