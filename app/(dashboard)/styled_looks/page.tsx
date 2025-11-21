"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Heart, Calendar, CloudRain, Sparkles, Palette, Trash2, Loader2, X, Download, Share2 } from "lucide-react";

type StyledLook = {
  id: string;
  image_url: string;
  created_at: string;
  occasion: string | null;
  weather: string | null;
  outfit_style: string | null;
  color_preference: string | null;
  fit_preference: string | null;
  material_preference: string | null;
  season: string | null;
  time_of_day: string | null;
  budget: string | null;
  personal_style: string | null;
  notes: string | null;
};

const formatTagLabel = (value: string | null): string => {
  if (!value || value === "None") return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function StyledLooksPage() {
  const authReady = useRequireAuth();
  const [styledLooks, setStyledLooks] = useState<StyledLook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<StyledLook | null>(null);

  useEffect(() => {
    if (authReady) {
      fetchStyledLooks();
    }
  }, [authReady]);

  const fetchStyledLooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setError("Please log in to view your styled looks");
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from("styled_looks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }

      setStyledLooks(data || []);
    } catch (err) {
      console.error("Error fetching styled looks:", err);
      setError("Failed to load styled looks");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStyledLook = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to remove this outfit from your Styled Looks?")) {
      return;
    }

    setDeletingId(id);
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(pathParts.indexOf("styled-looks") + 1).join("/");

      // Delete from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("styled-looks")
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting from storage:", storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("styled_looks")
        .delete()
        .eq("id", id);

      if (dbError) {
        throw dbError;
      }

      // Remove from state
      setStyledLooks((prev) => prev.filter((look) => look.id !== id));
    } catch (err) {
      console.error("Error deleting styled look:", err);
      alert("Failed to delete styled look. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authReady) {
    return null;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl shadow-pink-500/25"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl"
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
            className="flex justify-center mb-2 md:mb-3"
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
            <Heart size={28} className="md:w-9 md:h-9 text-pink-200 fill-pink-200" />
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Styled Looks</h1>
          <p className="text-pink-100 text-sm md:text-base px-2">
            Your saved outfit recommendations
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-4 md:gap-6 mt-3 md:mt-4">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold">{styledLooks.length}</div>
              <div className="text-xs text-pink-200">Saved Outfits</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 text-sm md:text-base"
        >
          <span>{error}</span>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && styledLooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl md:rounded-2xl p-8 md:p-12 text-center"
        >
          <Heart className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-pink-300" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            No Styled Looks Yet
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Start saving your favorite outfit recommendations from Style Bot!
          </p>
        </motion.div>
      )}

      {/* Styled Looks Grid */}
      {!isLoading && styledLooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {styledLooks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedLook(look)}
              className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-gray-200 group hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Image Container - Maintains aspect ratio */}
              <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={look.image_url}
                  alt="Styled look"
                  className="w-full h-auto max-w-full object-contain block"
                  loading="lazy"
                />
                
                {/* Delete Button with Animation */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStyledLook(look.id, look.image_url);
                  }}
                  disabled={deletingId === look.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10 hover:shadow-xl"
                  title="Remove from Styled Looks"
                >
                  {deletingId === look.id ? (
                    <Loader2 size={18} className="text-red-600 animate-spin" />
                  ) : (
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Details */}
              <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Calendar size={14} className="text-pink-500" />
                    </motion.div>
                    <span className="font-medium">{formatDate(look.created_at)}</span>
                  </div>
                </div>

                {/* Tags with Icons */}
                <div className="space-y-2.5">
                  {look.occasion && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="flex items-center gap-2 text-xs bg-pink-50 rounded-lg px-2.5 py-1.5"
                    >
                      <Calendar size={14} className="text-pink-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong className="text-gray-900">Occasion:</strong> {formatTagLabel(look.occasion)}
                      </span>
                    </motion.div>
                  )}
                  {look.weather && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-2 text-xs bg-blue-50 rounded-lg px-2.5 py-1.5"
                    >
                      <CloudRain size={14} className="text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong className="text-gray-900">Weather:</strong> {formatTagLabel(look.weather)}
                      </span>
                    </motion.div>
                  )}
                  {look.outfit_style && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="flex items-center gap-2 text-xs bg-purple-50 rounded-lg px-2.5 py-1.5"
                    >
                      <Sparkles size={14} className="text-purple-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong className="text-gray-900">Style:</strong> {formatTagLabel(look.outfit_style)}
                      </span>
                    </motion.div>
                  )}
                  {look.color_preference && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center gap-2 text-xs bg-rose-50 rounded-lg px-2.5 py-1.5"
                    >
                      <Palette size={14} className="text-rose-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong className="text-gray-900">Color:</strong> {formatTagLabel(look.color_preference)}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedLook(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-4xl max-h-[95vh] my-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  <h3 className="text-lg font-bold text-gray-800">Styled Look Details</h3>
                </div>
                <motion.button
                  onClick={() => setSelectedLook(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                    <div className="relative w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedLook.image_url}
                        alt="Styled look"
                        className="w-full h-auto max-w-full object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-1/2 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 pb-3 border-b border-gray-200">
                      <Calendar size={16} className="text-pink-500" />
                      <span className="font-medium">{formatDate(selectedLook.created_at)}</span>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Outfit Details</h4>
                      
                      {selectedLook.occasion && (
                        <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                          <Calendar size={18} className="text-pink-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Occasion</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.occasion)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.weather && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CloudRain size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Weather</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.weather)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.outfit_style && (
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <Sparkles size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Style</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.outfit_style)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.color_preference && (
                        <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
                          <Palette size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Color Preference</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.color_preference)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.fit_preference && (
                        <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                          <div className="w-[18px] h-[18px] flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-indigo-500 rounded" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fit Preference</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.fit_preference)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.material_preference && (
                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                          <div className="w-[18px] h-[18px] flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Material</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.material_preference)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.season && (
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-[18px] h-[18px] flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Season</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.season)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.time_of_day && (
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-[18px] h-[18px] flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Time of Day</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.time_of_day)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.budget && (
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                          <div className="w-[18px] h-[18px] flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <span className="text-emerald-500 text-xs font-bold">$</span>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Budget</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.budget)}</div>
                          </div>
                        </div>
                      )}

                      {selectedLook.personal_style && (
                        <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
                          <Heart size={18} className="text-violet-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Personal Style</div>
                            <div className="text-sm font-medium text-gray-900">{formatTagLabel(selectedLook.personal_style)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Sparkles className="w-3 h-3 text-pink-600" />
                  <span className="hidden sm:inline">Saved from Style Bot</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement("a");
                      link.href = selectedLook.image_url;
                      link.download = `styled-look-${selectedLook.id}.jpg`;
                      link.click();
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: "Check out my styled look!",
                          url: selectedLook.image_url,
                        });
                      } else {
                        navigator.clipboard.writeText(selectedLook.image_url);
                        alert("Image URL copied to clipboard!");
                      }
                    }}
                    className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-pink-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
