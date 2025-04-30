"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const FooterSection: React.FC = () => {
  return (
    <motion.footer
      className="bg-[#A9BAEF] text-[#29224F] w-full relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Top Section */}
      <div className="container mx-auto px-4 md:px-0 py-8">
        {/* Desktop Grid: 4 Columns */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {/* Column 1: Brand & Social Icons */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Dressify</h2>
            <div className="flex space-x-4">
              <Link href="/products" aria-label="Products" className="hover:text-[#29224F]/80 transition-colors">
                <FiFacebook size={24} />
              </Link>
              <Link href="/pricing" aria-label="Pricing" className="hover:text-[#29224F]/80 transition-colors">
                <FiTwitter size={24} />
              </Link>
              <Link href="/releases" aria-label="Releases" className="hover:text-[#29224F]/80 transition-colors">
                <FiInstagram size={24} />
              </Link>
            </div>
          </div>

          {/* Column 2: SHOP Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-[#29224F]/80">Products</Link></li>
              <li><Link href="/overview" className="hover:text-[#29224F]/80">Overview</Link></li>
              <li><Link href="/pricing" className="hover:text-[#29224F]/80">Pricing</Link></li>
              <li><Link href="/releases" className="hover:text-[#29224F]/80">Releases</Link></li>
            </ul>
          </div>

          {/* Column 3: COMPANY Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-[#29224F]/80">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#29224F]/80">Contact</Link></li>
              <li><Link href="/news" className="hover:text-[#29224F]/80">News</Link></li>
              <li><Link href="/support" className="hover:text-[#29224F]/80">Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Stay Up To Date */}
          <div>
            <h3 className="text-lg font-semibold mb-4">STAY UP TO DATE</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks for subscribing!");
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29224F] text-black text-sm"
              />
              <button type="submit" className="bg-[#29224F] text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm">
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Grid: 3 Columns */}
        <div className="grid grid-cols-3 gap-4 md:hidden">
          {/* Column 1: Brand & Social Icons */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Dressify</h2>
            <div className="flex justify-center space-x-2">
              <Link href="/products" aria-label="Products" className="hover:text-[#29224F]/80 transition-colors">
                <FiFacebook size={20} />
              </Link>
              <Link href="/pricing" aria-label="Pricing" className="hover:text-[#29224F]/80 transition-colors">
                <FiTwitter size={20} />
              </Link>
              <Link href="/releases" aria-label="Releases" className="hover:text-[#29224F]/80 transition-colors">
                <FiInstagram size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Combined SHOP & COMPANY Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold mb-2">SHOP & COMPANY</h3>
            <ul className="space-y-1 text-xs">
              <li><Link href="/products" className="hover:text-[#29224F]/80">Products</Link></li>
              <li><Link href="/overview" className="hover:text-[#29224F]/80">Overview</Link></li>
              <li><Link href="/pricing" className="hover:text-[#29224F]/80">Pricing</Link></li>
              <li><Link href="/releases" className="hover:text-[#29224F]/80">Releases</Link></li>
              <li><Link href="/about-us" className="hover:text-[#29224F]/80">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#29224F]/80">Contact</Link></li>
              <li><Link href="/news" className="hover:text-[#29224F]/80">News</Link></li>
              <li><Link href="/support" className="hover:text-[#29224F]/80">Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Stay Up To Date */}
          <div className="text-center">
            <h3 className="text-sm font-semibold mb-2">STAY UP TO DATE</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}
              className="flex flex-col items-center space-y-1"
            >
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29224F] text-black text-xs"
              />
              <button type="submit" className="bg-[#29224F] text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors text-xs">
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <hr className="border-[#29224F]/50" />
      <div className="container mx-auto px-4 md:px-0 py-3 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <p className="text-xs md:text-sm">&copy; 2023 Dressify. All rights reserved.</p>
        <div className="flex space-x-2 text-xs md:text-sm">
          <Link href="/terms" className="hover:text-[#29224F]/80">Terms</Link>
          <Link href="/privacy" className="hover:text-[#29224F]/80">Privacy</Link>
          <Link href="/cookies" className="hover:text-[#29224F]/80">Cookies</Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default FooterSection;