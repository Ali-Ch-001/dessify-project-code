'use client';

import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  children: React.ReactNode;
}

export default function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-[#1E2772] text-white px-6 py-2 rounded-lg hover:bg-[#1B2368] transition"
    >
      {children}
    </motion.button>
  );
}
