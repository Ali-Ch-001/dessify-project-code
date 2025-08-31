"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBlob: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the animation start to reduce initial lag
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Blobs - Progressive loading */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-400/30 rounded-full filter blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? {
          opacity: 1,
          scale: 1,
        } : { opacity: 0, scale: 0.8 }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 via-indigo-400/30 to-purple-400/20 rounded-full filter blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? {
          opacity: 1,
          scale: 1,
        } : { opacity: 0, scale: 0.8 }}
        transition={{
          opacity: { duration: 1, delay: 0.2 },
          scale: { duration: 1, delay: 0.2 },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/10 via-purple-300/20 to-indigo-300/10 rounded-full filter blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? {
          opacity: 1,
          scale: 1,
        } : { opacity: 0, scale: 0.8 }}
        transition={{
          opacity: { duration: 1, delay: 0.4 },
          scale: { duration: 1, delay: 0.4 },
        }}
      />
    </div>
  );
};

export default AnimatedBlob;
