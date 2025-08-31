"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccess(true);
    }
  };

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/home");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label className="block text-black mb-1 text-lg font-medium">
          Email Id
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="w-full px-6 py-4 text-lg border-2 border-[#E4E7FF] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-black mb-1 text-lg font-medium">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className="w-full px-6 py-4 text-lg border-2 border-[#E4E7FF] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 text-center"
        >
          {errorMessage}
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="underline ml-2 text-sm"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-center"
        >
          Login successful! Redirecting to dashboard...
        </motion.div>
      )}

      {/* Login Button */}
      <div>
        <motion.button
          type="submit"
          disabled={loading || success}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 
                     text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50
                     shadow-lg hover:shadow-xl transition-all duration-300
                     relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          <motion.span
            className="relative z-10 flex items-center justify-center gap-2"
            animate={loading ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Logging in...
              </>
            ) : (
              <>
                Login Now
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </motion.svg>
              </>
            )}
          </motion.span>
        </motion.button>
      </div>

      {/* Additional Links */}
      <div className="flex flex-col items-center space-y-2">
        <Link href="/forgotpassword" className="text-sm text-[#29224F] hover:underline">
          Forgot Password?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
