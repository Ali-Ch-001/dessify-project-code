"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { 
  Upload,
  Play,
  Download,
  Image as ImageIcon,
  User,
  Shirt,
  Settings,
  Loader2,
  AlertCircle,
  ZoomIn,
  X,
  Sparkles,
  Zap,
  Wand2
} from "lucide-react";

export default function VirtualTryOnPage() {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [processedPersonImage, setProcessedPersonImage] = useState<File | null>(null);
  const [processedGarmentImage, setProcessedGarmentImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [isProcessingResult, setIsProcessingResult] = useState(false);
  const [backgroundRemovalProgress, setBackgroundRemovalProgress] = useState<{
    fileName: string;
    type: 'person' | 'garment' | 'result';
  } | null>(null);
  const [results, setResults] = useState<{
    generatedImage: string | null;
    processedImage: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Model parameters
  const [vtModelType] = useState("viton_hd");
  const [vtGarmentType, setVtGarmentType] = useState("upper_body");
  const [vtRepaint] = useState("false");

  const personImageRef = useRef<HTMLInputElement>(null);
  const garmentImageRef = useRef<HTMLInputElement>(null);

  // Add a small delay between background removal requests to avoid rate limiting
  let lastBackgroundRemovalTime = 0;
  const BACKGROUND_REMOVAL_COOLDOWN = 2000; // 2 seconds between requests

  const removeBackground = async (file: File): Promise<File> => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Retry logic for background removal
    let lastError: Error | null = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Background removal attempt ${attempt}/${maxRetries}`);
        
        const response = await fetch('/api/remove-background', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to remove background`);
        }

        const blob = await response.blob();
        return new File([blob], file.name.replace(/\.[^/.]+$/, '_nobg.png'), { type: 'image/png' });
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Background removal attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If all retries failed, throw the last error
    throw lastError || new Error('Failed to remove background after all retries');
  };

  const removeBackgroundFromUrl = async (imageUrl: string): Promise<string> => {
    // Fetch the image from URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'tryon-result.png', { type: 'image/png' });
    
    // Remove background (this now has retry logic)
    const processedFile = await removeBackground(file);
    
    // Convert back to URL
    return URL.createObjectURL(processedFile);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'person' | 'garment') => {
    const file = event.target.files?.[0];
    if (file) {
      setIsRemovingBackground(true);
      setBackgroundRemovalProgress({
        fileName: file.name,
        type: type
      });
      setError(null);
      
      try {
        // Add cooldown between background removal requests
        const now = Date.now();
        const timeSinceLastRequest = now - lastBackgroundRemovalTime;
        if (timeSinceLastRequest < BACKGROUND_REMOVAL_COOLDOWN) {
          const waitTime = BACKGROUND_REMOVAL_COOLDOWN - timeSinceLastRequest;
          console.log(`Waiting ${waitTime}ms before background removal...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        lastBackgroundRemovalTime = Date.now();
        
        // Remove background from the uploaded image
        const processedFile = await removeBackground(file);
        
        if (type === 'person') {
          setPersonImage(file);
          setProcessedPersonImage(processedFile);
        } else {
          setGarmentImage(file);
          setProcessedGarmentImage(processedFile);
        }
      } catch (err) {
        console.error('Error removing background:', err);
        setError('Failed to remove background. Please try again.');
        // Fallback to original image
        if (type === 'person') {
          setPersonImage(file);
          setProcessedPersonImage(file);
        } else {
          setGarmentImage(file);
          setProcessedGarmentImage(file);
        }
      } finally {
        setIsRemovingBackground(false);
        setBackgroundRemovalProgress(null);
      }
    }
  };

  const handleTryOn = async () => {
    if (!processedPersonImage || !processedGarmentImage) {
      setError("Please upload both person and garment images");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('personImage', processedPersonImage);
      formData.append('garmentImage', processedGarmentImage);
      formData.append('refAcceleration', 'false');
      formData.append('step', '30');
      formData.append('scale', '2.5');
      formData.append('seed', '42');
      formData.append('vtModelType', vtModelType);
      formData.append('vtGarmentType', vtGarmentType);
      formData.append('vtRepaint', vtRepaint);

      const response = await fetch('/api/tryon', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // First set the raw result
        setResults({
          generatedImage: result.data.generatedImage,
          processedImage: null
        });

        // Then process the result to remove background
        setIsProcessingResult(true);
        setBackgroundRemovalProgress({
          fileName: 'Try-On Result',
          type: 'result'
        });

        try {
          const processedImageUrl = await removeBackgroundFromUrl(result.data.generatedImage);
          setResults({
            generatedImage: result.data.generatedImage,
            processedImage: processedImageUrl
          });
        } catch (err) {
          console.error('Error processing result:', err);
          // Keep the original result if background removal fails
        } finally {
          setIsProcessingResult(false);
          setBackgroundRemovalProgress(null);
        }
      } else {
        setError(result.error || "Failed to process images");
      }
    } catch (err) {
      console.error("Error during try-on:", err);
      setError("Failed to process images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string | null, filename: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Background Removal Modal */}
      {(isRemovingBackground || isProcessingResult) && backgroundRemovalProgress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20"
          >
            <div className="text-center space-y-6">
              {/* Animated Icon */}
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto relative"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wand2 className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              
              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {backgroundRemovalProgress.type === 'result' ? 'Enhancing Result' : 'Removing Background'}
                </h3>
                <p className="text-sm text-gray-600">
                  {backgroundRemovalProgress.type === 'result' 
                    ? 'Creating your perfect try-on...' 
                    : `Processing ${backgroundRemovalProgress.fileName}...`
                  }
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">
                  {backgroundRemovalProgress.type === 'result' 
                    ? 'AI enhancement in progress...' 
                    : 'Processing with AI...'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Try-On Generation Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            
            <div className="relative text-center space-y-6">
              {/* Animated Icon */}
              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto relative"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-12 h-12 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-white/30"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              
              {/* Title */}
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  AI Try-On Generation
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600"
                >
                  Creating your virtual try-on experience...
                </motion.p>
              </div>
              
              {/* Animated Progress Steps */}
              <div className="space-y-3">
                {[
                  { text: "Analyzing person image", delay: 0.4 },
                  { text: "Processing garment details", delay: 0.6 },
                  { text: "Generating virtual fit", delay: 0.8 },
                  { text: "Applying AI enhancements", delay: 1.0 }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: step.delay
                      }}
                    />
                    <span className="text-gray-600">{step.text}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "easeInOut" }}
                />
              </div>
              
              {/* Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
                <span className="text-xs">Processing with advanced AI...</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-4 mb-8 ${(isRemovingBackground || isProcessingResult || isProcessing) ? 'pointer-events-none opacity-50' : ''}`}
      >
        {/* Header */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 
                     rounded-2xl p-6 text-white text-center shadow-xl shadow-purple-500/25"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Background decoration */}
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
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
          
          <div className="relative z-10">
            <motion.div
              className="flex justify-center mb-3"
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
              <Wand2 size={32} className="text-yellow-300" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
            <p className="text-purple-100 text-base mb-3">AI-powered 2D virtual try-on with advanced computer vision</p>
            
            {/* Badges */}
            <div className="flex items-center justify-center gap-2">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                AI Powered
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                Real-time
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className={`grid gap-4 transition-all duration-500 ${
          results?.processedImage 
            ? 'grid-cols-1 xl:grid-cols-5' 
            : 'grid-cols-1 xl:grid-cols-3'
        }`}>
          {/* Input Section - Dynamic Sizing */}
          <div className={`space-y-3 transition-all duration-500 ${
            results?.processedImage 
              ? 'xl:col-span-2' 
              : 'xl:col-span-2'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Person Image Upload - Compact */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Person Image</span>
                </div>
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 group"
                  onClick={() => !isRemovingBackground && personImageRef.current?.click()}
                >
                  {personImage ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <Image 
                          src={URL.createObjectURL(processedPersonImage || personImage)} 
                          alt="Person" 
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                        {isRemovingBackground && backgroundRemovalProgress?.type === 'person' && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-3 h-3 text-white animate-spin mx-auto mb-1" />
                              <p className="text-xs text-white">Processing...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 font-medium truncate">{personImage.name}</p>
                      <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-block">
                        {processedPersonImage && processedPersonImage !== personImage ? '✓ Processed' : '✓ Uploaded'}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                        <Upload className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Upload person image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={personImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'person')}
                    className="hidden"
                    disabled={isRemovingBackground}
                  />
                </div>
              </div>

              {/* Garment Image Upload - Compact */}
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-4 border border-purple-200/50 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shirt className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Garment Image</span>
                </div>
                <div 
                  className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200 group"
                  onClick={() => !isRemovingBackground && garmentImageRef.current?.click()}
                >
                  {garmentImage ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <Image 
                          src={URL.createObjectURL(processedGarmentImage || garmentImage)} 
                          alt="Garment" 
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                        {isRemovingBackground && backgroundRemovalProgress?.type === 'garment' && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-3 h-3 text-white animate-spin mx-auto mb-1" />
                              <p className="text-xs text-white">Processing...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 font-medium truncate">{garmentImage.name}</p>
                      <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-block">
                        {processedGarmentImage && processedGarmentImage !== garmentImage ? '✓ Processed' : '✓ Uploaded'}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors">
                        <Upload className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Upload garment image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={garmentImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'garment')}
                    className="hidden"
                    disabled={isRemovingBackground}
                  />
                </div>
              </div>
            </div>

            {/* Model Parameters - Compact */}
            <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 rounded-2xl p-4 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Model Settings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Garment Type</label>
                  <select
                    value={vtGarmentType}
                    onChange={(e) => setVtGarmentType(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    disabled={isRemovingBackground}
                  >
                    <option value="upper_body">Upper Body</option>
                    <option value="lower_body">Lower Body</option>
                    <option value="dresses">Dresses</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTryOn}
                    disabled={!processedPersonImage || !processedGarmentImage || isProcessing || isRemovingBackground || isProcessingResult}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <Play className="w-3 h-3" />
                        Generate Try-On
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display - Compact */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section - Dynamic Sizing */}
          <div className={`transition-all duration-500 ${
            results?.processedImage 
              ? 'xl:col-span-3' 
              : 'xl:col-span-1'
          }`}>
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 rounded-2xl p-6 pb-12 border border-purple-200/50 shadow-xl shadow-purple-500/10 h-fit">
              {/* Background decoration */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl"
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
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-20"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-xl shadow-lg">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Generated Result</h3>
                    <p className="text-sm text-gray-600">Your AI-powered try-on result</p>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {results?.processedImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="space-y-5"
                    >
                      {/* Success Animation */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex items-center justify-center gap-3 text-purple-600 mb-5"
                      >
                        <Sparkles className="w-6 h-6 animate-pulse text-purple-500" />
                        <span className="text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          Try-On Complete!
                        </span>
                        <Sparkles className="w-6 h-6 animate-pulse text-purple-500" />
                      </motion.div>

                      {/* Result Image - Enhanced styling */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group cursor-pointer"
                        onClick={() => setShowPopup(true)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/50">
                          <Image 
                            src={results.processedImage} 
                            alt="Generated Try-On" 
                            width={400}
                            height={600}
                            className="w-full h-auto rounded-xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
                          <div className="absolute top-3 right-3">
                            <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/50">
                              <ZoomIn className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Action Buttons - Enhanced */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-3"
                      >
                        <button
                          onClick={() => downloadImage(results.processedImage, 'tryon-result.png')}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm py-3 rounded-xl font-semibold"
                        >
                          <Download className="w-4 h-4 mr-2 inline" />
                          Download Result
                        </button>
                        <button
                          onClick={() => setShowPopup(true)}
                          className="flex-1 bg-white/80 backdrop-blur-sm border border-purple-200 hover:bg-white hover:border-purple-300 transition-all duration-200 text-sm py-3 rounded-xl font-semibold text-purple-700"
                        >
                          <ZoomIn className="w-4 h-4 mr-2 inline" />
                          View Full Size
                        </button>
                      </motion.div>


                    </motion.div>
                  ) : results?.generatedImage && isProcessingResult ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </motion.div>
                      <p className="text-sm text-gray-600 font-medium">Enhancing your result with AI...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Upload images and click &quot;Generate Try-On&quot; to see results</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Screen Popup */}
      <AnimatePresence>
        {showPopup && results?.processedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl h-full max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-semibold">Generated Try-On Result</h3>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setShowPopup(false)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 border border-white/20"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Image container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image 
                    src={results.processedImage} 
                    alt="Generated Try-On" 
                    width={800}
                    height={1200}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  />
                </div>
              </motion.div>
              
              {/* Footer with actions */}
              <div className="flex justify-center gap-4 mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => downloadImage(results.processedImage, 'tryon-result.png')}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download Result
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
