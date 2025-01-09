
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import AgentCardList from '@/components/custom/agent-card'
import { ChatHeader } from '@/components/custom/chat-header';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default async function Page(props: { searchParams: Promise<any> }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Agent</CardTitle>
          <Button>
            <Link href="/create-agent">
              Create Agent
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="pb-4">
            Start to chat with your agent
          </CardDescription>
          <AgentCardList userId={session.user.id!} />
        </CardContent>
      </Card>
    </div>
  )
}
