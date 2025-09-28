"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiEye, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import FooterSection from "@/components/FooterSection";

// Product type for landing page products
interface LandingProduct {
  id: number;
  title: string;
  price: string;
  rating: number;
  imgSrc: string;
  category: string;
}

// Product type for Supabase products
interface SupabaseProduct {
  id: string;
  product_name: string;
  price: number;
  description: string;
  category: string;
  occasion: string;
  weather: string;
  color: string;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
}

// Landing page products data
const landingProducts: LandingProduct[] = [
  // HOT category
  { id: 1, title: "Spread Collar Shirt", price: "Rs 2,499", rating: 5.0, imgSrc: "/landing_img/shirt1.png", category: "HOT" },
  { id: 2, title: "White Solid Formal Shirt", price: "Rs 1,899", rating: 4.9, imgSrc: "/landing_img/shirt2.png", category: "HOT" },
  { id: 3, title: "Shine On Me Blouse", price: "Rs 1,699", rating: 4.8, imgSrc: "/landing_img/shirt3.png", category: "HOT" },
  { id: 4, title: "Gray Solid Padded Jacket", price: "Rs 3,299", rating: 4.7, imgSrc: "/landing_img/shirt4.png", category: "HOT" },
  { id: 5, title: "Printed Loose T-shirt", price: "Rs 1,599", rating: 5.0, imgSrc: "/landing_img/shirt5.png", category: "HOT" },
  { id: 6, title: "Summer Wind Crop Shirt", price: "Rs 1,299", rating: 4.8, imgSrc: "/landing_img/shirt6.png", category: "HOT" },
  { id: 7, title: "Tailored Jacket", price: "Rs 3,999", rating: 4.6, imgSrc: "/landing_img/shirt7.png", category: "HOT" },
  { id: 8, title: "Solid Round Neck T-shirt", price: "Rs 1,199", rating: 4.7, imgSrc: "/landing_img/shirt8.png", category: "HOT" },
  
  // SALE category
  { id: 9, title: "Leather Handbag", price: "Rs 4,499", rating: 4.4, imgSrc: "/landing_img/sale1.jpg", category: "SALE" },
  { id: 10, title: "Summer Sunglasses", price: "Rs 1,599", rating: 4.2, imgSrc: "/landing_img/sale2.jpg", category: "SALE" },
  { id: 11, title: "Vintage Belt", price: "Rs 1,299", rating: 4.0, imgSrc: "/landing_img/sale3.jpg", category: "SALE" },
  { id: 12, title: "Denim Shorts", price: "Rs 1,799", rating: 4.3, imgSrc: "/landing_img/sale4.jpg", category: "SALE" },
  { id: 13, title: "Graphic Tee", price: "Rs 1,399", rating: 4.1, imgSrc: "/landing_img/sale5.jpg", category: "SALE" },
  { id: 14, title: "Crop Hoodie", price: "Rs 2,199", rating: 4.5, imgSrc: "/landing_img/sale6.jpg", category: "SALE" },
  { id: 15, title: "Tie Dye Dress", price: "Rs 2,499", rating: 4.6, imgSrc: "/landing_img/sale7.jpg", category: "SALE" },
  { id: 16, title: "Sleek Blazer", price: "Rs 3,599", rating: 4.7, imgSrc: "/landing_img/sale8.jpg", category: "SALE" },
  
  // SHOES category
  { id: 17, title: "Running Sneakers", price: "Rs 3,999", rating: 4.5, imgSrc: "/landing_img/shoes1.jpg", category: "SHOES" },
  { id: 18, title: "Leather Boots", price: "Rs 4,999", rating: 4.6, imgSrc: "/landing_img/shoes2.jpg", category: "SHOES" },
  { id: 19, title: "Strappy Heels", price: "Rs 2,999", rating: 4.3, imgSrc: "/landing_img/shoes3.jpg", category: "SHOES" },
  { id: 20, title: "Slip-on Loafers", price: "Rs 2,799", rating: 4.2, imgSrc: "/landing_img/shoes4.jpg", category: "SHOES" },
  { id: 21, title: "Platform Sandals", price: "Rs 2,499", rating: 4.1, imgSrc: "/landing_img/shoes5.jpg", category: "SHOES" },
  { id: 22, title: "Canvas Sneakers", price: "Rs 2,699", rating: 4.4, imgSrc: "/landing_img/shoes6.jpg", category: "SHOES" },
  { id: 23, title: "Ankle Boots", price: "Rs 4,499", rating: 4.8, imgSrc: "/landing_img/shoes7.jpg", category: "SHOES" },
  { id: 24, title: "Mules", price: "Rs 2,199", rating: 4.0, imgSrc: "/landing_img/shoes8.jpg", category: "SHOES" },
  
  // ACCESSORIES category
  { id: 25, title: "Gold Hoop Earrings", price: "Rs 1,399", rating: 4.7, imgSrc: "/landing_img/acc1.jpg", category: "ACCESSORIES" },
  { id: 26, title: "Chunky Necklace", price: "Rs 1,599", rating: 4.6, imgSrc: "/landing_img/acc2.jpg", category: "ACCESSORIES" },
  { id: 27, title: "Silk Scarf", price: "Rs 1,199", rating: 4.2, imgSrc: "/landing_img/acc3.jpg", category: "ACCESSORIES" },
  { id: 28, title: "Wide Brim Hat", price: "Rs 1,899", rating: 4.3, imgSrc: "/landing_img/acc4.jpg", category: "ACCESSORIES" },
  { id: 29, title: "Minimal Watch", price: "Rs 3,799", rating: 4.9, imgSrc: "/landing_img/acc5.jpg", category: "ACCESSORIES" },
  { id: 30, title: "Tote Bag", price: "Rs 1,799", rating: 4.1, imgSrc: "/landing_img/acc6.jpg", category: "ACCESSORIES" },
  { id: 31, title: "Cat-Eye Sunglasses", price: "Rs 1,299", rating: 4.0, imgSrc: "/landing_img/acc7.jpg", category: "ACCESSORIES" },
  { id: 32, title: "Leather Wallet", price: "Rs 1,699", rating: 4.4, imgSrc: "/landing_img/acc8.jpg", category: "ACCESSORIES" },
];

