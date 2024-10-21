'use client';

import { FC } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import { UserChatHistoryItem } from '../interfaces/chat.interface';

import ChatPromptItem from './chat-prompt-item';

type ChatPromptListProps = ComponentBaseProps & {
  title: string;
  items: UserChatHistoryItem[]; // Define the structure of the items prop
  onItemClick?: (itemLabel: string) => void; // Function to handle item clicks
  onDelete?: (itemLabel: string) => void; // Function to handle item clicks
  onSave?: (itemLabel: string) => void; // Function to handle item clicks
  onShare?: (itemLabel: string) => void; // Function to handle item clicks
};

const ChatPromptList: FC<ChatPromptListProps> = ({
  className,
  items,
  title,
  onItemClick,
  onDelete,
  onSave,
  onShare
}) => {
  if (!items || items.length === 0) return null;
  const truncateTitle = (title: string): string => {
    return title.length > 20 ? `${title.slice(0, 20)}...` : title;
  };
  //console.log('items', items);
  return (
    <div className={classNames(className)}>
      {/* <p className="border-b-2 border-[#292F36] px-7 py-6 uppercase text-gray-500">{title}</p> */}
      <ul className="flex flex-col gap-4 px-7 py-6">
        <ChatPromptItem
          className="cursor-pointer"
          title={truncateTitle(items[0].message as string)}
          onDelete={() => onDelete?.(items[0].id)} // Pass the item label to the click handler
          onSave={() => onSave?.(items[0].id)} // Pass the item label to the click handler
          onShare={() => onShare?.(items[0].id)} // Pass the item label to the click handler
          onClick={() => onItemClick?.(items[0].id)} // Pass the item label to the click handler
        />
      </ul>
    </div>
  );
};

export default ChatPromptList;
