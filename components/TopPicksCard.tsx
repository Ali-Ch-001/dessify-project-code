'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

interface TopPicksCardProps {
  image: string;
  title: string;
}

export default function TopPicksCard({ image, title }: TopPicksCardProps) {
  return (
    <motion.div
      className="group relative bg-white/80 backdrop-blur-sm border border-white/20 
                 shadow-lg shadow-black/5 rounded-2xl overflow-hidden"
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 }
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Heart size={16} className="text-red-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Eye size={16} className="text-blue-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ShoppingCart size={16} className="text-green-600" />
          </motion.button>
        </div>

        {/* Badge */}
        <motion.div
          className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Trending
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <motion.h3 
          className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h3>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </motion.svg>
            ))}
            <span className="text-sm text-gray-600 ml-1">(4.8)</span>
          </div>
          
          <motion.button
            className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            View Details →
          </motion.button>
        </motion.div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
