import { useState } from "react";
import { sendMessage } from "../../utils/chatStore";
import { useAuth } from "../../store/AuthContext";
import MessageBubble from "./MessageBubble";

function ChatWindow({ chat, refresh }) {
  const { user } = useAuth();
  const [text, setText] = useState("");

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage({
      inviteId: chat.inviteId,
      senderRole: user.role,
      senderEmail: user.email,
      text,
    });

    setText("");
    refresh();
  };

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="p-4 border-b font-semibold">
        Campaign #{chat.campaignId}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.messages.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No messages yet
          </p>
        ) : (
          chat.messages.map((m) => (
            <MessageBubble
              key={m.id}
              msg={m}
              isOwn={m.senderEmail === user.email}
            />
          ))
        )}
      </div>

      {/* input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;