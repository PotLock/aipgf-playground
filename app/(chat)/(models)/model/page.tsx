import { auth } from '@/app/(auth)/auth';
import { getModelsByUserId } from '@/db/queries';
import ModelCardList from '@/components/custom/model-card-list';
import { ChatHeader } from '@/components/custom/chat-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }


  return (

    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <div className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Model</h2>
          <Button asChild>
            <Link  href="/create-provider">
              Create Provider
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Start to chat with your Model
          </p>
          <ModelCardList />
        </div>
      </div>
    </div>
  );
}