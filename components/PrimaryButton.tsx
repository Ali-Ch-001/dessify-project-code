// components/PrimaryButton.tsx
import React from "react";

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        bg-gradient-to-r from-purple-400 to-indigo-400
        hover:from-purple-500 hover:to-indigo-600
        text-white py-3 px-6 rounded-md
        transition-colors duration-200 font-semibold text-lg
        ${className}
      `}
    >
      {children}
    </button>
  );
}
