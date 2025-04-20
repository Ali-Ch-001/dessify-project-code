"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSetupForm from "@/components/ProfileSetupForm";
const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Fetch the profile row for the user
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) {
      console.error("Error fetching profile:", error.message);
      // If the error message indicates no row or multiple rows, show profile setup
      if (error.message.includes("JSON object requested")) {
        setShowProfileSetup(true);
      }
    } else {
      setProfile(data);
      setShowProfileSetup(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [showProfileSetup]);

  // When no profile exists, display the profile setup modal over a blurred background.
  if (showProfileSetup) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-white/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ProfileSetupForm onComplete={fetchProfile} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!profile) return <p className="text-lg text-gray-800">Loading...</p>;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-[#29224F]">Dashboard</h1>
      <div className="bg-gray-100 p-6 rounded-md shadow-md w-full max-w-md">
        <p className="text-lg text-gray-800 mb-2">
          <strong>Gender:</strong> {profile.gender || "Not set"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Body Type:</strong> {profile.body_type || "Not set"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Hair Type:</strong> {profile.hair_type || "Not set"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Hair Color:</strong> {profile.hair_color || "Not set"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Eyeball Color:</strong> {profile.eyeball_color || "Not set"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Glasses:</strong> {profile.glasses ? "Yes" : "No"}
        </p>
        <p className="text-lg text-gray-800 mb-2">
          <strong>Skin Tone:</strong> {profile.skin_tone || "Not set"}
          {profile.skin_tone && (
            <span
              style={{ backgroundColor: `rgb(${profile.skin_tone})` }}
              className="inline-block ml-2 w-8 h-8 rounded border border-gray-300"
            />
          )}
        </p>
      </div>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </button>
    </motion.div>
  );
};

export default Dashboard;
