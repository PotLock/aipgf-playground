import { auth } from '@/app/(auth)/auth';
import { ChatHeader } from '@/components/custom/chat-header';
import { Tools } from '@/components/custom/tools';

export default async function Page(props: { searchParams: Promise<any> }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Tools />
    </div>
  );
}
