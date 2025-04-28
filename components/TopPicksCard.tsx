'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; // ✅ Import next/image

interface TopPicksCardProps {
  image: string;
  title: string;
}

export default function TopPicksCard({ image, title }: TopPicksCardProps) {
  return (
    <motion.div
      className="text-center bg-white shadow-md rounded-lg p-3"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* ✅ Updated to use next/image */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 25vw" // Responsive optimization
        />
      </div>
      <p className="mt-2 font-medium text-gray-700">{title}</p>
    </motion.div>
  );
}
