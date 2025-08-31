"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTshirt, FaShoePrints, FaGem } from "react-icons/fa";
import { GiDress, GiSunglasses } from "react-icons/gi";
import { HiShoppingBag } from "react-icons/hi";

const FloatingElements: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the animation start to reduce initial lag
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const elements = [
    { Icon: FaTshirt, delay: 0, x: "10%", y: "20%" },
    { Icon: FaShoePrints, delay: 2, x: "80%", y: "15%" },
    { Icon: FaGem, delay: 4, x: "15%", y: "75%" },
    { Icon: GiDress, delay: 1, x: "85%", y: "70%" },
    { Icon: HiShoppingBag, delay: 3, x: "25%", y: "40%" },
    { Icon: GiSunglasses, delay: 5, x: "70%", y: "45%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? {
            opacity: 0.1,
            scale: 1,
          } : { opacity: 0, scale: 0 }}
          transition={{
            duration: 1,
            delay: isVisible ? delay * 0.5 : 0,
          }}
        >
          <Icon className="text-[#29224F] text-4xl md:text-6xl" />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
