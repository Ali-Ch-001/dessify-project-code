'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { 
  X, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  FolderOpen
} from 'lucide-react';
import Image from 'next/image'

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  category?: string;
  error?: string;
};

export default function UploadWardrobePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef    = useRef<Webcam>(null);
  const [items, setItems]       = useState<UploadItem[]>([]);
  const [showWebcam, setShowWebcam] = useState(false);
  const [userId, setUserId]     = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_CATEGORIZATION_URL!;

  // get user ID
  useEffect(() => {
    import('@/lib/supabaseClient').then(({ supabase }) =>
      supabase.auth.getUser().then(({ data, error }) => {
        if (!error && data.user) setUserId(data.user.id);
      })
    );
  }, []);

  // add new files to queue
  const handleFiles = (files: FileList) => {
    const newItems = Array.from(files).map(f => ({
      id:   crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      status: 'pending' as const,
    }));
    setItems(i => [...i, ...newItems]);
  };

  // upload one item
  const uploadItem = async (item: UploadItem) => {
    setItems(i =>
      i.map(x => x.id === item.id ? { ...x, status: 'uploading' } : x)
    );
    try {
      const form = new FormData();
      form.append('user_id', userId);
      form.append('file', item.file);
      const res = await fetch(API_URL, { method: 'POST', body: form });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Status ${res.status}: ${t}`);
      }
      const body = await res.json();
      setItems(i =>
        i.map(x => x.id === item.id
          ? { ...x, status: 'success', category: body.category }
          : x
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setItems(i =>
        i.map(x => x.id === item.id
          ? { ...x, status: 'error', error: msg }
          : x
        )
      );
    }
  };

  // upload all pending
  const uploadAll = async () => {
    for (const it of items.filter(x => x.status === 'pending')) {
      await uploadItem(it);
    }
  };

  // remove from queue
  const removeItem = (id: string) => {
    setItems(i => i.filter(x => x.id !== id));
  };

  // webcam capture
  const capturePhoto = () => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return;
    fetch(shot)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        handleFiles(dt.files);
        setShowWebcam(false);
      });
  };

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

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const successCount = items.filter(i => i.status === 'success').length;
  const errorCount = items.filter(i => i.status === 'error').length;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Header */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 
                   rounded-2xl p-6 text-white text-center shadow-xl shadow-purple-500/25"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
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
            <FolderOpen size={36} className="text-yellow-300" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Upload Your Wardrobe</h1>
          <p className="text-purple-100 text-base mb-4">Add your favorite pieces to get personalized style recommendations</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold">{items.length}</div>
              <div className="text-xs text-purple-200">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-300">{successCount}</div>
              <div className="text-xs text-purple-200">Uploaded</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-300">{pendingCount}</div>
              <div className="text-xs text-purple-200">Pending</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Dropzone */}
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDrop={e => { 
          e.preventDefault(); 
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files); 
        }}
        onDragOver={e => { 
          e.preventDefault(); 
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center shadow-lg cursor-pointer
          transition-all duration-300 group overflow-hidden
          ${isDragOver 
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 scale-105' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-indigo-50/50'
          }
        `}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250 }}
      >
        {/* Animated background pattern */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isDragOver ? {
            background: [
              'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-4"
            animate={isDragOver ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full opacity-20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full shadow-lg">
                <Upload size={28} className="text-white" />
              </div>
            </div>
          </motion.div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isDragOver ? 'Drop your files here!' : 'Drag & drop images, or click to select'}
          </h3>
          <p className="text-gray-600 text-sm">Support for JPG, PNG, and GIF files</p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
        </div>
      </motion.div>

      {/* Enhanced Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-3 justify-center"
        variants={itemVariants}
      >
        <motion.button
          onClick={uploadAll} 
          disabled={!items.some(i => i.status === 'pending')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Upload All ({pendingCount})
        </motion.button>
        
        <motion.button
          onClick={() => setShowWebcam(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Camera size={18} />
          Capture Live Photo
        </motion.button>
      </motion.div>

      {/* Enhanced Preview Grid */}
      {items.length > 0 && (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section Header */}
          <motion.div
            className="flex items-center justify-between"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">Upload Queue</h2>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {pendingCount} pending
                  </div>
                )}
                {successCount > 0 && (
                  <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {successCount} uploaded
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {errorCount} failed
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg shadow-black/5 group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={item.preview}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    
                    {/* Status overlay */}
                    {item.status === 'uploading' && (
                      <motion.div 
                        className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                    
                    {item.status === 'success' && (
                      <motion.div
                        className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle size={14} />
                      </motion.div>
                    )}
                    
                    {item.status === 'error' && (
                      <motion.div
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <AlertCircle size={14} />
                      </motion.div>
                    )}
                  </div>

                  {/* Remove button */}
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </motion.button>

                  {/* Category badge */}
                  {item.status === 'success' && item.category && (
                    <motion.div
                      className="absolute bottom-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {item.category}
                    </motion.div>
                  )}

                  {/* Error message */}
                  {item.status === 'error' && (
                    <motion.div
                      className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex items-center justify-center text-white p-2 text-xs text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.error}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Enhanced Webcam Modal */}
      <AnimatePresence>
        {showWebcam && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-black/20 border border-white/20"
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-center mb-4">
                <motion.div
                  className="flex justify-center mb-3"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Camera size={32} className="text-purple-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Capture Photo</h3>
                <p className="text-gray-600 text-sm">Position yourself and click capture</p>
              </div>
              
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-xl shadow-lg border-2 border-gray-200"
              />
              
              <div className="mt-4 flex gap-3">
                <motion.button
                  onClick={capturePhoto}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera size={18} className="mr-2 inline" />
                  Capture
                </motion.button>
                <motion.button
                  onClick={() => setShowWebcam(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}