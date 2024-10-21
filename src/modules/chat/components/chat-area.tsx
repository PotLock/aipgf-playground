'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import { ChatMessage } from '../interfaces/chat.interface';

import BotIcon from '@/assets/svgs/bot-icon.svg';
import UserIcon from '@/assets/svgs/user-icon.svg';

import ChatMessageItem from './chat-message-item';

import { kv } from '@vercel/kv';
import { useEffect } from 'react';

type ChatAreaProps = {
  conversationList: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  userAddress: string;
};

const ChatArea: FC<ChatAreaProps> = ({ conversationList, messagesEndRef, userAddress }) => {
  // const saveChatToKV = async (conversationList: any) => {
  //   try {
  //     const pipeline = kv.pipeline();
  //     const chatId = `chat_${Date.now()}`;
  //     pipeline.hmset(`chat:${chatId}`, conversationList);
  //     pipeline.zadd(`user:chat:${userAddress}`, {
  //       score: Date.now(),
  //       member: `chat:${chatId}`
  //     });
  //     await pipeline.exec();
  //     console.log('Chat saved successfully with ID:', chatId, 'for user:', userAddress);
  //   } catch (error) {
  //     console.error('Error saving chat to KV:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (conversationList) {
  //     saveChatToKV(conversationList);
  //   }
  // }, [conversationList]);

  return (
    <div className="scrollbar flex h-full flex-col gap-11 overflow-auto">
      {conversationList.map((item, index) => {
        const isUser = item.type === 'user';

        return (
          <div
            key={`${item.id}-${index}`}
            className={classNames('flex gap-4', isUser ? 'flex-row-reverse' : 'flex-row')}
          >
            <Image
              src={isUser ? UserIcon.src : BotIcon.src}
              alt="User Icon"
              width={UserIcon.width}
              height={UserIcon.height}
              className="h-10 w-10 shrink-0"
            />
            <div className="grow">
              <ChatMessageItem creator='testtest' children isUser={isUser} />
            </div>
            <div className="h-10 w-10 shrink-0" />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
