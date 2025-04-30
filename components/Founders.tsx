"use client";

import React from "react";
import { motion } from "framer-motion";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card";

interface Founder {
  title: string;
  description: string;
}

const founders: Founder[] = [
  {
    title: "Ali Mohsin",
    description:
      "Visionary founder & chief architect of Dressify's AI stack. A FAST-NUCES CS grad who designs our Hybrid Engines, fine-tunes models, and builds bullet-proof microservices.",
  },
  {
    title: "Kabeer Ahmad",
    description:
      "Full-stack maestro & pipeline optimizer BS-CS in Automation, Next.js & Supabase expert, low-GPU inference tuner, and StyleBot conversational flow designer.",
  },
  {
    title: "Fatima Ahmad",
    description:
      "UX & design guru with a Business Management edge crafting Dressify's warm, responsive interfaces and outfit journeys for truly personal styling.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Founders() {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        Meet Our Founders
      </h2>
      <motion.div
        className="max-w-xl mx-auto flex flex-col space-y-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {founders.map((founder) => (
          <motion.div key={founder.title} variants={cardVariants}>
            <DraggableCardContainer className="mx-auto">
              <DraggableCardBody className="p-1 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 cursor-grab">
                <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
                  <div className="h-24 w-24 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    {getInitials(founder.title)}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{founder.title}</h3>
                  <p className="text-gray-600">{founder.description}</p>
                </div>
              </DraggableCardBody>
            </DraggableCardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
