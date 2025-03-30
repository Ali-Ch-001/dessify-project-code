"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineRobot } from "react-icons/ai";
import { FiSettings, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaShoppingBag } from "react-icons/fa";

const InfoSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // TODO: Add any file handling logic (e.g. preview, upload, etc.)
    }
  };

  // Define an array of model images for the slider
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
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 md:px-0">
        {/* Section Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose Dressify?
        </motion.h2>

        {/* Cards Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Card 1: AI Recommendations */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
            <motion.div
              className="mb-4"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <AiOutlineRobot size={48} className="text-[#29224F]" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-600">
              Get AI recommended outfits based on your wardrobe.
            </p>
          </div>

          {/* Card 2: Effortless Management */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
            <motion.div
              className="mb-4"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FiSettings size={48} className="text-[#29224F]" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Effortless Management</h3>
            <p className="text-gray-600">
              Manage your wardrobe easily and effectively.
            </p>
          </div>

          {/* Card 3: Personalized Shopping */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
            <motion.div
              className="mb-4"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaShoppingBag size={48} className="text-[#29224F]" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Personalized Shopping</h3>
            <p className="text-gray-600">
              Purchase items according to your taste, saving you time.
            </p>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center bg-white rounded-lg shadow-md p-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-[#29224F] text-center md:text-left mb-4 md:mb-0 md:mr-6">
            Snap, Upload, & Discover Your Best Looks
          </h3>
          <div className="flex items-center">
            <label
              htmlFor="upload"
              className="bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Upload Here
            </label>
            <input
              id="upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </motion.div>

        {/* Display Selected File */}
        {selectedFile && (
          <div className="text-center mt-4 text-gray-500">
            Selected File: {selectedFile.name}
          </div>
        )}

        {/* Wardrobe Section Heading & Subtext */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Your Wardrobe But Better
          </h3>
          <p className="text-gray-600 text-lg md:text-xl">
            Manage and personalize your digital wardrobe effortlessly with Your Dressify Closet.
          </p>
        </motion.div>

        {/* Mobile Model Images Slider with Buttons */}
        <div className="block md:hidden mt-10">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {currentImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-0 z-20 bg-white p-2 rounded-full shadow"
              >
                <FiChevronLeft size={24} className="text-[#29224F]" />
              </button>
            )}
            {/* Animated Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <Image
                src={modelImages[currentImageIndex].src}
                alt={modelImages[currentImageIndex].alt}
                width={250}
                height={330}
                className="rounded-md shadow-md"
              />
              <p className="mt-2 text-lg font-medium text-black">
                {modelImages[currentImageIndex].caption}
              </p>
            </motion.div>
            {/* Right Arrow */}
            {currentImageIndex < modelImages.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-0 z-20 bg-white p-2 rounded-full shadow"
              >
                <FiChevronRight size={24} className="text-[#29224F]" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Model Images Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 mt-10">
          {/* Model 1 */}
          <div className="flex flex-col items-center">
            <Image
              src="/landing_img/model1.png"
              alt="Model 1"
              width={300}
              height={400}
              className="rounded-md shadow-md"
            />
            <motion.p
              className="mt-2 text-lg font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your Go-To Black Pants
            </motion.p>
          </div>
          {/* Model 2 */}
          <div className="flex flex-col items-center">
            <Image
              src="/landing_img/model2.png"
              alt="Model 2"
              width={300}
              height={400}
              className="rounded-md shadow-md"
            />
            <motion.p
              className="mt-2 text-lg font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Black Crop Tailored Jacket
            </motion.p>
          </div>
          {/* Model 3 */}
          <div className="flex flex-col items-center">
            <Image
              src="/landing_img/model3.png"
              alt="Model 3"
              width={300}
              height={400}
              className="rounded-md shadow-md"
            />
            <motion.p
              className="mt-2 text-lg font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Textured Sunset Shirt
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
