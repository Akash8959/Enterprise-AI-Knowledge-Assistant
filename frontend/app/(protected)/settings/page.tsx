"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [topK, setTopK] = useState(4);
  const [chunkSize, setChunkSize] = useState(500);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchMe();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System & Profile Settings</h1>
        <p className="text-foreground/60 mt-1">
          Manage user profile credentials, department assignment, and RAG configuration.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground">User Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-foreground/60 font-medium">Full Name</label>
            <input
              type="text"
              readOnly
              value={user?.full_name || "Enterprise User"}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-2 font-semibold text-foreground outline-none"
            />
          </div>

          <div>
            <label className="text-foreground/60 font-medium">Email Address</label>
            <input
              type="text"
              readOnly
              value={user?.email || "user@enterprise.com"}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-2 font-semibold text-foreground outline-none"
            />
          </div>

          <div>
            <label className="text-foreground/60 font-medium">Assigned Department</label>
            <input
              type="text"
              readOnly
              value={user?.department || "Engineering"}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-2 font-semibold text-indigo-600 dark:text-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="text-foreground/60 font-medium">Account Role</label>
            <input
              type="text"
              readOnly
              value={user?.role || "user"}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-2 font-semibold text-foreground outline-none uppercase"
            />
          </div>
        </div>
      </div>

      {/* RAG Configuration Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground">RAG Vector Retrieval Parameters</h2>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <label>Top-K Retrieval Context Chunks</label>
              <span className="text-indigo-600 font-bold">{topK} Chunks</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-foreground/50 mt-1">Number of similar text chunks fetched from ChromaDB for prompt context.</p>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <label>Text Chunk Size (Characters)</label>
              <span className="text-indigo-600 font-bold">{chunkSize} Chars</span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-foreground/50 mt-1">Character length per chunk during document ingestion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}