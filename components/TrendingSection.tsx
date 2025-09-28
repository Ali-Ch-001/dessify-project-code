"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye } from "react-icons/fi";
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
    { id: 1, title: "Spread Collar Shirt", price: "Rs 2,499", rating: 5.0, imgSrc: "/landing_img/shirt1.png" },
    { id: 2, title: "White Solid Formal Shirt", price: "Rs 1,899", rating: 4.9, imgSrc: "/landing_img/shirt2.png" },
    { id: 3, title: "Shine On Me Blouse", price: "Rs 1,699", rating: 4.8, imgSrc: "/landing_img/shirt3.png" },
    { id: 4, title: "Gray Solid Padded Jacket", price: "Rs 3,299", rating: 4.7, imgSrc: "/landing_img/shirt4.png" },
    { id: 5, title: "Printed Loose T-shirt", price: "Rs 1,599", rating: 5.0, imgSrc: "/landing_img/shirt5.png" },
    { id: 6, title: "Summer Wind Crop Shirt", price: "Rs 1,299", rating: 4.8, imgSrc: "/landing_img/shirt6.png" },
    { id: 7, title: "Tailored Jacket", price: "Rs 3,999", rating: 4.6, imgSrc: "/landing_img/shirt7.png" },
    { id: 8, title: "Solid Round Neck T-shirt", price: "Rs 1,199", rating: 4.7, imgSrc: "/landing_img/shirt8.png" },
  ],
  SALE: [
    { id: 9, title: "Leather Handbag", price: "Rs 4,499", rating: 4.4, imgSrc: "/landing_img/sale1.jpg" },
    { id: 10, title: "Summer Sunglasses", price: "Rs 1,599", rating: 4.2, imgSrc: "/landing_img/sale2.jpg" },
    { id: 11, title: "Vintage Belt", price: "Rs 1,299", rating: 4.0, imgSrc: "/landing_img/sale3.jpg" },
    { id: 12, title: "Denim Shorts", price: "Rs 1,799", rating: 4.3, imgSrc: "/landing_img/sale4.jpg" },
    { id: 13, title: "Graphic Tee", price: "Rs 1,399", rating: 4.1, imgSrc: "/landing_img/sale5.jpg" },
    { id: 14, title: "Crop Hoodie", price: "Rs 2,199", rating: 4.5, imgSrc: "/landing_img/sale6.jpg" },
    { id: 15, title: "Tie Dye Dress", price: "Rs 2,499", rating: 4.6, imgSrc: "/landing_img/sale7.jpg" },
    { id: 16, title: "Sleek Blazer", price: "Rs 3,599", rating: 4.7, imgSrc: "/landing_img/sale8.jpg" },
  ],
  
  SHOES: [
    { id: 17, title: "Running Sneakers", price: "Rs 3,999", rating: 4.5, imgSrc: "/landing_img/shoes1.jpg" },
    { id: 18, title: "Leather Boots", price: "Rs 4,999", rating: 4.6, imgSrc: "/landing_img/shoes2.jpg" },
    { id: 19, title: "Strappy Heels", price: "Rs 2,999", rating: 4.3, imgSrc: "/landing_img/shoes3.jpg" },
    { id: 20, title: "Slip-on Loafers", price: "Rs 2,799", rating: 4.2, imgSrc: "/landing_img/shoes4.jpg" },
    { id: 21, title: "Platform Sandals", price: "Rs 2,499", rating: 4.1, imgSrc: "/landing_img/shoes5.jpg" },
    { id: 22, title: "Canvas Sneakers", price: "Rs 2,699", rating: 4.4, imgSrc: "/landing_img/shoes6.jpg" },
    { id: 23, title: "Ankle Boots", price: "Rs 4,499", rating: 4.8, imgSrc: "/landing_img/shoes7.jpg" },
    { id: 24, title: "Mules", price: "Rs 2,199", rating: 4.0, imgSrc: "/landing_img/shoes8.jpg" },
  ],
  
  ACCESSORIES: [
    { id: 25, title: "Gold Hoop Earrings", price: "Rs 1,399", rating: 4.7, imgSrc: "/landing_img/acc1.jpg" },
    { id: 26, title: "Chunky Necklace", price: "Rs 1,599", rating: 4.6, imgSrc: "/landing_img/acc2.jpg" },
    { id: 27, title: "Silk Scarf", price: "Rs 1,199", rating: 4.2, imgSrc: "/landing_img/acc3.jpg" },
    { id: 28, title: "Wide Brim Hat", price: "Rs 1,899", rating: 4.3, imgSrc: "/landing_img/acc4.jpg" },
    { id: 29, title: "Minimal Watch", price: "Rs 3,799", rating: 4.9, imgSrc: "/landing_img/acc5.jpg" },
    { id: 30, title: "Tote Bag", price: "Rs 1,799", rating: 4.1, imgSrc: "/landing_img/acc6.jpg" },
    { id: 31, title: "Cat-Eye Sunglasses", price: "Rs 1,299", rating: 4.0, imgSrc: "/landing_img/acc7.jpg" },
    { id: 32, title: "Leather Wallet", price: "Rs 1,699", rating: 4.4, imgSrc: "/landing_img/acc8.jpg" },
  ],
};

const categories = ["SALE", "HOT", "SHOES", "ACCESSORIES"];

const TrendingSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("HOT");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const products = productMap[activeCategory] || [];
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const groupIntoSlides = (items: Product[]) => {
    // On mobile, show one larger card per slide for clarity
    const slides = [] as Product[][];
    for (let i = 0; i < items.length; i += 1) {
      slides.push(items.slice(i, i + 1));
    }
    return slides;
  };
  const mobileSlides = groupIntoSlides(products);

  const handleAddToCart = () => {
    // Redirect to sign in
    router.push('/sign-in');
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

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
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1,
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
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Top Trends These Days
            </h2>
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

        {/* Mobile Slider - single large card per slide for better legibility */}
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
            
      <div className="w-full overflow-hidden px-6">
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
            className="w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
                    >
            <div className="relative h-[320px] overflow-hidden">
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
            <div className="p-5">
            <h3 className="font-bold text-xl mb-2 text-[#29224F]">
                          {product.title}
                        </h3>
            <p className="text-3xl font-extrabold text-purple-600">
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
                    scale: 1.02,
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
                        onClick={handleAddToCart}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiShoppingCart size={20} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleViewProduct(product)}
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

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && selectedProduct && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProductModal}
            >
              <motion.div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4 sm:mx-0"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex flex-col sm:flex-row">
                  {/* Close button */}
                  <button
                    onClick={closeProductModal}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Product Image - Left Side */}
                  <div className="relative w-full sm:w-1/2 h-48 sm:h-full overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                    <Image
                      src={selectedProduct.imgSrc}
                      alt={selectedProduct.title}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    
                    {/* Rating badge */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-xs font-bold">{selectedProduct.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details - Right Side */}
                  <div className="w-full sm:w-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#29224F] mb-2">
                        {selectedProduct.title}
                      </h2>
                      
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {selectedProduct.price}
                        </p>
                        {activeCategory === "SALE" && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Product Description */}
                      <div className="mb-4">
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          Premium quality item from our trending collection. Perfect for any occasion.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <motion.button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiShoppingCart size={14} />
                        Add to Cart
                      </motion.button>
                      <motion.button
                        onClick={closeProductModal}
                        className="px-4 border-2 border-purple-300 text-[#29224F] py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 text-xs sm:text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrendingSection;