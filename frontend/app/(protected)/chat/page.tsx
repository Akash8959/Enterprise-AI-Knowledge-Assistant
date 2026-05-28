"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import ChatBubble from "@/components/chat/ChatBubble";
import ConversationItem from "@/components/chat/ConversationItem";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "AI streaming and FastAPI backend integration will be connected in upcoming phases.\n\n```python\nprint('Enterprise AI Assistant')\n```",
        },
      ]);

      setIsTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-100px)] gap-6">

        {/* Sidebar */}
        <aside className="w-80 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-4 hidden lg:block">

          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-semibold">
              Conversations
            </h2>

            <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-sm text-white hover:opacity-90 transition">
              New Chat
            </button>

          </div>

          {/* Conversation List */}
          <div className="space-y-3">

            <ConversationItem
              title="Enterprise AI Setup"
              active
            />

            <ConversationItem
              title="RAG Architecture Discussion"
            />

            <ConversationItem
              title="Department Access Control"
            />

          </div>

        </aside>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col border border-[var(--border)] bg-[var(--card)] rounded-2xl overflow-hidden">

          {/* Chat Header */}
          <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Enterprise AI Assistant
              </h2>

              <p className="text-sm text-foreground/60 mt-1">
                Secure enterprise knowledge conversation
              </p>
            </div>

            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Empty State */}
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">

                <div className="text-center">

                  <h2 className="text-3xl font-bold mb-3">
                    Start a Conversation
                  </h2>

                  <p className="text-foreground/60">
                    Ask questions about enterprise knowledge and documents.
                  </p>

                </div>

              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex justify-start">

                <div className="bg-background border border-[var(--border)] rounded-2xl px-5 py-4 flex gap-2">

                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />

                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150" />

                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-300" />

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--border)] p-4 flex gap-4">

            {/* Upload Button */}
            <button className="px-4 rounded-xl border border-[var(--border)] hover:border-indigo-500 transition">
              +
            </button>

            {/* Chat Input */}
            <input
              type="text"
              placeholder="Ask your enterprise AI assistant..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="flex-1 rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500"
            />

            {/* Send Button */}
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