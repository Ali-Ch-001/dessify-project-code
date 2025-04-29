"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/PrimaryButton";
import TopPicksCard from "@/components/TopPicksCard";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [displayName, setDisplayName] = useState<string>("User");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        console.error("Auth error fetching user:", authErr);
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        setDisplayName(user.email ?? "User");
      } else {
        setDisplayName(profile.display_name ?? user.email ?? "User");
      }
    })();
  }, []);

  return (
    <motion.div
      className="space-y-6 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Box */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center bg-[#D7D8FC] rounded-xl p-4 md:p-6"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="space-y-1 md:space-y-2 w-full md:w-1/2">
          <p className="text-xs sm:text-sm text-gray-700">{today}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Welcome Back, {displayName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ready to dazzle? Tell me what’s your mood today and let’s find your
            perfect outfit!
          </p>
        </div>

        <div className="w-full md:w-1/2 h-48 md:h-36 mt-4 md:mt-0 relative">
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
        transition={{ type: "spring", stiffness: 250 }}
      >
        <p className="text-sm sm:text-base text-gray-800 mb-2">
          Discover Your Best Look with AI
        </p>
        <PrimaryButton>Start chat</PrimaryButton>
      </motion.div>

      {/* Top Picks */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Top Picks For You Today!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <TopPicksCard image="/dashboard_img/loading.png" title="Sunny Escape" />
          <TopPicksCard image="/dashboard_img/loading.png" title="City Slick" />
          <TopPicksCard image="/dashboard_img/loading.png" title="Neutral Charm" />
          <TopPicksCard image="/dashboard_img/loading.png" title="Pop of Pattern" />
        </div>
      </div>
    </motion.div>
  );
}
