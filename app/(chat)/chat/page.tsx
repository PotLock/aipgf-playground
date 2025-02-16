import { CoreMessage } from 'ai';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation'

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/custom/chat';
import { getAgentById, getToolsByIds, saveChat } from '@/db/queries';
import { generateUUID } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../actions';

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

    const title = await generateTitleFromUserMessage({ message: startMessage });
    await saveChat({
        id,
        userId: session.user.id as string,
        title,
        agentId: agent.id,
    });


    return redirect(`/chat/${id}?startMessage=${startMessage}`);
}
