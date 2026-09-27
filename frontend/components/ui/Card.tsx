import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] text-foreground p-6 shadow-xs transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}