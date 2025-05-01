import React from "react";
import { motion } from "framer-motion";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card";

interface Founder {
  title: string;
  description: string;
}

const founders: Founder[] = [
  {
    title: "Kabeer Ahmad",
    description:
      "Kabeer Ahmad is our full-stack performance lead. He built Dressify’s Next.js & Supabase pipeline and cut API latency by 60% with smart caching. Kabeer also designed the StyleBot chat and runs community code clinics.",
  },
  {
    title: "Ali Mohsin",
    description:
      "Ali Mohsin is the visionary founder and chief AI architect. He blends leading edge AI Models to create hyper-realistic outfits and optimized our GPU pipelines for sub-50ms responses. He also leads our data science team. He is the one keeping the lights on.",
  },
  {
    title: "Fatima Ahmad",
    description:
      "Fatima Ahmad leads UX and design, turning user research into intuitive interfaces. Her redesign boosted mobile conversions by 25% and she ensures Dressify meets high accessibility standards.",
  },
];

// Framer Motion variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};
const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0 },
};

export default function Founders() {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <section className="bg-white py-16">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#29224F] mb-12">
        Meet Our Founders
      </h2>

      <motion.div
        className="container mx-auto flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {founders.map((founder) => (
          <motion.div
            key={founder.title}
            variants={cardVariants}
            className="w-full md:w-1/3"
          >
            <DraggableCardContainer>
              <DraggableCardBody className="p-1 rounded-3xl bg-gradient-to-r from-[#4B3F72] via-[#6D5BAA] to-[#A59DE0] cursor-grab">
                <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-row items-center">
                  <div className="h-20 w-20 flex-shrink-0 bg-[#29224F] rounded-full flex items-center justify-center text-3xl font-bold text-white mr-6">
                    {getInitials(founder.title)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#29224F] mb-1">
                      {founder.title}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {founder.description}
                    </p>
                  </div>
                </div>
              </DraggableCardBody>
            </DraggableCardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
