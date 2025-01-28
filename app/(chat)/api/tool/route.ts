import { auth } from '@/app/(auth)/auth';
import { getToolByUserId } from '@/db/queries';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const query = url.searchParams.get('query') || '';

  const { tools, totalTools } = await getToolByUserId({ userId: session.user.id!, page, limit, query });
  const totalPages = Math.ceil(totalTools / limit);

  return new Response(JSON.stringify({ tools, totalPages }), { status: 200 });
}
