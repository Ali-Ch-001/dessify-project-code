'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Eye,
  Tag,
  Calendar,
  CloudRain,
  Palette,
  Plus,
  Minus,
  X,
  CheckCircle
} from 'lucide-react';

interface Product {
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

interface CartItem {
  product: Product;
  quantity: number;
}

const ShopYourStyle = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; phone?: string; address?: string; city?: string; postal_code?: string } } | null>(null);
  const [showPreviousOrders, setShowPreviousOrders] = useState(false);
  const [previousOrders, setPreviousOrders] = useState<Array<{
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    payment_method: string;
    total_amount: number;
    status: string;
    created_at: string;
    order_items?: Array<{
      product_name: string;
      quantity: number;
      price: number;
    }>;
  }>>([]);
  const authReady = useRequireAuth();

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'];
  const occasions = ['Casual', 'Formal', 'Party', 'Work', 'Wedding', 'Date Night', 'Travel'];
  const weather = ['Summer', 'Winter', 'Spring', 'Fall', 'Rainy', 'Hot', 'Cold'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray'];

  // Fetch user data
  useEffect(() => {
    if (authReady) {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      };
      getUser();
    }
  }, [authReady]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Occasion filter
    if (selectedOccasion) {
      filtered = filtered.filter(product => product.occasion === selectedOccasion);
    }

    // Weather filter
    if (selectedWeather) {
      filtered = filtered.filter(product => product.weather === selectedWeather);
    }

    // Color filter
    if (selectedColor) {
      filtered = filtered.filter(product => product.color === selectedColor);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedOccasion, selectedWeather, selectedColor, sortBy]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const addToCart = async (product: Product) => {
    setAddingToCart(product.id);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    setAddingToCart(null);
    setAddedToCart(product.id);
    
    // Clear success state after 2 seconds
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const fetchPreviousOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPreviousOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedOccasion('');
    setSelectedWeather('');
    setSelectedColor('');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedOccasion) count++;
    if (selectedWeather) count++;
    if (selectedColor) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 mb-4 mx-4 md:mx-6"
      >
        {/* Search, Filters, Sort and Cart */}
        <div className="space-y-3 lg:space-y-0 lg:flex lg:flex-row lg:gap-4">
          {/* Search Bar - Full Width on Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 lg:pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>

          {/* Mobile Controls Row */}
          <div className="flex gap-2 lg:gap-3">
            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 bg-white border border-gray-300 px-3 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors text-sm lg:text-base lg:px-4 lg:py-3 lg:flex-none lg:gap-2"
            >
              <Filter className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden xs:inline lg:inline">Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-purple-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center ml-1">
                  {getActiveFiltersCount()}
                </span>
              )}
            </motion.button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-white border border-gray-300 px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base lg:px-4 lg:py-3 lg:flex-none lg:min-w-[140px]"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Previous Orders Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                fetchPreviousOrders();
                setShowPreviousOrders(true);
              }}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base lg:px-4 lg:py-3 lg:flex-none lg:gap-2"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden xs:inline lg:inline">Orders</span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(true)}
              className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm lg:text-base lg:px-4 lg:py-3 lg:flex-none lg:gap-2"
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden xs:inline lg:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                >
                  <option value="">All Occasions</option>
                  {occasions.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
                <select
                  value={selectedWeather}
                  onChange={(e) => setSelectedWeather(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                >
                  <option value="">All Weather</option>
                  {weather.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                >
                  <option value="">All Colors</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium text-base"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Products Grid */}
      <div className="px-4 md:px-6">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative">
                  {product.image_urls.length > 0 && (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.product_name}
                      width={400}
                      height={224}
                      className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Heart className="w-3 h-3 md:w-4 md:h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedProduct(product)}
                        className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-600 hover:text-blue-500 transition-colors" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Sale Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                      NEW
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <h3 className="font-semibold text-sm md:text-base mb-3 line-clamp-2 text-gray-800">{product.product_name}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg md:text-xl font-bold text-green-600">Rs {product.price}</span>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{product.category}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {product.occasion && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{product.occasion}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-400" />
                        <span>{product.color}</span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: (addingToCart === product.id || addedToCart === product.id) ? 1 : 1.02 }}
                    whileTap={{ scale: (addingToCart === product.id || addedToCart === product.id) ? 1 : 0.98 }}
                    onClick={() => addToCart(product)}
                    disabled={addingToCart === product.id || addedToCart === product.id}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base relative overflow-hidden ${
                      addingToCart === product.id
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                        : addedToCart === product.id
                        ? 'bg-gradient-to-r from-green-500 to-green-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Adding...
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </>
                    ) : addedToCart === product.id ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Added!
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-30"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 0] }}
                          transition={{ duration: 0.6 }}
                        />
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </motion.div>
                        <span>Add to Cart</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Product Details
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="relative">
                    <Image
                      src={selectedProduct.image_urls[0] || '/placeholder.jpg'}
                      alt={selectedProduct.product_name}
                      width={600}
                      height={384}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  {selectedProduct.image_urls.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {selectedProduct.image_urls.slice(1, 5).map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`${selectedProduct.product_name} ${index + 2}`}
                          width={100}
                          height={80}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
    <div>
                  <h3 className="text-3xl font-bold mb-4">{selectedProduct.product_name}</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-green-600">Rs {selectedProduct.price}</span>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">{selectedProduct.category}</span>
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Category:</span>
                      <span className="text-gray-600">{selectedProduct.category}</span>
                    </div>
                    {selectedProduct.occasion && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">Occasion:</span>
                        <span className="text-gray-600">{selectedProduct.occasion}</span>
                      </div>
                    )}
                    {selectedProduct.weather && (
                      <div className="flex items-center gap-3">
                        <CloudRain className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">Weather:</span>
                        <span className="text-gray-600">{selectedProduct.weather}</span>
                      </div>
                    )}
                    {selectedProduct.color && (
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">Color:</span>
                        <span className="text-gray-600">{selectedProduct.color}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: (addingToCart === selectedProduct.id || addedToCart === selectedProduct.id) ? 1 : 1.02 }}
                      whileTap={{ scale: (addingToCart === selectedProduct.id || addedToCart === selectedProduct.id) ? 1 : 0.98 }}
                      onClick={() => addToCart(selectedProduct)}
                      disabled={addingToCart === selectedProduct.id || addedToCart === selectedProduct.id}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                        addingToCart === selectedProduct.id
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-white'
                          : addedToCart === selectedProduct.id
                          ? 'bg-gradient-to-r from-green-500 to-green-600 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      }`}
                    >
                      {addingToCart === selectedProduct.id ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            Adding...
                          </motion.span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </>
                      ) : addedToCart === selectedProduct.id ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            Added!
                          </motion.span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-30"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 0] }}
                            transition={{ duration: 0.6 }}
                          />
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </motion.div>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Add some products to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <Image
                          src={item.product.image_urls[0] || '/placeholder.jpg'}
                          alt={item.product.product_name}
                          width={64}
                          height={64}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs md:text-sm mb-1 truncate">{item.product.product_name}</h4>
                          <p className="text-green-600 font-bold text-sm">Rs {item.product.price}</p>
                          <div className="flex items-center gap-1 md:gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 bg-white rounded text-xs md:text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-green-600">Rs {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Previous Orders Modal */}
      {showPreviousOrders && (
        <PreviousOrdersModal
          orders={previousOrders}
          onClose={() => setShowPreviousOrders(false)}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          totalPrice={getTotalPrice()}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            setCart([]);
            setShowCart(false);
          }}
          user={user}
        />
      )}
    </div>
  );
};

