"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import ChatBubble, { SourceItem } from "@/components/chat/ChatBubble";
import ConversationItem from "@/components/chat/ConversationItem";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello 👋 I am your Enterprise AI Knowledge Assistant.\n\nAsk me any question about your uploaded company policies, engineering docs, HR handbooks, or financial reports!",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const userQuery = input.trim();
    if (!userQuery || isTyping) return;

    // Add User Message
    const userMessage: Message = {
      role: "user",
      content: userQuery,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call FastAPI RAG Endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/rag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          query: userQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`RAG Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Add AI Response with Citations
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || "I retrieved knowledge chunks but generated an empty answer.",
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("RAG Query error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Connection Error**: Could not retrieve RAG context from backend.\n\nDetails: ${
            error.message || "Ensure FastAPI backend server is running at " + API_BASE_URL
          }`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "New conversation started. Ask me anything about your enterprise documents!",
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] gap-6 max-w-7xl mx-auto min-w-0">
      {/* SIDEBAR (Desktop Only lg+) */}
      <aside className="w-72 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-4 hidden lg:flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Conversations</h2>
            <button
              onClick={handleNewChat}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
            >
              + New Chat
            </button>
          </div>

          <div className="space-y-1.5">
            <ConversationItem title="Enterprise Knowledge Assistant" active />
            <ConversationItem title="Document RAG Retrieval" />
            <ConversationItem title="Department Permissions Test" />
          </div>
        </div>

        <div className="text-[11px] text-foreground/40 text-center pt-3 border-t border-[var(--border)]">
          Powered by ChromaDB & SentenceTransformers
        </div>
      </aside>

      {/* MAIN CHAT INTERFACE (Responsive for Desktop & Mobile) */}
      <div className="flex-1 flex flex-col border border-[var(--border)] bg-[var(--card)] rounded-2xl overflow-hidden shadow-xs min-w-0">
        {/* Top Bar inside Chat */}
        <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-2 bg-[var(--card)] shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <span>🤖</span> Enterprise AI Assistant
            </h2>
            <p className="text-[11px] text-foreground/60 mt-0.5">
              Responses are limited to your assigned department.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="lg:hidden text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
            >
              New
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              role={message.role}
              content={message.content}
              sources={message.sources}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs font-medium text-foreground/70">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="truncate">Searching ChromaDB & generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-[var(--border)] p-2.5 sm:p-4 bg-[var(--card)] shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Ask a question about your documents..."
              value={input}
              disabled={isTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-indigo-500 transition min-h-[44px]"
            />

            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-xs sm:text-sm text-white hover:bg-indigo-700 transition disabled:opacity-50 min-h-[44px] shrink-0 cursor-pointer shadow-xs"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}