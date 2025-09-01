"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiHeart, FiArrowRight } from "react-icons/fi";
import { FaGem, FaRocket, FaStar } from "react-icons/fa";

const socialLinks = [
  { href: "https://facebook.com/Dressify", icon: <FiFacebook size={24} />, label: "Facebook", color: "group-hover:text-blue-600" },
  { href: "https://twitter.com/Dressify", icon: <FiTwitter size={24} />, label: "Twitter", color: "group-hover:text-sky-500" },
  { href: "https://instagram.com/Dressify", icon: <FiInstagram size={24} />, label: "Instagram", color: "group-hover:text-pink-500" },
];

const footerNav = [
  {
    heading: "SHOP",
    links: [
      { label: "Products", href: "/products", icon: <FaGem size={16} /> },
      { label: "Pricing", href: "/pricing", icon: <FaStar size={16} /> },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About Us", href: "/about-us", icon: <FaRocket size={16} /> },
      { label: "Contact", href: "/contact", icon: <FiMail size={16} /> },
      { label: "News", href: "/news", icon: <FaStar size={16} /> },
      { label: "Support", href: "/support", icon: <FaGem size={16} /> },
    ],
  },
];

const FooterSection: React.FC = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  return (
    <motion.footer
      className="relative bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#FCE7F3] text-[#29224F] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      />
      
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12 md:gap-12 items-start">
          {/* Enhanced Brand + Social */}
          <motion.div 
            className="flex flex-col items-center md:items-start order-1 md:order-none col-span-2 md:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Dressify
            </motion.h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 text-center md:text-left max-w-xs md:max-w-sm">
              <span className="bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Revolutionizing fashion
              </span> with AI-powered style recommendations and virtual try-ons.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, icon, label, color }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                                     <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                   >
                     <Link 
                       href={href} 
                       aria-label={label} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className={`p-3.5 md:p-3 scale-110 md:scale-100 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 text-[#29224F] ${color} block group`}
                     >
                       {icon}
                     </Link>
                   </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Footer navigation columns */}
          {/* Grouped Links: 2 columns on mobile within a full-width block */}
          <motion.div
            className="order-2 md:order-none col-span-2 md:col-span-2 grid grid-cols-2 gap-6 sm:gap-8 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {footerNav.map(({ heading, links }, columnIndex) => (
              <motion.div
                key={heading}
                className="text-center md:text-left min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: columnIndex * 0.1 + 0.1 }}
                viewport={{ once: true }}
              >
                <motion.h3
                  className="text-left text-2xl md:text-2xl font-semibold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {heading}
                </motion.h3>
                <ul className="space-y-2.5 md:space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: linkIndex * 0.1 }}
                      viewport={{ once: true }}
                      onHoverStart={() => setHoveredLink(link.href)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-base md:text-[17px] hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 group py-2 min-h-11"
                      >
                        <motion.div
                          animate={{
                            scale: hoveredLink === link.href ? 1.2 : 1,
                            rotate: hoveredLink === link.href ? 10 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-[#29224F] group-hover:text-purple-500"
                        >
                          {link.icon}
                        </motion.div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Newsletter */}
          <motion.div 
            className="text-center md:text-left order-4 md:order-none col-span-2 md:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-2xl md:text-2xl font-semibold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              STAY UP TO DATE
            </motion.h3>
            <p className="text-base md:text-sm text-gray-600 mb-4">
              Get the latest <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">fashion trends</span> and exclusive offers delivered to your inbox.
            </p>
            <form
              action={`https://formsubmit.co/${process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL}`}
              method="POST"
              className="space-y-3"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_next"
                value={process.env.NEXT_PUBLIC_FORMSUBMIT_SUBSCRIBE_NEXT_LIVE}
              />
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full border-2 border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white/30 text-black text-base md:text-base transition-all duration-300"
                />
                                 <motion.div
                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
                   animate={{ x: email ? 0 : -10, opacity: email ? 1 : 0.5 }}
                   transition={{ duration: 0.3 }}
                 >
                    <FiMail size={20} className="text-[#29224F]" />
                 </motion.div>
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg md:text-lg font-semibold flex items-center justify-center gap-2 group min-h-12"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Subscribe Now</span>
                                 <motion.div
                   animate={{ x: [0, 5, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <FiArrowRight size={18} className="text-white" />
                 </motion.div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <motion.div 
        className="border-t border-white/30 bg-white/10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
  <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-base md:text-lg">
                    <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <span>&copy; {new Date().getFullYear()} <span className="bg-gradient-to-r from-[#29224F] via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">Dressify</span>. All rights reserved.</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#29224F]"
            >
              <FiHeart size={14} />
            </motion.div>
          </motion.div>
                      <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Link href="/terms" className="hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Terms & Conditions
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Link href="/privacy" className="hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Privacy Policy
                </Link>
              </motion.div>
            </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default FooterSection;
