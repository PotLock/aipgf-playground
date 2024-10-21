import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/modules/auth/constants/auth.config';
import { getChat, getMissingKeys } from '@/libs/chat/chat.actions';
import { Chat } from '@/modules/chat/components/chat-ui';
import { AI } from '@/libs/chat/ai.actions';
import { Session } from 'types/chat';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const session: any = await auth();

  if (!session?.user) {
    return {};
  }

  const chat = await getChat(params.id, session.user.id);

  if (!chat || 'error' in chat) {
    redirect('/');
  } else {
    return {
      title: chat?.title.toString().slice(0, 50) ?? 'Chat'
    };
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session: any = (await auth()) as Session;
  const missingKeys = await getMissingKeys();

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`);
  }

  const userId = session.user.id as string;
  const chat = await getChat(params.id, userId);

  if (!chat || 'error' in chat) {
    redirect('/');
  } else {
    if (chat?.userId !== session?.user?.username) {
      notFound();
    }

    return (
      <AI initialAIState={{ chatId: chat.id, messages: chat.messages, agentId: chat.agentId }}>
        <Chat id={chat.id} session={session} initialMessages={chat.messages} missingKeys={missingKeys} />
      </AI>
    );
  }
}
