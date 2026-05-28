export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/40 backdrop-blur-xl p-5">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
          E-AI KA
        </h2>

        <nav className="mt-10 space-y-4">
          <p className="text-slate-300 hover:text-white cursor-pointer">
            Dashboard
          </p>

          <p className="text-slate-300 hover:text-white cursor-pointer">
            AI Chat
          </p>

          <p className="text-slate-300 hover:text-white cursor-pointer">
            Documents
          </p>

          <p className="text-slate-300 hover:text-white cursor-pointer">
            Analytics
          </p>

          <p className="text-slate-300 hover:text-white cursor-pointer">
            Settings
          </p>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">
            Enterprise AI Knowledge Assistant
          </h1>

          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition">
            Profile
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}