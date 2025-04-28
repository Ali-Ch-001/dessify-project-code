'use client';

import { motion } from 'framer-motion';
import PrimaryButton from '@/components/PrimaryButton';
import DownloadIcon from '@/components/DownloadIcon';
export default function UploadWardrobePage() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-[#A3A6E8] rounded-xl px-8 py-12 text-center text-white cursor-pointer select-none shadow-md"
      >
        <h1 className="text-[28px] md:text-[36px] font-bold tracking-wide">
          Upload Your Wardrobe Here
        </h1>
      </motion.div>

      {/* Upload Box */}
      <motion.div
        className="border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center p-10 bg-white shadow-md max-w-md mx-auto"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 250 }}
      >
       <DownloadIcon />

        <p className="text-gray-700 font-medium">Drag and Drop here</p>
        <p className="text-gray-500 text-sm my-2">or</p>
        <PrimaryButton>Select File</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}
