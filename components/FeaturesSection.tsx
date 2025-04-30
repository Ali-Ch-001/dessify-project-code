"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  JSX,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

export type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    setTimeout(() => checkScrollability(), 300);
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    setTimeout(() => checkScrollability(), 300);
  };

  const handleCardClose = (index: number) => {
    if (!carouselRef.current) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 230 : 384;
    const gap = isMobile ? 4 : 8;
    const scrollPosition = (cardWidth + gap) * (index + 1);
    carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    setTimeout(() => checkScrollability(), 300);
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll scroll-smooth py-10 [scrollbar-width:none] md:py-20"
        >
          <div className="absolute right-0 z-[1000] h-full w-[5%] bg-gradient-to-l from-white via-transparent pointer-events-none" />
          <div className="flex flex-row gap-4 pl-4 pr-4 w-fit">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 * idx } }}
                className="rounded-3xl last:pr-20"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pr-4 md:pr-10">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A9BAEF] disabled:opacity-50"
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A9BAEF] disabled:opacity-50"
          >
            <IconArrowNarrowRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }: { card: Card; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  
  useOutsideClick(containerRef, handleClose);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-20 w-full max-w-5xl rounded-3xl bg-white p-8 md:p-10 text-purple-200"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#29224F] text-white"
              >
                <IconX className="h-4 w-4" />
              </button>
              <motion.p
                className="text-sm font-medium uppercase text-blue-900"
                layoutId={layout ? `category-${card.title}` : undefined}
              >
                {card.category}
              </motion.p>
              <motion.p
                className="mt-2 text-2xl font-semibold md:text-5xl text-blue-900"
                layoutId={layout ? `title-${card.title}` : undefined}
              >
                {card.title}
              </motion.p>
              <div className="mt-6 text-lg leading-relaxed text-blue-900">
                {card.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleOpen}
        layoutId={layout ? `card-${card.title}` : undefined}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#29224F] to-[#A9BAEF] p-6 md:h-[40rem] md:w-96"
      >
        <motion.p
          className="text-xs font-medium uppercase text-white"
          layoutId={layout ? `category-${card.title}` : undefined}
        >
          {card.category}
        </motion.p>
        <motion.p
          className="mt-2 text-lg font-semibold text-white md:text-3xl"
          layoutId={layout ? `title-${card.title}` : undefined}
        >
          {card.title}
        </motion.p>
        <div className="absolute inset-0 z-0">
          <Image src={card.src} alt={card.title} fill className="object-cover" />
        </div>
      </motion.button>
    </>
  );
};

export const BlurImage = ({ height, width, src, className, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt || "card image"}
      {...rest}
    />
  );
};

export type { Card as CardType };