// Previous Orders Modal Component
const PreviousOrdersModal = ({ orders, onClose }: {
  orders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    payment_method: string;
    total_amount: number;
    status: string;
    created_at: string;
    order_items?: Array<{
      product_name: string;
      quantity: number;
      price: number;
    }>;
  }>;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Previous Orders
              </h2>
              <p className="text-gray-600 mt-1">Your order history</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600">You haven&apos;t placed any orders yet. Start shopping to see your orders here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">Order #{order.order_number}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">Rs {order.total_amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600 capitalize">{order.payment_method.replace('_', ' ')}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((item: { product_name: string; quantity: number; price: number }, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                        <span className="font-medium">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No items found</p>}
                  </div>

                  <div className="border-t pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Customer:</span>
                        <p className="text-gray-600">{order.customer_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-600">{order.customer_phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-600">{order.shipping_address}, {order.city} {order.postal_code}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Checkout Modal Component
const CheckoutModal = ({ cart, totalPrice, onClose, onSuccess, user }: {
  cart: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onSuccess: () => void;
  user: { id: string; email?: string; user_metadata?: { full_name?: string; phone?: string; address?: string; city?: string; postal_code?: string } } | null;
}) => {
  const [formData, setFormData] = useState({
    customer_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    customer_email: user?.email || '',
    customer_phone: user?.user_metadata?.phone || '',
    shipping_address: user?.user_metadata?.address || '',
    city: user?.user_metadata?.city || '',
    postal_code: user?.user_metadata?.postal_code || '',
    payment_method: 'cash_on_delivery'
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        order_number: `ORD-${Date.now()}`,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.product_name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: totalPrice,
        ...formData
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      setOrderSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase. We&apos;ll process your order soon.</p>
          <div className="animate-pulse">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto mx-4"
      >
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Checkout
              </h2>
              <p className="text-gray-600 mt-1">Complete your order</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Contact & Shipping Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address *
                  </label>
                  <textarea
                    value={formData.shipping_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, shipping_address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Enter your complete address..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Karachi, Lahore, Islamabad..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="75000"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Payment Method
              </h3>
              <div className="space-y-3">
                <motion.label 
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.payment_method === 'cash_on_delivery' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash_on_delivery"
                    checked={formData.payment_method === 'cash_on_delivery'}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                  <div className="text-green-600 font-semibold">✓</div>
                </motion.label>
                
                <motion.label 
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.payment_method === 'online_transfer' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="online_transfer"
                    checked={formData.payment_method === 'online_transfer'}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Online Transfer</div>
                    <div className="text-sm text-gray-600">Bank transfer or mobile banking</div>
                  </div>
                  <div className="text-blue-600 font-semibold">💳</div>
                </motion.label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.product.product_name} x{item.quantity}</span>
                    <span className="font-medium">Rs {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">Rs {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Place Order
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShopYourStyle;
