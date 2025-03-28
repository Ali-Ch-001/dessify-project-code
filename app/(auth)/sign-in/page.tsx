"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Panel: Illustration with decorative shape */}
      <motion.div
        className="w-full md:w-1/2 relative flex items-center justify-center p-8 bg-[#F5F7FB] overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Shape */}
        <div className="absolute w-[400px] h-[400px] bg-[#E4E7FF] rounded-full -top-10 -left-16 z-0 opacity-50" />
        <Image
          src="/sign_in_up_img/Login_image.png" // Replace with your actual illustration path
          alt="Login Illustration"
          width={450}
          height={450}
          className="z-10 object-contain"
        />
      </motion.div>

      {/* Right Panel: Login Form */}
      <motion.div
        className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-10 md:px-14 md:py-14"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#29224F]">Dressify</h1>
          {/* Back Arrow Link */}
          <Link
            href="/"
            className="flex items-center text-[#29224F] hover:underline mb-6"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back
          </Link>
          <p className="text-[#555555] mb-8 text-lg">Login into your account</p>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
