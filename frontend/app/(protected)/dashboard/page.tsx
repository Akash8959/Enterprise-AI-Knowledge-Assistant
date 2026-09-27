"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

interface SummaryStats {
  total_documents: number;
  processed_documents: number;
  failed_documents: number;
  total_users: number;
  recent_documents: Array<{
    id: number;
    filename: string;
    file_type: string;
    department: string;
    status: string;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SummaryStats>({
    total_documents: 0,
    processed_documents: 0,
    failed_documents: 0,
    total_users: 1,
    recent_documents: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/stats/summary`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-foreground">
          Enterprise AI Knowledge Assistant
        </h1>
        <p className="text-foreground/70 mt-2 max-w-2xl text-sm leading-relaxed">
          Welcome to your central RAG knowledge hub. Upload company policies, engineering documentation, and department files to interact with AI-powered search and context-aware responses.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            🤖 Launch RAG AI Chat
          </Link>
          <Link
            href="/documents"
            className="rounded-xl border border-[var(--border)] bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:border-indigo-500 transition shadow-sm"
          >
            📄 Upload & Manage Documents
          </Link>
        </div>
      </div>

      {/* Real Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Total Knowledge Documents
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {loading ? "..." : stats.total_documents}
          </div>
          <p className="mt-1 text-xs text-foreground/50">Stored in database</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Vectorized & Indexed
          </div>
          <div className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {loading ? "..." : stats.processed_documents}
          </div>
          <p className="mt-1 text-xs text-foreground/50">Ready in ChromaDB</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Vector Store Model
          </div>
          <div className="mt-3 text-lg font-bold text-foreground font-mono">
            all-MiniLM-L6-v2
          </div>
          <p className="mt-1 text-xs text-foreground/50">384-dimensional embeddings</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Backend RAG Service
          </div>
          <div className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy
          </div>
          <p className="mt-1 text-xs text-foreground/50">FastAPI + ChromaDB</p>
        </div>
      </div>

      {/* Recent Knowledge Documents */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Knowledge Documents</h2>
            <p className="text-xs text-foreground/60">Recently ingested enterprise knowledge files</p>
          </div>
          <Link
            href="/documents"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-foreground/50">
            Loading recent documents...
          </div>
        ) : stats.recent_documents.length === 0 ? (
          <div className="py-8 text-center text-xs text-foreground/50">
            No documents uploaded yet. <Link href="/documents" className="text-indigo-600 underline">Upload your first document</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] text-foreground/60">
                <tr>
                  <th className="pb-3 font-semibold">Document Name</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Uploaded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-foreground/80">
                {stats.recent_documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-foreground/5 transition">
                    <td className="py-3 font-medium text-foreground">{doc.filename}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                        {doc.department}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 text-foreground/50">{doc.created_at || "Just now"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}