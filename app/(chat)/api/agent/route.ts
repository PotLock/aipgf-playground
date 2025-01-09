import { auth } from '@/app/(auth)/auth';
import { getAgentByUserId } from '@/db/queries';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  const { agents, totalAgents } = await getAgentByUserId({ userId: session.user.id!, page, limit });
  const totalPages = Math.ceil(totalAgents / limit);

  return new Response(JSON.stringify({ agents, totalPages }), { status: 200 });
}
