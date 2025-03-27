// src/components/TrendingSection.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: string;
  rating: number;
  imgSrc: string;
}

const dummyProducts: Product[] = [
  {
    id: 1,
    title: "Spread Collar Shirt",
    price: "$48.99",
    rating: 5.0,
    imgSrc: "/img/shirt1.png",
  },
  {
    id: 2,
    title: "White Solid Formal Shirt",
    price: "$39.00",
    rating: 4.9,
    imgSrc: "/img/shirt2.png",
  },
  {
    id: 3,
    title: "Shine On Me Blouse",
    price: "$34.50",
    rating: 4.8,
    imgSrc: "/img/shirt3.png",
  },
  {
    id: 4,
    title: "Gray Solid Padded Jacket",
    price: "$52.00",
    rating: 4.7,
    imgSrc: "/img/shirt4.png",
  },
  {
    id: 5,
    title: "Printed Loose T-shirt",
    price: "$39.99",
    rating: 5.0,
    imgSrc: "/img/shirt5.png",
  },
  {
    id: 6,
    title: "Summer Wind Crop Shirt",
    price: "$29.50",
    rating: 4.8,
    imgSrc: "/img/shirt6.png",
  },
  {
    id: 7,
    title: "Tailored Jacket",
    price: "$59.00",
    rating: 4.6,
    imgSrc: "/img/shirt7.png",
  },
  {
    id: 8,
    title: "Solid Round Neck T-shirt",
    price: "$25.99",
    rating: 4.7,
    imgSrc: "/img/shirt8.png",
  },
];

const categories = ["SALE", "HOT", "SHOES", "ACCESSORIES"];

const TrendingSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("HOT");
  // In a real app, you’d filter products by category, but here we’ll just show dummy data

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
              className={`text-sm sm:text-base md:text-lg font-semibold py-1 px-3 border-b-2 transition-colors ${
                activeCategory === cat
                  ? "border-[#29224F] text-[#29224F]"
                  : "border-transparent text-gray-500 hover:text-[#29224F]"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {dummyProducts.map((product) => (
              <motion.div
                key={product.id}
                className="flex flex-col items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Product Image */}
                <div className="w-full h-auto mb-3 flex justify-center">
                  <Image
                    src={product.imgSrc}
                    alt={product.title}
                    width={200}
                    height={250}
                    className="object-cover rounded-md"
                  />
                </div>
                {/* Product Title */}
                <h3 className="font-medium text-center text-sm sm:text-base md:text-lg mb-1">
                  {product.title}
                </h3>
                {/* Price & Rating */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-gray-600">
                  <span className="font-semibold">{product.price}</span>
                  <span>|</span>
                  <span>⭐ {product.rating.toFixed(1)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrendingSection;
