"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { FaRocket, FaMagic } from "react-icons/fa";
import { motion } from "framer-motion";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left Panel: Enhanced form area */}
      <motion.div 
        className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-12 md:py-12 relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-xl mx-auto w-full">
          {/* Glass card for form */}
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Logo with gradient animation */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
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
            
            {/* Back button with animation */}
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
            
            {/* Welcome message with icon */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaRocket className="text-xl md:text-2xl text-purple-600" />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Start Your Fashion Journey</h2>
              </div>
              <p className="text-gray-600 text-sm">Sign up now and transform your wardrobe with AI!</p>
            </div>

            {/* Sign Up Form Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SignUpForm />
              
              {/* Sign in link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-purple-600 hover:text-purple-800 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel: Enhanced illustration */}
      <motion.div 
        className="hidden md:flex w-full md:w-1/2 items-center justify-center p-6 relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Glass card container for illustration */}
        <motion.div
          className="relative bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Floating badge */}
          <motion.div
            className="absolute -top-4 -left-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            animate={{ 
              y: [0, -10, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Join Today!
          </motion.div>
          
          <Image
            src="/sign_in_up_img/sign_up.png"
            alt="Fashion illustration"
            width={450}
            height={450}
            className="z-10 object-contain"
          />
          
          {/* Features list */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaMagic className="text-purple-600" />
              <span className="text-sm font-bold text-gray-800">What you&apos;ll get:</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✨ AI-powered outfit recommendations</li>
              <li>👗 Digital wardrobe management</li>
              <li>🛍️ Personalized shopping suggestions</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}