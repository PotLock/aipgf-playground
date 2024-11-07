import { auth } from '@/app/(auth)/auth';
import { getAgentByUserId } from '@/db/queries';

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const agents = await getAgentByUserId({ userId: session.user.id! });
  return Response.json(agents);
}
