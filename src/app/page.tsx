// pages/index.tsx
import { NextPage } from 'next';
import React from 'react';
import HeroSection from "@/components/HeroSection";

const LandingPage: NextPage = () => {
  return (
    <div className="bg-[#A9BAEF] min-h-screen text-[#29224F]">
      {/* NAVIGATION BAR */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <div className="text-2xl font-bold">
          Dressify
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-[#29224F] transition-colors">Home</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Trial</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#29224F] transition-colors">Contact</a>
        </div>
        <button
          className="bg-[#29224F] text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors"
          type="button"
        >
          Login
        </button>
      </nav>

      {/* Landing Page Sections */}
      <HeroSection />
      {/* Add more sections here as needed */}
    </div>
  );
};

export default LandingPage;
