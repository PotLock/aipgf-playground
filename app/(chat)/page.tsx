import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
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
          {agents.map((agent) => (
            <div className="flex items-center justify-between space-x-4" key={agent.id}>
              <div className="flex items-center space-x-4">
                <Avatar className="size-8">
                  <AvatarImage src={agent.avatar} alt="Image" />
                  <AvatarFallback>{agent.name}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.intro}</p>
                </div>
              </div>
              <Link className="ml-auto" href={`/chat?agentId=${agent.id}`}>Start Chat</Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
