'use client';

import * as React from 'react';
import Textarea from 'react-textarea-autosize';

import { useActions, useUIState } from 'ai/rsc';

import { UserMessage } from '@/modules/chat/components/chat-card';
import { type AI } from '@/libs/chat/ai.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import classNames from 'classnames';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/hooks/use-enter-submit';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

export function PromptForm({ input, setInput }: { input: string; setInput: (value: string) => void }) {
  const router = useRouter();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState<typeof AI>();
  const [fileContent, setFileContent] = React.useState('');

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setFileContent(event.target.result);
        setInput(event.target.result);
      };
      reader.onerror = (event: any) => {
        console.error('File could not be read! Code ' + event.target.error.code);
      };
      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault();

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur();
        }

        const value = input.trim();
        setInput('');
        if (!value) return;

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ]);

        // Submit and get response message
        const responseMessage = await submitUserMessage(value);
        setMessages(currentMessages => [...currentMessages, responseMessage]);
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-[8px] border-4 border-[#5F5C64] bg-[#141A20] ">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                uploadRef.current?.click()
              }}
            >

              <IconPlus />
              <span className="sr-only">Upload File</span>
            </Button>
          </TooltipTrigger>
          <Input type='file' className='hidden' onChange={handleFileChange} ref={uploadRef} accept="text/plain,.md" />
          <TooltipContent>Upload File</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none "
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="ico-send-right-icon shrink-0 bg-transparent  px-2 text-xl text-gray-50"
                disabled={input === ''}
              >
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
