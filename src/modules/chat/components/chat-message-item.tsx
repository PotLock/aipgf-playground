import { FC, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '@/common/interfaces';

import BoderImage from '@/components/common/border-image';
import AngleDownIcon from '@/assets/svgs/angle-down-icon.svg';
import ChatBotResponseFrame from '@/assets/svgs/chat-bot-response-frame.svg';
import ChatUserMessageFrame from '@/assets/svgs/chat-user-message-frame.svg';


type ChatMessageItemProps = ComponentBaseProps & {
  creator: string;
  children: React.ReactNode;
  isUser: boolean;
};

const ChatMessageItem: FC<ChatMessageItemProps> = ({ creator, children, isUser }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev); // Toggle the collapse state
  };

  const sliceAddress = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <BoderImage
      className={classNames('border-0 text-gray-400', isUser ? 'text-right' : '')}
      imageBoder={isUser ? ChatUserMessageFrame.src : ChatBotResponseFrame.src}
    >
      <div
        className={classNames(
          'flex items-center justify-between border-b-[1px] border-[#292F36] px-4 py-3',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={classNames('grow font-bold', isUser ? '' : 'text-cyan-500')}>
          {isUser ? sliceAddress(creator) : creator}
        </div>
        <button className="shrink-0" onClick={toggleCollapse}>
          <Image
            src={AngleDownIcon.src}
            alt="Angle Down Icon"
            width={AngleDownIcon.width}
            height={AngleDownIcon.height}
            className="translate-y-1"
          />
        </button>
      </div>
      <motion.div
        className="overflow-hidden "
        // initial={{ height: 0 }}
        animate={{ height: isCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-3"  > {children}</div>
      </motion.div>
    </BoderImage>
  );
};

export default ChatMessageItem;
