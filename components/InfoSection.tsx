"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { AiOutlineRobot } from "react-icons/ai";
import { FiSettings, FiChevronLeft, FiChevronRight, FiUpload } from "react-icons/fi";
import { FaShoppingBag, FaMagic } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { GiMirrorMirror } from "react-icons/gi";

const InfoSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Enhanced features data
  const features = [
    {
      icon: AiOutlineRobot,
      title: "AI Recommendations",
      description: "Get AI recommended outfits based on your wardrobe.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0,
    },
    {
      icon: FiSettings,
      title: "Effortless Management",
      description: "Manage your wardrobe easily and effectively.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: FaShoppingBag,
      title: "Personalized Shopping",
      description: "Purchase items according to your taste, saving you time.",
      gradient: "from-pink-500 to-orange-500",
      delay: 0.2,
    },
    {
      icon: GiMirrorMirror,
      title: "Virtual Try-On",
      description: "Try outfits virtually before you buy or wear them.",
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.3,
    },
  ];

  // Model images for the slider
  const modelImages = [
    {
      src: "/landing_img/model2.png",
      alt: "Model 1",
      caption: "Black Crop Tailored Jacket",
    },
    {
      src: "/landing_img/model1.png",
      alt: "Model 2",
      caption: "Your Go-To Black Pants",
    },
    {
      src: "/landing_img/model3.png",
      alt: "Model 3",
      caption: "Textured Sunset Shirt",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    if (currentImageIndex < modelImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-white via-purple-50/30 to-white py-20 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-0 relative z-10">
        {/* Section Heading with gradient */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent"
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
            Why Choose Dressify?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience the future of fashion with our AI-powered platform
          </motion.p>
        </motion.div>

        {/* Enhanced Cards with 3D hover effects */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div
                className="relative bg-white rounded-2xl p-8 shadow-xl overflow-hidden cursor-pointer h-full"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0`}
                  animate={{
                    opacity: hoveredCard === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating icon */}
                <motion.div
                  className="mb-6 relative"
                  animate={{
                    y: hoveredCard === index ? [-5, 5, -5] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoveredCard === index ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                    <feature.icon size={32} className="text-white" />
                  </div>
                  {hoveredCard === index && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AiOutlineStar className="text-yellow-400 text-xl" />
                    </motion.div>
                  )}
                </motion.div>

                <h3 className="text-2xl font-bold mb-3 text-[#29224F]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated underline */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: hoveredCard === index ? "100%" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Upload Section with animation */}
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ y: y1 }}
        >
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
                }}
                animate={{
                  backgroundPosition: ["0px 0px", "70px 70px"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            <div className="relative z-10 text-center md:text-left mb-6 md:mb-0 md:mr-8">
              <motion.div
                className="flex items-center gap-2 mb-3"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaMagic className="text-white text-2xl" />
                <span className="text-white/90 text-sm font-medium uppercase tracking-wider">AI-Powered</span>
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Snap, Upload, & Discover
              </h3>
              <p className="text-white/90 text-lg">
                Your Best Looks in Seconds
              </p>
            </div>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <label
                htmlFor="upload"
                className="relative inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg cursor-pointer shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
              >
                <span className="relative z-10">Upload Here</span>
                <FiUpload className="relative z-10 text-xl group-hover:animate-bounce" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </label>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </motion.div>
          </motion.div>

          {/* Display Selected File with animation */}
          {selectedFile && (
            <motion.div
              className="text-center mt-6 p-4 bg-green-50 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-green-600 font-medium">✓ Selected: {selectedFile.name}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Wardrobe Section */}
        <motion.div
          className="text-center mt-20 mb-20 relative z-10 bg-white/80 backdrop-blur-sm py-12 px-6 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-4xl md:text-5xl font-bold mb-6 relative"
            whileInView={{ scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">
              Your Wardrobe But Better
            </span>
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.h3>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Manage and personalize your digital wardrobe effortlessly with Your Dressify Closet.
          </p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Enhanced Mobile Model Images Slider */}
        <div className="block md:hidden">
          <div className="relative flex items-center px-4">
            {currentImageIndex > 0 && (
              <motion.button
                onClick={prevImage}
                className="absolute left-0 z-20 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl border border-purple-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiChevronLeft size={24} className="text-[#29224F]" />
              </motion.button>
            )}
            
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              <div className="relative">
                <Image
                  src={modelImages[currentImageIndex].src}
                  alt={modelImages[currentImageIndex].alt}
                  width={280}
                  height={370}
                  className="rounded-2xl shadow-2xl"
                />
                
                {/* Enhanced mobile card heading with better styling */}
                <motion.div
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[280px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Main card container */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-4 relative overflow-hidden">
                    {/* Animated background pattern */}
                    <motion.div
                      className="absolute inset-0 opacity-5"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundImage: "radial-gradient(circle at 25% 25%, #9333ea 2px, transparent 2px)",
                        backgroundSize: "15px 15px",
                      }}
                    />
                    
                    {/* Enhanced heading */}
                    <motion.h4 
                      className="text-lg font-bold mb-2 relative z-10 text-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {modelImages[currentImageIndex].caption}
                      </span>
                    </motion.h4>
                    
                    {/* Animated underline */}
                    <motion.div
                      className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 mx-auto"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    />
                    
                    {/* Enhanced call-to-action */}
                    <motion.div 
                      className="text-sm text-purple-600 font-medium flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>Explore Collection</span>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {currentImageIndex < modelImages.length - 1 && (
              <motion.button
                onClick={nextImage}
                className="absolute right-0 z-20 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl border border-purple-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiChevronRight size={24} className="text-[#29224F]" />
              </motion.button>
            )}
          </div>
          
          {/* Enhanced mobile pagination indicators */}
          <motion.div 
            className="flex justify-center items-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {modelImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Desktop Model Images Grid with 3D effects */}
        <motion.div 
          className="hidden md:grid grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {modelImages.map((model, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                rotateX: -5,
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white">
                <div className="relative h-[400px] overflow-hidden">
                  <Image
                    src={model.src}
                    alt={model.alt}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    <span className="text-xs font-bold text-purple-600">NEW</span>
                  </motion.div>
                </div>
                
                {/* Enhanced Caption with improved heading */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundImage: "radial-gradient(circle at 25% 25%, #9333ea 2px, transparent 2px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  
                  {/* Enhanced heading with gradient and animation */}
                  <motion.h4 
                    className="text-lg font-bold mb-2 relative z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {model.caption}
                    </span>
                  </motion.h4>
                  
                  {/* Animated underline */}
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  />
                  
                  {/* Enhanced call-to-action */}
                  <motion.p 
                    className="text-sm text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <span>Explore Collection</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;