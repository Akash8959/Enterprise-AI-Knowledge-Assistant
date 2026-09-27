"use client";

import ThemeToggle from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/chat", label: "AI RAG Chat", icon: "💬" },
    { href: "/documents", label: "Knowledge Documents", icon: "📁" },
    { href: "/analytics", label: "System Analytics", icon: "📈" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/chat":
        return "AI RAG Chat";
      case "/documents":
        return "Documents";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "Enterprise AI";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col lg:flex-row transition-colors duration-200">
      {/* DESKTOP SIDEBAR (lg and up) */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] p-5 hidden lg:flex flex-col justify-between shrink-0 transition-colors duration-200">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0">
              E
            </div>
            <div className="truncate">
              <h2 className="text-base font-bold text-foreground leading-none truncate">
                Enterprise AI
              </h2>
              <p className="text-[10px] text-foreground/50 font-medium tracking-wider uppercase mt-1">
                Knowledge Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Info Footnote */}
        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-foreground/60 space-y-1">
          <div className="font-semibold text-foreground">RAG Engine v1.0</div>
          <div>FastAPI • ChromaDB</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
        </div>
      </aside>

      {/* MOBILE / TABLET HEADER & DRAWER (< lg) */}
      <header className="lg:hidden sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            E
          </div>
          <span className="text-sm font-bold text-foreground truncate">
            {getPageTitle(pathname)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-foreground hover:bg-foreground/5 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Click to Close */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[var(--card)] text-[var(--foreground)] border-r border-[var(--border)] h-full p-5 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    E
                  </div>
                  <div>
                    <h2 className="text-sm font-bold leading-none">Enterprise AI</h2>
                    <p className="text-[9px] text-foreground/50 tracking-wider uppercase mt-0.5">Knowledge Assistant</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-foreground/70 hover:text-foreground text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* User Badge inside Drawer */}
              <div className="mt-4 p-3 rounded-xl bg-foreground/5 border border-[var(--border)] text-xs">
                <p className="font-bold text-foreground truncate">{user?.full_name || "Enterprise User"}</p>
                <p className="text-foreground/60 text-[11px] truncate">{user?.email || "user@enterprise.com"}</p>
                <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {user?.department || "General"}
                </span>
              </div>

              {/* Nav Items */}
              <nav className="mt-6 space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition min-h-[44px]"
              >
                Logout Account
              </button>

              <div className="text-[10px] text-foreground/40 text-center">
                RAG Engine v1.0 • System Online
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* DESKTOP TOPBAR */}
        <header className="hidden lg:flex h-16 border-b border-[var(--border)] bg-[var(--card)] items-center justify-between px-8 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-foreground">
              Enterprise AI Knowledge Platform
            </h1>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {user?.department || "General"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-foreground truncate max-w-[150px]">
                {user?.full_name || "Enterprise User"}
              </p>
              <p className="text-[11px] text-foreground/50 truncate max-w-[150px]">
                {user?.email || "user@enterprise.com"}
              </p>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition min-h-[36px]"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}