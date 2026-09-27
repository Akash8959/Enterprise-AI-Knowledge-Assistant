"use client";

import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export type SourceItem = {
  filename: string;
  document_id?: number;
  department?: string;
  snippet?: string;
};

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
};

export default function ChatBubble({ role, content, sources }: ChatBubbleProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} w-full`}>
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        {/* Main Message Container */}
        <div
          className={`rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 whitespace-pre-wrap overflow-hidden shadow-xs border ${
            role === "user"
              ? "bg-indigo-600 text-white border-indigo-600 font-medium"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
          }`}
        >
          <div className="prose prose-sm dark:prose-invert max-w-full break-words text-xs sm:text-sm">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children } = props;
                  return (
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        borderRadius: "12px",
                        padding: "12px",
                        marginTop: "10px",
                        fontSize: "12px",
                        maxWidth: "100%",
                        overflowX: "auto",
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Sources / Citations Section */}
          {role === "assistant" && sources && sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <p className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>📚</span> Verified Enterprise Sources ({sources.length})
              </p>
              <div className="grid gap-2">
                {sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-2.5 text-xs text-foreground/90 overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span className="flex items-center gap-1 truncate max-w-[220px] sm:max-w-md">
                        📄 {src.filename}
                      </span>
                      {src.department && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[10px] shrink-0">
                          {src.department}
                        </span>
                      )}
                    </div>
                    {src.snippet && (
                      <p className="text-foreground/70 line-clamp-2 italic text-[11px] font-mono break-words">
                        "{src.snippet}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className={`text-[10px] sm:text-[11px] text-foreground/40 mt-1 px-2 ${role === "user" ? "text-right" : "text-left"}`}>
          {role === "user" ? "You" : "Enterprise AI KA"} • Just now
        </p>
      </div>
    </div>
  );
}