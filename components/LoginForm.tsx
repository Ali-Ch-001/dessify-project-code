"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// OPTIONAL: If you want icons, install react-icons:
// npm install react-icons
import { FiMail, FiLock } from "react-icons/fi";

// Zod schema for login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log("Login Data:", data);
    // TODO: Add production-level logic (API calls, etc.)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label className="block text-[#555555] mb-1 font-medium text-base">
          Email Id
        </label>
        <div className="relative">
          {/* Optional icon on the left */}
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FiMail />
          </span>
          <input
            type="email"
            placeholder="info@proavistatechnologies.com"
            {...register("email")}
            className="w-full pl-10 pr-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F] 
                       placeholder-gray-500"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-[#555555] mb-1 font-medium text-base">
          Password
        </label>
        <div className="relative">
          {/* Optional icon on the left */}
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FiLock />
          </span>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className="w-full pl-10 pr-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F] 
                       placeholder-gray-500"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link href="/forgot-password" className="text-[#29224F] hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-[#29224F] text-white py-3 rounded-md 
                   hover:bg-gray-800 transition-colors font-semibold text-lg"
      >
        Login Now
      </button>

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[#555555]">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-[#29224F] font-medium hover:underline">
            Signup Now
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
