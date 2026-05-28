import DashboardLayout from "@/layouts/DashboardLayout";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to E-AI KA 🚀
        </h1>

        <p className="text-slate-400">
          Enterprise AI Knowledge Assistant Dashboard Initialized Successfully.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Documents</h2>
            <p className="text-slate-400">
              Manage enterprise knowledge documents.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6">
            <h2 className="text-xl font-semibold mb-2">AI Chat</h2>
            <p className="text-slate-400">
              Interact with your enterprise AI assistant.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-slate-400">
              Monitor AI usage and document insights.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}