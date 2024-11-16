import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import AgentCardList from '@/components/custom/agent-card';
import { ChatHeader } from '@/components/custom/chat-header';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgentByUserId } from '@/db/queries';


export default async function Page(props: { searchParams: Promise<any> }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const agents = await getAgentByUserId({ userId: session.user.id! });

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Card>
        <CardHeader>
          <CardTitle>Agent</CardTitle>
          <CardDescription>
            Start to chat with your agent
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <AgentCardList agents={agents as any} />
        </CardContent>
      </Card>
    </div>
  )
}
