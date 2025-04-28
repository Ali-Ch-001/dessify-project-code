'use client';

import { motion } from 'framer-motion';

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
      <img src={image} alt={title} className="rounded-lg object-cover h-64 w-full" />
      <p className="mt-2 font-medium text-gray-700">{title}</p>
    </motion.div>
  );
}
