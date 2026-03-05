import { useEffect, useState } from "react";
import { getChats } from "../../utils/chatStore";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const loadChats = () => {
    const data = getChats();
    setChats(data);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const selectedChat = chats.find(
    (c) => c.inviteId === selectedId
  );

  return (
    <div className="h-[calc(100vh-80px)] grid grid-cols-12 bg-white rounded-2xl shadow overflow-hidden">
      {/* left */}
      <div className="col-span-4">
        <ConversationList
          chats={chats}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* right */}
      <div className="col-span-8">
        <ChatWindow chat={selectedChat} refresh={loadChats} />
      </div>
    </div>
  );
}

export default ChatPage;