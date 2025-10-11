"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Upload, 
  Play, 
  Download, 
  X, 
  Loader2, 
  AlertCircle, 
  ZoomIn, 
  Wand2, 
  Zap,
  User,
  Shirt
} from "lucide-react";

interface VirtualTryOnPopupProps {
  onClose: () => void;
}

export default function VirtualTryOnPopup({ onClose }: VirtualTryOnPopupProps) {
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
  const [showFullSize, setShowFullSize] = useState(false);

  // Model parameters
  const [vtModelType] = useState("viton_hd");
  const [vtGarmentType, setVtGarmentType] = useState("upper_body");
  const [vtRepaint] = useState("false");

  const personImageRef = useRef<HTMLInputElement>(null);
  const garmentImageRef = useRef<HTMLInputElement>(null);

  const removeBackground = async (file: File): Promise<File> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to remove background: ${response.status}`);
    }

    const blob = await response.blob();
    return new File([blob], file.name.replace(/\.[^/.]+$/, '_nobg.png'), { type: 'image/png' });
  };

  const removeBackgroundFromUrl = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'tryon-result.png', { type: 'image/png' });
    
    const processedFile = await removeBackground(file);
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
        setResults({
          generatedImage: result.data.generatedImage,
          processedImage: null
        });

        // Process the result to remove background
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

  const resetDemo = () => {
    setPersonImage(null);
    setGarmentImage(null);
    setProcessedPersonImage(null);
    setProcessedGarmentImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <>
      {/* Background Removal Modal */}
      {(isRemovingBackground || isProcessingResult) && backgroundRemovalProgress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20"
          >
            <div className="text-center space-y-6">
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
              
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
              
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 relative overflow-hidden"
          >
            <div className="relative text-center space-y-6">
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
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "easeInOut" }}
                />
              </div>
              
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

      {/* Main Popup */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl max-w-6xl w-full mx-2 sm:mx-4 shadow-2xl border border-white/20 max-h-[98vh] sm:max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Virtual Try-On Demo</h2>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Experience AI-powered virtual try-on</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(98vh-100px)] sm:max-h-[calc(95vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Left Side - Upload Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upload Your Images</h3>
                  <p className="text-sm sm:text-base text-gray-600">Upload a person image and a garment to see the magic happen!</p>
                </div>

                {/* Person Image Upload */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/50">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Person Image</span>
                  </div>
                  <div 
                    className="border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200"
                    onClick={() => personImageRef.current?.click()}
                  >
                    {personImage ? (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="relative inline-block">
                          <Image 
                            src={URL.createObjectURL(processedPersonImage || personImage)} 
                            alt="Person" 
                            width={100}
                            height={100}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md border-2 border-white"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">{personImage.name}</p>
                        <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-block">
                          ✓ Ready
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm sm:text-base">Upload person image</p>
                          <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, WEBP</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={personImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'person')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Garment Image Upload */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200/50">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Garment Image</span>
                  </div>
                  <div 
                    className="border-2 border-dashed border-purple-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200"
                    onClick={() => garmentImageRef.current?.click()}
                  >
                    {garmentImage ? (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="relative inline-block">
                          <Image 
                            src={URL.createObjectURL(processedGarmentImage || garmentImage)} 
                            alt="Garment" 
                            width={100}
                            height={100}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md border-2 border-white"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">{garmentImage.name}</p>
                        <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-block">
                          ✓ Ready
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm sm:text-base">Upload garment image</p>
                          <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, WEBP</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={garmentImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'garment')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Model Settings */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Model Settings</h4>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Garment Type</label>
                    <select
                      value={vtGarmentType}
                      onChange={(e) => setVtGarmentType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      <option value="upper_body">Upper Body</option>
                      <option value="lower_body">Lower Body</option>
                      <option value="dresses">Dresses</option>
                    </select>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleTryOn}
                  disabled={!personImage || !garmentImage || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">Generate Try-On</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Try-On Result</h3>
                  <p className="text-sm sm:text-base text-gray-600">Your AI-generated virtual try-on will appear here</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200/50 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                  {results?.processedImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-3 sm:space-y-4"
                    >
                      {/* Success Animation */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex items-center justify-center gap-2 sm:gap-3 text-purple-600 mb-3 sm:mb-4"
                      >
                        <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-purple-500" />
                        <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Try-On Complete!
                        </span>
                        <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-purple-500" />
                      </motion.div>

                      {/* Result Image */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group cursor-pointer bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-200"
                        onClick={() => setShowFullSize(true)}
                      >
                        <Image 
                          src={results.processedImage} 
                          alt="Generated Try-On" 
                          width={300}
                          height={400}
                          className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg border border-white/50">
                            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={resetDemo}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                        >
                          Try Another
                        </button>
                        <button
                          onClick={() => downloadImage(results.processedImage, 'tryon-result.png')}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">Save</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                      </div>
                      <p className="text-gray-600 font-medium text-sm sm:text-base">
                        {isProcessing ? 'Generating your virtual try-on...' : 'Upload images and click "Generate" to see results'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {showFullSize && results?.processedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-60 flex items-center justify-center p-2 sm:p-6"
            onClick={() => setShowFullSize(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl h-full max-h-[98vh] sm:max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-white text-lg sm:text-xl font-semibold">Generated Try-On Result</h3>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setShowFullSize(false)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 border border-white/20"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/10 overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image 
                    src={results.processedImage} 
                    alt="Generated Try-On" 
                    width={800}
                    height={1200}
                    className="max-w-full max-h-full object-contain rounded-lg sm:rounded-xl shadow-2xl"
                  />
                </div>
              </motion.div>
              
              <div className="flex justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => downloadImage(results.processedImage, 'tryon-result.png')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-1 sm:mr-2 inline" />
                  <span className="hidden sm:inline">Download Result</span>
                  <span className="sm:hidden">Download</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
