import { BotChatMessage, ChatMessage, UserChatMessage } from '../interfaces/chat.interface';

import { AI_CHAT_LIST, USERS } from '../constants/chat.constant';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export const simulateBotResponse = (userMessage: string): Promise<string> => {
  return new Promise(resolve => {
    // Simulate a delay for the bot response
    setTimeout(() => {
      openai.chat.completions
        .create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are helpful assassin . Do what user say?' },
            { role: 'user', content: userMessage }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'transfer',
                description: 'Transfer APT to a specific address',
                parameters: {
                  type: 'object',
                  properties: {
                    address: {
                      type: 'string',
                      description: 'The address to transfer APT to'
                    },
                    amount: {
                      type: 'string',
                      description: 'The amount of APT to transfer'
                    }
                  },
                  required: ['address', 'amount']
                }
              }
            }
          ],
          tool_choice: 'auto'
        })
        .then((botResponse: any) => {
          if (botResponse.choices[0]?.message?.tool_calls) {
            const toolCall = botResponse.choices[0].message.tool_calls[0];
            const { address, amount } = JSON.parse(toolCall.function.arguments);
            resolve(`Transfer request: ${amount} APT to ${address}`);
          } else {
            const botResponseText =
              botResponse.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
            resolve(botResponseText);
          }
        })
        .catch((error: any) => {
          console.error('Error generating bot response:', error);
          resolve('Sorry, an error occurred while generating the response.');
        });
    }, 1000); // Delay for 1 second
  });
};

export const createChatMessage = (msg: UserChatMessage | BotChatMessage): ChatMessage => {
  const creatorName =
    msg.type === 'user'
      ? USERS.find(user => user.id === msg.creatorId)?.name || ''
      : AI_CHAT_LIST.find(user => user.id === msg.creatorId)?.name || '';

  return {
    id: msg.id,
    message: msg.message,
    avatar: '',
    type: msg.type,
    creator: creatorName
  };
};

export const insertNewParagraph = () => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const newParagraph = document.createElement('p');

  newParagraph.innerText = '';

  range?.insertNode(newParagraph);
  range?.setStartAfter(newParagraph);
  if (range) {
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
