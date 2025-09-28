/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Wrap the Button in a motion component for “jumpy” dropdown triggers
const MotionButton = motion(Button);

type Profile = {
  display_name: string | null;
  avatar_url:   string | null;
  mobile:       string | null;
  dob:          string | null;
  gender:       string | null;
  body_type:    string | null;
  hair_type:    string | null;
  hair_color:   string | null;
  eyeball_color:string | null;
  glasses:      boolean | null;
  skin_tone:    string | null;
};

export default function UserInfoPage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [status, setStatus]       = useState<"idle"|"success"|"error">("idle");
  const [saveError, setSaveError] = useState<string>("");
  const [profile, setProfile]     = useState<Profile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const FEATURE_URL = process.env.NEXT_PUBLIC_FEATURE_EXTRACTOR_URL!;
  const extractInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Profile>({
    defaultValues: {
      display_name: "",
      avatar_url:   "",
      mobile:       "",
      dob:          "",
      gender:       "",
      body_type:    "",
      hair_type:    "",
      hair_color:   "",
      eyeball_color:"",
      glasses:      null,
      skin_tone:    "",
    }
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        (Object.keys(profileData) as (keyof Profile)[]).forEach((key) => {
          const val = profileData[key];
          if (val != null) setValue(key, val);
        });
        if (profileData.avatar_url) setAvatarPreview(profileData.avatar_url);
      }
      setLoading(false);
    })();
  }, [router, setValue]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext  = file.name.split(".").pop();
    const name = `${Date.now()}.${ext}`;
    setSaving(true);

    const { data: up, error: upErr } = await supabase
      .storage.from("avatars").upload(name, file);

    if (upErr) {
      setStatus("error");
      setSaveError(upErr.message);
      setSaving(false);
      return;
    }

    const { data: { publicUrl } } = supabase
      .storage.from("avatars").getPublicUrl(up.path);

    setValue("avatar_url", publicUrl);
    setAvatarPreview(publicUrl);
    setSaving(false);
  }

  async function handleExtract(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    setExtractError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(FEATURE_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Extraction failed");
      const feats: Partial<Record<keyof Profile, string>> = await res.json();

      ([
        "gender",
        "body_type",
        "hair_type",
        "hair_color",
        "eyeball_color",
        "glasses",
        "skin_tone",
      ] as (keyof Profile)[]).forEach(field => {
        const raw = feats[field];
        if (!raw) return;
        if (field === "glasses") setValue("glasses", raw === "Yes");
        else setValue(field, raw);
      });
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : String(err));
    } finally {
      setExtracting(false);
      if (extractInputRef.current) extractInputRef.current.value = "";
    }
  }

  const onSubmit: SubmitHandler<Profile> = async data => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (profile?.mobile) data.mobile = profile.mobile;
    if (profile?.dob)    data.dob    = profile.dob;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...data });

    if (error) {
      setStatus("error");
      setSaveError(error.message);
    } else {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        router.refresh();
      }, 1200);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <p className="text-[#29224F]">Loading…</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 sm:space-y-8 flex flex-col items-center"
    >
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            className="p-3 mb-4 rounded-xl bg-green-100 text-green-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✔ Profile saved!
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            className="p-3 mb-4 rounded-xl bg-red-100 text-red-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✖ {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#29224F]">
        Edit Your Profile
      </h1>

      {/* Profile Card */}
      <motion.section
        initial={{ x: -50, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-purple-500/20 border border-purple-400/20 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Animated background elements - hidden on mobile for performance */}
        <motion.div 
          className="hidden md:block absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-xl sm:blur-2xl"
          animate={{ 
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="hidden md:block absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/5 rounded-full blur-xl sm:blur-2xl"
          animate={{ 
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />
        <div className="relative z-10">
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-white text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div 
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.div>
            <span className="text-center">Your Information</span>
          </motion.h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Display Name */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group"
            >
              <label className="block mb-2 sm:mb-3 font-semibold text-white/90 text-sm sm:text-base md:text-lg flex items-center gap-2 sm:gap-3">
                <motion.div 
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Display Name
              </label>
              <input
                {...register("display_name", { required: "Name required" })}
                className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300 group-hover:border-white/30 text-sm sm:text-base"
                placeholder="Enter your display name"
              />
              {errors.display_name && (
                <motion.p 
                  className="text-red-200 text-sm mt-3 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.display_name.message}
                </motion.p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Date of Birth */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group"
              >
                <label className="block mb-2 sm:mb-3 font-semibold text-white/90 text-sm sm:text-base md:text-lg flex items-center gap-2 sm:gap-3">
                  <motion.div 
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dob", { required: !profile?.dob })}
                  disabled={!!profile?.dob}
                  className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </motion.div>

              {/* Mobile Number */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group"
              >
                <label className="block mb-2 sm:mb-3 font-semibold text-white/90 text-sm sm:text-base md:text-lg flex items-center gap-2 sm:gap-3">
                  <motion.div 
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  {...register("mobile", { required: !profile?.mobile })}
                  disabled={!!profile?.mobile}
                  className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300 group-hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </motion.div>
            </div>

            {/* Avatar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <motion.label
                htmlFor="avatarInput"
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-white/20 shadow-xl sm:shadow-2xl shadow-black/20 cursor-pointer border-2 sm:border-4 border-white/30 hover:border-white/50 transition-all duration-300 group"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 5,
                  rotateX: 5
                }}
                transition={{ duration: 0.3 }}
              >
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="avatar"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center text-white/60 w-full h-full text-sm sm:text-base md:text-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.label>

              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={saving}
                className="hidden"
              />

              <motion.p 
                className="mt-3 sm:mt-4 text-white/80 text-xs sm:text-sm md:text-base font-medium"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Profile Picture
              </motion.p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={saving}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 sm:mt-8 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-white to-white/90 text-purple-700 rounded-xl sm:rounded-2xl hover:shadow-xl hover:shadow-white/20 transition-all duration-300 text-base sm:text-lg font-bold border-2 border-white/20 hover:border-white/40"
            >
              {saving ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  Saving…
                </div>
              ) : (
                "Save Profile"
              )}
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* AI-Extracted Features */}
      <motion.section
        initial={{ x: 50, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-indigo-500/20 border border-indigo-400/20 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Animated background elements - hidden on mobile for performance */}
        <motion.div 
          className="hidden md:block absolute top-0 right-0 w-24 sm:w-36 h-24 sm:h-36 bg-white/5 rounded-full blur-xl sm:blur-2xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="hidden md:block absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28 bg-white/5 rounded-full blur-xl sm:blur-2xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div 
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>
              <span className="text-center">AI-Extracted Features</span>
            </motion.h2>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <MotionButton
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => extractInputRef.current?.click()}
                className="px-4 sm:px-5 py-2 bg-gradient-to-r from-white to-white/90 text-indigo-700 rounded-xl text-xs sm:text-sm font-semibold border-2 border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
              >
                Extract Automatically
              </MotionButton>
            </motion.div>
          </div>

        <input
          ref={extractInputRef}
          type="file"
          accept="image/*"
          onChange={handleExtract}
          disabled={extracting}
          className="hidden"
        />

        {extracting && (
          <div className="flex items-center gap-3 text-white/90 text-sm bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
            Extracting features from image…
          </div>
        )}
        {extractError && (
          <div className="flex items-center gap-3 text-red-200 text-sm bg-red-500/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-red-400/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {extractError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {[
            { name: "gender",        label: "Gender",    opts: ["man","woman"] },
            { name: "body_type",     label: "Body Type", opts: ["slim","moderate","heavyset"] },
            { name: "hair_type",     label: "Hair Type", opts: ["bald","short","normal","long"] },
            { name: "hair_color",    label: "Hair Color",opts: ["blonde","brown","black","red"] },
            { name: "eyeball_color", label: "Eye Color", opts: ["blue","brown","green","hazel"] },
          ].map(({ name, label, opts }, index) => {
            const val = watch(name as any) || "";
            return (
              <motion.div 
                key={name} 
                className="space-y-3 sm:space-y-4 group"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <label className="block font-semibold text-white/90 text-xs sm:text-sm md:text-base flex items-center gap-2 sm:gap-3">
                  <motion.div 
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                  {label}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MotionButton
                      variant="outline"
                      className="w-full justify-between text-xs sm:text-sm border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {val || `Select ${label}`}
                    </MotionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white border border-gray-200 shadow-xl rounded-lg sm:rounded-xl">
                    <DropdownMenuLabel className="text-gray-900 font-semibold text-xs sm:text-sm">{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={val}
                      onValueChange={(v) => setValue(name as any, v)}
                    >
                      {opts.map(o => (
                        <DropdownMenuRadioItem key={o} value={o} className="text-gray-700 hover:bg-purple-50 cursor-pointer text-xs sm:text-sm">
                          {o}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            );
          })}

          {/* Glasses */}
          <motion.div 
            className="space-y-3 sm:space-y-4 group"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <label className="block font-semibold text-white/90 text-xs sm:text-sm md:text-base flex items-center gap-2 sm:gap-3">
              <motion.div 
                className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
              Glasses
            </label>
            {(() => {
              const boolVal = watch("glasses");
              const strVal = boolVal === null ? "" : boolVal ? "true" : "false";
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MotionButton
                      variant="outline"
                      className="w-full justify-between text-xs sm:text-sm border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {boolVal === null ? "Select Glasses" : boolVal ? "Yes" : "No"}
                    </MotionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white border border-gray-200 shadow-xl rounded-lg sm:rounded-xl">
                    <DropdownMenuLabel className="text-gray-900 font-semibold text-xs sm:text-sm">Glasses</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={strVal}
                      onValueChange={v => setValue("glasses", v === "true")}
                    >
                      <DropdownMenuRadioItem value="true" className="text-gray-700 hover:bg-purple-50 cursor-pointer text-xs sm:text-sm">Yes</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="false" className="text-gray-700 hover:bg-purple-50 cursor-pointer text-xs sm:text-sm">No</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })()}
          </motion.div>

          {/* Skin Tone */}
          <motion.div 
            className="space-y-3 sm:space-y-4 sm:col-span-2 group"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <label className="block font-semibold text-white/90 text-xs sm:text-sm md:text-base flex items-center gap-2 sm:gap-3">
              <motion.div 
                className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
              />
              Skin Tone (RGB)
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("skin_tone")}
                disabled
                className="flex-1 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl px-3 py-2 text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300 disabled:opacity-60"
              />
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white/30 rounded-full shadow-inner shadow-black/20"
                style={{ backgroundColor: `rgb(${watch("skin_tone") || "255,255,255"})` }}
              />
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-white to-white/90 text-indigo-700 rounded-xl sm:rounded-2xl hover:shadow-xl hover:shadow-white/20 transition-all duration-300 text-sm sm:text-base font-bold border-2 border-white/20 hover:border-white/40"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              Saving…
            </div>
          ) : (
            "Save Profile"
          )}
        </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}