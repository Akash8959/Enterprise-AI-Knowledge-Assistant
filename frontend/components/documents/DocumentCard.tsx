"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

interface Props {
  id: number;
  title: string;
  type: string;
  department?: string;
  status?: string;
  createdAt?: string;
  onDelete: (id: number) => void;
}

export default function DocumentCard({
  id,
  title,
  type,
  department = "General",
  status = "Processed",
  createdAt,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will purge its vector index.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/upload/document/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(id);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Failed to delete document.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to reach server to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (filename: string, fileType: string) => {
    const fn = filename.toLowerCase();
    if (fn.endsWith(".pdf") || fileType.includes("pdf")) return "📕";
    if (fn.endsWith(".docx") || fn.endsWith(".doc") || fileType.includes("word")) return "📘";
    if (fn.endsWith(".txt") || fileType.includes("text")) return "📄";
    return "📁";
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-indigo-500/50 hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-xl">
            {getFileIcon(title, type)}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            {department}
          </span>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h3 className="font-semibold text-base text-foreground line-clamp-1" title={title}>
            {title}
          </h3>
          <p className="text-xs text-foreground/60 mt-1 uppercase tracking-wider font-mono">
            {type.replace("application/", "").replace("text/", "")}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${status === "Processed" ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="text-foreground/70 font-medium">{status}</span>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}