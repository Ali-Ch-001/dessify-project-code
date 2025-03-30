"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Dummy product data and categories
interface Product {
  id: number;
  title: string;
  price: string;
  rating: number;
  imgSrc: string;
}

const dummyProducts: Product[] = [
  { id: 1, title: "Spread Collar Shirt", price: "$48.99", rating: 5.0, imgSrc: "/landing_img/shirt1.png" },
  { id: 2, title: "White Solid Formal Shirt", price: "$39.00", rating: 4.9, imgSrc: "/landing_img/shirt2.png" },
  { id: 3, title: "Shine On Me Blouse", price: "$34.50", rating: 4.8, imgSrc: "/landing_img/shirt3.png" },
  { id: 4, title: "Gray Solid Padded Jacket", price: "$52.00", rating: 4.7, imgSrc: "/landing_img/shirt4.png" },
  { id: 5, title: "Printed Loose T-shirt", price: "$39.99", rating: 5.0, imgSrc: "/landing_img/shirt5.png" },
  { id: 6, title: "Summer Wind Crop Shirt", price: "$29.50", rating: 4.8, imgSrc: "/landing_img/shirt6.png" },
  { id: 7, title: "Tailored Jacket", price: "$59.00", rating: 4.6, imgSrc: "/landing_img/shirt7.png" },
  { id: 8, title: "Solid Round Neck T-shirt", price: "$25.99", rating: 4.7, imgSrc: "/landing_img/shirt8.png" },
];

const categories = ["SALE", "HOT", "SHOES", "ACCESSORIES"];

const TrendingSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("HOT");

  // (Optional) Filter products by activeCategory here if needed.
  // For now, we simply display dummyProducts.
  const products = dummyProducts;

  // --- Mobile Slider Logic (2 cards per slide) ---
  const groupIntoSlides = (items: Product[]) => {
    const slides = [];
    for (let i = 0; i < items.length; i += 2) {
      slides.push(items.slice(i, i + 2));
    }
    return slides;
  };
  const mobileSlides = groupIntoSlides(products);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < mobileSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 md:px-0">
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Top Trends These Days
        </motion.h2>

        {/* Category Tabs */}
        <motion.div
          className="flex justify-center space-x-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm sm:text-base md:text-lg font-semibold py-1 px-3 border-b-2 transition-colors ${
                activeCategory === cat
                  ? "border-[#29224F] text-[#29224F]"
                  : "border-transparent text-gray-500 hover:text-[#29224F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Mobile Slider: Shows 2 products per slide */}
        <div className="block md:hidden">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 z-20 bg-white p-2 rounded-full shadow"
              >
                <FiChevronLeft size={24} className="text-[#29224F]" />
              </button>
            )}
            <div className="w-full overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex gap-6"
              >
                {mobileSlides[currentSlide].map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center bg-white p-3 rounded-md shadow-sm flex-1"
                  >
                    <div className="w-full h-auto mb-3 flex justify-center">
                      <Image
                        src={product.imgSrc}
                        alt={product.title}
                        width={250}
                        height={330}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-medium text-center text-lg mb-1 text-black">
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-semibold">{product.price}</span>
                      <span>|</span>
                      <span>⭐ {product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            {/* Right Arrow */}
            {currentSlide < mobileSlides.length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-0 z-20 bg-white p-2 rounded-full shadow"
              >
                <FiChevronRight size={24} className="text-[#29224F]" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Grid: Shows 4 products per row */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex flex-col items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full h-auto mb-3 flex justify-center">
                <Image
                  src={product.imgSrc}
                  alt={product.title}
                  width={200}
                  height={250}
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="font-medium text-center text-lg mb-1 text-black">
                {product.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-semibold">{product.price}</span>
                <span>|</span>
                <span>⭐ {product.rating.toFixed(1)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
