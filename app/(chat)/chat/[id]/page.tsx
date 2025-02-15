import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat as PreviewChat } from '@/components/custom/chat';
import { getChatById, getMessagesByChatId, getAgentById, getToolsByIds } from '@/db/queries';
import { convertToUIMessages } from '@/lib/utils';


export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });
  const agent = await getAgentById(chat.agentId)
  console.log('agent', agent);
  if (!chat && agent) {
    notFound();
  }

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chat.userId) {
    return notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const tools = await getToolsByIds(agent.tools as any);

  return (
    <PreviewChat
      startMessage={''}
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      agent={agent}
      user={session.user as any}
      tools={tools}
    />
  );
}
