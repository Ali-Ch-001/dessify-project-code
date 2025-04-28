'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfileButton() {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-1 rounded-full shadow bg-white cursor-pointer select-none"
      onClick={() => router.push('/userinfo')}
    >
      <div className="w-6 h-6 bg-orange-300 rounded-full"></div>
      <span className="text-sm font-medium text-gray-700 text-[13px]">Fatima Ahmad</span>
    </motion.div>
  );
}
