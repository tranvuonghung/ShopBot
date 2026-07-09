import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Send } from "lucide-react";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";
import api from "../../../api/axiosConfig";

const BRAND_RED = "#e4393c";

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const t = setInterval(fetchConversations, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selectedGuestId) return;
    fetchMessages(selectedGuestId);
    const t = setInterval(() => fetchMessages(selectedGuestId), 3000);
    return () => clearInterval(t);
  }, [selectedGuestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    try {
      const res = await api.get("/chat/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách hội thoại:", err);
    }
  }

  async function fetchMessages(guestId) {
    try {
      const res = await api.get(`/chat/${guestId}`);
      setMessages(res.data);
      setConversations((prev) =>
        prev.map((c) => (c.guest_id === guestId ? { ...c, unread_count: 0 } : c))
      );
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !selectedGuestId) return;

    setSending(true);
    const content = text.trim();
    setText("");

    try {
      await api.post(`/chat/${selectedGuestId}/admin`, { message: content });
      await fetchMessages(selectedGuestId);
      await fetchConversations();
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  }

  const selectedConversation = conversations.find((c) => c.guest_id === selectedGuestId);

  return (
    <div className="d-flex min-vh-100" style={{ background: "#f7f7fb" }}>
      <Sidebar />

      <main className="flex-grow-1 p-4 d-flex flex-column" style={{ height: "100vh" }}>
        <h1 className="fw-bold mb-0">Tin nhắn khách hàng</h1>

        <div className="flex-grow-1 d-flex border rounded-4 bg-white overflow-hidden shadow-sm">
          <div className="border-end overflow-auto" style={{ width: 300, flexShrink: 0 }}>
            {conversations.length === 0 && (
              <div className="text-secondary text-center p-4 small">Chưa có hội thoại nào</div>
            )}

            {conversations.map((c) => {
              const active = c.guest_id === selectedGuestId;
              return (
                <button
                  key={c.guest_id}
                  type="button"
                  onClick={() => setSelectedGuestId(c.guest_id)}
                  className="w-100 text-start p-3 d-flex flex-column gap-1"
                  style={{
                    background: active ? "#fdeceb" : "transparent",
                    border: "none",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{c.guest_name}</span>
                    {c.unread_count > 0 && (
                      <span className="badge rounded-pill" style={{ background: BRAND_RED, color: "#fff" }}>
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <small className="text-secondary text-truncate">
                    {c.last_sender_type === "admin" ? "Bạn: " : ""}
                    {c.last_message}
                  </small>
                  <small className="text-secondary" style={{ fontSize: 11 }}>
                    {formatTime(c.last_time)}
                  </small>
                </button>
              );
            })}
          </div>

          <div className="d-flex flex-column flex-grow-1">
            {!selectedGuestId ? (
              <div className="d-flex align-items-center justify-content-center flex-grow-1 text-secondary">
                Chọn một hội thoại để bắt đầu
              </div>
            ) : (
              <>
                <div className="p-3 border-bottom fw-semibold">
                  {selectedConversation?.guest_name || "Khách hàng"}
                </div>

                <div className="flex-grow-1 overflow-auto p-3" style={{ background: "#f7f7fb" }}>
                  {messages.map((m) => {
                    const isAdmin = m.sender_type === "admin";
                    return (
                      <div
                        key={m.id}
                        className={`d-flex mb-2 ${isAdmin ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className="px-3 py-2"
                          style={{
                            maxWidth: "60%",
                            borderRadius: 14,
                            background: isAdmin ? BRAND_RED : "#fff",
                            color: isAdmin ? "#fff" : "#111",
                            border: isAdmin ? "none" : "1px solid #eee",
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
                    placeholder="Nhập phản hồi..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="btn d-flex align-items-center gap-1"
                    style={{ background: BRAND_RED, color: "#fff" }}
                    disabled={sending || !text.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}