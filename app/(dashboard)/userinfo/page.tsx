"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
  const [showModal, setShowModal] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const FEATURE_URL = process.env.NEXT_PUBLIC_FEATURE_EXTRACTOR_URL!;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Profile>({
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

  // ─── Load existing profile ─────────────────────────
  useEffect(() => {
    (async () => {
      // 1) Get the logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
  
      // 2) Fetch their profile row
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
  
      if (profileData) {
        // 3) Save to local state
        setProfile(profileData);
  
        // 4) Populate the form fields—only keys defined in Profile
        (Object.keys(profileData) as (keyof Profile)[]).forEach((key) => {
          const val = profileData[key];
          if (val != null) {
            setValue(key, val);
          }
        });
  
        // 5) Set the avatar preview if present
        if (profileData.avatar_url) {
          setAvatarPreview(profileData.avatar_url);
        }
      }
  
      setLoading(false);
    })();
  }, [router, setValue]);
  
  // ─── Avatar upload ────────────────────────────────
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

    const urlResponse = supabase
      .storage.from("avatars").getPublicUrl(up.path);
    const publicUrl = urlResponse.data.publicUrl;
    setValue("avatar_url", publicUrl);
    setAvatarPreview(publicUrl);
    setSaving(false);
  }

  // ─── AI feature extraction ─────────────────────────
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
      ] as const).forEach((field) => {
        const raw = feats[field];
        if (raw == null) return;
        if (field === "glasses") {
          // raw comes back as "Yes"/"No"
          setValue("glasses", raw === "Yes");
        } else {
          setValue(field, raw);
        }
      });
  
      setShowModal(false);
    } catch (err: unknown) {
      // Narrow down to Error to extract message, else stringify
      if (err instanceof Error) {
        setExtractError(err.message);
      } else {
        setExtractError(String(err));
      }
    } finally {
      setExtracting(false);
    }
  }  

  // ─── Form submission ──────────────────────────────
  const onSubmit: SubmitHandler<Profile> = async (data) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

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
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-800">Loading…</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="max-w-3xl mx-auto p-6 space-y-8"
    >
      {/* ─── Status banners ───────────────────────────── */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            className="p-3 mb-4 rounded bg-green-100 text-green-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✔ Profile saved!
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            className="p-3 mb-4 rounded bg-red-100 text-red-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✖ {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-center text-gray-800">Edit Your Profile</h1>

      {/* ─── Section 1: Your Information ─────────────── */}
      <motion.section
        initial={{ x:-50, opacity:0 }} animate={{ x:0, opacity:1 }}
        transition={{ duration:0.4 }}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">Display Name</label>
            <input
              {...register("display_name", { required: "Name required" })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-gray-900"
            />
            {errors.display_name && (
              <p className="text-red-600 text-sm mt-1">{errors.display_name.message}</p>
            )}
          </div>
          {/* DOB */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">Date of Birth</label>
            <input
              type="date"
              {...register("dob", { required: !profile?.dob })}
              disabled={!!profile?.dob}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-gray-900 ${profile?.dob?"bg-gray-100":""}`}
            />
          </div>
          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">Mobile Number</label>
            <input
              type="tel"
              {...register("mobile", { required: !profile?.mobile })}
              disabled={!!profile?.mobile}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-gray-900 ${profile?.mobile?"bg-gray-100":""}`}
            />
          </div>
          {/* Avatar */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">Profile Picture</label>
            <div className="flex items-center gap-4">
            <div className="relative w-40 sm:w-32 md:w-40 aspect-square rounded-full overflow-hidden bg-gray-100">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-400 w-full h-full">
                    No pic
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={saving}
                className="text-gray-800"
              />
            </div>
          </div>
        </form>
      </motion.section>

      {/* ─── Section 2: AI-Extracted Features ─────────── */}
      <motion.section
        initial={{ x:50, opacity:0 }} animate={{ x:0, opacity:1 }}
        transition={{ duration:0.4, delay:0.2 }}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">AI-Extracted Features</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Extract Automatically
          </button>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name:"gender", label:"Gender", opts:["man","woman"] },
            { name:"body_type", label:"Body Type", opts:["slim","moderate","heavyset"] },
            { name:"hair_type", label:"Hair Type", opts:["bald","short","normal","long"] },
            { name:"hair_color", label:"Hair Color", opts:["blonde","brown","black","red"] },
            { name:"eyeball_color", label:"Eyeball Color", opts:["blue","brown","green","hazel"] },
          ].map(({ name, label, opts }) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-gray-800">{label}</label>
              <select
                {...register(name as keyof Profile, { required: true })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-gray-900"
              >
                <option value="">Select…</option>
                {opts.map(o=> <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {/* Glasses */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">Glasses</label>
            <select
              {...register("glasses", { required:true })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-gray-900"
            >
              <option value="">Select…</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {/* Skin Tone */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-800">Skin Tone (RGB)</label>
            <div className="flex items-center gap-3">
              <input
                {...register("skin_tone")}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-indigo-400"
              />
              <span
                className="w-6 h-6 border rounded-full"
                style={{ backgroundColor: `rgb(${watch("skin_tone")})` }}
              />
            </div>
          </div>
          {/* Save */}
          <div className="md:col-span-2 text-right">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </motion.section>

      {/* ─── Extraction Modal ────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
              initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-30, opacity:0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upload to Extract</h3>
                <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-800"/></button>
              </div>
              <input
                type="file" accept="image/*"
                onChange={handleExtract}
                disabled={extracting}
                className="block w-full text-sm text-gray-800 mb-2"
              />
              {extracting && <p className="text-gray-700">Extracting…</p>}
              {extractError && <p className="text-red-600">{extractError}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
