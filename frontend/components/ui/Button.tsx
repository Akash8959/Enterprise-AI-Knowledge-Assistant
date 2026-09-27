import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-sm text-white hover:bg-indigo-700 active:scale-[0.99] transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xs ${className}`}
    >
      {children}
    </button>
  );
}