"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-[#29224F]">Dashboard</h1>
      <p className="text-lg mb-8">Welcome to your dashboard!</p>
      <button
        onClick={handleLogout}
        className="bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Log Out
      </button>
    </motion.div>
  );
};

export default Dashboard;
