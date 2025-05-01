"use client";

import React from "react";
import { Carousel, Card, type Card as CardType } from "@/components/FeaturesSection";

// Enhanced Dressify feature cards data
const data: CardType[] = [
  {
    src: "/landing_img/about_us_img/feature1.png",
    title: "Personalized Style",
    category: "Recommendation",
    content: (
      <div className="space-y-4">
        <p>
          AI crafts outfits that feel uniquely you. Our algorithm learns
          from your past choices, the occasion, and your mood to suggest attire
          that elevates your personal style and boosts your confidence.
        </p>
      </div>
    ),
  },
  {
    src: "/landing_img/about_us_img/feature2.png",
    title: "Quick Capture",
    category: "Catalog",
    content: (
      <div className="space-y-4">
        <p>
          Simply snap a photo of your clothing items and watch as our AI
          automatically tags each piece by type, color, and pattern, making
          wardrobe management effortless.
        </p>
      </div>
    ),
  },
  {
    src: "/landing_img/about_us_img/feature3.png",
    title: "Live AI Updates",
    category: "Innovation",
    content: (
      <div className="space-y-4">
        <p>
          Stay ahead of trends with real-time AI improvements delivered
          over-the-air. From seasonal colors to emerging styles, your
          recommendations stay fresh and on point.
        </p>
      </div>
    ),
  },
  {
    src: "/landing_img/about_us_img/style_recs.png",
    title: "Style Recommendations",
    category: "Feature",
    content: (
      <p >
        Receive personalized style guides that combine expert fashion tips
        with your unique wardrobe. Dressify ensures you always look your best,
        no matter the occasion.
      </p>
    ),
  },
];

/**
 * Dressify feature carousel aligned to left-edge of the viewport
 */
export const DressifyCardsCarouselDemo: React.FC = () => {
  const cards = data.map((card, idx) => (
    <Card key={idx} card={card} index={idx} layout />
  ));

  return (
    <section className="w-full bg-white py-8">
      <div className="w-full overflow-hidden">
        <h2 className="pl-4 sm:pl-6 text-5xl font-extrabold font-sans text-[#29224F] dark:text-[#29224F] mb-8">
          Why Choose Dressify?
        </h2>
        <Carousel items={cards} />
      </div>
    </section>
  );
};

export default DressifyCardsCarouselDemo;
