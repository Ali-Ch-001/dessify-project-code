'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSetupForm from "@/components/ProfileSetupForm";

// ✅ Define a proper Profile Type
interface Profile {
  gender: string | null;
  body_type: string | null;
  hair_type: string | null;
  hair_color: string | null;
  eyeball_color: string | null;
  glasses: boolean | null;
  skin_tone: string | null;
}

export default function Page() {
  const [profile, setProfile] = useState<Profile | null>(null); // ✅ Use Profile type
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      if (error.message.includes("JSON object requested")) {
        setShowProfileSetup(true);
      }
    } else {
      setProfile(data as Profile); // ✅ Cast safely
      setShowProfileSetup(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [showProfileSetup]);

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

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-[#29224F]">Dashboard</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <ProfileField label="Gender" value={profile.gender} />
        <ProfileField label="Body Type" value={profile.body_type} />
        <ProfileField label="Hair Type" value={profile.hair_type} />
        <ProfileField label="Hair Color" value={profile.hair_color} />
        <ProfileField label="Eyeball Color" value={profile.eyeball_color} />
        <ProfileField label="Glasses" value={profile.glasses ? "Yes" : "No"} />
        <ProfileField label="Skin Tone" value={profile.skin_tone} isColor />
      </div>

      <button
        onClick={() => router.push("/home")}
        className="mt-8 bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </button>
    </motion.div>
  );
}

/* Small helper component for profile fields */
function ProfileField({
  label,
  value,
  isColor,
}: {
  label: string;
  value: string | boolean | null; // ✅ Safe types
  isColor?: boolean;
}) {
  return (
    <p className="text-lg text-gray-800">
      <strong>{label}:</strong> {value || "Not set"}
      {isColor && value && typeof value === "string" && (
        <span
          style={{ backgroundColor: `rgb(${value})` }}
          className="inline-block ml-2 w-6 h-6 rounded-full border border-gray-300"
        />
      )}
    </p>
  );
}
