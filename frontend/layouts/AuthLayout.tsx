import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AuthLayout({
  subtitle,
  children,
}: {
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200 relative">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] text-foreground p-6 sm:p-8 shadow-xl transition-colors duration-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-xl mb-3 shadow-sm">
            E
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Enterprise AI Assistant
          </h1>

          <p className="text-sm text-foreground/60 mt-2 font-medium">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}