"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left Panel: Enhanced Illustration */}
      <motion.div
        className="w-full md:w-1/2 relative flex items-center justify-center p-6 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glass card container */}
        <motion.div
          className="relative bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Welcome Back!
          </motion.div>
          
          <Image
            src="/sign_in_up_img/Login_image.png"
            alt="Login Illustration"
            width={450}
            height={450}
            className="z-10 object-contain"
          />
          
          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-4 left-4 flex items-center gap-2 text-purple-600"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <AiFillStar className="text-xl" />
            <span className="text-sm font-medium">AI-Powered Fashion</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Panel: Enhanced Login Form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 md:py-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-xl mx-auto w-full">
          {/* Glass card for form */}
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Logo with gradient */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% auto" }}
            >
              Dressify
            </motion.h1>
            
            {/* Back button with hover effect */}
            <Link
              href="/"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-6 group"
            >
              <motion.div
                className="mr-2"
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FiArrowLeft size={20} />
              </motion.div>
              <span className="group-hover:underline">Back to Home</span>
            </Link>
            
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
              <p className="text-gray-600 text-sm">Login to access your personalized wardrobe</p>
            </div>
            
            {/* Login Form Component */}
            <LoginForm />
            
            {/* Additional decorative element */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-500">
                New to Dressify?{" "}
                <Link href="/sign-up" className="text-purple-600 hover:text-purple-800 font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}