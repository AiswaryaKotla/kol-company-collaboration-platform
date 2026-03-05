function ConversationList({ chats, selectedId, onSelect }) {
  return (
    <div className="border-r h-full overflow-y-auto">
      {chats.length === 0 ? (
        <p className="p-4 text-sm text-gray-400">
          No conversations
        </p>
      ) : (
        chats.map((c) => (
          <div
            key={c.inviteId}
            onClick={() => onSelect(c.inviteId)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
              selectedId === c.inviteId ? "bg-blue-50" : ""
            }`}
          >
            <p className="font-medium text-sm">
              Campaign #{c.campaignId}
            </p>
            <p className="text-xs text-gray-400">
              {c.messages.length} messages
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ConversationList;