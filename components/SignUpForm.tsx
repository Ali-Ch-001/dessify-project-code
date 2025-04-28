"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Define the signup schema
const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    mobile: z.string().regex(
      /^(\+?\d{1,3}[- ]?)?\d{7,15}$/,
      "Please enter a valid mobile number in E.164 format (e.g., +923214480668)"
    ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    const { firstName, lastName, email, password, mobile } = data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName, mobile } },
    });
  
    if (error) {
      console.error("Error signing up:", error.message);
      // show error to user if you like
    } else {
      // insert into profiles
      const userId = signUpData.user?.id;
      if (userId) {
        const { error: profileErr } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            display_name: `${firstName} ${lastName}`,
            mobile,
          });
        if (profileErr) {
          console.error("Error creating profile row:", profileErr.message);
        }
      }
      setIsSuccess(true);
    }
  };  

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  return (
    <>
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Sign up successful!
          </h2>
          <p className="text-lg text-gray-700">Redirecting to login...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                {...register("firstName")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                {...register("lastName")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                Email Id
              </label>
              <input
                type="email"
                placeholder="info@xyz.com"
                {...register("email")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                Mobile No. (E.164 format)
              </label>
              <input
                type="text"
                placeholder="+92xxxxxxxxxx"
                {...register("mobile")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.mobile && (
                <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="xxxxxxx"
                {...register("password")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 text-lg font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="xxxxxxx"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 text-lg border-2 border-[#E4E7FF] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#29224F] placeholder:text-[#000000] text-black"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-[#29224F] text-white py-3 rounded-md hover:bg-[#555555] transition-colors font-semibold text-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SignUpForm;
