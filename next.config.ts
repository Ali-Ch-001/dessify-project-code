// next.config.ts
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// parse out the hostname, e.g. "cnbivalpbhgraozwjnzx.supabase.co"
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // trust your Supabase storage bucket domain
      {
        protocol: 'https',
        hostname: supabaseHost,
      },
      // Hugging Face Spaces for AI-generated images (recommendations, try-on, background removal)
      {
        protocol: 'https',
        hostname: '*.hf.space',
      },
    ],
  },
  // …any other config options you already have
};

export default nextConfig;
