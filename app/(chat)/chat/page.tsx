import { CoreMessage } from 'ai';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/custom/chat';
import { getAgentById, getToolsByIds } from '@/db/queries';
import { generateUUID } from '@/lib/utils';

export default async function Page(props: { searchParams: Promise<any> }) {
    const params = await props.searchParams;
    const { agentId } = params;

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

    const cookieStore = await cookies();
    const modelIdFromCookie = cookieStore.get('model-id')?.value;
    const selectedModelId =
        models.find((model) => model.id === modelIdFromCookie)?.id ||
        DEFAULT_MODEL_NAME;
    const id = generateUUID();
    console.log(agent)
    const tools = await getToolsByIds(agent.tools as any);
    return (
        <Chat
            key={id}
            id={id}
            initialMessages={[]}
            selectedModelId={selectedModelId}
            agent={agent as any}
            user={session.user as any}
            tools={tools}
        />
    );
}
