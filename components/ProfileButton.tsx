// components/ProfileButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { User, ChevronDown } from "lucide-react";

export default function ProfileButton() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    (async () => {
      // 1. Get current user
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        console.error("Auth fetch error:", authErr);
        return;
      }

      // 2. Fetch profile row
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        return;
      }

      // 3. Update local state
      setDisplayName(
        profile?.display_name ||
          user.user_metadata?.full_name ||
          user.email ||
          "Complete Profile"
      );
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    })();
  }, []);

  return (
    <motion.button
      onClick={() => router.push("/userinfo")}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center space-x-2
        bg-white/80 backdrop-blur-xl border border-white/20
        text-gray-800 font-medium
        rounded-xl
        px-2 py-1.5 sm:px-3 sm:py-2
        shadow-lg shadow-black/5
        transition-all duration-300
        hover:shadow-xl hover:shadow-black/10
        hover:bg-white/90
        focus:outline-none focus:ring-4 focus:ring-purple-300/50
        group
      "
    >
      {/* Avatar circle */}
      <motion.div 
        className="relative w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full overflow-hidden shadow-md"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="avatar"
            fill
            className="object-cover"
          />
        ) : (
          <User
            width={20}
            height={20}
            className="m-auto text-white"
          />
        )}
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-30"
          initial={false}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Display name */}
      <motion.span 
        className="text-xs font-semibold truncate max-w-[80px] sm:max-w-[100px] bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden sm:inline"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {displayName}
      </motion.span>

      {/* Chevron icon */}
      <motion.div
        animate={{ rotate: isHovered ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown size={12} className="text-gray-500 group-hover:text-purple-600 transition-colors hidden sm:block" />
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
