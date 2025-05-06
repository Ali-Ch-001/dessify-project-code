'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import PrimaryButton from '@/components/PrimaryButton';
import DownloadIcon from '@/components/DownloadIcon';
import { X } from 'lucide-react';
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

  return (
    <motion.div
      className="space-y-8 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl p-6 text-white text-center shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h1 className="text-3xl font-extrabold">Upload Your Wardrobe</h1>
      </motion.div>

      {/* Dropzone */}
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center shadow-md cursor-pointer"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 250 }}
      >
        <DownloadIcon className="mx-auto mb-4" />
        <p className="font-medium">Drag & drop images, or click to select</p>
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
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <PrimaryButton onClick={uploadAll} disabled={!items.some(i => i.status === 'pending')}>
          Upload All
        </PrimaryButton>
        <PrimaryButton onClick={() => setShowWebcam(true)}>
          Capture Live Photo
        </PrimaryButton>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative w-full h-32">
                <Image
                  src={item.preview}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* remove from list */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
              >
                <X size={16} />
              </button>

              {/* statuses */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <div className="loader" />
                </div>
              )}
              {item.status === 'success' && (
                <motion.div
                  className="absolute top-1 left-1 bg-green-500 text-white rounded-full px-2 py-1 text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {item.category}
                </motion.div>
              )}
              {item.status === 'error' && (
                <motion.div
                  className="absolute inset-0 bg-red-500/70 flex items-center justify-center text-white p-2 text-sm"
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

      {/* Webcam Modal */}
      <AnimatePresence>
        {showWebcam && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 max-w-sm w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <div className="mt-4 flex justify-end gap-2">
                <PrimaryButton onClick={capturePhoto}>Capture</PrimaryButton>
                <PrimaryButton onClick={() => setShowWebcam(false)}>Cancel</PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}