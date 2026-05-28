"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello 👋 I am your Enterprise AI Knowledge Assistant.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "AI response generation will be connected with FastAPI backend later.",
        },
      ]);
    }, 500);

    setInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-100px)] gap-6">

        {/* Chat Sidebar */}
        <aside className="w-80 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-4 hidden lg:block">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Conversations
            </h2>

            <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-sm">
              New Chat
            </button>
          </div>

          <div className="space-y-3">

            <div className="p-3 rounded-xl bg-background border border-[var(--border)] cursor-pointer hover:border-indigo-500 transition">
              Enterprise AI Setup
            </div>

            <div className="p-3 rounded-xl bg-background border border-[var(--border)] cursor-pointer hover:border-indigo-500 transition">
              RAG Architecture Discussion
            </div>

          </div>
        </aside>

        {/* Chat Main */}
        <div className="flex-1 flex flex-col border border-[var(--border)] bg-[var(--card)] rounded-2xl overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-2xl rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                      : "bg-background border border-[var(--border)]"
                  }`}
                >
                  {message.content}
                </div>

              </div>
            ))}

          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--border)] p-4 flex gap-4">

            <input
              type="text"
              placeholder="Ask your enterprise AI assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleSend}
              className="px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold hover:opacity-90 transition"
            >
              Send
            </button>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}