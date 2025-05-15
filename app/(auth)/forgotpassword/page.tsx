// app/(auth)/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import PrimaryButton from '@/components/PrimaryButton';

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('');
  const [status, setStatus]       = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [errorMsg, setErrorMsg]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <motion.div
        className="w-full md:w-1/2 relative flex items-center justify-center p-8 bg-[#F5F7FB] overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute w-[400px] h-[400px] bg-[#E4E7FF] rounded-full -top-10 -left-16 z-0 opacity-50" />
        <Image
          src="/sign_in_up_img/Login_image.png"
          alt="Forgot Password Illustration"
          width={450}
          height={450}
          className="z-10 object-contain"
        />
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-10 md:px-14 md:py-14"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#29224F]">Forgot Password</h1>
          <Link
            href="/login"
            className="flex items-center text-[#29224F] hover:underline mb-6"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back to Login
          </Link>
          <p className="text-[#555555] mb-8 text-lg">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#29224F] font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <PrimaryButton type="submit" disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? 'Sending…' : 'Send Reset Link'}
            </PrimaryButton>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  className="text-red-600 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✖ {errorMsg}
                </motion.div>
              )}
              {status === 'sent' && (
                <motion.div
                  className="text-green-600 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✔ Check your inbox for the reset link.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  );
}