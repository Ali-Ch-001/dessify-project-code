// components/ProfileButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { User } from "lucide-react";

export default function ProfileButton() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center space-x-3
        bg-gradient-to-r from-purple-400 to-indigo-500
        text-white font-medium
        rounded-full
        px-4 py-2
        shadow-lg
        transition-shadow duration-200
        hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-purple-300
      "
    >
      {/* Avatar circle */}
      <div className="relative w-8 h-8 bg-white bg-opacity-30 rounded-full overflow-hidden">
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
            className="m-auto text-white/80"
          />
        )}
      </div>

      {/* Display name, truncated to avoid layout shift */}
      <span className="text-sm truncate max-w-[100px]">
        {displayName}
      </span>
    </motion.button>
  );
}
