"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ParticleEffect from "./ParticleEffect";
import { FaClock, FaTag, FaBolt, FaStar } from "react-icons/fa";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const reviews = [
  { id: 1, name: "Khadija", text: "Dressify has completely transformed how I approach my wardrobe. The AI recommendations are spot-on!", rating: 5 },
  { id: 2, name: "Sarah", text: "I've never felt more confident in my fashion choices since using Dressify. It's like having a personal stylist!", rating: 5 },
  { id: 3, name: "Romaisa", text: "The ease of managing my digital wardrobe on Dressify is amazing. I can plan outfits for the whole week!", rating: 5 },
  { id: 4, name: "Ali", text: "Dressify's suggestions are unbelievably accurate. It knows my style better than I do!", rating: 5 },
  { id: 5, name: "Aisha", text: "I used to waste so much time figuring out what to wear. Dressify has saved me hours every week!", rating: 5 },
  { id: 6, name: "Zara", text: "Shopping has never been easier. Dressify not only helps me find new outfits but also shows me how to style them!", rating: 5 },
];

const repeatedReviews = [...reviews, ...reviews];

const ExclusiveOfferSection: React.FC = () => {
  const targetDate = useMemo(() => new Date("2025-12-31T23:59:59").getTime(), []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [hoveredReview, setHoveredReview] = useState<number | null>(null);

  useEffect(() => {
    function calcTimeLeft() {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
      }
    }
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: "Days", color: "from-purple-600 to-pink-600" },
    { value: timeLeft.hours, label: "Hours", color: "from-blue-600 to-cyan-600" },
    { value: timeLeft.minutes, label: "Mins", color: "from-pink-600 to-orange-600" },
    { value: timeLeft.seconds, label: "Secs", color: "from-orange-600 to-yellow-600" },
  ];

  return (
    <main className="w-full relative">
      {/* Mobile Exclusive Offer with enhanced animations */}
      <section className="block md:hidden bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 relative h-[700px] overflow-hidden">
        <ParticleEffect />
        
        {/* Background Image with parallax */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/landing_img/offermodel.png"
            alt="Model with green blazer"
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0 z-0"
          />
        </motion.div>
        
        {/* Enhanced overlay with gradient animation */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6"
          style={{
            background: "linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.9))",
          }}
          animate={{
            background: [
              "linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.9))",
              "linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(59, 130, 246, 0.9))",
              "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9))",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaTag className="text-3xl text-yellow-400" />
              <h2 className="text-4xl font-bold text-white">Exclusive Offer</h2>
              <FaTag className="text-3xl text-yellow-400 scale-x-[-1]" />
            </motion.div>
            
            <p className="text-white/90 mb-8 text-lg max-w-md mx-auto">
              A perfect sale matching your style is happening now. Don&apos;t miss out!
            </p>
            
            {/* Enhanced countdown for mobile */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {timeUnits.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                >
                  <motion.div
                    className="bg-white/20 backdrop-blur-md rounded-xl p-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span
                      className="text-3xl font-bold text-white block"
                      key={item.value}
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.value}
                    </motion.span>
                    <span className="text-white/70 text-xs">{item.label}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              className="relative bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaBolt className="text-yellow-500" />
                Buy Now
                <FaBolt className="text-yellow-500" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Desktop Exclusive Offer with 3D effects */}
      <section className="hidden md:block bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row gap-12 py-20 relative z-10">
          {/* Left Image with 3D effect */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              whileHover={{
                rotateY: 10,
                rotateX: -5,
                scale: 1.05,
              }}
              transition={{ duration: 0.3 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/landing_img/offermodel.png"
                  alt="Model with green blazer"
                  width={500}
                  height={600}
                  className="object-cover"
                />
                
                {/* Floating badges */}
                <motion.div
                  className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  LIMITED TIME
                </motion.div>
                
                <motion.div
                  className="absolute bottom-8 left-8 bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  50% OFF
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content with animations */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-6"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaClock className="text-3xl text-purple-600" />
              <span className="text-purple-600 font-bold text-xl">LIMITED TIME OFFER</span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% auto" }}
            >
              Exclusive Offer
            </motion.h2>

            <p className="text-gray-700 mb-8 text-xl leading-relaxed">
              A perfect sale matching your style is happening now. Don&apos;t miss out on updating your wardrobe with these tailored discounts!
            </p>

            {/* Enhanced countdown for desktop */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {timeUnits.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div
                    className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl shadow-xl text-white text-center`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      className="text-4xl font-bold block"
                      key={item.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.span>
                    <span className="text-sm opacity-90">{item.label}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl overflow-hidden group self-start"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaBolt className="text-yellow-300 text-2xl" />
                Shop Now & Save Big
                <FaBolt className="text-yellow-300 text-2xl" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Reviews Section with 3D cards */}
      <section className="bg-gradient-to-b from-white via-purple-50/50 to-white py-20 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* <FaStar className="text-3xl text-purple-400" /> */}
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customer Love
              </h2>
              {/* <FaStar className="text-3xl text-purple-400" /> */}
            </motion.div>
            <p className="text-lg text-gray-600">See what our happy customers are saying</p>
          </motion.div>
        </div>

        {/* Continuous slider with 3D effect - Edge to Edge */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-4 md:gap-8 py-4 md:py-6 pl-4 md:pl-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 60,
                ease: "linear",
              },
            }}
          >
              {repeatedReviews.map((review, index) => (
                <motion.div
                  key={`${review.id}-${index}`}
                  className="min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] flex-shrink-0"
                  onHoverStart={() => setHoveredReview(index)}
                  onHoverEnd={() => setHoveredReview(null)}
                >
                  <motion.div
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-xl h-full relative overflow-hidden"
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: -5,
                      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                  >
                    {/* Gradient background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredReview === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      {/* Rating stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <FaStar className="text-yellow-400 text-xl" />
                          </motion.div>
                        ))}
                      </div>
                      
                      <p className="text-gray-700 mb-4 italic text-lg leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#29224F] text-lg">{review.name}</p>
                          <p className="text-sm text-gray-500">Verified Customer</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ExclusiveOfferSection;