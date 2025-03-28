"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema including confirmPassword
const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    mobile: z
      .string()
      .regex(/^(\+?\d{1,3}[- ]?)?\d{7,15}$/, "Please enter a valid mobile number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    console.log("Sign Up Data:", data);
    // TODO: Add production-level logic (e.g. API calls, etc.)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter your name."
            {...register("firstName")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter your name."
            {...register("lastName")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            Email Id
          </label>
          <input
            type="email"
            placeholder="info@xyz.com"
            {...register("email")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            Mobile No.
          </label>
          <input
            type="text"
            placeholder="+91 - 86968 58000"
            {...register("mobile")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.mobile && (
            <p className="text-red-600 text-sm mt-1">
              {errors.mobile.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Password & Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="xxxxxxx"
            {...register("password")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[#555555] mb-1 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="xxxxxxx"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border border-[#E4E7FF] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#29224F]"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Sign Up Button */}
      <div>
        <button
          type="submit"
          className="w-full mt-4 bg-[#29224F] text-white py-3 rounded-md 
                     hover:bg-gray-800 transition-colors font-semibold text-lg"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
