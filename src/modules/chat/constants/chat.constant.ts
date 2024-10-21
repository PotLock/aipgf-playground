import { AIChat, BotChatMessage, User, UserChatHistoryItem, UserChatMessage } from '../interfaces/chat.interface';

export const AI_CHAT_LIST: AIChat[] = [
  {
    avatar: '/widget',
    name: 'Widgets',
    id: 'Widget',
    message: 'Message Smart Action...'
  },
  {
    avatar: '/api/placeholder/96/96',
    name: 'Agent Father',
    id: 'agent-father',
    message: 'Message Agent Father...'
  }
];

export const SIDEBAR_LIST: any[] = [
  {
    url: '/widget',
    name: 'Widget',
    id: 'Widget'
  },
  {
    url: '/tools',
    name: 'Tool',
    id: 'tools'
  },
  {
    url: '/agent',
    name: 'Agent',
    id: 'agent'
  }
];
// Sample users
export const USERS: User[] = [
  {
    id: 'user1',
    name: 'Nate Near',
    avatar: 'https://example.com/avatars/nate.png'
  },
  {
    id: 'user2',
    name: 'Alice Smith',
    avatar: 'https://example.com/avatars/alice.png'
  },
  {
    id: 'smart-action',
    name: 'ChatBot',
    avatar: 'https://example.com/avatars/bot.png'
  }
];

// Sample user chat history items
export const USER_CHAT_HISTORY: UserChatHistoryItem[] = [
  {
    title: 'Test',
    id: 'GCFXOP1',
    userId: 'user1',
    botId: 'smart-action',
    date: new Date('2023-10-01T10:00:00Z')
  },
  {
    title: 'Latest News',
    id: 'history2',
    userId: 'user1',
    botId: 'agent-father',
    date: new Date('2023-10-01T10:00:00Z')
  }
];

// Sample chat messages
export const USER_CHAT_MESSAGES: UserChatMessage[] = [
  {
    id: 'msg1',
    creatorId: 'user1',
    message: 'Show me the NFT holdings of nate.near',
    date: new Date('2023-10-01T10:00:00Z'),
    historyId: 'history1',
    type: 'user'
  },
  {
    id: 'msg2',
    creatorId: 'user1',
    message: 'What is the weather today?',
    date: new Date('2023-10-01T10:02:00Z'),
    historyId: 'history1',
    type: 'user'
  },
  {
    id: 'msg3',
    creatorId: 'user1',
    message: 'Show me the latest news articles',
    date: new Date('2023-10-01T10:03:00Z'),
    historyId: 'history2',
    type: 'user'
  },
  {
    id: 'msg4',
    creatorId: 'user1',
    message: 'What is the weather today?',
    date: new Date('2023-10-01T10:04:00Z'),
    historyId: 'history2',
    type: 'user'
  }
];

// Sample bot chat messages
export const BOT_CHAT_MESSAGES: BotChatMessage[] = [
  {
    id: 'botMsg1',
    creatorId: 'smart-action',
    message: 'Here are your NFT holdings...',
    date: new Date('2023-10-01T10:01:00Z'),
    historyId: 'history1',
    type: 'bot'
  },
  {
    id: 'botMsg2',
    creatorId: 'smart-action',
    message: 'The weather today is sunny with a high of 75°F.',
    date: new Date('2023-10-01T10:03:00Z'),
    historyId: 'history1',
    type: 'bot'
  },
  {
    id: 'botMsg3',
    creatorId: 'agent-father',
    message: 'Here are the latest news articles...',
    date: new Date('2023-10-01T10:04:00Z'),
    historyId: 'history2',
    type: 'bot'
  },
  {
    id: 'botMsg4',
    creatorId: 'agent-father',
    message: 'The weather today is sunny with a high of 75°F.',
    date: new Date('2023-10-01T10:05:00Z'),
    historyId: 'history2',
    type: 'bot'
  }
];
