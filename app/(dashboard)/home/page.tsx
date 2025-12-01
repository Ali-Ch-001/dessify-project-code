"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, TrendingUp, Calendar, Upload, Wand2, Shirt, Camera, Heart, ArrowRight, Clock, CloudRain, Palette } from "lucide-react";
import Link from "next/link";

type StyledLook = {
  id: string;
  image_url: string;
  created_at: string;
  occasion: string | null;
  weather: string | null;
  outfit_style: string | null;
  color_preference: string | null;
};

export default function HomePage() {
  const [displayName, setDisplayName] = useState<string>("User");
  const [uploadedItemsCount, setUploadedItemsCount] = useState<number>(0);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [styledLooks, setStyledLooks] = useState<StyledLook[]>([]);
  const [isLoadingStyledLooks, setIsLoadingStyledLooks] = useState<boolean>(true);
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

      // Fetch user profile
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

      // Fetch uploaded items count
      const { count, error: countErr } = await supabase
        .from("userwardrobe")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countErr) {
        console.error("Error fetching items count:", countErr);
      } else {
        setUploadedItemsCount(count || 0);
      }

      // Fetch styled looks
      fetchStyledLooks();
    })();
  }, []);

  // Fetch styled looks
  const fetchStyledLooks = async () => {
    setIsLoadingStyledLooks(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setIsLoadingStyledLooks(false);
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from("styled_looks")
        .select("id, image_url, created_at, occasion, weather, outfit_style, color_preference")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2);

      if (fetchErr) {
        console.error("Error fetching styled looks:", fetchErr);
      } else {
        setStyledLooks(data || []);
      }
    } catch (err) {
      console.error("Error fetching styled looks:", err);
    } finally {
      setIsLoadingStyledLooks(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatTagLabel = (value: string | null): string => {
    if (!value || value === "None") return "";
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Trigger compact mode after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCompact(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
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
        className={`relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 
                   rounded-2xl border border-white/50 shadow-xl shadow-black/5
                   ${isCompact ? 'p-4 sm:p-6' : 'p-6 sm:p-8'}`}
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        layout
        animate={{
          height: isCompact ? "auto" : "auto",
          scale: isCompact ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
          layout: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        }}
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
        
        <AnimatePresence mode="wait">
          {!isCompact ? (
            // Full layout
            <motion.div 
              key="full-layout"
              className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: -20,
                transition: { duration: 0.5, ease: "easeIn" }
              }}
            >
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
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome Back, {displayName}!
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
                  <Sparkles size={24} className="text-yellow-500" />
                </motion.div>
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
                  <Upload size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{uploadedItemsCount} Items Uploaded</span>
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
          </motion.div>
          ) : (
            // Compact layout
            <motion.div 
              key="compact-layout"
              className="relative z-10 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.2
                }
              }}
            >
            <motion.div 
              className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base text-purple-600 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Calendar size={16} className="sm:w-5 sm:h-5" />
              </motion.div>
              {today}
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div 
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <TrendingUp size={16} className="text-green-600 sm:w-4 sm:h-4" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700">12 Looks Created</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, delay: 0.7, repeat: Infinity }}
                >
                  <Upload size={16} className="text-blue-600 sm:w-4 sm:h-4" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700">{uploadedItemsCount} Items Uploaded</span>
              </motion.div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>
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

      {/* Quick Actions & Styled Looks Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Quick Actions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Generate Outfit Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/style_bot">
                <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 cursor-pointer overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles size={20} className="text-yellow-300" />
                  </motion.div>
                  <Wand2 size={32} className="mb-3 relative z-10" />
                  <h3 className="font-bold text-lg mb-1 relative z-10">Generate</h3>
                  <p className="text-sm text-purple-100 relative z-10">AI Outfit</p>
                </div>
              </Link>
            </motion.div>

            {/* Virtual Try-On Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/virtual_tryon">
                <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-pink-500/25 cursor-pointer overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                  <Camera size={32} className="mb-3 relative z-10" />
                  <h3 className="font-bold text-lg mb-1 relative z-10">Virtual</h3>
                  <p className="text-sm text-pink-100 relative z-10">Try-On</p>
                </div>
              </Link>
            </motion.div>

            {/* Upload Wardrobe Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/upload_wardrobe">
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 cursor-pointer overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                  <Upload size={32} className="mb-3 relative z-10" />
                  <h3 className="font-bold text-lg mb-1 relative z-10">Upload</h3>
                  <p className="text-sm text-blue-100 relative z-10">Wardrobe</p>
                </div>
              </Link>
            </motion.div>

            {/* Closet Manager Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/closet_manager">
                <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/25 cursor-pointer overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                  <Shirt size={32} className="mb-3 relative z-10" />
                  <h3 className="font-bold text-lg mb-1 relative z-10">Closet</h3>
                  <p className="text-sm text-emerald-100 relative z-10">Manager</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column - Styled Looks History */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Recent Styled Looks
              </h2>
            </div>
            {styledLooks.length > 0 && (
              <Link href="/styled_looks">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  View All
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            )}
          </div>

          {isLoadingStyledLooks ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : styledLooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 text-center border border-gray-200"
            >
              <Heart className="w-12 h-12 mx-auto mb-3 text-pink-300" />
              <h3 className="font-bold text-gray-800 mb-2">No Styled Looks Yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start saving your favorite outfits from Style Bot!
              </p>
              <Link href="/style_bot">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-lg font-semibold text-sm"
                >
                  Generate Outfits
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {styledLooks.map((look, index) => (
                <motion.div
                  key={look.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => window.location.href = '/styled_looks'}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={look.image_url}
                        alt="Styled look"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(look.created_at)}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {look.occasion && (
                          <div className="flex items-center gap-1 bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md text-xs">
                            <Calendar size={10} />
                            <span>{formatTagLabel(look.occasion)}</span>
                          </div>
                        )}
                        {look.weather && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs">
                            <CloudRain size={10} />
                            <span>{formatTagLabel(look.weather)}</span>
                          </div>
                        )}
                        {look.outfit_style && (
                          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md text-xs">
                            <Sparkles size={10} />
                            <span>{formatTagLabel(look.outfit_style)}</span>
                          </div>
                        )}
                        {look.color_preference && (
                          <div className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md text-xs">
                            <Palette size={10} />
                            <span>{formatTagLabel(look.color_preference)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-400 group-hover:text-pink-600 transition-colors"
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}