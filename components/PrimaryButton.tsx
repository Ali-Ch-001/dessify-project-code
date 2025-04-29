// components/PrimaryButton.tsx
import React from "react";

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={
        `bg-[#29224F] text-white py-3 px-6 rounded-md 
         hover:bg-[#555555] transition-colors font-semibold text-lg ` +
        className
      }
    >
      {children}
    </button>
  );
}
