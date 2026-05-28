"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition"
    >
      Toggle Theme
    </button>
  );
}