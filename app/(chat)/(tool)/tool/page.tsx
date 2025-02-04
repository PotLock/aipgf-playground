
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import ToolCardList from '@/components/custom/tool-card'
import { ChatHeader } from '@/components/custom/chat-header';
import { Button } from "@/components/ui/button";


export default async function Page(props: { searchParams: Promise<any> }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <div className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Tool</h2>
          <Button asChild>
            <Link href="/create-tool">
              Create Tool
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Start to chat with your tool
          </p>
          <ToolCardList />
        </div>
      </div>
    </div>
  )
}
