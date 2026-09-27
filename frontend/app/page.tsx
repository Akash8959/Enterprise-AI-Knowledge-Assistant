"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootHomePage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [token, isLoading, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
      <div className="flex items-center gap-3 text-sm font-medium text-foreground/70">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Authenticating workspace session...</span>
      </div>
    </div>
  );
}