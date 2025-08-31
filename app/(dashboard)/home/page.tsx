"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import TopPicksCard from "@/components/TopPicksCard";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, TrendingUp, Calendar, Zap } from "lucide-react";

export default function HomePage() {
  const [displayName, setDisplayName] = useState<string>("User");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        console.error("Auth error fetching user:", authErr);
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        setDisplayName(user.email ?? "User");
      } else {
        setDisplayName(profile.display_name ?? user.email ?? "User");
      }
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 
                   rounded-2xl p-6 sm:p-8 border border-white/50 shadow-xl shadow-black/5"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background decoration */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl sm:blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 flex-1">
            <motion.div
              className="flex items-center gap-2 text-xs sm:text-sm text-purple-600 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              {today}
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome Back, {displayName}! ✨
            </motion.h1>
            
            <motion.p 
              className="text-sm sm:text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Ready to dazzle? Tell me what&apos;s your mood today and let&apos;s find your perfect outfit!
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <TrendingUp size={14} className="text-green-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">12 Looks Created</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <Zap size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">5 Items Uploaded</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="relative w-full lg:w-80 h-48 sm:h-64 lg:h-48"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Image
              src="/dashboard_img/homepage.png"
              alt="Welcome"
              fill
              className="object-contain rounded-xl"
              priority
            />
            {/* Floating sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Sparkles size={16} className="text-yellow-400 sm:w-5 sm:h-5" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Features Card */}
      <motion.div
        className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 
                   rounded-2xl p-4 sm:p-6 text-center text-white shadow-xl shadow-purple-500/25"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 rounded-2xl" />
        
        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-2 sm:mb-3"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Sparkles size={20} className="text-yellow-300 sm:w-6 sm:h-6" />
          </motion.div>
          
          <motion.h2 
            className="text-lg sm:text-xl font-bold mb-1 sm:mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover Your Best Look with AI
          </motion.h2>
          
          <motion.p 
            className="text-purple-100 mb-3 sm:mb-4 text-xs sm:text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Get personalized recommendations and try on clothes virtually
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => window.location.href = '/style_bot'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-none sm:min-w-[140px]"
            >
              <Sparkles size={14} />
              Start Chat
            </motion.button>
            
            <motion.button
              onClick={() => window.location.href = '/virtual_tryon'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/30 flex-1 sm:flex-none sm:min-w-[140px]"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Virtual Try-On
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Picks Section */}
      <motion.div variants={itemVariants}>
        <motion.div
          className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Top Picks For You Today!
          </h2>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Sparkles size={16} className="text-yellow-500 sm:w-5 sm:h-5" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <TopPicksCard image="/dashboard_img/loading.png" title="Sunny Escape" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TopPicksCard image="/dashboard_img/loading.png" title="City Slick" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TopPicksCard image="/dashboard_img/loading.png" title="Neutral Charm" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TopPicksCard image="/dashboard_img/loading.png" title="Pop of Pattern" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
