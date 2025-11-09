"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/lib/useRequireAuth";
import {
  Sparkles,
  Wand2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Filter,
  X,
  Download,
  Share2,
  ZoomIn,
  RefreshCw,
  Shirt,
  Calendar,
  CloudRain,
  Palette,
  Ruler,
  Layers,
  Sun,
  Clock,
  DollarSign,
  User,
} from "lucide-react";

type WardrobeItem = {
  id: string;
  image_url: string;
  category: string;
};

type RecommendationParams = {
  occasion: string;
  weather: string;
  num_outfits: number;
  outfit_style: string;
  color_preference: string;
  fit_preference: string;
  material_preference: string;
  season: string;
  time_of_day: string;
  budget: string;
  personal_style: string;
};

type RecommendationResult = {
  outfitImages: string[];
  outfitDetails: any;
};

// Helper function to format tag values for display
const formatTagLabel = (value: string): string => {
  if (value === "None") return "None";
  // Replace underscores with spaces and capitalize each word
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Tag options matching the Gradio API specification exactly
const TAG_OPTIONS = {
  occasion: [
    "casual",
    "business",
    "formal",
    "semi_formal",
    "business_casual",
    "cocktail",
    "wedding",
    "party",
    "date",
    "sport",
    "workout",
    "travel",
    "beach",
    "outdoor",
    "night_out",
    "brunch",
    "dinner",
    "meeting",
    "interview",
    "cultural",
    "traditional",
  ],
  weather: [
    "any",
    "hot",
    "warm",
    "mild",
    "cool",
    "cold",
    "freezing",
    "rain",
    "snow",
    "windy",
    "humid",
    "sunny",
    "cloudy",
  ],
  outfit_style: [
    "casual",
    "smart_casual",
    "formal",
    "sporty",
    "athletic",
    "streetwear",
    "minimalist",
    "classic",
    "modern",
    "elegant",
    "sophisticated",
    "traditional",
    "ethnic",
  ],
  color_preference: [
    "None",
    "neutral",
    "monochromatic",
    "monochrome",
    "complementary",
    "bold",
    "subtle",
    "bright",
    "muted",
    "pastel",
    "dark",
    "light",
    "earth_tones",
    "jewel_tones",
    "black_white",
    "navy_white",
    "colorful",
    "minimal_color",
  ],
  fit_preference: [
    "None",
    "fitted",
    "loose",
    "oversized",
    "relaxed",
    "comfortable",
    "structured",
    "flowy",
    "tailored",
    "athletic_fit",
    "regular_fit",
  ],
  material_preference: [
    "None",
    "cotton",
    "linen",
    "silk",
    "wool",
    "cashmere",
    "denim",
    "leather",
    "breathable",
    "waterproof",
    "moisture_wicking",
    "sustainable",
  ],
  season: [
    "None",
    "spring",
    "summer",
    "fall",
    "autumn",
    "winter",
    "year_round",
    "transitional",
  ],
  time_of_day: [
    "None",
    "morning",
    "afternoon",
    "evening",
    "night",
    "all_day",
  ],
  budget: [
    "None",
    "luxury",
    "premium",
    "mid_range",
    "affordable",
    "budget",
    "value",
  ],
  personal_style: [
    "None",
    "conservative",
    "moderate",
    "bold",
    "experimental",
    "traditional",
    "trendy",
    "timeless",
    "fashion_forward",
    "classic",
    "eclectic",
  ],
};

export default function StyleBotPage() {
  const authReady = useRequireAuth();
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [isLoadingWardrobe, setIsLoadingWardrobe] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Recommendation parameters
  const [params, setParams] = useState<RecommendationParams>({
    occasion: "casual",
    weather: "any",
    num_outfits: 3,
    outfit_style: "casual",
    color_preference: "None",
    fit_preference: "None",
    material_preference: "None",
    season: "None",
    time_of_day: "None",
    budget: "None",
    personal_style: "None",
  });

  // Fetch user's wardrobe
  // IMPORTANT: Only fetch once on mount, do NOT refetch after recommendations
  // to prevent showing duplicates if backend auto-saves uploaded files
  const fetchWardrobe = useCallback(async () => {
    setIsLoadingWardrobe(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setError("Please log in to access your wardrobe");
        return;
      }

      const { data: items, error: fetchErr } = await supabase
        .from("userwardrobe")
        .select("id, image_url, category")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // Order by creation date

      if (fetchErr) {
        throw fetchErr;
      }

      // Remove duplicates based on image_url to prevent showing same items multiple times
      const uniqueItems = items?.filter((item, index, self) => 
        index === self.findIndex((t) => t.image_url === item.image_url)
      ) || [];

      setWardrobeItems(uniqueItems);
      console.log(`Loaded ${uniqueItems.length} unique wardrobe items${items && items.length !== uniqueItems.length ? ` (${items.length - uniqueItems.length} duplicates removed)` : ''}`);
      
      if (uniqueItems.length === 0) {
        setError("Your wardrobe is empty. Please upload some items first.");
      }
    } catch (err) {
      console.error("Error fetching wardrobe:", err);
      setError("Failed to load wardrobe items");
    } finally {
      setIsLoadingWardrobe(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) {
      fetchWardrobe();
    }
    // Only fetch once when auth is ready, don't refetch on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  // Convert wardrobe image URLs to Files
  const convertWardrobeToFiles = async (): Promise<File[]> => {
    const files: File[] = [];

    console.log(`Converting ${wardrobeItems.length} wardrobe items to files...`);

    for (const item of wardrobeItems) {
      try {
        const response = await fetch(item.image_url);
        if (!response.ok) {
          console.warn(`Failed to fetch image ${item.id}:`, response.status);
          continue;
        }
        const blob = await response.blob();
        
        // Determine correct file extension from MIME type or URL
        let extension = "jpg"; // default
        const mimeType = blob.type.toLowerCase();
        
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
          extension = "jpg";
        } else if (mimeType.includes("png")) {
          extension = "png";
        } else if (mimeType.includes("webp")) {
          extension = "webp";
        } else if (mimeType.includes("gif")) {
          extension = "gif";
        } else {
          // Try to extract from URL
          const urlExtension = item.image_url.split(".").pop()?.toLowerCase();
          if (urlExtension && ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "tif"].includes(urlExtension)) {
            extension = urlExtension === "jpeg" ? "jpg" : urlExtension;
          }
        }
        
        // Ensure MIME type is set correctly
        const correctMimeType = extension === "jpg" || extension === "jpeg" 
          ? "image/jpeg" 
          : extension === "png" 
          ? "image/png"
          : extension === "webp"
          ? "image/webp"
          : extension === "gif"
          ? "image/gif"
          : blob.type || "image/jpeg";
        
        const file = new File(
          [blob],
          `wardrobe-${item.id}.${extension}`,
          { type: correctMimeType }
        );
        
        files.push(file);
        console.log(`Successfully converted item ${item.id} (${item.category}) - ${extension}, ${correctMimeType}`);
      } catch (err) {
        console.error(`Error converting wardrobe item ${item.id}:`, err);
      }
    }

    console.log(`Successfully converted ${files.length} out of ${wardrobeItems.length} items`);
    return files;
  };

  // Generate recommendations
  const generateRecommendations = async () => {
    if (wardrobeItems.length === 0) {
      setError("Please upload some items to your wardrobe first");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
      // Validate minimum wardrobe size
      if (wardrobeItems.length < 2) {
        throw new Error("You need at least 2 items in your wardrobe to generate outfit recommendations");
      }

      // Convert wardrobe to files
      const wardrobeFiles = await convertWardrobeToFiles();
      
      if (wardrobeFiles.length === 0) {
        throw new Error("Failed to load wardrobe images");
      }

      if (wardrobeFiles.length < 2) {
        throw new Error(`Only ${wardrobeFiles.length} wardrobe image(s) could be loaded. You need at least 2 items to generate outfits.`);
      }

      console.log(`Sending ${wardrobeFiles.length} wardrobe files to API...`);

      // Prepare form data
      const formData = new FormData();
      wardrobeFiles.forEach((file, index) => {
        formData.append("files", file);
        console.log(`Added file ${index + 1}: ${file.name} (${file.size} bytes)`);
      });
      formData.append("occasion", params.occasion);
      formData.append("weather", params.weather);
      formData.append("num_outfits", params.num_outfits.toString());
      formData.append("outfit_style", params.outfit_style);
      formData.append("color_preference", params.color_preference);
      formData.append("fit_preference", params.fit_preference);
      formData.append("material_preference", params.material_preference);
      formData.append("season", params.season);
      formData.append("time_of_day", params.time_of_day);
      formData.append("budget", params.budget);
      formData.append("personal_style", params.personal_style);

      // Call API
      const response = await fetch("/api/recommend", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data);
        // IMPORTANT: Do NOT refetch wardrobe after getting recommendations
        // The recommended outfits are just for display, not to be saved
        // Refetching here would cause duplicates if the backend auto-saves files
      } else {
        throw new Error(data.error || "Failed to get recommendations");
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to generate recommendations");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset parameters to defaults
  const resetParams = () => {
    setParams({
      occasion: "casual",
      weather: "any",
      num_outfits: 3,
      outfit_style: "casual",
      color_preference: "None",
      fit_preference: "None",
      material_preference: "None",
      season: "None",
      time_of_day: "None",
      budget: "None",
      personal_style: "None",
    });
  };

  if (!authReady) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="flex justify-center mb-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wand2 size={36} className="text-yellow-300" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Style Bot</h1>
          <p className="text-purple-100 text-base">
            Get AI-powered outfit recommendations from your wardrobe
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold">{wardrobeItems.length}</div>
              <div className="text-xs text-purple-200">Wardrobe Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{params.num_outfits}</div>
              <div className="text-xs text-purple-200">Outfits to Generate</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tag Selection Panel */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Style Preferences</h2>
          </div>
          <button
            onClick={resetParams}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={14} />
              Occasion
            </label>
            <select
              value={params.occasion}
              onChange={(e) => setParams({ ...params, occasion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.occasion.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Weather */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CloudRain size={14} />
              Weather
            </label>
            <select
              value={params.weather}
              onChange={(e) => setParams({ ...params, weather: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.weather.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Outfits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Shirt size={14} />
              Number of Outfits
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={params.num_outfits}
              onChange={(e) => setParams({ ...params, num_outfits: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Outfit Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Outfit Style
            </label>
            <select
              value={params.outfit_style}
              onChange={(e) => setParams({ ...params, outfit_style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.outfit_style.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Color Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette size={14} />
              Color Preference
            </label>
            <select
              value={params.color_preference}
              onChange={(e) => setParams({ ...params, color_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.color_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Ruler size={14} />
              Fit Preference
            </label>
            <select
              value={params.fit_preference}
              onChange={(e) => setParams({ ...params, fit_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.fit_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Material Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Layers size={14} />
              Material Preference
            </label>
            <select
              value={params.material_preference}
              onChange={(e) => setParams({ ...params, material_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.material_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sun size={14} />
              Season
            </label>
            <select
              value={params.season}
              onChange={(e) => setParams({ ...params, season: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.season.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={14} />
              Time of Day
            </label>
            <select
              value={params.time_of_day}
              onChange={(e) => setParams({ ...params, time_of_day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.time_of_day.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign size={14} />
              Budget
            </label>
            <select
              value={params.budget}
              onChange={(e) => setParams({ ...params, budget: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.budget.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Style */}
    <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User size={14} />
              Personal Style
            </label>
            <select
              value={params.personal_style}
              onChange={(e) => setParams({ ...params, personal_style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {TAG_OPTIONS.personal_style.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={generateRecommendations}
          disabled={isGenerating || isLoadingWardrobe || wardrobeItems.length === 0}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Generate Outfit Recommendations
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Loading State */}
      {isLoadingWardrobe && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* Results Gallery */}
      <AnimatePresence>
        {results && results.outfitImages && results.outfitImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recommended Outfits ({results.outfitImages.length})
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    These are AI-generated outfit combinations from your wardrobe
                  </p>
                </div>
              </div>
              {results.outfitDetails && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </button>
              )}
            </div>

            {/* Outfit Details */}
            {showDetails && results.outfitDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-4 overflow-auto"
              >
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(results.outfitDetails, null, 2)}
                </pre>
              </motion.div>
            )}

            {/* Outfit Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.outfitImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 group"
                >
                  <div
                    className="relative w-full h-64 cursor-pointer"
                    onClick={() => setSelectedOutfit(imageUrl)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Recommended outfit ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <ZoomIn className="w-4 h-4 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-medium text-gray-800">
                          Outfit {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Outfit {index + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = imageUrl;
                          link.download = `outfit-${index + 1}.jpg`;
                          link.click();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => setSelectedOutfit(imageUrl)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Full Size"
                      >
                        <ZoomIn size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOutfit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-800">Outfit Preview</h3>
                <button
                  onClick={() => setSelectedOutfit(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-50">
                <Image
                  src={selectedOutfit}
                  alt="Full size outfit"
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedOutfit;
                    link.download = "outfit.jpg";
                    link.click();
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <Download size={18} />
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Check out this outfit recommendation!",
                        url: selectedOutfit,
                      });
                    } else {
                      navigator.clipboard.writeText(selectedOutfit);
                      alert("Image URL copied to clipboard!");
                    }
                  }}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all duration-200"
                >
                  <Share2 size={18} />
                  Share
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
