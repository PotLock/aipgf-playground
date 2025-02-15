import { CoreMessage } from 'ai';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/custom/chat';
import { getAgentById, getToolsByIds } from '@/db/queries';
import { generateUUID } from '@/lib/utils';

export default async function Page(props: { searchParams: Promise<any> }) {
    const params = await props.searchParams;
    const { agentId, startMessage } = params;

    let agent: any;
    if (agentId) {
        agent = await getAgentById(agentId)
    }

    const session = await auth();

    if (!session || !session.user) {
        return notFound();
    }

    if (!session.user.id && !agentId) {
        return notFound();
    }


    const id = generateUUID();
    const tools = await getToolsByIds(agent.tools as any);
    return (
        <Chat
            startMessage={startMessage}
            key={id}
            id={id}
            initialMessages={[]}
            agent={agent as any}
            user={session.user as any}
            tools={tools}
        />
    );
}
