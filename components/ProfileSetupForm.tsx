/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export interface ProfileData {
  gender: string;
  body_type: string;
  hair_type: string;
  hair_color: string;
  eyeball_color: string;
  glasses: string; // "Yes" or "No"
  skin_tone: string; // "R,G,B"
}

const defaultValues: ProfileData = {
  gender: "",
  body_type: "",
  hair_type: "",
  hair_color: "",
  eyeball_color: "",
  glasses: "No",
  skin_tone: "",
};
interface ProfileSetupFormProps {
  onComplete?: () => void;
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onComplete }) => {
  const { register, handleSubmit, setValue } = useForm<ProfileData>({ defaultValues });
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skinColorHex] = useState("#e6c8b4");

  // ←––– USE ENV VAR HERE
  const FEATURE_URL = process.env.NEXT_PUBLIC_FEATURE_EXTRACTOR_URL!;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(FEATURE_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to extract features");
      const extracted: ProfileData = await response.json();
      Object.entries(extracted).forEach(([key, value]) =>
        setValue(key as keyof ProfileData, value)
      );
      setShowForm(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setUploadError(err.message || "Error extracting features");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const profileData = {
      ...data,
      glasses: data.glasses === "Yes",
    };
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...profileData });
    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onComplete ? onComplete() : router.push("/dashboard");
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-4xl font-bold mb-8 text-center text-[#29224F]">
        Complete Your Profile
      </h2>

      <AnimatePresence>
        {!showForm && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <label className="block mb-4 font-medium text-2xl text-[#29224F]">
              Upload Your Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {uploading && <p className="text-lg text-gray-500 mt-2">Extracting features...</p>}
            {uploadError && <p className="text-lg text-red-600 mt-2">{uploadError}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-2xl text-green-600"
          >
            Profile saved successfully! Closing...
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && !success && (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Gender */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Gender</label>
              <select
                {...register("gender")}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select gender</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
              </select>
            </div>

            {/* Body Type (read-only) */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Body Type</label>
              <select
                {...register("body_type")}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select body type</option>
                <option value="slim">Slim</option>
                <option value="moderate">Moderate</option>
                <option value="heavyset">Heavyset</option>
              </select>
            </div>

            {/* Hair Type */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Hair Type</label>
              <select
                {...register("hair_type")}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select hair type</option>
                <option value="bald">Bald</option>
                <option value="short">Short</option>
                <option value="normal">Normal</option>
                <option value="long">Long</option>
              </select>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Hair Color</label>
              <select
                {...register("hair_color")}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select hair color</option>
                <option value="blonde">Blonde</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
              </select>
            </div>

            {/* Eyeball Color */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Eyeball Color</label>
              <select
                {...register("eyeball_color")}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select eyeball color</option>
                <option value="blue">Blue</option>
                <option value="brown">Brown</option>
                <option value="green">Green</option>
                <option value="hazel">Hazel</option>
              </select>
            </div>

            {/* Eyeglasses */}
            <div>
              <label className="block mb-2 text-xl font-semibold text-black">Eyeglasses</label>
              <select
                {...register("glasses")}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-black"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Skin Tone */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-xl font-semibold text-black">Skin Tone (RGB)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={skinColorHex}
                  disabled
                  className="w-16 h-10 p-0 border-0"
                />
                <input
                  type="text"
                  {...register("skin_tone")}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-xl text-black"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold text-xl"
              >
                Save Profile
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSetupForm;
