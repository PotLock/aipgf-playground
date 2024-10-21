import { UserChatHistoryItem } from '../interfaces/chat.interface';

export const groupChatHistoryByDate = (chatHistory: UserChatHistoryItem[]): Record<string, UserChatHistoryItem[]> => {
  return chatHistory.reduce(
    (acc, item) => {
      const dateKey = new Date(item.date).toLocaleDateString(); // Format the date as needed

      if (!acc[dateKey]) {
        acc[dateKey] = []; // Initialize an array for this date if it doesn't exist
      }
      acc[dateKey].push(item); // Add the chat history item to the corresponding date

      return acc;
    },
    {} as Record<string, UserChatHistoryItem[]>
  );
};
