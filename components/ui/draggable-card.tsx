"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationControls,
} from "motion/react";

export const DraggableCardBody = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig);
  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]), springConfig);

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        top: -window.innerHeight / 2,
        left: -window.innerWidth / 2,
        right: window.innerWidth / 2,
        bottom: window.innerHeight / 2,
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      dragElastic={0.2}
      onDragStart={() => (document.body.style.cursor = "grabbing")}
      onDragEnd={() => {
        document.body.style.cursor = "default";
        controls.start({
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          transition: { type: "spring", ...springConfig },
        });
        mouseX.set(0);
        mouseY.set(0);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={controls}
      style={{ rotateX, rotateY, opacity, willChange: "transform, opacity" }}
      className={cn(
        "relative w-80 cursor-grab overflow-hidden rounded-md bg-neutral-100 p-6 dark:bg-neutral-900",
        className
      )}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white select-none"
        style={{ opacity: glareOpacity }}
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn("[perspective:3000px]", className)}>{children}</div>;
};
