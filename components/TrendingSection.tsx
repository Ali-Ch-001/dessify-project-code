"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 md:px-0">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Top Trends These Days
        </motion.h2>

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
              onClick={() => {
                setActiveCategory(cat);
                setCurrentSlide(0); // reset slider
              }}
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

        {/* Mobile Slider */}
        <div className="block md:hidden">
          <div className="relative flex items-center">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
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
                    <div className="w-full h-[300px] mb-3 flex justify-center items-center overflow-hidden rounded-md">
                    <Image
                        src={product.imgSrc}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
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
            {currentSlide < mobileSlides.length - 1 && (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="absolute right-0 z-20 bg-white p-2 rounded-full shadow"
              >
                <FiChevronRight size={24} className="text-[#29224F]" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex flex-col items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
            <div className="w-full h-[300px] mb-3 flex justify-center items-center overflow-hidden rounded-md">
            <Image
                src={product.imgSrc}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
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