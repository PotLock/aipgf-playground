import { auth } from '@/app/(auth)/auth';
import { getToolByUserId, getAgentById } from '@/db/queries';
import UpdateAgent from './update-agent-form';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }
  const { id } = await params;
  console.log(id, session.user.id);
  const tools = await getToolByUserId({ userId: session.user.id! });
  const agent = await getAgentById(id);

  return <UpdateAgent tools={tools as any} agent={agent} />;
}
