'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '@/components/PrimaryButton';
import TopPicksCard from '@/components/TopPicksCard';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [displayName, setDisplayName] = useState<string>('User');
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    (async () => {
      // 1. Grab the current user
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        console.error('Auth error fetching user:', authErr);
        return;
      }

      // 2. Fetch their profile row
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (profileErr) {
        console.error('Profile fetch error:', profileErr);
        // fallback to email
        setDisplayName(user.email ?? 'User');
      } else {
        setDisplayName(profile.display_name ?? user.email ?? 'User');
      }
    })();
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Box */}
      <motion.div
        className="flex justify-between items-center bg-[#D7D8FC] rounded-xl p-6"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="space-y-2 max-w-xl">
          <p className="text-sm text-gray-700">{today}</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, {displayName}!
          </h1>
          <p className="text-gray-600">
            Ready to dazzle? Click here and tell me, what’s your mood today? Let’s
            find the perfect outfit together!
          </p>
        </div>

        <div className="w-36 h-36 relative">
          <Image
            src="/dashboard_img/homepage.png"
            alt="Welcome"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
      </motion.div>

      {/* AI Chat Prompt */}
      <motion.div
        className="bg-white border rounded-xl p-4 text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250 }}
      >
        <p className="text-gray-800 mb-2">Discover Your Best Look with AI</p>
        <PrimaryButton>Start chat</PrimaryButton>
      </motion.div>

      {/* Top Picks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top Picks For You Today!
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TopPicksCard image="/dashboard_img/loading.png" title="Sunny Escape" />
          <TopPicksCard image="/dashboard_img/loading.png" title="City Slick" />
          <TopPicksCard image="/dashboard_img/loading.png" title="Neutral Charm" />
          <TopPicksCard image="/dashboard_img/loading.png" title="Pop of Pattern" />
        </div>
      </div>
    </motion.div>
  );
}
