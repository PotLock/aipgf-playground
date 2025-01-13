import { auth } from '@/app/(auth)/auth';
import { getToolByUserId } from '@/db/queries';

import CreateAgent from './create-agent-form'; './create-agent-form'


export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const tools = await getToolByUserId({ userId: session.user.id! });
  return <CreateAgent tools={tools as any} />;
}
