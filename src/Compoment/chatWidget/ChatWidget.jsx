import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import api from "../../api/axiosConfig";

const BRAND_RED = "#e4393c";

export default function ChatWidget() {
  const guestInfo = JSON.parse(localStorage.getItem("guestInfo") || "null");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!open || !guestInfo?.id) return;

    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);

    return () => clearInterval(pollRef.current);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await api.get(`/chat/${guestInfo.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !guestInfo?.id) return;

    setSending(true);
    const content = text.trim();
    setText("");

    try {
      await api.post(`/chat/${guestInfo.id}/guest`, { message: content });
      await fetchMessages();
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  }

  if (!guestInfo?.id) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn rounded-circle shadow"
        style={{
          position: "fixed",
          bottom: 96,
          right: 24,
          width: 56,
          height: 56,
          background: BRAND_RED,
          color: "#fff",
          border: "none",
          zIndex: 1050,
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div
          className="shadow-lg bg-white d-flex flex-column"
          style={{
            position: "fixed",
            bottom: 164,
            right: 24,
            width: 320,
            height: 420,
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 1050,
          }}
        >
          <div className="p-3 fw-bold text-white" style={{ background: BRAND_RED }}>
            Hỗ trợ khách hàng
          </div>

          <div className="flex-grow-1 p-3 overflow-auto" style={{ background: "#f7f7fb" }}>
            {messages.map((m) => {
              const isGuest = m.sender_type === "guest";
              return (
                <div
                  key={m.id}
                  className={`d-flex mb-2 ${isGuest ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    className="px-3 py-2"
                    style={{
                      maxWidth: "75%",
                      borderRadius: 14,
                      background: isGuest ? BRAND_RED : "#fff",
                      color: isGuest ? "#fff" : "#111",
                      border: isGuest ? "none" : "1px solid #eee",
                      fontSize: 14,
                    }}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="d-flex border-top p-2 gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tin nhắn..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              className="btn"
              style={{ background: BRAND_RED, color: "#fff" }}
              disabled={sending || !text.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}