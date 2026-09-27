import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-foreground placeholder:text-foreground/40 px-4 py-2.5 text-sm min-h-[44px] outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;