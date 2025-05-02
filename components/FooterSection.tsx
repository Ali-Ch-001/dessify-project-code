"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const socialLinks = [
  { href: "https://facebook.com/Dressify", icon: <FiFacebook size={24} />, label: "Facebook" },
  { href: "https://twitter.com/Dressify", icon: <FiTwitter size={24} />, label: "Twitter" },
  { href: "https://instagram.com/Dressify", icon: <FiInstagram size={24} />, label: "Instagram" },
];

const footerNav = [
  {
    heading: "SHOP",
    links: [
      { label: "Products", href: "/products" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "News", href: "/news" },
      { label: "Support", href: "/support" },
    ],
  },
];

const FooterSection: React.FC = () => {
  return (
    <motion.footer
      className="bg-[#A9BAEF] text-[#29224F]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand + Social */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-4">Dressify</h2>
          <div className="flex space-x-4">
            {socialLinks.map(({ href, icon, label }) => (
              <Link key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="hover:text-opacity-80">
                {icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer navigation columns */}
        {footerNav.map(({ heading, links }) => (
          <div key={heading} className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">{heading}</h3>
            <ul className="space-y-2 text-sm">
              {links.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-opacity-80">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">STAY UP TO DATE</h3>
          <form
              action={`https://formsubmit.co/${process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL}`}
              method="POST"
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_next"
                value={process.env.NEXT_PUBLIC_FORMSUBMIT_SUBSCRIBE_NEXT_LIVE}
              />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-full border border-[#29224F] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29224F] text-black text-sm"
            />
            <button
              type="submit"
              className="bg-[#29224F] text-white px-6 py-2 rounded-md hover:bg-[#4B3F72] transition-colors text-sm"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#29224F]/50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; {new Date().getFullYear()} Dressify. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:text-opacity-80">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-opacity-80">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default FooterSection;
