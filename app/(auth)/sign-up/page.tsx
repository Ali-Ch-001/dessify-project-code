"use client";

import React from "react";
import Image from "next/image";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Panel: White form area */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-10 md:px-14 md:py-14">
        <div className="max-w-xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl font-bold mb-2 text-[#29224F]">Dressify</h1>
          <p className="text-[#555555] mb-8 text-lg">
            Sign up now and transform your wardrobe!
          </p>

          {/* The Form */}
          <SignUpForm />
        </div>
      </div>

      {/* Right Panel: Pastel background with seamstress illustration */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#F5F7FB] items-center justify-center p-8">
        <Image
          src="/sign_in_up_img/sign_up.png" // Replace with your actual illustration path
          alt="Seamstress illustration"
          width={450}
          height={450}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
