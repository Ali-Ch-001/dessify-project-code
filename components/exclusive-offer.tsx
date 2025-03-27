"use client";

import React, { useEffect, useState } from "react";
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
    text: "Dressify has completely transformed how I approach my wardrobe. The personalized suggestions are spot on, and the entire experience is so intuitive. It’s like having a styling pal in my pocket!",
  },
  {
    id: 2,
    name: "Sarah",
    text: "I’ve never felt more confident in my fashion choices since using Dressify. The AI recommendations help me pick new looks that I never thought I’d try. The platform has enabled me to expand my wardrobe in ways I absolutely love.",
  },
  {
    id: 3,
    name: "Romaisa",
    text: "The ease of managing my digital wardrobe on Dressify is amazing. The quick access to my wardrobe allows me to decide faster how I’d like to mix and match, elevating my daily style game.",
  },
  {
    id: 4,
    name: "Ali",
    text: "Dressify's suggestions are unbelievably accurate. It's like it knows my style better than I do. I love how the app streamlines my morning routine.",
  },
  {
    id: 5,
    name: "Aisha",
    text: "I used to waste so much time figuring out what to wear. Now with Dressify, I have curated outfits ready for any occasion in seconds.",
  },
  {
    id: 6,
    name: "Zara",
    text: "Shopping has never been easier. Dressify not only helps me find new outfits but also organizes my closet, so I never lose track of my favorite pieces.",
  },
];

// Duplicate reviews for continuous "marquee" effect
const repeatedReviews = [...reviews, ...reviews];

const ExclusiveOfferSection: React.FC = () => {
  // ======= COUNTDOWN TIMER LOGIC =======
  // Set your target date/time here:
  const targetDate = new Date("2025-12-31T23:59:59").getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Function to calculate time difference
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // If the date has passed or is now, set everything to 0
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
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

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
              src="/img/offermodel.png" // Replace with your actual image
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
            {/* Continuous marquee animation */}
            <motion.div
              className="flex space-x-6"
              animate={{ x: ["0%", "-50%"] }} // Scroll half the total width if we doubled the array
              transition={{
                repeat: Infinity,
                duration: 30,
                ease: "linear",
              }}
            >
              {repeatedReviews.map((review) => (
                <div
                  key={review.id + Math.random()} // ensure unique key for duplicates
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
