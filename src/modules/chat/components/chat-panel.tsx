import * as React from 'react';

import { shareChat } from '@/libs/chat/chat.actions';
import { Button } from '@/components/ui/button';
import { PromptForm } from './prompt-form';
import { ButtonScrollToBottom } from './button-scroll-to-bottom';
import { IconShare } from '@/components/ui/icons';
import { FooterText } from './footer';
import { ChatShareDialog } from './chat-share-dialog';
import { useAIState, useActions, useUIState } from 'ai/rsc';
import type { AI } from '@/libs/chat/ai.actions';
import { nanoid } from 'nanoid';
import { UserMessage } from '@/modules/chat/components/chat-card';
import { useSearchParams } from 'next/navigation'


export interface ChatPanelProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({ id, title, input, setInput, isAtBottom, scrollToBottom }: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const searchParams = useSearchParams()

  const prompt = searchParams.get('prompt')
  const exampleMessages: any[] = [
    // {
    //   heading: 'What are the',
    //   subheading: 'trending memecoins today?',
    //   message: `What are the trending memecoins today?`
    // },
    // {
    //   heading: 'What is the price of',
    //   subheading: '$DOGE right now?',
    //   message: 'What is the price of $DOGE right now?'
    // },
    // {
    //   heading: 'I would like to buy',
    //   subheading: '42 $DOGE',
    //   message: `I would like to buy 42 $DOGE`
    // },
    // {
    //   heading: 'What are some',
    //   subheading: `recent events about $DOGE?`,
    //   message: `What are some recent events about $DOGE?`
    // }
  ];
  React.useEffect(() => {
    const sendChat = async () => {
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: nanoid(),
          display: <UserMessage>{prompt}</UserMessage>
        }
      ]);

      const responseMessage = await submitUserMessage(prompt);

      setMessages(currentMessages => [...currentMessages, responseMessage]);
    }

    if (prompt) {
      sendChat()
    }
  }, [prompt])
  return (
    <div className="absolute inset-x-0 bottom-0 w-full  from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {messages.length === 0 &&
          exampleMessages.map((example, index) => (
            <div
              key={example.heading}
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index > 1 && 'hidden md:block'
                }`}
              onClick={async () => {
                setMessages(currentMessages => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{example.message}</UserMessage>
                  }
                ]);

                const responseMessage = await submitUserMessage(example.message);

                setMessages(currentMessages => [...currentMessages, responseMessage]);
              }}
            >
              <div className="text-sm font-semibold">{example.heading}</div>
              <div className="text-sm text-zinc-600">{example.subheading}</div>
            </div>
          ))}
      </div>

      {messages?.length >= 2 ? (
        id && title ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                <IconShare className="mr-2" />
                Share
              </Button>
              <ChatShareDialog
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                onCopy={() => setShareDialogOpen(false)}
                shareChat={shareChat}
                chat={{
                  id,
                  title,
                  messages: aiState.messages
                }}
              />
            </div>
          </div>
        ) : null
      ) : null}

      <div className="w-full p-10">
        <PromptForm input={input} setInput={setInput} />
      </div>
    </div>
  );
}