const categories = ["ALL", "HOT", "SALE", "SHOES", "ACCESSORIES"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [supabaseProducts, setSupabaseProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<LandingProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const router = useRouter();

  // Fetch user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setSupabaseProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category and search
  const filteredProducts = React.useMemo(() => {
    let products = [...landingProducts];
    
    // Add Supabase products
    const supabaseProductsFormatted = supabaseProducts.map(product => ({
      id: parseInt(product.id.replace(/\D/g, '')) + 1000, // Ensure unique IDs
      title: product.product_name,
      price: `Rs ${product.price.toFixed(2)}`,
      rating: 4.5, // Default rating for Supabase products
      imgSrc: product.image_urls[0] || '/landing_img/shirt1.png',
      category: product.category.toUpperCase(),
      isSupabase: true,
      supabaseId: product.id
    }));
    
    products = [...products, ...supabaseProductsFormatted];

    // Filter by category
    if (activeCategory !== "ALL") {
      products = products.filter(product => product.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [activeCategory, searchQuery, supabaseProducts]);

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push('/sign-in');
    } else {
      // Redirect to shop your style page in dashboard
      router.push('/shop_your_style');
    }
  };

  const handleViewProduct = (product: LandingProduct) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] via-white to-[#FCE7F3]">
      {/* Header */}
      <motion.section 
        className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 leading-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-[#29224F] via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Our Products
              </span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-[#29224F]/80 leading-relaxed max-w-3xl mx-auto mb-4 px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover our curated collection of fashion items
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        className="py-4 sm:py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <motion.div
            className="flex justify-center gap-1.5 sm:gap-2 lg:gap-4 mb-6 sm:mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 font-bold text-xs sm:text-sm lg:text-lg rounded-full transition-all ${
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
                {activeCategory === cat && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section 
        className="py-4 sm:py-6 lg:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="relative group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  {/* Image container */}
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={product.imgSrc}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-xs font-bold">{product.rating}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => handleAddToCart()}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiShoppingCart size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleViewProduct(product)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEye size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 text-[#29224F] line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {product.price}
                      </p>
                      {product.category === "SALE" && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          SALE
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </motion.section>

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
                      {selectedProduct.category === "SALE" && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Product Description */}
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        Premium quality item from our {selectedProduct.category.toLowerCase()} collection. Perfect for any occasion.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      onClick={() => handleAddToCart()}
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

      {/* Footer */}
      <FooterSection />
    </div>
  );
}