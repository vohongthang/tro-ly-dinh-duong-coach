// src/components/ChatCoach.jsx
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export default function ChatCoach({ profile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Chào bạn! Mình là AI tư vấn dinh dưỡng. Hỏi mình về thực đơn, Calo, hoặc mục tiêu của bạn nhé." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          profile,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "(Không có phản hồi)" }]);
    } catch (err) {
      setError(
        err.message?.includes("Failed to fetch") || err.message?.includes("Unexpected token")
          ? "Không gọi được AI — tính năng này chỉ hoạt động khi app được deploy qua Vercel (không chạy trên GitHub Pages)."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center z-40"
        title="Hỏi AI tư vấn"
      >
        <MessageCircle size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-96 sm:h-[560px] bg-white sm:rounded-2xl shadow-2xl border border-stone-200 flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3.5 bg-emerald-700 text-white sm:rounded-t-2xl">
            <div>
              <div className="text-sm font-semibold">AI Tư vấn Dinh dưỡng</div>
              <div className="text-[11px] text-emerald-200">Trả lời dựa trên hồ sơ của bạn</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border border-stone-200 text-stone-700 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-stone-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Đang trả lời...
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>
            )}
          </div>

          <div className="p-3 border-t border-stone-100">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về dinh dưỡng, thực đơn..."
                rows={1}
                className="flex-1 resize-none px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-24"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">
              AI có thể trả lời chưa hoàn toàn chính xác — không thay thế tư vấn y khoa chuyên môn.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
