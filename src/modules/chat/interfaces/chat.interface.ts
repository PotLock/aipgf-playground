export type AIChat = {
  avatar: string;
  name: string;
  id: string;
  message: string;
};

export type UserChatHistoryItem = {
  title: string;
  id: string;
  userId: string;
  botId: string;
  date: Date;
  message?: string;
};

export type ChatMessage = {
  id: string;
  message: string;
  avatar: string;
  creator: string;
  type: 'user' | 'bot';
};

export type UserChatMessage = {
  id: string;
  creatorId: string;
  message: string;
  date: Date;
  historyId: string;
  type: 'user' | 'bot';
};

export type BotChatMessage = {
  id: string;
  creatorId: string;
  message: string;
  date: Date;
  historyId: string;
  type: 'user' | 'bot';
};

export type User = {
  id: string;
  name: string;
  avatar: string;
};
