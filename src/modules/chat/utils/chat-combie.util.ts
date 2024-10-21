import { BotChatMessage, UserChatMessage } from '../interfaces/chat.interface';

export const combineChatMessages = (
  userMessages: UserChatMessage[],
  botMessages: BotChatMessage[]
): (UserChatMessage | BotChatMessage)[] => {
  const combinedMessages: (UserChatMessage | BotChatMessage)[] = [];
  const maxLength = Math.max(userMessages.length, botMessages.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < userMessages.length) {
      combinedMessages.push(userMessages[i]); // Add user message
    }
    if (i < botMessages.length) {
      combinedMessages.push(botMessages[i]); // Add bot message
    }
  }

  return combinedMessages;
};
