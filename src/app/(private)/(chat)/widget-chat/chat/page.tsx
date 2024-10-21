import { PageBaseProps } from '@/common/interfaces';
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/modules/auth/constants/auth.config';
import { getChat, getMissingKeys } from '@/libs/chat/chat.actions'
import { Chat } from '@/modules/chat/components/chat-ui'
import { AI } from '@/libs/chat/ai.actions'
import { Session } from 'types/chat'
import { nanoid } from '@/modules/chat/utils/utils';

export const metadata = {
  title: 'Prompt Wallet'
}

export interface ChatPageProps {
  params: {
  },
  searchParams: {
    agentId: string
    prompt: string
    widgetId: string
  }
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const id = nanoid()
  const session: any = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  return (
    <AI initialAIState={{ chatId: id, messages: [], agentId: searchParams.agentId }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
