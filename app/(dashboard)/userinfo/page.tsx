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
      className="max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
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
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-[#A9BAEF] to-[#8AA4D3] p-4 sm:p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center">
          Your Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Display Name */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block mb-2 font-medium text-white text-base sm:text-lg">
              Display Name
            </label>
            <input
              {...register("display_name", { required: "Name required" })}
              className="w-full border border-white bg-white bg-opacity-10 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
            {errors.display_name && (
              <p className="text-red-200 text-xs mt-1">
                {errors.display_name.message}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block mb-2 font-medium text-white text-base sm:text-lg">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob", { required: !profile?.dob })}
                disabled={!!profile?.dob}
                className="w-full border border-white bg-white bg-opacity-10 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition disabled:opacity-50"
              />
            </motion.div>

            {/* Mobile Number */}
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block mb-2 font-medium text-white text-base sm:text-lg">
                Mobile Number
              </label>
              <input
                type="tel"
                {...register("mobile", { required: !profile?.mobile })}
                disabled={!!profile?.mobile}
                className="w-full border border-white bg-white bg-opacity-10 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition disabled:opacity-50"
              />
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col items-center"
          >
            <label
              htmlFor="avatarInput"
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 shadow-inner cursor-pointer"
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-400 w-full h-full text-sm">
                  No pic
                </div>
              )}
            </label>

            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={saving}
              className="hidden"
            />

            <p className="mt-2 text-white text-sm sm:text-base">Profile Picture</p>
          </motion.div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#29224F] rounded-xl hover:opacity-90 transition text-base sm:text-lg font-semibold"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </motion.section>

      {/* AI-Extracted Features */}
      <motion.section
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gradient-to-br from-[#A9BAEF] to-[#8AA4D3] p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            AI-Extracted Features
          </h2>
          <MotionButton
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => extractInputRef.current?.click()}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-white text-[#29224F] rounded-xl text-sm sm:text-base"
          >
            Extract Automatically
          </MotionButton>
        </div>

        <input
          ref={extractInputRef}
          type="file"
          accept="image/*"
          onChange={handleExtract}
          disabled={extracting}
          className="hidden"
        />

        {extracting && <p className="text-white text-sm">Extracting…</p>}
        {extractError && <p className="text-red-200 text-sm">{extractError}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { name: "gender",        label: "Gender",    opts: ["man","woman"] },
            { name: "body_type",     label: "Body Type", opts: ["slim","moderate","heavyset"] },
            { name: "hair_type",     label: "Hair Type", opts: ["bald","short","normal","long"] },
            { name: "hair_color",    label: "Hair Color",opts: ["blonde","brown","black","red"] },
            { name: "eyeball_color", label: "Eye Color", opts: ["blue","brown","green","hazel"] },
          ].map(({ name, label, opts }) => {
            const val = watch(name as any) || "";
            return (
              <div key={name} className="space-y-1">
                <label className="block mb-1 font-medium text-white text-sm sm:text-base">
                  {label}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MotionButton
                      variant="outline"
                      className="w-full justify-between text-sm"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {val || `Select ${label}`}
                    </MotionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={val}
                      onValueChange={(v) => setValue(name as any, v)}
                    >
                      {opts.map(o => (
                        <DropdownMenuRadioItem key={o} value={o}>
                          {o}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}

          {/* Glasses */}
          <div className="space-y-1">
            <label className="block mb-1 font-medium text-white text-sm sm:text-base">
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
                      className="w-full justify-between text-sm"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {boolVal === null ? "Select Glasses" : boolVal ? "Yes" : "No"}
                    </MotionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Glasses</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={strVal}
                      onValueChange={v => setValue("glasses", v === "true")}
                    >
                      <DropdownMenuRadioItem value="true">Yes</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="false">No</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })()}
          </div>

          {/* Skin Tone */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block mb-1 font-medium text-white text-sm sm:text-base">
              Skin Tone (RGB)
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("skin_tone")}
                disabled
                className="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-800 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60"
              />
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-300 rounded-full shadow-inner"
                style={{ backgroundColor: `rgb(${watch("skin_tone") || "255,255,255"})` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#29224F] rounded-xl text-base sm:text-lg font-semibold transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </motion.section>
    </motion.div>
  );
}