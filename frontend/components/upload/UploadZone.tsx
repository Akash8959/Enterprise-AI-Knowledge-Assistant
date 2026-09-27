"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "@/lib/api";

interface Props {
  onUploadSuccess?: () => void;
}

export default function UploadZone({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState("General");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("department", department);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/document`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Upload failed");
      }

      setMessage({ text: result.message || "File uploaded and processed!", type: "success" });
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({ text: error.message || "An error occurred during upload.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    multiple: false,
  });

  return (
    <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-[var(--card)] border-[var(--border)]">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`cursor-pointer p-6 rounded-xl border border-transparent transition-colors hover:border-indigo-500/50 ${
          isDragActive ? "bg-indigo-500/10 border-indigo-500" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📁</div>
        <p className="text-lg font-medium text-foreground">
          {isDragActive ? "Drop the enterprise file here..." : "Drag & drop files here"}
        </p>
        <p className="text-sm text-foreground/60 mt-1">
          Supports <span className="font-semibold text-indigo-500">PDF, TXT, DOCX</span> (Up to 25MB)
        </p>
      </div>

      {/* Department Selector */}
      <div className="mt-4 flex items-center justify-center gap-3 max-w-xs mx-auto">
        <label className="text-xs font-semibold text-foreground/70">Department:</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="text-xs rounded-lg border border-[var(--border)] bg-background px-3 py-1.5 outline-none focus:border-indigo-500"
        >
          <option value="General">General Knowledge</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">Human Resources</option>
          <option value="Finance">Finance</option>
          <option value="Legal">Legal</option>
        </select>
      </div>

      {/* File Preview & Upload Action */}
      {file && (
        <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 max-w-md mx-auto">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Ready for Processing
          </p>
          <p className="mt-1 text-sm font-medium text-foreground truncate">{file.name}</p>
          <p className="text-xs text-foreground/60">{(file.size / 1024).toFixed(1)} KB</p>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing & Indexing Vector Store...
              </>
            ) : (
              "Upload & Vectorize Document"
            )}
          </button>
        </div>
      )}

      {/* Message Feedback */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm max-w-md mx-auto ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}