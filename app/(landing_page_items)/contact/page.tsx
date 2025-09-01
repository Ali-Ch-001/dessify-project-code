"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  return (
    <>
      {/* ✅ Green Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg">
          ✅ Your message has been sent successfully!
        </div>
      )}

      <form
        action={`https://formsubmit.co/${process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL}`}
        method="POST"
        className="space-y-4 sm:space-y-6"
      >
        <input type="hidden" name="_captcha" value="false" />

        {/** Use the correct NEXT_PUBLIC_SITE_URL and append success flag **/}
        <input
          type="hidden"
          name="_next"
          value={`${process.env.NEXT_PUBLIC_SITE_URL}/contact?success=true`}
        />

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 sm:py-3 bg-[#29224F] text-white font-semibold rounded-lg hover:bg-[#4B3F72] transition"
        >
          Send Message
        </button>
      </form>
    </>
  );
}

export default function ContactPage() {
  return (
  <div className="min-h-screen text-[#29224F] flex flex-col">
      {/* Main Content */}
      <motion.main
        className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Contact Section */}
        <section className="max-w-3xl mx-auto rounded-3xl border-2 border-[#29224F] p-6 sm:p-12 bg-[#FAFAFC] shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#29224F]">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg mb-4 text-[#29224F]">
            Have questions or feedback? Fill out the form below and we&apos;ll
            get back to you within 24 hours.
          </p>

          <Suspense fallback={<div>Loading form...</div>}>
            <ContactForm />
          </Suspense>

          {/* Contact Details */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[#29224F]">
            <div>
              <h3 className="text-lg font-semibold mb-1">Address</h3>
              <p className="text-sm">
                123 Fashion Avenue
                <br />
                Lahore, Pakistan 54000
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Phone</h3>
              <p className="text-sm">+92 300 1234567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <p className="text-sm">support@dressify.com</p>
            </div>
          </div>
        </section>
      </motion.main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}