"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-20 h-9 rounded-xl border border-[var(--border)] bg-[var(--card)] animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-foreground hover:bg-foreground/5 transition min-h-[38px] shadow-xs cursor-pointer select-none"
    >
      <span>{isDark ? "🌙 Dark" : "☀️ Light"}</span>
    </button>
  );
}