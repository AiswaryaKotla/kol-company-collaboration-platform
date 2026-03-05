import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../../store/AuthContext";

const socket = io("http://localhost:5000");

function Messages() {
  const { user } = useAuth();

  const chats = [
    { id: "nike", name: "Nike Campaign Team" },
    { id: "adidas", name: "Adidas Marketing" },
    { id: "puma", name: "Puma Collab" },
  ];

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!activeChat) return;

    socket.emit("join_chat", activeChat.id);

    //  load old messages
    fetch(`http://localhost:5000/messages/${activeChat.id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [activeChat]);

  /* ================= RECEIVE MESSAGE ================= */
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  /* ================= SEND MESSAGE ================= */
  const handleSend = () => {
    if (!message.trim()) return;

    const msgData = {
      chatId: activeChat.id,
      sender: user?.role || "me",
      text: message,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-xl shadow-sm overflow-hidden">
      {/* LEFT — Chat List */}
      <div className="w-80 border-r hidden md:block">
        <div className="p-4 border-b font-semibold">Messages</div>

        <div className="overflow-y-auto h-full">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                activeChat.id === chat.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium">{chat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b font-semibold">
          {activeChat.name}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === user?.role
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                  msg.sender === user?.role
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;