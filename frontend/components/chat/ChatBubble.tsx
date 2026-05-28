"use client";

import ReactMarkdown from "react-markdown";

import SyntaxHighlighter from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBubble({
  role,
  content,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex ${
        role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div className="max-w-3xl">

        <div
          className={`rounded-2xl px-5 py-4 whitespace-pre-wrap overflow-hidden ${
            role === "user"
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
              : "bg-background border border-[var(--border)]"
          }`}
        >

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
                      padding: "16px",
                      marginTop: "12px",
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

<p className="text-xs text-foreground/50 mt-2 px-2">
  Just now
</p>

      </div>
    </div>
  );
}