import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full
        rounded-xl
        border
        border-border
        bg-background
        px-4
        py-3
        outline-none
        transition-all
        focus:ring-2
        focus:ring-blue-500
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;