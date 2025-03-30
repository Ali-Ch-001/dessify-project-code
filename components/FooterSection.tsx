"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const popupData: Record<string, { title: string; body: string }> = {
  Products: {
    title: "Products",
    body: "Here is some dummy content about our products. We offer a wide range of items to suit your style!",
  },
  Overview: {
    title: "Overview",
    body: "A quick overview of our platform. Discover the best ways to shop and manage your wardrobe effectively.",
  },
  Pricing: {
    title: "Pricing",
    body: "Check out our competitive pricing plans to get the most out of your Dressify experience.",
  },
  Releases: {
    title: "Releases",
    body: "Stay updated with our latest product releases and exciting new features.",
  },
  AboutUs: {
    title: "About Us",
    body: "Learn more about the team behind Dressify and our mission to revolutionize fashion.",
  },
  Contact: {
    title: "Contact",
    body: "Need to get in touch? Here's how you can reach us for support or inquiries.",
  },
  News: {
    title: "News",
    body: "Get the latest news and updates about Dressify's partnerships and upcoming events.",
  },
  Support: {
    title: "Support",
    body: "Facing issues or have questions? Our support team is here to help you with anything you need.",
  },
  Terms: {
    title: "Terms",
    body: "These are the dummy Terms & Conditions for Dressify. Please read carefully before using our service.",
  },
  Privacy: {
    title: "Privacy",
    body: "Your privacy matters to us. This is a placeholder for our Privacy Policy.",
  },
  Cookies: {
    title: "Cookies",
    body: "We use cookies to enhance your experience. This is a placeholder for our Cookie Policy.",
  },
};

const FooterSection: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupBody, setPopupBody] = useState("");

  const openPopup = (key: string) => {
    const data = popupData[key] || { title: "Unknown", body: "No content available." };
    setPopupTitle(data.title);
    setPopupBody(data.body);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
              <button
                onClick={() => openPopup("Products")}
                aria-label="Open Products"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiFacebook size={24} />
              </button>
              <button
                onClick={() => openPopup("Pricing")}
                aria-label="Open Pricing"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiTwitter size={24} />
              </button>
              <button
                onClick={() => openPopup("Releases")}
                aria-label="Open Releases"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiInstagram size={24} />
              </button>
            </div>
          </div>
          {/* Column 2: SHOP Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openPopup("Products")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Overview")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Pricing")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Releases")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Releases
                </button>
              </li>
            </ul>
          </div>
          {/* Column 3: COMPANY Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openPopup("AboutUs")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Contact")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("News")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  News
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Support")} className="hover:text-[#29224F]/80 transition-colors text-sm">
                  Support
                </button>
              </li>
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
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29224F] text-black text-sm"
                required
              />
              <button
                type="submit"
                className="bg-[#29224F] text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
              >
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
              <button
                onClick={() => openPopup("Products")}
                aria-label="Open Products"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiFacebook size={20} />
              </button>
              <button
                onClick={() => openPopup("Pricing")}
                aria-label="Open Pricing"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiTwitter size={20} />
              </button>
              <button
                onClick={() => openPopup("Releases")}
                aria-label="Open Releases"
                className="hover:text-[#29224F]/80 transition-colors"
              >
                <FiInstagram size={20} />
              </button>
            </div>
          </div>
          {/* Column 2: Combined SHOP & COMPANY Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold mb-2">SHOP &amp; COMPANY</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => openPopup("Products")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Overview")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Pricing")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Releases")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Releases
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("AboutUs")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Contact")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("News")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  News
                </button>
              </li>
              <li>
                <button onClick={() => openPopup("Support")} className="text-xs hover:text-[#29224F]/80 transition-colors">
                  Support
                </button>
              </li>
            </ul>
          </div>
          {/* Column 3: Stay Up To Date */}
          <div className="text-center">
            <h3 className="text-sm font-semibold mb-2">STAY UP TO DATE</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks for subscribing!");
              }}
              className="flex flex-col items-center space-y-1"
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29224F] text-black text-xs"
                required
              />
              <button
                type="submit"
                className="bg-[#29224F] text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors text-xs mt-1"
              >
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
          <button onClick={() => openPopup("Terms")} className="hover:text-[#29224F]/80 transition-colors">
            Terms
          </button>
          <button onClick={() => openPopup("Privacy")} className="hover:text-[#29224F]/80 transition-colors">
            Privacy
          </button>
          <button onClick={() => openPopup("Cookies")} className="hover:text-[#29224F]/80 transition-colors">
            Cookies
          </button>
        </div>
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-md shadow-lg w-11/12 md:w-1/2 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-600 text-xl hover:text-gray-900"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">{popupTitle}</h2>
              <p className="text-gray-700">{popupBody}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.footer>
  );
};

export default FooterSection;
