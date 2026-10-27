"use client";

import { useCallback, useEffect, useState } from "react";
import UploadZone from "@/components/upload/UploadZone";
import DocumentCard from "@/components/documents/DocumentCard";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

interface DocumentItem {
  id: number;
  filename: string;
  file_type: string;
  department?: string;
  status?: string;
  created_at?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/upload/documents`,
        { headers: getAuthHeaders() }
      );
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base Documents</h1>
        <p className="text-foreground/60 mt-1">
          Upload, index, and manage department documents for RAG AI retrieval.
        </p>
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Upload Knowledge File</h2>
        <UploadZone onUploadSuccess={fetchDocuments} />
      </div>

      {/* Document Library Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Document Library</h2>
            <p className="text-xs text-foreground/60">
              {documents.length} vectorized {documents.length === 1 ? "document" : "documents"} available
            </p>
          </div>

        </div>

        {/* Loading / Grid / Empty State */}
        {loading ? (
          <div className="py-12 text-center text-foreground/60 text-sm">
            Loading enterprise documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--card)]">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-lg font-semibold text-foreground">No documents found</h3>
            <p className="text-sm text-foreground/60 mt-1">
              Upload your first PDF, TXT, or DOCX document above to enable AI RAG context.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.filename}
                type={doc.file_type}
                department={doc.department}
                status={doc.status}
                createdAt={doc.created_at}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}