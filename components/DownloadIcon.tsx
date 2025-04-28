'use client';

import { motion } from 'framer-motion';

export default function DownloadIcon() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-10 h-10 text-[#1E2772]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5V17a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-.5M16.5 10.5L12 6m0 0L7.5 10.5M12 6v12"
        />
      </svg>
    </motion.div>
  );
}
