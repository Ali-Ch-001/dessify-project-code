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
        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-[#29224F] text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold text-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login Now"}
        </button>
      </div>

      {/* Additional Links */}
      <div className="flex flex-col items-center space-y-2">
        <Link href="/forgotpassword" className="text-sm text-[#29224F] hover:underline">
          Forgot Password?
        </Link>
        <div className="text-sm text-[#555555]">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-[#29224F] hover:underline">
            Signup Now
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
