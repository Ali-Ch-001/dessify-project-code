"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";
import TrendingSection from "@/components/TrendingSection";
import ExclusiveOfferPage from "@/components/exclusive-offer";
import FooterSection from "@/components/FooterSection";

// Defer heavier decorative effects
const AnimatedBlob = dynamic(() => import("@/components/AnimatedBlob"), { ssr: false, loading: () => null });
const FloatingElements = dynamic(() => import("@/components/FloatingElements"), { ssr: false, loading: () => null });

export default function LandingClient() {
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(!!reduce);
  type NavigatorConnection = { saveData?: boolean } | undefined;
  const conn = (navigator as unknown as { connection?: NavigatorConnection }).connection;
  const sd = conn?.saveData === true;
    setSaveData(!!sd);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#FCE7F3] min-h-screen text-[#29224F] relative">
      {/* Deferred decorative effects */}
  {loaded && !reducedMotion && !saveData && (
        <>
          <AnimatedBlob />
          <FloatingElements />
        </>
      )}

      {/* Sections */}
      <motion.div
        id="home"
        className="pt-20 scroll-mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
      </motion.div>

      <section id="info" className="content-visibility-auto contain-intrinsic-size-[600px] scroll-mt-20">
        <InfoSection />
      </section>

      <section id="shop" className="content-visibility-auto contain-intrinsic-size-[600px] scroll-mt-20">
        <TrendingSection />
      </section>

      <section className="content-visibility-auto contain-intrinsic-size-[600px]">
        <ExclusiveOfferPage />
      </section>

      <FooterSection />
    </div>
  );
}
