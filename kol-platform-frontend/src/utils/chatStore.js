const CHAT_KEY = "kol_chat_threads";

// get all chats
export const getChats = () => {
  const raw = localStorage.getItem(CHAT_KEY);
  return raw ? JSON.parse(raw) : [];
};

// save chats
const saveChats = (chats) => {
  localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
};

// get chat by inviteId
export const getChatByInvite = (inviteId) => {
  const chats = getChats();
  return chats.find((c) => c.inviteId === inviteId);
};

// create chat if missing
export const ensureChatExists = (invite) => {
  const chats = getChats();

  let existing = chats.find((c) => c.inviteId === invite.id);
  if (existing) return existing;

  const newChat = {
    id: Date.now(),
    inviteId: invite.id,
    campaignId: invite.campaignId,
    companyEmail: invite.companyEmail,
    kolEmail: invite.kolEmail,
    messages: [],
    lastMessageAt: Date.now(),
  };

  chats.push(newChat);
  saveChats(chats);
  return newChat;
};

// send message
export const sendMessage = ({
  inviteId,
  senderRole,
  senderEmail,
  text,
}) => {
  const chats = getChats();
  const chat = chats.find((c) => c.inviteId === inviteId);
  if (!chat) return;

  chat.messages.push({
    id: Date.now(),
    text,
    senderRole,
    senderEmail,
    createdAt: Date.now(),
  });

  chat.lastMessageAt = Date.now();
  saveChats(chats);
};