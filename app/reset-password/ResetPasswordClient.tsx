'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '@/components/PrimaryButton';

export default function ResetPasswordClient() {
  const params       = useSearchParams();
  const accessToken  = params.get('access_token')  || '';
  const refreshToken = params.get('refresh_token') || '';
  const router       = useRouter();

  const [password, setPassword] = useState('');
  const [status,   setStatus]   = useState<'idle'|'setting'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // restore session from the tokens in the URL
    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .catch(console.error);
    }
  }, [accessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('setting');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => router.replace('/sign-in'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <PrimaryButton type="submit" disabled={status === 'setting'} className="w-full">
            {status === 'setting' ? 'Setting…' : 'Set New Password'}
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
            {status === 'success' && (
              <motion.div
                className="text-green-600 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✔ Password updated! Redirecting…
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.replace('/sign-in')}
            className="text-indigo-600 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
