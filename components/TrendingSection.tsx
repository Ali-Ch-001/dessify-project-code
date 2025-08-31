"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// Product type
interface Product {
  id: number;
  title: string;
  price: string;
  rating: number;
  imgSrc: string;
}

// Categories and respective products
const productMap: Record<string, Product[]> = {
  HOT: [
    { id: 1, title: "Spread Collar Shirt", price: "$48.99", rating: 5.0, imgSrc: "/landing_img/shirt1.png" },
    { id: 2, title: "White Solid Formal Shirt", price: "$39.00", rating: 4.9, imgSrc: "/landing_img/shirt2.png" },
    { id: 3, title: "Shine On Me Blouse", price: "$34.50", rating: 4.8, imgSrc: "/landing_img/shirt3.png" },
    { id: 4, title: "Gray Solid Padded Jacket", price: "$52.00", rating: 4.7, imgSrc: "/landing_img/shirt4.png" },
    { id: 5, title: "Printed Loose T-shirt", price: "$39.99", rating: 5.0, imgSrc: "/landing_img/shirt5.png" },
    { id: 6, title: "Summer Wind Crop Shirt", price: "$29.50", rating: 4.8, imgSrc: "/landing_img/shirt6.png" },
    { id: 7, title: "Tailored Jacket", price: "$59.00", rating: 4.6, imgSrc: "/landing_img/shirt7.png" },
    { id: 8, title: "Solid Round Neck T-shirt", price: "$25.99", rating: 4.7, imgSrc: "/landing_img/shirt8.png" },
  ],
  SALE: [
    { id: 9, title: "Leather Handbag", price: "$69.99", rating: 4.4, imgSrc: "/landing_img/sale1.jpg" },
    { id: 10, title: "Summer Sunglasses", price: "$18.50", rating: 4.2, imgSrc: "/landing_img/sale2.jpg" },
    { id: 11, title: "Vintage Belt", price: "$14.00", rating: 4.0, imgSrc: "/landing_img/sale3.jpg" },
    { id: 12, title: "Denim Shorts", price: "$27.99", rating: 4.3, imgSrc: "/landing_img/sale4.jpg" },
    { id: 13, title: "Graphic Tee", price: "$22.00", rating: 4.1, imgSrc: "/landing_img/sale5.jpg" },
    { id: 14, title: "Crop Hoodie", price: "$35.00", rating: 4.5, imgSrc: "/landing_img/sale6.jpg" },
    { id: 15, title: "Tie Dye Dress", price: "$38.99", rating: 4.6, imgSrc: "/landing_img/sale7.jpg" },
    { id: 16, title: "Sleek Blazer", price: "$55.00", rating: 4.7, imgSrc: "/landing_img/sale8.jpg" },
  ],
  
  SHOES: [
    { id: 17, title: "Running Sneakers", price: "$60.00", rating: 4.5, imgSrc: "/landing_img/shoes1.jpg" },
    { id: 18, title: "Leather Boots", price: "$89.00", rating: 4.6, imgSrc: "/landing_img/shoes2.jpg" },
    { id: 19, title: "Strappy Heels", price: "$48.00", rating: 4.3, imgSrc: "/landing_img/shoes3.jpg" },
    { id: 20, title: "Slip-on Loafers", price: "$43.99", rating: 4.2, imgSrc: "/landing_img/shoes4.jpg" },
    { id: 21, title: "Platform Sandals", price: "$39.50", rating: 4.1, imgSrc: "/landing_img/shoes5.jpg" },
    { id: 22, title: "Canvas Sneakers", price: "$42.00", rating: 4.4, imgSrc: "/landing_img/shoes6.jpg" },
    { id: 23, title: "Ankle Boots", price: "$70.00", rating: 4.8, imgSrc: "/landing_img/shoes7.jpg" },
    { id: 24, title: "Mules", price: "$34.99", rating: 4.0, imgSrc: "/landing_img/shoes8.jpg" },
  ],
  
  ACCESSORIES: [
    { id: 25, title: "Gold Hoop Earrings", price: "$21.99", rating: 4.7, imgSrc: "/landing_img/acc1.jpg" },
    { id: 26, title: "Chunky Necklace", price: "$25.00", rating: 4.6, imgSrc: "/landing_img/acc2.jpg" },
    { id: 27, title: "Silk Scarf", price: "$17.50", rating: 4.2, imgSrc: "/landing_img/acc3.jpg" },
    { id: 28, title: "Wide Brim Hat", price: "$29.99", rating: 4.3, imgSrc: "/landing_img/acc4.jpg" },
    { id: 29, title: "Minimal Watch", price: "$59.99", rating: 4.9, imgSrc: "/landing_img/acc5.jpg" },
    { id: 30, title: "Tote Bag", price: "$28.00", rating: 4.1, imgSrc: "/landing_img/acc6.jpg" },
    { id: 31, title: "Cat-Eye Sunglasses", price: "$19.00", rating: 4.0, imgSrc: "/landing_img/acc7.jpg" },
    { id: 32, title: "Leather Wallet", price: "$26.50", rating: 4.4, imgSrc: "/landing_img/acc8.jpg" },
  ],
};

