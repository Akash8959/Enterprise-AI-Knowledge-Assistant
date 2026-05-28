export default function AuthLayout({

  subtitle,
  children,
}: {
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
      
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl p-8 shadow-2xl transition-colors duration-300">

        <div className="text-center mb-8">
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            E-AI KA
          </h1>

          <p className="text-foreground/70 mt-3">
            {subtitle}
          </p>

        </div>

        {children}

      </div>
    </main>
  );
}