import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgentByUserId } from '@/db/queries';


export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const agents = await getAgentByUserId({ userId: session.user.id! });

  return agents.map((agent) => (
    <Card className="w-[350px]" key={agent.id}>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {agent.prompt}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link className="w-full" href={`/chat?agentId=${agent.id}`}>Start Chat</Link>
      </CardFooter>
    </Card>
  ))



}