const categories = ["SALE", "HOT", "SHOES", "ACCESSORIES"];

const TrendingSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("HOT");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const products = productMap[activeCategory] || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const groupIntoSlides = (items: Product[]) => {
    const slides = [];
    for (let i = 0; i < items.length; i += 2) {
      slides.push(items.slice(i, i + 2));
    }
    return slides;
  };
  const mobileSlides = groupIntoSlides(products);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="w-full bg-gradient-to-b from-white via-indigo-50/30 to-white py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-0 relative z-10">
        {/* Enhanced heading with animation */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
             {/* <FaFire className="text-3xl text-purple-500" /> */}
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Top Trends These Days
            </h2>
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* <FaFire className="text-3xl text-purple-500" /> */}
            </motion.div>
          </motion.div>
          <p className="text-lg text-gray-600">Discover what&apos;s hot in fashion right now</p>
        </motion.div>

        {/* Enhanced category tabs */}
        <motion.div
          className="flex justify-center gap-4 mb-12 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentSlide(0);
              }}
              className={`relative px-6 py-3 font-bold text-lg rounded-full transition-all ${
                activeCategory === cat
                  ? "text-white"
                  : "text-gray-600 hover:text-[#29224F]"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background for active category */}
              {activeCategory === cat && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  layoutId="activeCategory"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
              {cat === "SALE" && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  -50%
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Mobile Slider with enhanced animations */}
        <div className="block md:hidden">
          <div className="relative flex items-center">
            <AnimatePresence>
              {currentSlide > 0 && (
                <motion.button
                  onClick={() => setCurrentSlide(currentSlide - 1)}
                  className="absolute left-0 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <FiChevronLeft size={24} className="text-[#29224F]" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <div className="w-full overflow-hidden px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex gap-4"
                >
                  {mobileSlides[currentSlide].map((product) => (
                    <motion.div
                      key={product.id}
                      className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="relative h-[250px] overflow-hidden">
                        <Image
                          src={product.imgSrc}
                          alt={product.title}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-xs font-bold">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-[#29224F]">
                          {product.title}
                        </h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {product.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <AnimatePresence>
              {currentSlide < mobileSlides.length - 1 && (
                <motion.button
                  onClick={() => setCurrentSlide(currentSlide + 1)}
                  className="absolute right-0 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FiChevronRight size={24} className="text-[#29224F]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Grid with 3D cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="relative group"
                variants={itemVariants}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden h-full"
                  whileHover={{
                    rotateY: 5,
                    rotateX: -5,
                    scale: 1.02,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image container with overlay */}
                  <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={product.imgSrc}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating badge */}
                    <motion.div
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-bold">{product.rating}</span>
                      </div>
                    </motion.div>
                    
                    {/* Action buttons */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
                      initial={{ y: 100 }}
                      animate={{ y: hoveredProduct === product.id ? 0 : 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiHeart size={20} />
                      </motion.button>
                      <motion.button
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiShoppingCart size={20} />
                      </motion.button>
                      <motion.button
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEye size={20} />
                      </motion.button>
                    </motion.div>
                  </div>
                  
                  {/* Product details */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-[#29224F] line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <motion.p
                        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                        animate={{
                          backgroundPosition: hoveredProduct === product.id ? ["0% 50%", "100% 50%"] : "0% 50%",
                        }}
                        transition={{ duration: 1 }}
                        style={{ backgroundSize: "200% auto" }}
                      >
                        {product.price}
                      </motion.p>
                      {activeCategory === "SALE" && (
                        <motion.span
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          SALE
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrendingSection;