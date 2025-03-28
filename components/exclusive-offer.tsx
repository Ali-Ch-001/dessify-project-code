"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Reviews array
const reviews = [
  {
    id: 1,
    name: "Khadija",
    text: "Dressify has completely transformed how I approach my wardrobe...",
  },
  {
    id: 2,
    name: "Sarah",
    text: "I’ve never felt more confident in my fashion choices since using Dressify...",
  },
  {
    id: 3,
    name: "Romaisa",
    text: "The ease of managing my digital wardrobe on Dressify is amazing...",
  },
  {
    id: 4,
    name: "Ali",
    text: "Dressify's suggestions are unbelievably accurate...",
  },
  {
    id: 5,
    name: "Aisha",
    text: "I used to waste so much time figuring out what to wear...",
  },
  {
    id: 6,
    name: "Zara",
    text: "Shopping has never been easier. Dressify not only helps me find new outfits...",
  },
];

// Duplicate reviews for continuous "marquee" effect
const repeatedReviews = [...reviews, ...reviews];

const ExclusiveOfferSection: React.FC = () => {
  // Memoize the target date so it remains constant between renders.
  const targetDate = useMemo(
    () => new Date("2025-12-31T23:59:59").getTime(),
    []
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calcTimeLeft() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // targetDate is now stable

  return (
    <main className="w-full">
      {/* EXCLUSIVE OFFER SECTION */}
      <section className="bg-[#E8EAF6] px-4 md:px-0">
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Image */}
          <motion.div
            className="w-full md:w-1/2 flex items-end justify-center relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/landing_img/offermodel.png" // Replace with your actual image
              alt="Model with green blazer"
              width={400}
              height={500}
              className="object-cover object-bottom rounded-md"
            />
          </motion.div>

          {/* Right Text & Countdown */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#29224F]">
              Exclusive Offer
            </h2>
            <p className="text-gray-700 mb-6 max-w-md text-base md:text-xl">
              A perfect sale matching your style is happening now. Don’t miss
              out on updating your wardrobe with these tailored discounts!
            </p>
            {/* Live Countdown */}
            <div className="flex space-x-4 mb-6">
              {/* Days */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl md:text-4xl font-bold text-[#29224F]">
                  {timeLeft.days}
                </span>
                <span className="text-gray-600 text-xs md:text-sm">Days</span>
              </motion.div>
              {/* Hours */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl md:text-4xl font-bold text-[#29224F]">
                  {timeLeft.hours}
                </span>
                <span className="text-gray-600 text-xs md:text-sm">Hours</span>
              </motion.div>
              {/* Minutes */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl md:text-4xl font-bold text-[#29224F]">
                  {timeLeft.minutes}
                </span>
                <span className="text-gray-600 text-xs md:text-sm">Mins</span>
              </motion.div>
              {/* Seconds */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl md:text-4xl font-bold text-[#29224F]">
                  {timeLeft.seconds}
                </span>
                <span className="text-gray-600 text-xs md:text-sm">Secs</span>
              </motion.div>
            </div>
            <motion.button
              className="bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors text-base md:text-xl"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* REVIEWS - CONTINUOUS SLIDER */}
      <section className="bg-white py-8 md:py-12 px-4 md:px-0 overflow-hidden">
        <div className="container mx-auto">
          <motion.h2
            className="text-2xl md:text-4xl font-bold text-center mb-8 text-[#29224F]"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Feedback Corner
          </motion.h2>

          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                duration: 30,
                ease: "linear",
              }}
            >
              {repeatedReviews.map((review) => (
                <div
                  key={review.id + Math.random()}
                  className="min-w-[300px] max-w-[300px] bg-[#F9FAFB] p-6 rounded-md shadow-md flex-shrink-0"
                >
                  <p className="text-gray-700 italic mb-3">“{review.text}”</p>
                  <span className="font-semibold text-[#29224F]">
                    — {review.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExclusiveOfferSection;
