"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Panel: White form area */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-10 md:px-14 md:py-14">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#29224F]">
            Dressify
          </h1>
          {/* Back Arrow Button */}
          <Link
            href="/"
            className="flex items-center text-[#29224F] hover:underline mb-6"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back
          </Link>
          <p className="text-[#555555] mb-8 text-lg">
            Sign up now and transform your wardrobe!
          </p>

          {/* Animated Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignUpForm />
            
          <div className="text-center mt-6 text-sm text-[#555555]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#29224F] hover:underline">
              Sign in
            </Link>
          </div>

          </motion.div>
        </div>
      </div>

      {/* Right Panel: Pastel background with seamstress illustration */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#F5F7FB] items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Shape */}
        <div className="absolute w-[400px] h-[400px] bg-[#E4E7FF] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-50" />
        <Image
          src="/sign_in_up_img/sign_up.png" // Replace with your actual illustration path
          alt="Seamstress illustration"
          width={450}
          height={450}
          className="z-10 object-contain"
        />
      </div>
    </div>
  );
}
