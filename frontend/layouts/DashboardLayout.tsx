import ThemeToggle from "@/components/shared/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] backdrop-blur-xl p-5 transition-colors duration-300">
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
          E-AI KA
        </h2>

        <nav className="mt-10 space-y-4">

          <p className="text-foreground/70 hover:text-foreground cursor-pointer transition">
            Dashboard
          </p>

          <p className="text-foreground/70 hover:text-foreground cursor-pointer transition">
            AI Chat
          </p>

          <p className="text-foreground/70 hover:text-foreground cursor-pointer transition">
            Documents
          </p>

          <p className="text-foreground/70 hover:text-foreground cursor-pointer transition">
            Analytics
          </p>

          <p className="text-foreground/70 hover:text-foreground cursor-pointer transition">
            Settings
          </p>

        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-xl flex items-center justify-between px-6 transition-colors duration-300">
          
          <h1 className="text-lg font-semibold">
            Enterprise AI Knowledge Assistant
          </h1>

          <ThemeToggle />

        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}