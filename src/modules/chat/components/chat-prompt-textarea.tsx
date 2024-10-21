'use client';

import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import { insertNewParagraph } from '../utils/chat-promt-bot.util';

type ChatPromptTextareaProps = ComponentBaseProps & {
  placeholder?: string;
  onSend?: (value: string) => void;
};

const ChatPromptTextarea: FC<ChatPromptTextareaProps> = ({ className, onSend, placeholder = 'Message...' }) => {
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSend = () => {
    const content = contentEditableRef.current?.innerHTML || '';

    if (content) {
      onSend?.(content);
      clearContent();
    }
  };

  const clearContent = () => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = '';
      setIsEmpty(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        insertNewParagraph();
      } else {
        event.preventDefault();
        handleSend();
      }
    }
  };

  const handleInput = () => {
    const content = contentEditableRef.current?.innerHTML || '';

    setIsEmpty(!content.length);
  };

  return (
    <div className="flex w-full items-start justify-between rounded-[8px] border-4 border-[#5F5C64] bg-[#141A20] px-4 py-5">
      <div className="relative flex-1 text-gray-50">
        {isEmpty && <div className="pointer-events-none absolute left-0 top-0">{placeholder}</div>}
        <div
          ref={contentEditableRef}
          contentEditable
          className={classNames('max-h-[300px] min-h-6 overflow-y-auto bg-[#141A20]', className)}
          style={{ outline: 'none' }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button className="ico-send-right-icon shrink-0 px-2 text-xl text-gray-50" onClick={handleSend} />
    </div>
  );
};

export default ChatPromptTextarea;
