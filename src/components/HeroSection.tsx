// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row items-center mt-10 px-4 md:px-0">
      {/* Left Text Content */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Fashion Simplified: <br />
          Explore, Try, and Shop <br />
          with Dressify
        </h1>
        <button
          className="bg-[#29224F] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          type="button"
        >
          Explore Now
        </button>
      </div>

      {/* Right Image / Visual Content */}
      <div className="w-full md:w-1/2 flex justify-end relative mb-8 md:mb-0">
        <div className="relative z-10">
          <Image
            src="/img/landing1.png"  // Path from public folder
            alt="Model wearing a pastel dress"
            width={400}              // Adjust width/height as needed
            height={500}
            objectFit="cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;