import { cookies } from 'next/headers';
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import AgentCardList from '@/components/custom/agent-card'
import { ChatHeader } from '@/components/custom/chat-header';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgentByUserId } from '@/db/queries';
import { PlusCircle } from 'lucide-react';

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
          <Card className="flex flex-col items-center justify-center h-full">
            <CardContent className="pt-6 text-center">
              <PlusCircle className="size-12 mb-4 mx-auto text-gray-400" />
              <CardTitle className="text-xl mb-2">Create New Agent</CardTitle>
              <CardDescription className="mb-4">Add a new Agent to your collection</CardDescription>
              <Button asChild>
                <Link className='w-full'
                  href={`/create-agent`}>
                  Create Agent
                </Link>
              </Button>
            </CardContent>
          </Card>
          <AgentCardList agents={agents as any} />
        </CardContent>
      </Card>
    </div>
  )
}
